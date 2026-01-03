import { useEffect, useState } from "react";
import { fetchIndices } from "../services/api";

export default function MarketTicker() {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    fetchIndices().then(data => setIndices(data || []));
    const id = setInterval(() => {
      fetchIndices().then(data => setIndices(data || []));
    }, 120000); // refresh every 1 min

    return () => clearInterval(id);
  }, []);

  if (!indices.length) return null;

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {indices.map((i, idx) => (
          <div className="ticker-item" key={idx}>
            <span className="ticker-name">{i.name}</span>
            <span className="ticker-price">
              {i.price?.toFixed(2)}
            </span>
            <span className={i.percent >= 0 ? "pos" : "neg"}>
              {i.percent?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
