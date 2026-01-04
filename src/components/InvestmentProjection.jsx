export default function InvestmentProjection({
  cagr,
  years
}) {
  if (cagr == null || !years) return null;

  const principal = 100000;

  const oneYearValue = Math.round(
    principal * (1 + cagr)
  );

  const totalYearsValue = Math.round(
    principal * Math.pow(1 + cagr, years)
  );

  return (
    <div className="projection-card">
      <div className="projection-header">
        If you had invested ₹1,00,000
      </div>

      <div className="projection-values">
        <div className="projection-item">
          <span className="projection-label">
            After 1 year
          </span>
          <span className="projection-amount">
            ₹{oneYearValue.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="projection-item">
          <span className="projection-label">
            After {years} years
          </span>
          <span className="projection-amount highlight">
            ₹{totalYearsValue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="projection-note">
        Based on CAGR; actual returns may differ.
      </div>
    </div>
  );
}
