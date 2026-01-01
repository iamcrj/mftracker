const API_BASE =
  "https://script.google.com/macros/s/AKfycbznLFg94Muw8-aNePmnysoLxVYWmlwErd0XlyoGlRas-lMWqdR1-QqVOVEV5vFaPozg/exec";

export async function fetchAmfiData(fundCode) {
  const res = await fetch(`${API_BASE}?fundCode=${fundCode}`);
  if (!res.ok) {
    throw new Error("Failed to fetch AMFI data");
  }
  return res.json();
}
