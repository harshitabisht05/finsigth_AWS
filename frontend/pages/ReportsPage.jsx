import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { downloadCsv, downloadPdf } from "../services/reportService";

export default function ReportsPage() {
  const [status, setStatus] = useState("");

  async function runDownload(fn, label) {
    try {
      setStatus(`Generating ${label}...`);
      await fn();
      setStatus(`${label} downloaded.`);
    } catch (err) {
      setStatus(err.response?.data?.message || `Failed to download ${label}`);
    }
  }

  return (
    <main className="p-4 lg:p-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-4 lg:gap-6">
        <Sidebar />
        <section className="space-y-4">
          <Navbar title="Reports" />
          <div className="card p-6 space-y-4 max-w-2xl">
            <h3 className="text-lg font-semibold text-theme">Download Cost Reports</h3>
            <p className="text-sm text-theme-muted">Export monthly cost summary, top services, leak findings, and optimization recommendations.</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => runDownload(downloadCsv, "CSV report")} className="neon-btn">Download CSV</button>
              <button type="button" onClick={() => runDownload(downloadPdf, "PDF report")} className="ghost-btn">Download PDF</button>
            </div>
            {status && <p className="text-sm text-theme">{status}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
