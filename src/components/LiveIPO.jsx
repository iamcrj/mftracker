import { useEffect, useState } from "react";
import { fetchLiveIPO } from "../services/api";

export default function LiveIPO() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [segment, setSegment] = useState("EQ"); // EQ | SME

  useEffect(() => {
    fetchLiveIPO()
      .then(setIpos)
      .finally(() => setLoading(false));
  }, []);

  const filtered = ipos.filter(
    ipo => ipo.series === segment
  );

  return (
    <div className="live-ipo">
      <h2>Live IPOs</h2>
      <p className="muted">
        Track currently active IPOs with issue details
        and subscription status.
      </p>

      {/* Desktop segment switch */}
      <div className="ipo-segment desktop-only">
        <button
          className={
            segment === "EQ"
              ? "seg-btn active"
              : "seg-btn"
          }
          onClick={() => setSegment("EQ")}
        >
          Mainline IPOs
        </button>
        <button
          className={
            segment === "SME"
              ? "seg-btn active"
              : "seg-btn"
          }
          onClick={() => setSegment("SME")}
        >
          SME IPOs
        </button>
      </div>

      {loading && (
        <div className="muted">Loading IPOs…</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="muted">
          No {segment === "EQ" ? "Mainline" : "SME"}{" "}
          IPOs currently available.
        </div>
      )}

      <div className="ipo-grid">
        {filtered.map(ipo => (
          <div className="ipo-card" key={ipo.symbol}>
            <div className="ipo-header">
              <div>
                <div className="ipo-symbol">
                  {ipo.symbol}
                </div>
                <div className="ipo-name">
                  {ipo.companyName}
                </div>
              </div>

              <span className="ipo-status active">
                {ipo.status}
              </span>
            </div>

            <div className="ipo-meta">
              <div>
                <span>Opens</span>
                <strong>{ipo.issueStartDate}</strong>
              </div>
              <div>
                <span>Closes</span>
                <strong>{ipo.issueEndDate}</strong>
              </div>
            </div>

            <div className="ipo-details">
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
                    {Number(
                      ipo.issueSize
                    ).toLocaleString()}
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

      {/* Mobile bottom bar */}
      <div className="ipo-bottom-bar mobile-only">
        <button
          className={
            segment === "EQ"
              ? "bottom-btn active"
              : "bottom-btn"
          }
          onClick={() => setSegment("EQ")}
        >
          Mainline
        </button>
        <button
          className={
            segment === "SME"
              ? "bottom-btn active"
              : "bottom-btn"
          }
          onClick={() => setSegment("SME")}
        >
          SME
        </button>
      </div>
    </div>
  );
}
