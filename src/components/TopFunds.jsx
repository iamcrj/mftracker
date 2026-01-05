import { useEffect, useState } from "react";
import { fetchAmfiReturns } from "../services/api";

export default function TopFunds() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("2025");
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    setLoading(true);

    const cached = sessionStorage.getItem(
      "mf_amfi_returns_cache"
    );

    if (cached) {
      setFromCache(true);
    }

    fetchAmfiReturns()
      .then(res => {
        setData(res || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = [
    ...new Set(data.map(d => d.category))
  ];

  const yearKey = `return${year}`;

  const filtered = data
    .filter(d => !category || d.category === category)
    .filter(d => typeof d[yearKey] === "number")
    .sort((a, b) => b[yearKey] - a[yearKey])
    .slice(0, 10);

  return (
    <div className="top-funds">
      <h2>Top Mutual Funds by Category</h2>
      <p className="muted">
        See top performing mutual funds over the last
        three calendar years based on reported returns.
      </p>

      {fromCache && !loading && (
        <div className="cache-indicator">
          Showing cached data (updated hourly)
        </div>
      )}

      {/* 🔄 Loading state */}
      {loading && (
        <>
          <div className="loading-row">
            <span className="spinner" />
            Loading top funds…
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>Category</th>
                  <th>Return</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div className="skeleton skeleton-text" />
                    </td>
                    <td>
                      <div className="skeleton skeleton-text short" />
                    </td>
                    <td>
                      <div className="skeleton skeleton-text tiny" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ✅ Loaded content */}
      {!loading && (
        <>
          <div className="filters">
            <select
              value={category}
              onChange={e =>
                setCategory(e.target.value)
              }
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={e => setYear(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="muted">
              No funds available for the selected
              filters.
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fund</th>
                    <th>Category</th>
                    <th>Return ({year})</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.schemeCode}>
                      <td>{f.schemeName}</td>
                      <td>{f.category}</td>
                      <td className="pos">
                        {f[yearKey].toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
