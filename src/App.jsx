import { useState } from "react";

import MarketTicker from "./components/MarketTicker";
import ReturnsPage from "./ReturnsPage";
import TopFunds from "./components/TopFunds";
import RecentReturns from "./components/RecentReturns";
import LiveIPO from "./components/LiveIPO";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";

export default function App() {
  const [page, setPage] = useState("returns");

  function renderPage() {
    switch (page) {
      case "returns":
        return <ReturnsPage />;
      case "top":
        return <TopFunds />;
      case "recent":
        return <RecentReturns />;
      // case "ipo":
      //   return <LiveIPO />;
      case "privacy":
        return <PrivacyPolicy />;
      case "disclaimer":
        return <Disclaimer />;
      default:
        return <ReturnsPage />;
    }
  }

  return (
    <div id="app_root" className="app-root">
      <MarketTicker />

      <nav
        id="app_navbar"
        className="app-navbar"
      >
        <div className="app-navbar__inner">
          <div
            className="app-navbar__brand"
            onClick={() => setPage("returns")}
          >
            FundLens
          </div>

          <div className="app-navbar__links">
            <button
              className={`app-nav-btn ${
                page === "returns" ? "active" : ""
              }`}
              onClick={() => setPage("returns")}
            >
              Performance
            </button>

            <button
              className={`app-nav-btn ${
                page === "top" ? "active" : ""
              }`}
              onClick={() => setPage("top")}
            >
              Top Funds
            </button>

            <button
              className={`app-nav-btn ${
                page === "recent" ? "active" : ""
              }`}
              onClick={() => setPage("recent")}
            >
              Trends
            </button>

            {/* <button
              className={`app-nav-btn ${
                page === "ipo" ? "active" : ""
              }`}
              onClick={() => setPage("ipo")}
            >
              IPOs
            </button> */}
          </div>
        </div>
      </nav>

      <main
        id="app_content"
        className="app-content"
      >
        {renderPage()}
      </main>

      <footer
        id="app_footer"
        className="app-footer"
      >
        <div className="app-footer__inner">
          <div className="app-footer__disclaimer">
            <strong>Disclaimer:</strong> FundLens provides
            market data and mutual fund analytics for
            informational purposes only. Mutual fund
            investments are subject to market risks. Past
            performance does not guarantee future returns.
          </div>

          <div className="app-footer__links">
            <span>
              © {new Date().getFullYear()} FundLens
            </span>
            <span>•</span>
            <button
              className="app-footer__link-btn"
              onClick={() => setPage("privacy")}
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              className="app-footer__link-btn"
              onClick={() => setPage("disclaimer")}
            >
              Disclaimer
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
