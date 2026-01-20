import { useEffect, useState } from "react";
import { fetchLiveIPO } from "../services/api";
import "./css/LiveIPO.css";

export default function LiveIPO() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [segment, setSegment] = useState("EQ"); // EQ | SME

  useEffect(() => {
    fetchLiveIPO()
      .then(data => setIpos(data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = ipos.filter(
    ipo => ipo.series === segment
  );

  return (
    <div className="live-ipo">
      {/* Header */}
      <div className="live-ipo__header">
        <h2 className="live-ipo__title">Live IPOs</h2>
        <p className="live-ipo__subtitle">
          Track currently active IPOs with issue details and
          subscription status.
        </p>
      </div>

      {/* Segment switch – desktop */}
      <div className="live-ipo__segments desktop-only">
        <button
          className={`segment-btn ${
            segment === "EQ" ? "active" : ""
          }`}
          onClick={() => setSegment("EQ")}
        >
          Mainline IPOs
        </button>
        <button
          className={`segment-btn ${
            segment === "SME" ? "active" : ""
          }`}
          onClick={() => setSegment("SME")}
        >
          SME IPOs
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="live-ipo__loading">
          Loading IPOs…
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="live-ipo__empty">
          No {segment === "EQ" ? "Mainline" : "SME"} IPOs
          currently available.
        </div>
      )}

      {/* IPO Cards */}
      <div className="live-ipo__grid">
        {filtered.map(ipo => (
          <div className="ipo-card" key={ipo.symbol}>
            <div className="ipo-card__header">
              <div>
                <div className="ipo-card__symbol">
                  {ipo.symbol}
                </div>
                <div className="ipo-card__name">
                  {ipo.companyName}
                </div>
              </div>

              <span className="ipo-card__status">
                {ipo.status}
              </span>
            </div>

            <div className="ipo-card__dates">
              <div>
                <span>Opens</span>
                <strong>{ipo.issueStartDate}</strong>
              </div>
              <div>
                <span>Closes</span>
                <strong>{ipo.issueEndDate}</strong>
              </div>
            </div>

            <div className="ipo-card__metrics">
              {ipo.issuePrice && (
                <div>
                  <span>Price</span>
                  <strong>{ipo.issuePrice}</strong>
                </div>
              )}

              {ipo.issueSize && (
                <div>
                  <span>Issue Size</span>
                  <strong>
                    {Number(ipo.issueSize).toLocaleString()}
                  </strong>
                </div>
              )}

              {ipo.noOfTime && (
                <div>
                  <span>Subscription</span>
                  <strong>
                    {Number(ipo.noOfTime).toFixed(2)}×
                  </strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom switch – mobile */}
      <div className="live-ipo__bottom mobile-only">
        <button
          className={`bottom-tab ${
            segment === "EQ" ? "active" : ""
          }`}
          onClick={() => setSegment("EQ")}
        >
          Mainline
        </button>
        <button
          className={`bottom-tab ${
            segment === "SME" ? "active" : ""
          }`}
          onClick={() => setSegment("SME")}
        >
          SME
        </button>
      </div>
    </div>
  );
}
