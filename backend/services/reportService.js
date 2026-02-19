const { getUserCostInsights } = require("./costService");
const { detectCostLeaks } = require("./leakDetectionService");
const { generateCsvReport } = require("../utils/csvReport");
const { generatePdfBuffer } = require("../utils/pdfReport");

async function buildReportData(accounts) {
  const insights = await getUserCostInsights(accounts);
  const leaks = await detectCostLeaks(accounts);
  return { summary: insights.summary, monthlyTrend: insights.monthlyTrend, topServices: insights.topServices, leaks };
}

async function generateCsv(accounts) {
  const data = await buildReportData(accounts);
  const rows = [
    { section: "Summary", item: "Current Month Cost", value: data.summary.currentMonthCost },
    { section: "Summary", item: "Last Month Cost", value: data.summary.lastMonthCost },
    { section: "Summary", item: "Forecast Cost", value: data.summary.forecastCost },
    { section: "Summary", item: "Budget Utilization %", value: data.summary.budgetUtilization },
  ];

  data.topServices.forEach((s) => rows.push({ section: "Top Services", item: s.service, value: s.cost }));
  data.leaks.forEach((l) => rows.push({ section: "Cost Leak", item: l.type, value: l.message }));

  return generateCsvReport(rows);
}

async function generatePdf(accounts) {
  const data = await buildReportData(accounts);
  return generatePdfBuffer(data);
}

module.exports = { buildReportData, generateCsv, generatePdf };
