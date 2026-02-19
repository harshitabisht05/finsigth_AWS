import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="card glass p-4 md:p-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-theme">{title}</h2>
        <p className="text-sm text-theme-muted">Welcome, {user?.name || "User"}</p>
      </div>
      <button type="button" onClick={() => { logout(); navigate("/login"); }} className="ghost-btn text-sm">Logout</button>
    </header>
  );
}
