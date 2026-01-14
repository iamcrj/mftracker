import { useEffect, useState } from "react";
import { fetchLiveIPO } from "../services/api";

export default function LiveIPO() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveIPO()
      .then(setIpos)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="live-ipo">
      <h2>Live IPOs</h2>
      <p className="muted">
        Track currently active IPOs with issue details
        and subscription status.
      </p>

      {loading && (
        <div className="muted">Loading IPOs…</div>
      )}

      {!loading && ipos.length === 0 && (
        <div className="muted">
          No active IPOs at the moment.
        </div>
      )}

      <div className="ipo-grid">
        {ipos.map(ipo => (
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

              <span
                className={
                  ipo.status === "Active"
                    ? "ipo-status active"
                    : "ipo-status"
                }
              >
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
    </div>
  );
}
