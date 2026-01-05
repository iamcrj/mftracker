const BASE_URL =
  "https://script.google.com/macros/s/AKfycbzLj5eQm1dG_79euAUCRORWv1-5Jkz9GRKy1SSGjz6jzVUislcQ5uAhmmxGEyxx7JsHsw/exec";

const SCHEME_CACHE_KEY = "mf_schemes_cache";
const AMFI_RETURNS_CACHE_KEY = "mf_amfi_returns_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName =
      "cb_" + Math.random().toString(36).substring(2);

    const script = document.createElement("script");

    window[callbackName] = data => {
      resolve(data);
      delete window[callbackName];
      script.remove();
    };

    script.src = `${url}&callback=${callbackName}`;
    script.onerror = reject;

    document.body.appendChild(script);
  });
}

export function fetchNAV(schemeCode) {
  return jsonp(`${BASE_URL}?action=nav&schemeCode=${schemeCode}`);
}

export function fetchIndices() {
  return jsonp(`${BASE_URL}?action=indices`);
}

export async function fetchSchemes() {
  try {
    const cached = sessionStorage.getItem(SCHEME_CACHE_KEY);

    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    const data = await jsonp(`${BASE_URL}?action=schemes`);

    if (Array.isArray(data)) {
      sessionStorage.setItem(
        SCHEME_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data
        })
      );
    }

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchAmfiReturns() {
  try {
    const cached = sessionStorage.getItem(
      AMFI_RETURNS_CACHE_KEY
    );

    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    const data = await jsonp(
      `${BASE_URL}?action=amfiReturns`
    );

    if (Array.isArray(data)) {
      sessionStorage.setItem(
        AMFI_RETURNS_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data
        })
      );
    }

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
