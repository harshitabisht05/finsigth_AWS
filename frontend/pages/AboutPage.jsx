import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="card p-8 md:p-10">
          <p className="text-xs uppercase tracking-wider text-theme-muted">About FinSight</p>
          <h1 className="text-3xl md:text-5xl font-bold text-theme mt-3">Cloud Cost Optimization and Governance</h1>
          <p className="mt-5 text-theme-muted max-w-3xl">FinSight helps teams understand AWS spend, detect cost leaks, monitor budgets, and generate reports for governance. It uses IAM AssumeRole with read-only access and never deletes cloud resources.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/login" className="neon-btn">Go to Login</Link>
            <Link to="/signup" className="ghost-btn">Create Account</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
