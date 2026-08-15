import { useCallback, useEffect, useState } from "react";
import api, { getApiError } from "./api/client.js";
import AuthPanel from "./components/AuthPanel.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Toast from "./components/Toast.jsx";

const storedOwner = () => {
  try {
    return JSON.parse(localStorage.getItem("gym_owner") || "null");
  } catch {
    return null;
  }
};

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("gym_token"));
  const [owner, setOwner] = useState(storedOwner);
  const [booting, setBooting] = useState(Boolean(token));
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      if (!token) {
        setBooting(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setOwner(data.owner);
        localStorage.setItem("gym_owner", JSON.stringify(data.owner));
      } catch (error) {
        localStorage.removeItem("gym_token");
        localStorage.removeItem("gym_owner");
        setToken(null);
        setOwner(null);
        notify(getApiError(error), "error");
      } finally {
        setBooting(false);
      }
    };

    loadSession();
  }, [token]);

  const handleAuth = ({ token: authToken, owner: authOwner }) => {
    localStorage.setItem("gym_token", authToken);
    localStorage.setItem("gym_owner", JSON.stringify(authOwner));
    setToken(authToken);
    setOwner(authOwner);
    notify(`Welcome to ${authOwner.gymName}`);
  };

  const logout = () => {
    localStorage.removeItem("gym_token");
    localStorage.removeItem("gym_owner");
    setToken(null);
    setOwner(null);
    notify("Signed out");
  };

  if (booting) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 text-slate-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-300 border-t-transparent" />
      </main>
    );
  }

  return (
    <>
      {token && owner ? (
        <Dashboard owner={owner} onLogout={logout} notify={notify} />
      ) : (
        <AuthPanel onAuth={handleAuth} notify={notify} />
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
