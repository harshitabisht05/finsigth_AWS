export default function TopServicesList({ data }) {
  return (
    <section className="card p-5">
      <h3 className="text-lg font-semibold text-theme mb-4">Top 5 Services by Cost</h3>
      <ul className="space-y-3">
        {data.map((service, index) => (
          <li key={service.service} className="flex items-center justify-between text-sm rounded-xl surface-chip p-3">
            <span className="text-theme">{index + 1}. {service.service}</span>
            <span className="font-semibold text-theme">${service.cost}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
