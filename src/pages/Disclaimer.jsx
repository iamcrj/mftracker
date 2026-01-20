export default function Disclaimer() {
  return (
    <div className="legal-page">
      <h1>Disclaimer</h1>

      <p>
        FundLens is an informational platform designed to help users
        analyze mutual fund performance, trends, and public market data.
        We do not provide investment advice or recommendations.
      </p>

      <h2>No Investment Advice</h2>
      <p>
        All information available on this platform is for educational
        and informational purposes only. Past performance is not
        indicative of future returns.
      </p>

      <h2>Data Sources</h2>
      <p>
        Data is sourced from publicly available providers including AMFI,
        NSE, and other official disclosures. While we strive for accuracy,
        we do not guarantee completeness or correctness.
      </p>

      <h2>User Responsibility</h2>
      <p>
        Users are solely responsible for any investment decisions made
        based on information provided on FundLens. Please consult a
        registered financial advisor before investing.
      </p>

      <p className="legal-muted">
        FundLens shall not be liable for any loss or damage arising from
        reliance on this information.
      </p>
    </div>
  );
}
