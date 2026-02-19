export default function CostCards({ summary }) {
  const cards = [
    { label: "Current Month", value: `$${summary.currentMonthCost}` },
    { label: "Last Month", value: `$${summary.lastMonthCost}` },
    { label: "Forecast", value: `$${summary.forecastCost}` },
    { label: "Budget Utilization", value: `${summary.budgetUtilization}%` },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <article key={card.label} className="card neon-border p-5">
          <p className="text-xs uppercase tracking-wider text-theme-muted">{card.label}</p>
          <p className="text-2xl font-semibold text-theme mt-2">{card.value}</p>
        </article>
      ))}
    </section>
  );
}
