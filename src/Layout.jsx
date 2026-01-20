import { useEffect, useState } from "react";
import MarketTicker from "./components/MarketTicker";

export default function Layout({
  page,
  setPage,
  children
}) {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () =>
      setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () =>
      window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Desktop only */}
      {!isMobile && <MarketTicker />}

      {/* Desktop top nav */}
      {!isMobile && (
        <nav className="navbar">
          <div className="nav-inner">
            <div className="brand">FundLens</div>

            <div className="nav-links">
              <NavBtn
                label="Fund Performance"
                active={page === "returns"}
                onClick={() => setPage("returns")}
              />
              <NavBtn
                label="Top Performers"
                active={page === "top"}
                onClick={() => setPage("top")}
              />
              <NavBtn
                label="Short-Term Trends"
                active={page === "recent"}
                onClick={() => setPage("recent")}
              />
              <NavBtn
                label="IPO Tracker"
                active={page === "ipo"}
                onClick={() => setPage("ipo")}
              />
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main>{children}</main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <div className="bottom-nav">
          <BottomBtn
            label="Performance"
            active={page === "returns"}
            onClick={() => setPage("returns")}
          />
          <BottomBtn
            label="Top"
            active={page === "top"}
            onClick={() => setPage("top")}
          />
          <BottomBtn
            label="Trends"
            active={page === "recent"}
            onClick={() => setPage("recent")}
          />
          <BottomBtn
            label="IPOs"
            active={page === "ipo"}
            onClick={() => setPage("ipo")}
          />
        </div>
      )}
    </>
  );
}

function NavBtn({ label, active, onClick }) {
  return (
    <button
      className={`nav-btn ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function BottomBtn({ label, active, onClick }) {
  return (
    <button
      className={`bottom-nav-btn ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
