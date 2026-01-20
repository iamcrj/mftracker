import { useState } from "react";

export default function FundSelector({ schemes, onSelect }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = schemes.filter(s =>
    s.schemeName.toLowerCase().includes(query.toLowerCase())
  );

  if (selected) {
    return (
      <div className="selected-chip">
        <span>{selected.schemeName}</span>
        <button onClick={() => { setSelected(null); onSelect(null); }}>
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="search-box">
      <input
        className="search-input"
        placeholder="Search mutual fund…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {query && (
        <div className="search-results">
          {filtered.slice(0, 10).map(f => (
            <div
              key={f.schemeCode}
              className="search-item"
              onClick={() => {
                setSelected(f);
                onSelect(f);
                setQuery("");
              }}
            >
              {f.schemeName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
