export function getNavOnOrBefore(navData, year) {
  const target = new Date(year, 11, 31);

  for (const row of navData) {
    const [d, m, y] = row.date.split("-");
    const navDate = new Date(y, m - 1, d);

    if (navDate <= target) {
      return Number(row.nav);
    }
  }
  return null;
}

export function calculateYearlyReturns(navData, years) {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear - 1;

  const results = [];

  for (let i = 0; i < years; i++) {
    const year = endYear - i;
    const endNav = getNavOnOrBefore(navData, year);
    const startNav = getNavOnOrBefore(navData, year - 1);

    if (endNav && startNav) {
      results.push({
        year,
        performance: +(((endNav / startNav) - 1) * 100).toFixed(2)
      });
    }
  }

  return results;
}

export function calculateCagr(navData, years) {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear - 1;

  const endNav = getNavOnOrBefore(navData, endYear);
  const startNav = getNavOnOrBefore(navData, endYear - years);

  if (!endNav || !startNav) return null;

  return +(
    (Math.pow(endNav / startNav, 1 / years) - 1) * 100
  ).toFixed(2);
}
