import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TrendChart({ data }) {
  return (
    <section className="card p-5 h-80">
      <h3 className="text-lg font-semibold text-theme mb-4">Monthly Cost Trend</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(90,140,210,0.25)" />
          <XAxis dataKey="month" stroke="rgba(95,123,160,0.85)" tick={{ fill: "rgba(95,123,160,0.95)", fontSize: 12 }} />
          <YAxis stroke="rgba(95,123,160,0.85)" tick={{ fill: "rgba(95,123,160,0.95)", fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "rgba(14, 30, 54, 0.96)", border: "1px solid rgba(96, 160, 255, 0.42)", color: "#e8f2ff", borderRadius: "12px" }} />
          <Line type="monotone" dataKey="cost" stroke="#4ca1ff" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
