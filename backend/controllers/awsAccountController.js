const { AwsAccount } = require("../models");
const ApiError = require("../utils/apiError");
const { validateAssumeRole } = require("../services/awsClientService");

async function connectAwsAccount(req, res, next) {
  try {
    const { roleArn, externalId } = req.body;
    await validateAssumeRole(roleArn, externalId);

    const account = await AwsAccount.create({ user_id: req.user.id, role_arn: roleArn, external_id: externalId });
    return res.status(201).json({ id: account.id, roleArn: account.role_arn, createdAt: account.created_at });
  } catch (e) {
    return next(new ApiError(400, e.message || "Unable to assume provided role"));
  }
}

async function listAwsAccounts(req, res, next) {
  try {
    const rows = await AwsAccount.findAll({ where: { user_id: req.user.id }, attributes: ["id", "role_arn", "created_at"], order: [["created_at", "DESC"]] });
    return res.json(rows);
  } catch (e) { return next(e); }
}

module.exports = { connectAwsAccount, listAwsAccounts };
