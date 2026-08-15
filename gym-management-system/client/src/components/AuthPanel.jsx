import { Activity, ArrowLeft, Dumbbell, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import api, { getApiError } from "../api/client.js";

const logoChoices = [
  {
    label: "Forge",
    value:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=240&q=80",
    accent: "from-teal-400 to-emerald-500",
  },
  {
    label: "Pulse",
    value:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=240&q=80",
    accent: "from-amber-300 to-orange-500",
  },
  {
    label: "Core",
    value:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=240&q=80",
    accent: "from-cyan-300 to-blue-500",
  },
];

const inputClass =
  "h-12 w-full rounded-lg border border-white/10 bg-white/10 px-4 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-teal-300";

export default function AuthPanel({ onAuth, notify }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="hidden lg:block">
          <div className="max-w-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400 text-slate-950 shadow-glow">
              <Dumbbell className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-semibold text-white">Gym Management System</h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-slate-300">
              Tenant-ready operations for owners who need members, renewals, plans, and billing pressure points in one focused workspace.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                ["Private owner workspaces", ShieldCheck],
                ["OTP password recovery", Mail],
                ["Renewals calculated from today", Activity],
              ].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/10 text-teal-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl rounded-xl border border-white/10 bg-slate-950/75 p-5 shadow-2xl backdrop-blur md:p-8">
          {mode === "login" && <LoginForm setMode={setMode} loading={loading} setLoading={setLoading} onAuth={onAuth} notify={notify} />}
          {mode === "register" && (
            <RegisterForm setMode={setMode} loading={loading} setLoading={setLoading} onAuth={onAuth} notify={notify} />
          )}
          {mode === "forgot" && <ForgotPassword setMode={setMode} loading={loading} setLoading={setLoading} notify={notify} />}
        </div>
      </section>
    </main>
  );
}

function LoginForm({ setMode, loading, setLoading, onAuth, notify }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);
      onAuth(data);
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <Header icon={LockKeyhole} title="Owner Login" />
      <label className="grid gap-2 text-sm text-slate-300">
        Username
        <input
          className={inputClass}
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
          placeholder="fitforge"
          autoComplete="username"
        />
      </label>
      <label className="grid gap-2 text-sm text-slate-300">
        Password
        <input
          className={inputClass}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="password123"
          type="password"
          autoComplete="current-password"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-lg bg-teal-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <button type="button" onClick={() => setMode("forgot")} className="text-slate-300 transition hover:text-teal-200">
          Forgot password
        </button>
        <button type="button" onClick={() => setMode("register")} className="font-medium text-teal-200 transition hover:text-teal-100">
          Register gym
        </button>
      </div>
    </form>
  );
}

function RegisterForm({ setMode, loading, setLoading, onAuth, notify }) {
  const [form, setForm] = useState({
    gymName: "",
    email: "",
    username: "",
    password: "",
    logoUrl: logoChoices[0].value,
  });

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);
      onAuth(data);
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <Header icon={Dumbbell} title="Register Gym" onBack={() => setMode("login")} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          Gym Name
          <input className={inputClass} value={form.gymName} onChange={(event) => setForm({ ...form, gymName: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Email
          <input
            className={inputClass}
            value={form.email}
            type="email"
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Username
          <input className={inputClass} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Password
          <input
            className={inputClass}
            value={form.password}
            type="password"
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>
      </div>

      <div className="grid gap-3">
        <span className="text-sm text-slate-300">Gym Logo</span>
        <div className="grid grid-cols-3 gap-3">
          {logoChoices.map((logo) => {
            const selected = form.logoUrl === logo.value;
            return (
              <button
                key={logo.label}
                type="button"
                onClick={() => setForm({ ...form, logoUrl: logo.value })}
                className={`relative h-24 overflow-hidden rounded-lg border transition ${
                  selected ? "border-teal-300 ring-2 ring-teal-300/40" : "border-white/10 hover:border-white/30"
                }`}
                title={logo.label}
              >
                <img src={logo.value} alt="" className="h-full w-full object-cover" />
                <span className={`absolute inset-x-2 bottom-2 rounded-md bg-gradient-to-r ${logo.accent} px-2 py-1 text-xs font-semibold text-slate-950`}>
                  {logo.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-lg bg-teal-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating workspace..." : "Create Workspace"}
      </button>
    </form>
  );
}

function ForgotPassword({ setMode, loading, setLoading, notify }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const requestOtp = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password/request-otp", { email });
      setStep(2);
      notify(data.previewOtp ? `OTP sent. Simulated OTP: ${data.previewOtp}` : data.message, "info");
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password/verify-otp", { email, otp });
      setStep(3);
      notify(data.message);
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password/reset", { email, password });
      notify(data.message);
      setMode("login");
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5">
      <Header icon={Mail} title="Reset Password" onBack={() => setMode("login")} />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((number) => (
          <span key={number} className={`h-1.5 rounded-full ${number <= step ? "bg-teal-300" : "bg-white/10"}`} />
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={requestOtp} className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            Registered Email
            <input className={inputClass} value={email} type="email" onChange={(event) => setEmail(event.target.value)} />
          </label>
          <button className="h-12 rounded-lg bg-teal-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-200" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp} className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            6-Digit OTP
            <input
              className={`${inputClass} text-center text-lg`}
              value={otp}
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
          <button className="h-12 rounded-lg bg-teal-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-200" disabled={loading}>
            {loading ? "Checking..." : "Verify OTP"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPassword} className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            New Password
            <input className={inputClass} value={password} type="password" onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="h-12 rounded-lg bg-teal-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-200" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

function Header({ icon: Icon, title, onBack }) {
  return (
    <div className="flex items-center gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/10 text-slate-300 transition hover:border-teal-300/60 hover:text-teal-200"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-300 text-slate-950">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm text-teal-200">Owner Workspace</p>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>
    </div>
  );
}
