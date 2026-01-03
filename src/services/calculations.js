function parseDate(d) {
  const [dd, mm, yyyy] = d.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`);
}

export function calculateYearlyReturns(navData = [], years) {
  if (!Array.isArray(navData) || !years) return [];

  const navByYear = {};

  navData.forEach(d => {
    const year = parseDate(d.date).getFullYear();
    if (!navByYear[year]) {
      navByYear[year] = parseFloat(d.nav);
    }
  });

  const currentYear = new Date().getFullYear() - 1;
  const rows = [];

  for (let i = 0; i < years; i++) {
    const y = currentYear - i;
    if (navByYear[y] && navByYear[y - 1]) {
      rows.push({
        year: y,
        value: navByYear[y] / navByYear[y - 1] - 1
      });
    }
  }

  return rows;
}

export function calculateCAGRFromReturns(rows = []) {
  if (!rows.length) return null;

  const product = rows.reduce(
    (acc, r) => acc * (1 + r.value),
    1
  );

  return Math.pow(product, 1 / rows.length) - 1;
}
