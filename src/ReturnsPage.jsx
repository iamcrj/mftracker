import { useEffect, useRef, useState } from "react";
import "./ReturnsPage.css";

import { fetchSchemes, fetchNAV } from "./services/api";
import {
  calculateYearlyReturns,
  calculateCAGRFromReturns
} from "./services/calculations";

export default function ReturnsPage() {
  const [schemes, setSchemes] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const [years, setYears] = useState("");
  const [rows, setRows] = useState([]);
  const [cagr, setCagr] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    fetchSchemes().then(data => setSchemes(data || []));
  }, []);

  const suggestions =
    query.length > 1
      ? schemes.filter(s =>
          s.schemeName
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      : [];

  async function viewPerformance() {
    if (!selected) {
      setError("Please select a mutual fund");
      return;
    }
    if (!years || years <= 0) {
      setError("Please enter valid number of years");
      return;
    }

    setLoading(true);
    setError("");

    const nav = await fetchNAV(selected.schemeCode);
    const yearly = calculateYearlyReturns(nav, Number(years));

    setRows(yearly);
    setCagr(calculateCAGRFromReturns(yearly));
    setLoading(false);
  }

  function clearFund() {
    setSelected(null);
    setQuery("");
    setRows([]);
    setCagr(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <section
      id="returnsPage"
      className="returnsPage"
    >
      {/* Header */}
      <header className="returnsPage__header">
        <h1>Mutual Fund Performance</h1>
        <p>
          View historical returns and estimated CAGR
          based on NAV data.
        </p>
      </header>

      {/* Fund Search */}
      <div className="returnsPage__selector">
        {selected ? (
          <div className="returnsPage__selected">
            <span>{selected.schemeName}</span>
            <button onClick={clearFund}>Change</button>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              className="returnsPage__search"
              placeholder="Search mutual fund…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />

            {suggestions.length > 0 && (
              <div className="returnsPage__suggestions">
                {suggestions.slice(0, 10).map(s => (
                  <div
                    key={s.schemeCode}
                    className="returnsPage__suggestion"
                    onClick={() => {
                      setSelected(s);
                      setQuery("");
                    }}
                  >
                    {s.schemeName}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="returnsPage__controls">
        <input
          type="number"
          min="1"
          max="6"
          placeholder="Years (1–6)"
          value={years}
          onChange={e => setYears(e.target.value)}
        />

        <button
          onClick={viewPerformance}
          disabled={loading}
        >
          {loading ? "Calculating…" : "View"}
        </button>
      </div>

      {error && (
        <div className="returnsPage__error">
          {error}
        </div>
      )}

      {/* CAGR */}
      {cagr !== null && (
        <div className="returnsPage__cagr">
          <span>{years}Y CAGR</span>
          <strong>
            {(cagr * 100).toFixed(2)}%
          </strong>
        </div>
      )}

      {/* Projection */}
      {cagr !== null && (
        <div className="returnsPage__projection">
          <h4>If you had invested ₹1,00,000</h4>

          <div className="returnsPage__projectionGrid">
            <div>
              <label>After 1 year </label>
              <strong>
                ₹
                {Math.round(
                  100000 * (1 + cagr)
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <label>After {years} years </label>
              <strong className="highlight">
                ₹
                {Math.round(
                  100000 *
                    Math.pow(1 + cagr, years)
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <p className="note">
            Based on CAGR; actual returns may
            differ.
          </p>
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <div className="returnsPage__tableWrap">
          <table className="returnsPage__table">
            <thead>
              <tr>
                <th>Year</th>
                <th className="right">Return</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.year}>
                  <td>{r.year}</td>
                  <td className="right pos">
                    {(r.value * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
