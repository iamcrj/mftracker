import { useState } from "react";
import { fetchAmfiData } from "./api";
import {
  calculateYearlyReturns,
  calculateCagr
} from "./utils";

export default function App() {
  const [fundCode, setFundCode] = useState("");
  const [years, setYears] = useState(3);
  const [data, setData] = useState(null);
  const [cagr, setCagr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const json = await fetchAmfiData(fundCode);
      const navData = json.data;

      setData(calculateYearlyReturns(navData, years));
      setCagr(calculateCagr(navData, years));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Mutual Fund Returns</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="AMFI Code"
          value={fundCode}
          onChange={e => setFundCode(e.target.value)}
        />
        <input
          type="number"
          value={years}
          onChange={e => setYears(+e.target.value)}
        />
        <button>Calculate</button>
      </form>

      {loading && <p>Loading...</p>}

      {data && (
        <>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Year</th>
                <th>Return (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{row.performance}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>CAGR: {cagr}%</h3>
        </>
      )}
    </div>
  );
}
