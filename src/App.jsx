import { useEffect, useState } from "react";

import FundSelector from "./components/FundSelector";
import CAGRStrip from "./components/CAGRStrip";
import PerformanceTable from "./components/PerformanceTable";
import MarketTicker from "./components/MarketTicker";
import InvestmentProjection from "./components/InvestmentProjection";

import { fetchSchemes, fetchNAV } from "./services/api";
import {
  calculateYearlyReturns,
  calculateCAGRFromReturns
} from "./services/calculations";

export default function App() {
  const [schemes, setSchemes] = useState([]);
  const [selected, setSelected] = useState(null);

  const [years, setYears] = useState("");
  const [error, setError] = useState("");

  const [rows, setRows] = useState([]);
  const [cagr, setCagr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchemes().then(data => setSchemes(data || []));
  }, []);

  function validateYears(value) {
    if (!value) return "Please enter number of years";
    if (value <= 0) return "Years must be greater than 0";
    if (value > 6) return "Maximum allowed is 6 years";
    return "";
  }

  function handleYearsChange(e) {
    const value = e.target.value;
    setYears(value);
    setError(validateYears(value));
  }

  async function viewPerformance() {
    if (!selected) {
      setError("Please select a fund");
      return;
    }

    const validationError = validateYears(years);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    const navData = await fetchNAV(selected.schemeCode);
    const yearly = calculateYearlyReturns(navData, Number(years));

    setRows(yearly);
    setCagr(calculateCAGRFromReturns(yearly));

    setLoading(false);
  }

  return (
    <>
      <MarketTicker />

      <nav className="navbar">
        <div className="nav-inner">
          <div className="brand">FundLens</div>
          <div className="nav-links">
            <span className="nav-link active">Returns</span>
            <span className="nav-link">About</span>
          </div>
        </div>
      </nav>

      <div className="app">
        <header className="hero">
          <h1>Mutual Fund Historical Returns</h1>
          <p>
            View calendar-year returns and estimated CAGR
            based on historical NAV data.
          </p>
        </header>

        <FundSelector schemes={schemes} onSelect={setSelected} />

        <div className="controls">
          <div className="years-input">
            <input
              type="number"
              placeholder="No. of years"
              value={years}
              onChange={handleYearsChange}
              min="1"
              max="6"
            />
            {error && <div className="error-text">{error}</div>}
          </div>

          <button
            onClick={viewPerformance}
            disabled={loading || !!error || !years}
          >
            {loading ? "Loading…" : "View"}
          </button>
        </div>

        {cagr != null && (
          <div className="disclaimer">
            Returns shown are based on historical NAV data
            and are for informational purposes only. Actual
            returns may vary.
          </div>
        )}

        <CAGRStrip value={cagr} years={years} />

        {/* 🔽 NEW SECTION */}
        <InvestmentProjection
          cagr={cagr}
          years={Number(years)}
        />

        <PerformanceTable rows={rows} />
      </div>
    </>
  );
}
