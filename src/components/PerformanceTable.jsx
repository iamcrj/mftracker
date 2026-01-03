export default function PerformanceTable({ rows = [] }) {
  if (!rows.length) return null;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.year}>
              <td>{r.year}</td>
              <td className={r.value >= 0 ? "pos" : "neg"}>
                {(r.value * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
