import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(form);
      login(data.token, data.user);
      navigate("/connect-aws");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="card glass neon-border w-full max-w-md p-7 space-y-4">
        <h1 className="text-2xl font-semibold text-theme">Create Account</h1>
        <input className="neon-input" type="text" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input className="neon-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <input className="neon-input" type="password" placeholder="Password" minLength={8} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button disabled={loading} className="neon-btn w-full">{loading ? "Creating..." : "Create Account"}</button>
        <p className="text-sm text-theme-muted">Already have an account? <Link className="text-link" to="/login">Login</Link></p>
        <p className="text-sm text-theme-muted">Learn more <Link className="text-link" to="/about">About Us</Link></p>
      </form>
    </main>
  );
}
