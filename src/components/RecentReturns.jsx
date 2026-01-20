import { useEffect, useMemo, useState } from "react";
import { fetchAmfiRecentReturns } from "../services/api";
import "./css/RecentReturns.css";

const PERIODS = [
  { key: "oneWeek", label: "1W" },
  { key: "oneMonth", label: "1M" },
  { key: "threeMonth", label: "3M" },
  { key: "sixMonth", label: "6M" }
];

export default function RecentReturns() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("sixMonth");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] =
    useState([]);
  const [showFilters, setShowFilters] =
    useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAmfiRecentReturns()
      .then(res => setData(res || []))
      .finally(() => setLoading(false));
  }, []);

  const allCategories = useMemo(() => {
    return [
      ...new Set(
        data.map(d => d.schemeCategory).filter(Boolean)
      )
    ].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data
      .filter(d => d[period])
      .filter(d =>
        search
          ? d.schemeName
              .toLowerCase()
              .includes(search.toLowerCase())
          : true
      )
      .filter(d =>
        selectedCategories.length
          ? selectedCategories.includes(d.schemeCategory)
          : true
      )
      .sort(
        (a, b) =>
          b[period].returnPct -
          a[period].returnPct
      )
      .slice(0, 15);
  }, [data, period, search, selectedCategories]);

  const periodRange =
    filteredData[0]?.[period] || null;

  function toggleCategory(category) {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }

  return (
    <section className="recent-returns">
      <header className="recent-returns__header">
        <h2 className="recent-returns__title">
          Fund Short-Term Trends
        </h2>
        <p className="recent-returns__subtitle">
          View top performing funds across
          different time windows.
        </p>
      </header>

      <div className="recent-returns__periods">
        {PERIODS.map(p => (
          <button
            key={p.key}
            className={
              period === p.key
                ? "period-tab active"
                : "period-tab"
            }
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="recent-returns__toolbar">
        <input
          className="recent-returns__search"
          placeholder="Search fund name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button
          className="recent-returns__filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
          {selectedCategories.length > 0 && (
            <span className="filter-count">
              {selectedCategories.length}
            </span>
          )}
        </button>
      </div>

      {loading && (
        <div className="recent-returns__loading">
          <span className="recent-returns__spinner" />
        </div>
      )}

      {!loading && (
        <div
          className={
            showFilters
              ? "recent-returns__content with-filters"
              : "recent-returns__content"
          }
        >
          {showFilters && (
            <aside className="recent-returns__filters">
              <div className="filters__title">
                Filter by category
              </div>

              <div className="filters__list">
                {allCategories.map(cat => (
                  <label
                    key={cat}
                    className="filter-item"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(
                        cat
                      )}
                      onChange={() =>
                        toggleCategory(cat)
                      }
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </aside>
          )}

          <div className="recent-returns__results">
            {periodRange && (
              <div className="recent-returns__period-info">
                Period: {periodRange.from} →{" "}
                {periodRange.to}
              </div>
            )}

            <div className="recent-returns__table-wrapper">
              <table className="recent-returns__table">
                <thead>
                  <tr>
                    <th>Fund</th>
                    <th>Category</th>
                    <th className="right">
                      Return
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(f => (
                    <tr key={f.schemeCode}>
                      <td className="fund-name">
                        {f.schemeName}
                      </td>
                      <td className="fund-category">
                        {f.schemeCategory || "—"}
                      </td>
                      <td className="fund-return">
                        {f[period].returnPct.toFixed(
                          2
                        )}
                        %
                      </td>
                    </tr>
                  ))}

                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="no-results"
                      >
                        No funds match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="recent-returns__cards">
              {filteredData.map(f => (
                <div
                  className="return-card"
                  key={f.schemeCode}
                >
                  <div className="return-card__top">
                    <div className="return-card__fund">
                      {f.schemeName}
                    </div>
                    <div className="return-card__value">
                      {f[period].returnPct.toFixed(
                        2
                      )}
                      %
                    </div>
                  </div>
                  <div className="return-card__category">
                    {f.schemeCategory || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
