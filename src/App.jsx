import { useEffect, useState } from "react";
import FundSelector from "./components/FundSelector";
import CAGRStrip from "./components/CAGRStrip";
import PerformanceTable from "./components/PerformanceTable";
import { fetchSchemes, fetchNAV } from "./services/api";
import {
  calculateYearlyReturns,
  calculateCAGRFromReturns
} from "./services/calculations";

export default function App() {
  const [schemes, setSchemes] = useState([]);
  const [selected, setSelected] = useState(null);

  const [years, setYears] = useState("");          // ✅ empty by default
  const [error, setError] = useState("");          // ✅ validation error

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
    const validationError = validateYears(years);
    if (!selected) {
      setError("Please select a fund");
      return;
    }
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
    <div className="app">
      <h1>Mutual Fund Performance</h1>

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

      <CAGRStrip value={cagr} years={years} />
      <PerformanceTable rows={rows} />
    </div>
  );
}
