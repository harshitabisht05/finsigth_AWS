const { AwsAccount } = require("../models");
const { getUserCostInsights } = require("../services/costService");
const { detectCostLeaks } = require("../services/leakDetectionService");
const { checkBudgetThresholds } = require("../services/budgetService");
const { createAlertsFromFindings } = require("../services/alertService");

async function getDashboard(req, res, next) {
  try {
    const accounts = await AwsAccount.findAll({ where: { user_id: req.user.id } });
    const insights = await getUserCostInsights(accounts);
    const leaks = await detectCostLeaks(accounts);
    const budgetFindings = await checkBudgetThresholds(accounts);

    await createAlertsFromFindings(req.user.id, [...budgetFindings, ...leaks]);

    return res.json({
      summary: insights.summary,
      monthlyTrend: insights.monthlyTrend,
      topServices: insights.topServices,
      leaks,
    });
  } catch (e) { return next(e); }
}

module.exports = { getDashboard };
