const { createObjectCsvStringifier } = require("csv-writer");

function generateCsvReport(rows) {
  const csvWriter = createObjectCsvStringifier({
    header: [
      { id: "section", title: "SECTION" },
      { id: "item", title: "ITEM" },
      { id: "value", title: "VALUE" },
    ],
  });
  return `${csvWriter.getHeaderString()}${csvWriter.stringifyRecords(rows)}`;
}

module.exports = { generateCsvReport };
