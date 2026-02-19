const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { downloadCsvReport, downloadPdfReport } = require("../controllers/reportController");

const router = express.Router();
router.use(authMiddleware);
router.get("/csv", downloadCsvReport);
router.get("/pdf", downloadPdfReport);

module.exports = router;
