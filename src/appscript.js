function doGet(e) {

  const deployment_id = "https://script.google.com/macros/s/AKfycbzLj5eQm1dG_79euAUCRORWv1-5Jkz9GRKy1SSGjz6jzVUislcQ5uAhmmxGEyxx7JsHsw/exec";
  const callback = e.parameter.callback;
  let result;

  try {
    if (e.parameter.action === "schemes") {
      result = getSchemes();
    } else if (e.parameter.action === "nav") {
      result = getNAV(e.parameter.schemeCode);
    } else if (e.parameter.action === "indices") {
      result = getIndicesFromSheet();
    } else {
      result = { error: "Invalid action" };
    }
  } catch (err) {
    result = { error: err.message };
  }

  const json = JSON.stringify(result);

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${json})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/* ===== Business logic ===== */

function getSchemes() {
  const sheet = SpreadsheetApp
    .getActive()
    .getSheetByName("AMFI_FUNDS");

  const values = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 2)
    .getValues();

  return values.map(r => ({
    schemeCode: r[0],
    schemeName: r[1]
  }));
}

function resetAmfiOffset() {
  PropertiesService.getScriptProperties().deleteProperty("AMFI_OFFSET");
  Logger.log("✅ AMFI offset reset. Next run will start from beginning.");
}


function getNAV(schemeCode) {
  if (!schemeCode) return [];

  const url = `https://api.mfapi.in/mf/${schemeCode}`;
  const res = UrlFetchApp.fetch(url);
  const json = JSON.parse(res.getContentText());

  return json.data || [];
}

function getIndicesFromSheet() {
  const sheet = SpreadsheetApp
    .getActive()
    .getSheetByName("INDICES");

  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  // Read A:D (Name, Symbol, Price, %Change)
  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();

  return data
    .filter(r => r[0] && r[2]) // name & price exist
    .map(r => ({
      name: r[0],
      symbol: r[1],
      price: Number(r[2]),
      percent: Number(r[3])   // already decimal (0.48)
    }));
}
const BATCH_SIZE = 1000;   // safe for 6-min limit
const PROP_KEY = "AMFI_OFFSET";

function fetchAmfiYearlyReturnsBatched() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName("AMFI_RETURNS") || ss.insertSheet("AMFI_RETURNS");

  const props = PropertiesService.getScriptProperties();
  const offset = Number(props.getProperty(PROP_KEY)) || 0;

  if (offset === 0) {
    sheet.clear();
    sheet.appendRow([
      "Scheme Code",
      "Scheme Name",
      "Category",
      "Return 2025 %",
      "Return 2024 %",
      "Return 2023 %"
    ]);
  }

  const schemes = JSON.parse(
    UrlFetchApp.fetch("https://api.mfapi.in/mf").getContentText()
  );

  const years = {
    2025: ["31-12-2024", "31-12-2025"],
    2024: ["31-12-2023", "31-12-2024"],
    2023: ["31-12-2022", "31-12-2023"]
  };

  const rows = [];
  const end = Math.min(offset + BATCH_SIZE, schemes.length);

  for (let i = offset; i < end; i++) {
    const scheme = schemes[i];
    if(scheme.schemeName.toLowerCase().includes(" idcw") || 
        scheme.schemeName.toLowerCase().includes("regular") ||
        scheme.schemeName.toLowerCase().includes("dividend") ||
        scheme.schemeName.toLowerCase().includes("institutional") ||
        scheme.schemeName.toLowerCase().includes("auto sweep") ||
         scheme.schemeName.toLowerCase().includes("-div") || 
          scheme.schemeName.toLowerCase().includes("floating") ||
           scheme.schemeName.toLowerCase().includes("auto sweep")){
          continue;
        }
    // if(!scheme.schemeName.toLowerCase().includes("icici") && !scheme.schemeName.toLowerCase().includes("hdfc") && 
    //   !scheme.schemeName.toLowerCase().includes("kotak") && !scheme.schemeName.toLowerCase().includes("motilal")
    //   && !scheme.schemeName.toLowerCase().includes("quant") && !scheme.schemeName.toLowerCase().includes("quantum")
    //   && !scheme.schemeName.toLowerCase().includes("nippon") && !scheme.schemeName.toLowerCase().includes("bandhan") 
    //   && !scheme.schemeName.toLowerCase().includes("sbi ") && !scheme.schemeName.toLowerCase().includes("canara") 
    //   && !scheme.schemeName.toLowerCase().includes("pgim") && !scheme.schemeName.toLowerCase().includes("tata")
    //   && !scheme.schemeName.toLowerCase().includes("uti ") && !scheme.schemeName.toLowerCase().includes("dsp ")
    //   && !scheme.schemeName.toLowerCase().includes("pgim")){
    //     continue;
     // }
    try {
      const res = JSON.parse(
        UrlFetchApp.fetch(`https://api.mfapi.in/mf/${scheme.schemeCode}`).getContentText()
      );

      if (!res.data || res.data.length === 0) continue;
      // EXCLUDE schemes with no NAV in 2025
      if (!hasNavIn2025(res.data)) continue;

      const navMap = {};
      res.data.forEach(d => navMap[d.date] = parseFloat(d.nav));

      const returns = {};

      for (const yr in years) {
        const [from, to] = years[yr];
        const navFrom = findClosestNav(navMap, from);
        const navTo = findClosestNav(navMap, to);

        // ONLY skip if NAV missing
        if (navFrom == null || navTo == null) {
          returns[yr] = null;
          break;
        }

        returns[yr] = (((navTo - navFrom) / navFrom) * 100).toFixed(2);
      }

      // Skip scheme if ANY year missing
      if (Object.values(returns).some(v => v === null)) continue;

      rows.push([
        scheme.schemeCode,
        scheme.schemeName,
        res.meta.scheme_category || "Other",
        returns[2025],
        returns[2024],
        returns[2023]
      ]);

    } catch (e) {
      // silently skip problematic schemes
    }
  }

  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
         .setValues(rows);
  }

  // Save progress
  props.setProperty(PROP_KEY, end);

  if (end >= schemes.length) {
    props.deleteProperty(PROP_KEY);
    Logger.log("✅ AMFI processing completed");
  } else {
    Logger.log(`⏳ Processed ${end}/${schemes.length}`);
  }
}


