const express = require("express");
const authRoutes = require("./authRoutes");
const awsRoutes = require("./awsRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const reportRoutes = require("./reportRoutes");
const alertRoutes = require("./alertRoutes");

const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/auth", authRoutes);
router.use("/aws", awsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);
router.use("/alerts", alertRoutes);

module.exports = router;
