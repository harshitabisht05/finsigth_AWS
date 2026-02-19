export default function LeakPanel({ leaks }) {
  return (
    <section className="card p-5">
      <h3 className="text-lg font-semibold text-theme mb-4">Cost Leak Detection</h3>
      {!leaks.length ? (
        <p className="text-sm text-theme-muted">No leak indicators detected.</p>
      ) : (
        <ul className="space-y-2">
          {leaks.map((leak, idx) => (
            <li key={`${leak.message}-${idx}`} className={`rounded-xl p-3 text-sm border ${leak.type === "warning" ? "bg-red-500/10 text-red-200 border-red-300/30" : "surface-chip text-theme"}`}>
              {leak.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
