const { GetCostAndUsageCommand, GetCostForecastCommand } = require("@aws-sdk/client-cost-explorer");
const { DescribeBudgetCommand } = require("@aws-sdk/client-budgets");
const { getAwsClients } = require("./awsClientService");

function iso(d) { return d.toISOString().slice(0, 10); }
function todayIso() {
  const n = new Date();
  return iso(new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate())));
}
function monthRange(offset = 0) {
  const n = new Date();
  const s = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + offset, 1));
  const e = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + offset + 1, 1));
  return { start: iso(s), end: iso(e) };
}

async function getCost(ce, start, end, grouped) {
  const cmd = new GetCostAndUsageCommand({
    TimePeriod: { Start: start, End: end },
    Granularity: "MONTHLY",
    Metrics: ["UnblendedCost"],
    ...(grouped ? { GroupBy: [{ Type: "DIMENSION", Key: "SERVICE" }] } : {}),
  });
  const r = await ce.send(cmd);
  return r.ResultsByTime || [];
}

async function summaryFor(account) {
  const { ce, budgets, accountId } = await getAwsClients(account);
  const current = monthRange(0);
  const last = monthRange(-1);

  const [currentUsage, lastUsage, forecast] = await Promise.all([
    getCost(ce, current.start, current.end, false),
    getCost(ce, last.start, last.end, false),
    ce.send(new GetCostForecastCommand({
      TimePeriod: { Start: todayIso(), End: current.end },
      Metric: "UNBLENDED_COST",
      Granularity: "MONTHLY",
    })),
  ]);

  let budgetLimit = 0;
  let budgetActual = 0;
  if (accountId) {
    try {
      const b = await budgets.send(new DescribeBudgetCommand({
        AccountId: accountId,
        BudgetName: process.env.DEFAULT_BUDGET_NAME || "MonthlyBudget",
      }));
      budgetLimit = Number(b.Budget?.BudgetLimit?.Amount || 0);
      budgetActual = Number(b.Budget?.CalculatedSpend?.ActualSpend?.Amount || 0);
    } catch {}
  }

  const currentMonthCost = Number(currentUsage[0]?.Total?.UnblendedCost?.Amount || 0);
  const lastMonthCost = Number(lastUsage[0]?.Total?.UnblendedCost?.Amount || 0);
  const forecastCost = Number(forecast.Total?.Amount || 0);
  const budgetUtilization = budgetLimit > 0 ? (budgetActual / budgetLimit) * 100 : 0;

  return { currentMonthCost, lastMonthCost, forecastCost, budgetUtilization };
}

async function trendsFor(account) {
  const { ce } = await getAwsClients(account);
  const n = new Date();
  const start = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() - 5, 1));
  const end = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + 1, 1));

  const [monthly, byService] = await Promise.all([
    getCost(ce, iso(start), iso(end), false),
    getCost(ce, iso(start), iso(end), true),
  ]);

  const monthlyTrend = monthly.map((i) => ({ month: i.TimePeriod?.Start, cost: Number(i.Total?.UnblendedCost?.Amount || 0) }));

  const totals = {};
  byService.forEach((period) => {
    (period.Groups || []).forEach((g) => {
      const s = g.Keys?.[0] || "Other";
      const a = Number(g.Metrics?.UnblendedCost?.Amount || 0);
      totals[s] = (totals[s] || 0) + a;
    });
  });

  const topServices = Object.entries(totals)
    .map(([service, cost]) => ({ service, cost: Number(cost.toFixed(2)) }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  return { monthlyTrend, topServices };
}

function mergeSummary(summaries) {
  const t = summaries.reduce((a, s) => {
    a.currentMonthCost += s.currentMonthCost;
    a.lastMonthCost += s.lastMonthCost;
    a.forecastCost += s.forecastCost;
    a.budgetUtilization += s.budgetUtilization;
    return a;
  }, { currentMonthCost: 0, lastMonthCost: 0, forecastCost: 0, budgetUtilization: 0 });

  return {
    currentMonthCost: Number(t.currentMonthCost.toFixed(2)),
    lastMonthCost: Number(t.lastMonthCost.toFixed(2)),
    forecastCost: Number(t.forecastCost.toFixed(2)),
    budgetUtilization: Number((summaries.length ? t.budgetUtilization / summaries.length : 0).toFixed(2)),
  };
}

function mergeTrends(list) {
  const m = new Map();
  const s = new Map();

  list.forEach(({ monthlyTrend, topServices }) => {
    monthlyTrend.forEach((p) => m.set(p.month, (m.get(p.month) || 0) + p.cost));
    topServices.forEach((t) => s.set(t.service, (s.get(t.service) || 0) + t.cost));
  });

  return {
    monthlyTrend: Array.from(m.entries()).map(([month, cost]) => ({ month, cost: Number(cost.toFixed(2)) })).sort((a, b) => new Date(a.month) - new Date(b.month)),
    topServices: Array.from(s.entries()).map(([service, cost]) => ({ service, cost: Number(cost.toFixed(2)) })).sort((a, b) => b.cost - a.cost).slice(0, 5),
  };
}

async function getUserCostInsights(accounts) {
  if (!accounts.length) return { summary: { currentMonthCost: 0, lastMonthCost: 0, forecastCost: 0, budgetUtilization: 0 }, monthlyTrend: [], topServices: [] };
  const summaries = await Promise.all(accounts.map(summaryFor));
  const trends = await Promise.all(accounts.map(trendsFor));
  const merged = mergeTrends(trends);
  return { summary: mergeSummary(summaries), monthlyTrend: merged.monthlyTrend, topServices: merged.topServices };
}

module.exports = { getUserCostInsights };
