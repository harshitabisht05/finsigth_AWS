import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import AboutPage from "../pages/AboutPage";
import ConnectAwsPage from "../pages/ConnectAwsPage";
import DashboardPage from "../pages/DashboardPage";
import ReportsPage from "../pages/ReportsPage";
import SplashScreen from "../components/SplashScreen";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

const INSTALL_PROMPT_KEY = "finsight_install_prompt_seen_v1";

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setInstallPromptEvent(e);

      const hasSeenPrompt = localStorage.getItem(INSTALL_PROMPT_KEY) === "true";
      if (!hasSeenPrompt && !isInstalled()) {
        setShowInstallModal(true);
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function handleInstallNow() {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    localStorage.setItem(INSTALL_PROMPT_KEY, "true");
    setShowInstallModal(false);
    setInstallPromptEvent(null);
  }

  function handleInstallLater() {
    localStorage.setItem(INSTALL_PROMPT_KEY, "true");
    setShowInstallModal(false);
  }

  if (showSplash) return <SplashScreen />;

  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/connect-aws" element={<ProtectedRoute><ConnectAwsPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {showInstallModal && installPromptEvent && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/50 px-4">
          <div className="card glass w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-theme">Install FinSight</h2>
            <p className="mt-2 text-sm text-theme-muted">
              Install the app for faster access and a better full-screen experience.
            </p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={handleInstallNow} className="neon-btn">Install</button>
              <button type="button" onClick={handleInstallLater} className="ghost-btn">Not now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
