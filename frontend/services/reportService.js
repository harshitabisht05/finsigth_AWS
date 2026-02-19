import api from "./api";

async function downloadBlob(endpoint, filename) {
  const response = await api.get(endpoint, { responseType: "blob" });
  const blob = new Blob([response.data]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv() { return downloadBlob("/reports/csv", "finsight-report.csv"); }
export function downloadPdf() { return downloadBlob("/reports/pdf", "finsight-report.pdf"); }
