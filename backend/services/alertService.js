const { Alert } = require("../models");

async function createAlertIfNotExists(userId, message, type) {
  const ex = await Alert.findOne({ where: { user_id: userId, message, type }, order: [["created_at", "DESC"]] });
  if (ex) {
    const age = (Date.now() - new Date(ex.created_at).getTime()) / (1000 * 60 * 60);
    if (age < 24) return ex;
  }
  return Alert.create({ user_id: userId, message, type });
}

async function createAlertsFromFindings(userId, findings) {
  return Promise.all(findings.map((f) => createAlertIfNotExists(userId, f.message, f.type)));
}

module.exports = { createAlertsFromFindings };
