import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme} className="ghost-btn fixed right-4 top-4 z-50 text-xs md:text-sm" aria-label="Toggle theme">
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
