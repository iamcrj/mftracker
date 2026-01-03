function loadAMFISchemesOnce() {
  const sheetName = "AMFI_FUNDS";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // Prevent re-loading if data already exists
  if (sheet.getLastRow() > 1) {
    SpreadsheetApp.getUi().alert("AMFI schemes already loaded.");
    return;
  }

  const url = "https://api.mfapi.in/mf";
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  const rows = [["Scheme Code", "Scheme Name"]];

  data.forEach(scheme => {
    const schemeName = scheme.schemeName.toLowerCase();
    if((schemeName.includes("growth") || schemeName.includes("cumulative"))
         && schemeName.includes("direct plan")){
      rows.push([scheme.schemeCode, scheme.schemeName]);
    }
  });

  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.getRange("A1:B1").setFontWeight("bold");
}

function getYearEndNAV(amfiCode, year) {
  const url = `https://api.mfapi.in/mf/${amfiCode}`;
  const res = UrlFetchApp.fetch(url);
  const json = JSON.parse(res.getContentText());

  const targetDate = new Date(year, 11, 31);

  for (const row of json.data) {
    const [d, m, y] = row.date.split("-");
    const navDate = new Date(y, m - 1, d);

    if (navDate <= targetDate) {
      return Number(row.nav);
    }
  }
  return null;
}

function doGet(e) {
  const callback = e.parameter.callback;

  let result;
  try {
    if (e.parameter.action === "schemes") {
      result = getSchemes();
    } else if (e.parameter.action === "nav") {
      result = getNAV(e.parameter.schemeCode);
    } else {
      result = { error: "Invalid action" };
    }
  } catch (err) {
    result = { error: err.message };
  }

  const json = JSON.stringify(result);

  // JSONP response
  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${json})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // fallback (browser open)
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

function getNAV(schemeCode) {
  if (!schemeCode) return [];

  const url = `https://api.mfapi.in/mf/${schemeCode}`;
  const res = UrlFetchApp.fetch(url);
  const json = JSON.parse(res.getContentText());

  return json.data || [];
}

