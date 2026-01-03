import { useState, useRef } from "react";

export default function FundSelector({ schemes = [], onSelect }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const inputRef = useRef(null);

  const filtered = schemes.filter(s =>
    s.schemeName.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(fund) {
    setSelected(fund);
    onSelect(fund);
    setQuery("");
  }

  function clearSelection() {
    setSelected(null);
    onSelect(null);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="search-box">
      {/* Selected fund view */}
      {selected ? (
        <div className="selected-chip">
          <span className="chip-text">{selected.schemeName}</span>
          <button className="chip-clear" onClick={clearSelection}>
            Change
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search mutual fund…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          {query && filtered.length > 0 && (
            <div className="search-results">
              {filtered.slice(0, 10).map(s => (
                <div
                  key={s.schemeCode}
                  className="search-item"
                  onClick={() => handleSelect(s)}
                >
                  {s.schemeName}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
