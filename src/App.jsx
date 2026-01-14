import { useState } from "react";

import MarketTicker from "./components/MarketTicker";
import ReturnsPage from "./ReturnsPage";
import TopFunds from "./components/TopFunds";
import LiveIPO from "./components/LiveIPO";

export default function App() {
  const [page, setPage] = useState("returns");

  return (
    <>
      <MarketTicker />

      <nav className="navbar">
        <div className="nav-inner">
          <div className="brand">FundLens</div>

          <div className="nav-links">
            <button
              className={
                page === "returns"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => setPage("returns")}
            >
              Returns
            </button>

            <button
              className={
                page === "top"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => setPage("top")}
            >
              Top Funds
            </button>

            <button
              className={
                page === "ipo"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => setPage("ipo")}
            >
              Live IPO
            </button>
          </div>
        </div>
      </nav>

      {page === "returns" && <ReturnsPage />}
      {page === "top" && <TopFunds />}
      {page === "ipo" && <LiveIPO />}
    </>
  );
}
