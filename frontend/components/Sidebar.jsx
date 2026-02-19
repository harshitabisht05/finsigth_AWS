import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/connect-aws", label: "Connect AWS" },
  { to: "/reports", label: "Reports" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="card glass w-full lg:w-64 p-5">
      <h1 className="text-2xl font-semibold mb-7 text-theme tracking-wide">FinSight</h1>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.to;
          return (
            <Link key={link.to} to={link.to} className={`block rounded-xl px-4 py-2.5 transition ${active ? "neon-border surface-chip text-theme" : "text-theme-muted hover:surface-chip hover:text-theme"}`}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
