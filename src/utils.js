export function navOnOrBefore(data, year) {
  const target = new Date(year, 11, 31);
  for (const r of data) {
    const [d,m,y] = r.date.split("-");
    const dt = new Date(y, m-1, d);
    if (dt <= target) return +r.nav;
  }
  return null;
}

export function yearlyReturns(data, years) {
  const endYear = new Date().getFullYear() - 1;
  return Array.from({length: years}, (_, i) => {
    const y = endYear - i;
    const e = navOnOrBefore(data, y);
    const s = navOnOrBefore(data, y-1);
    return e && s ? {
      year: y,
      performance: +(((e/s)-1)*100).toFixed(2)
    } : null;
  }).filter(Boolean);
}

export function cagr(data, years) {
  const endYear = new Date().getFullYear() - 1;
  const e = navOnOrBefore(data, endYear);
  const s = navOnOrBefore(data, endYear-years);
  return e && s
    ? +((Math.pow(e/s,1/years)-1)*100).toFixed(2)
    : null;
}

/* SIP XIRR */
export function sipXirr(monthly, years, navData) {
  const months = years * 12;
  const cashflows = Array(months).fill(-monthly);
  const finalNav = navOnOrBefore(navData, new Date().getFullYear()-1);
  cashflows.push(finalNav * months);
  return internalRate(cashflows) * 100;
}

function internalRate(values) {
  let rate = 0.1;
  for (let i=0;i<100;i++) {
    let npv = values.reduce((a,v,j)=>a+v/Math.pow(1+rate,j),0);
    rate += npv/10000;
  }
  return rate;
}
