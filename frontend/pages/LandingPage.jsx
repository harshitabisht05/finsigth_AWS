import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  useEffect(() => {
    const h = (e) => { e.preventDefault(); setInstallPromptEvent(e); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  async function handleInstallClick() {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    setInstallPromptEvent(null);
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="card glass p-8 md:p-12 relative overflow-hidden">
          <h1 className="text-3xl md:text-5xl font-bold text-theme">FinSight</h1>
          <p className="mt-4 text-theme-muted">Cloud cost optimization and governance for AWS.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/signup" className="neon-btn">Start Free</Link>
            <Link to="/login" className="ghost-btn">Login</Link>
            {installPromptEvent && <button type="button" onClick={handleInstallClick} className="ghost-btn">Download App</button>}
          </div>
        </div>
      </section>
    </main>
  );
}
