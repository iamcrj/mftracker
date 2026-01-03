import { useState } from "react";

export default function FundSelector({ schemes = [], onSelect }) {
  const [query, setQuery] = useState("");

  const filtered = schemes.filter(s =>
    s.schemeName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-box">
      <input
        className="search-input"
        placeholder="Search mutual fund…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Dropdown now participates in layout */}
      {query && filtered.length > 0 && (
        <div className="search-results in-flow">
          {filtered.slice(0, 10).map(s => (
            <div
              key={s.schemeCode}
              className="search-item"
              onClick={() => {
                onSelect(s);
                setQuery(s.schemeName);
              }}
            >
              {s.schemeName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
