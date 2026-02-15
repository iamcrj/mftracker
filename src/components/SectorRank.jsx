import { useEffect, useState } from "react";
import { fetchSectorRankings } from "../services/api";
import "./css/SectorRank.css";

export default function SectorRank() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSectorRankings().then(setData);
  }, []);

  if (!data.length) {
    return (
      <div className="sectorrank__loading">
        <div className="spinner" />
        Loading sector rankings…
      </div>
    );
  }

  return (
    <section className="sectorrank">
      <header className="sectorrank__header">
        <h2 className="sectorrank__title">Sector Heatmap</h2>
        <p className="sectorrank__subtitle">
          Sector performance ranking across years
        </p>
      </header>

      <div className="sectorrank__grid">
        {data.map(yearData => (
          <div
            key={yearData.year}
            className="sectorrank__column"
          >
            <div className="sectorrank__year">
              {yearData.year}
            </div>

            <div className="sectorrank__benchmark">
              <span>{yearData.benchmark.name}</span>
              <strong>
                {yearData.benchmark.return.toFixed(2)}%
              </strong>
            </div>

            {yearData.sectors
              .sort((a, b) => a.rank - b.rank)
              .map(sector => (
                <div
                  key={sector.name}
                  className="sectorrank__cell"
                  style={{
                    background: getHeatColor(
                      sector.return
                    )
                  }}
                >
                  <div className="sectorrank__rank">
                    #{sector.rank}
                  </div>
                  <div className="sectorrank__name">
                    {sector.name}
                  </div>
                  <div className="sectorrank__return">
                    {sector.return.toFixed(1)}%
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* 🔥 Heatmap color scale */
function getHeatColor(value) {
  if (value > 40) return "#065f46";
  if (value > 25) return "#16a34a";
  if (value > 10) return "#4ade80";
  if (value > 0) return "#bbf7d0";
  if (value > -10) return "#fde68a";
  if (value > -25) return "#fca5a5";
  return "#dc2626";
}
