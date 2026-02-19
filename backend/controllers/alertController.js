const { Alert } = require("../models");

async function getAlerts(req, res, next) {
  try {
    const alerts = await Alert.findAll({ where: { user_id: req.user.id }, attributes: ["id", "message", "type", "created_at"], order: [["created_at", "DESC"]], limit: 50 });
    return res.json(alerts);
  } catch (e) { return next(e); }
}

module.exports = { getAlerts };
