const PDFDocument = require("pdfkit");

function generatePdfBuffer({ summary, topServices, leaks }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("FinSight Cost Optimization Report", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text("Monthly Summary");
    doc.fontSize(11).text(`Current Month Cost: $${summary.currentMonthCost}`);
    doc.text(`Last Month Cost: $${summary.lastMonthCost}`);
    doc.text(`Forecast Cost: $${summary.forecastCost}`);
    doc.text(`Budget Utilization: ${summary.budgetUtilization}%`);
    doc.moveDown();

    doc.fontSize(14).text("Top Services");
    topServices.forEach((s, i) => doc.fontSize(11).text(`${i + 1}. ${s.service}: $${s.cost}`));
    doc.moveDown();

    doc.fontSize(14).text("Cost Leak Findings");
    leaks.forEach((f) => doc.fontSize(11).text(`- ${f.message}`));

    doc.end();
  });
}

module.exports = { generatePdfBuffer };
