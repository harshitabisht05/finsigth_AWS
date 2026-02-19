const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAlerts } = require("../controllers/alertController");

const router = express.Router();
router.use(authMiddleware);
router.get("/", getAlerts);

module.exports = router;
