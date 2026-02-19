export default function NotificationPanel({ alerts }) {
  return (
    <section className="card p-5">
      <h3 className="text-lg font-semibold text-theme mb-4">Notifications</h3>
      {!alerts.length ? (
        <p className="text-sm text-theme-muted">No alerts available.</p>
      ) : (
        <ul className="space-y-2 max-h-80 overflow-auto">
          {alerts.map((alert) => (
            <li key={alert.id} className={`rounded-xl p-3 text-sm border ${alert.type === "warning" ? "bg-red-500/10 text-red-200 border-red-300/30" : "surface-chip text-theme"}`}>
              <p>{alert.message}</p>
              <p className="text-xs opacity-70 mt-1">{new Date(alert.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
