const BASE_URL = "https://script.google.com/macros/s/AKfycbzLj5eQm1dG_79euAUCRORWv1-5Jkz9GRKy1SSGjz6jzVUislcQ5uAhmmxGEyxx7JsHsw/exec";

export async function fetchSchemes() {
  const res = await fetch(`${BASE_URL}?action=schemes`);
  return res.json();
}

export async function fetchNAV(schemeCode) {
  const res = await fetch(
    `${BASE_URL}?action=nav&schemeCode=${schemeCode}`
  );
  return res.json();
}