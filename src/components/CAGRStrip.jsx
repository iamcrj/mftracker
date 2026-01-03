export default function CAGRStrip({ value, years }) {
  if (value == null) return null;

  return (
    <div className="cagr-strip">
      <span>{years}Y CAGR</span>
      <strong className={value >= 0 ? "pos" : "neg"}>
        {(value * 100).toFixed(2)}%
      </strong>
    </div>
  );
}
