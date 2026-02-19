const { AwsAccount } = require("../models");
const { generateCsv, generatePdf } = require("../services/reportService");

async function downloadCsvReport(req, res, next) {
  try {
    const accounts = await AwsAccount.findAll({ where: { user_id: req.user.id } });
    const csv = await generateCsv(accounts);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=\"finsight-report-${Date.now()}.csv\"`);
    return res.send(csv);
  } catch (e) { return next(e); }
}

async function downloadPdfReport(req, res, next) {
  try {
    const accounts = await AwsAccount.findAll({ where: { user_id: req.user.id } });
    const pdf = await generatePdf(accounts);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=\"finsight-report-${Date.now()}.pdf\"`);
    return res.send(pdf);
  } catch (e) { return next(e); }
}

module.exports = { downloadCsvReport, downloadPdfReport };
