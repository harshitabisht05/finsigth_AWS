import api from "./api";
export async function fetchDashboardData() { const { data } = await api.get("/dashboard"); return data; }
export async function fetchAlerts() { const { data } = await api.get("/alerts"); return data; }
