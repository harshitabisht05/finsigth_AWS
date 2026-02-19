const { DescribeBudgetCommand } = require("@aws-sdk/client-budgets");
const { getAwsClients } = require("./awsClientService");

async function checkBudgetForAccount(account) {
  const { budgets, accountId } = await getAwsClients(account);
  if (!accountId) return [];
  try {
    const r = await budgets.send(new DescribeBudgetCommand({
      AccountId: accountId,
      BudgetName: process.env.DEFAULT_BUDGET_NAME || "MonthlyBudget",
    }));

    const limit = Number(r.Budget?.BudgetLimit?.Amount || 0);
    const actual = Number(r.Budget?.CalculatedSpend?.ActualSpend?.Amount || 0);
    if (!limit) return [];

    const p = (actual / limit) * 100;
    if (p > 100) return [{ type: "warning", message: `Budget exceeded 100% (${p.toFixed(2)}%).` }];
    if (p > 80) return [{ type: "warning", message: `Budget crossed 80% (${p.toFixed(2)}%).` }];
    return [];
  } catch {
    return [];
  }
}

async function checkBudgetThresholds(accounts) {
  const all = await Promise.all(accounts.map((a) => checkBudgetForAccount(a)));
  return all.flat();
}

module.exports = { checkBudgetThresholds };
