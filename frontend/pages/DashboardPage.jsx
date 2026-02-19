import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CostCards from "../components/CostCards";
import TrendChart from "../components/TrendChart";
import TopServicesList from "../components/TopServicesList";
import LeakPanel from "../components/LeakPanel";
import NotificationPanel from "../components/NotificationPanel";
import { fetchAlerts, fetchDashboardData } from "../services/dashboardService";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({ summary: { currentMonthCost: 0, lastMonthCost: 0, forecastCost: 0, budgetUtilization: 0 }, monthlyTrend: [], topServices: [], leaks: [] });
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [d, a] = await Promise.all([fetchDashboardData(), fetchAlerts()]);
        setDashboard(d);
        setAlerts(a);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      }
    }
    load();
  }, []);

  return (
    <main className="p-4 lg:p-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-4 lg:gap-6">
        <Sidebar />
        <section className="space-y-4">
          <Navbar title="Dashboard" />
          {error && <p className="text-sm text-danger">{error}</p>}
          <CostCards summary={dashboard.summary} />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2"><TrendChart data={dashboard.monthlyTrend} /></div>
            <TopServicesList data={dashboard.topServices} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <LeakPanel leaks={dashboard.leaks} />
            <NotificationPanel alerts={alerts} />
          </div>
        </section>
      </div>
    </main>
  );
}
