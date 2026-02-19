const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validate");
const { connectAwsAccount, listAwsAccounts } = require("../controllers/awsAccountController");

const router = express.Router();
router.use(authMiddleware);

router.get("/accounts", listAwsAccounts);
router.post("/connect", [
  body("roleArn").trim().matches(/^arn:aws:iam::\d{12}:role\/[A-Za-z0-9+=,.@_\/-]+$/),
  body("externalId").trim().isLength({ min: 2, max: 255 }),
  validateRequest,
], connectAwsAccount);

module.exports = router;
