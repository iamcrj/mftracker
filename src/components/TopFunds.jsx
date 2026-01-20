import { useEffect, useState } from "react";
import { fetchAmfiReturns } from "../services/api";
import "./css/TopFunds.css";

export default function TopFunds() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("2025");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAmfiReturns()
      .then(res => setData(res || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    ...new Set(data.map(d => d.category).filter(Boolean))
  ];

  const yearKey = `return${year}`;

  const filtered = data
    .filter(d => !category || d.category === category)
    .filter(d => typeof d[yearKey] === "number")
    .sort((a, b) => b[yearKey] - a[yearKey])
    .slice(0, 10);

  return (
    <div className="topfunds">
      {/* Header */}
      <div className="topfunds__header">
        <h2 className="topfunds__title">
          Top Performers
        </h2>
        <p className="topfunds__subtitle">
          Best performing mutual funds by category and
          calendar year.
        </p>
      </div>

      {/* Filters */}
      <div className="topfunds__filters">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
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

      {/* Loading state */}
      {loading && (
        <div className="topfunds__loading">
          <span className="topfunds__spinner" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="topfunds__empty">
          No funds available for selected filters.
        </div>
      )}

      {/* Desktop table */}
      {!loading && filtered.length > 0 && (
        <div className="topfunds__table-wrap desktop-only">
          <table className="topfunds__table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Fund</th>
                <th>Category</th>
                <th className="right">
                  Return ({year})
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.schemeCode}>
                  <td className="rank">{i + 1}</td>
                  <td className="fund-name">
                    {f.schemeName}
                  </td>
                  <td className="fund-category">
                    {f.category}
                  </td>
                  <td className="fund-return">
                    {f[yearKey].toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!loading && filtered.length > 0 && (
        <div className="topfunds__cards mobile-only">
          {filtered.map((f, i) => (
            <div
              className="topfund-card"
              key={f.schemeCode}
            >
              <div className="card-top">
                <span className="card-rank">
                  #{i + 1}
                </span>
                <span className="card-return">
                  {f[yearKey].toFixed(2)}%
                </span>
              </div>

              <div className="card-name">
                {f.schemeName}
              </div>

              <div className="card-category">
                {f.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
