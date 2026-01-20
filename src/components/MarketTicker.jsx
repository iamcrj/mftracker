import { useEffect, useState } from "react";
import { fetchIndices } from "../services/api";

export default function MarketTicker() {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetchIndices().then(d => mounted && setIndices(d || []));

    const id = setInterval(() => {
      fetchIndices().then(d => mounted && setIndices(d || []));
    }, 120000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (!indices.length) return null;

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {indices.map((i, idx) => (
          <div key={idx} className="ticker-item">
            <span>{i.name}</span>
            <span>{i.price?.toFixed(2)}</span>
            <span className={i.percent >= 0 ? "pos" : "neg"}>
              {i.percent?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
