const cron = require("node-cron");
const { User, AwsAccount } = require("../models");
const { detectCostLeaks } = require("./leakDetectionService");
const { checkBudgetThresholds } = require("./budgetService");
const { createAlertsFromFindings } = require("./alertService");

async function runDailyScan() {
  const users = await User.findAll({ include: [{ model: AwsAccount }] });

  for (const user of users) {
    const accounts = user.aws_accounts || [];
    if (!accounts.length) continue;

    try {
      const leak = await detectCostLeaks(accounts);
      const budget = await checkBudgetThresholds(accounts);
      await createAlertsFromFindings(user.id, [...budget, ...leak]);
    } catch (e) {
      console.error(`Scheduled scan failed for user ${user.id}:`, e.message);
    }
  }
}

function initScheduler() {
  cron.schedule("0 2 * * *", () => {
    runDailyScan().catch((e) => console.error("Daily scheduler failed:", e.message));
  });
}

module.exports = { initScheduler, runDailyScan };