// function fetchAmfiYearlyReturns() {
//   const ss = SpreadsheetApp.getActiveSpreadsheet();
//   const sheet = ss.getSheetByName("AMFI_RETURNS") || ss.insertSheet("AMFI_RETURNS");

//   sheet.clear();
//   sheet.appendRow([
//     "Scheme Code",
//     "Scheme Name",
//     "Category",
//     "Return 2025 %",
//     "Return 2024 %",
//     "Return 2023 %"
//   ]);

//   const schemes = JSON.parse(
//     UrlFetchApp.fetch("https://api.mfapi.in/mf").getContentText()
//   );

//   const years = {
//     2025: ["31-12-2024", "31-12-2025"],
//     2024: ["31-12-2023", "31-12-2024"],
//     2023: ["31-12-2022", "31-12-2023"]
//   };

//   for (const scheme of schemes) {
     
//     try {
//       const res = JSON.parse(
//         UrlFetchApp.fetch(`https://api.mfapi.in/mf/${scheme.schemeCode}`).getContentText()
//       );

//       if (!res.data || res.data.length === 0) continue;

     
//       const navMap = {};
//       res.data.forEach(d => navMap[d.date] = parseFloat(d.nav));

//       const returns = {};
//       let valid = true;

//       for (const yr in years) {
//         const [from, to] = years[yr];
//         const navFrom = findClosestNav(navMap, from);
//         const navTo = findClosestNav(navMap, to);

//         if (!navFrom || !navTo || navFrom === navTo) {
//           valid = false;
//           break;
//         }

//         returns[yr] = (((navTo - navFrom) / navFrom) * 100).toFixed(2);
//       }

//       if (!valid) continue;

//       sheet.appendRow([
//         scheme.schemeCode,
//         scheme.schemeName,
//         res.meta.scheme_category,
//         returns[2025],
//         returns[2024],
//         returns[2023]
//       ]);

//     } catch (e) {
//       Logger.log(`Skipping ${scheme.schemeCode}: ${e}`);
//     }
//   }
// }

function hasNavIn2025(navData) {
  return navData.some(d => {
    const year = d.date.split("-")[2];
    return year === "2025";
  });
}


function findClosestNav(navMap, targetDate) {
  if (navMap[targetDate]) return navMap[targetDate];

  const target = new Date(targetDate.split("-").reverse().join("-"));
  let closest = null;
  let minDiff = Infinity;

  for (const date in navMap) {
    const d = new Date(date.split("-").reverse().join("-"));
    const diff = target - d;
    if (diff >= 0 && diff < minDiff) {
      minDiff = diff;
      closest = navMap[date];
    }
  }
  return closest;
}
