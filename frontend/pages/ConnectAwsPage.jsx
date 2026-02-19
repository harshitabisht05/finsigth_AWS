import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { connectAwsAccount } from "../services/awsService";

export default function ConnectAwsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ roleArn: "", externalId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await connectAwsAccount(form);
      setSuccess("AWS account connected successfully.");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect AWS account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-4 lg:p-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-4 lg:gap-6">
        <Sidebar />
        <section className="space-y-4">
          <Navbar title="Connect AWS" />
          <form onSubmit={onSubmit} className="card p-6 max-w-2xl space-y-4">
            <p className="text-theme-muted text-sm">Enter IAM role details for read-only analysis access using STS AssumeRole.</p>
            <label className="block text-sm font-medium text-theme">Role ARN</label>
            <input className="neon-input" placeholder="arn:aws:iam::123456789012:role/FinSightReadOnlyRole" value={form.roleArn} onChange={(e) => setForm((p) => ({ ...p, roleArn: e.target.value }))} required />
            <label className="block text-sm font-medium text-theme">External ID</label>
            <input className="neon-input" placeholder="finsight-external-id" value={form.externalId} onChange={(e) => setForm((p) => ({ ...p, externalId: e.target.value }))} required />
            {error && <p className="text-sm text-danger">{error}</p>}
            {success && <p className="text-sm text-success">{success}</p>}
            <button disabled={loading} className="neon-btn">{loading ? "Validating..." : "Connect Account"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
