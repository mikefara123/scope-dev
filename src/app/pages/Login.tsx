import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { requestPasswordReset } from "@/lib/auth";
import { users } from "@/data/mock";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { SocialButtons } from "@/app/components/auth/SocialButtons";
import { PasswordInput } from "@/app/components/auth/PasswordInput";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from "lucide-react";

type View = "login" | "forgot" | "forgot-sent";

const roleLabels: Record<UserRole, string> = {
  [UserRole.PLATFORM_ADMIN]: "Platform Admin",
  [UserRole.AGENCY_ADMIN]: "Agency Admin",
  [UserRole.GENERAL_USER]: "Designer",
  [UserRole.READ_ONLY_USER]: "Read Only",
};

const roleColors: Record<UserRole, string> = {
  [UserRole.PLATFORM_ADMIN]: "bg-red-500/10 text-red-400 border border-red-500/20",
  [UserRole.AGENCY_ADMIN]: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  [UserRole.GENERAL_USER]: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  [UserRole.READ_ONLY_USER]: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

export function Login() {
  const navigate = useNavigate();
  const { login, socialLogin, getRedirect } = useAuth();

  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await login(email, password, remember);
      if (res.success && res.user) {
        navigate(getRedirect());
      } else {
        setError(res.error || "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "apple") => {
    setError("");
    setIsLoading(true);
    try {
      const res = await socialLogin(provider);
      if (res.success) navigate(getRedirect());
      else setError(res.error || "Social login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await login(userEmail, "", true);
      if (res.success) navigate(getRedirect());
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestPasswordReset(resetEmail);
      setView("forgot-sent");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* ---- LOGIN VIEW ---- */}
      {view === "login" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <SocialButtons
            onGoogle={() => handleSocial("google")}
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-error/20 bg-error-light p-3 text-sm text-error-dark">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-[13px] font-medium text-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setResetEmail(email); setView("forgot"); }}
                  className="text-[13px] font-medium text-secondary hover:text-secondary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                label=""
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border text-secondary accent-secondary focus:ring-secondary/20"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-secondary hover:text-secondary/80 transition-colors">
              Create one
            </Link>
          </p>

          {/* Demo Quick Login */}
          <div className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Demo Accounts
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="space-y-1.5">
              {users.slice(0, 6).map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u.email)}
                  disabled={isLoading}
                  className="group flex w-full items-center justify-between rounded-xl border border-transparent bg-white/60 px-4 py-2.5 text-left transition-all hover:border-border hover:bg-white hover:shadow-xs disabled:opacity-60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[11px] font-semibold text-slate-600">
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground/70">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", roleColors[u.role])}>
                      {roleLabels[u.role]}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- FORGOT PASSWORD VIEW ---- */}
      {view === "forgot" && (
        <div className="animate-in fade-in slide-in-from-right-2 duration-400">
          <button
            onClick={() => setView("login")}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
                autoFocus
                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
            </button>
          </form>
        </div>
      )}

      {/* ---- FORGOT PASSWORD SENT VIEW ---- */}
      {view === "forgot-sent" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-light">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We've sent a password reset link to{" "}
            <span className="font-medium text-foreground">{resetEmail}</span>.
            <br />
            It may take a minute to arrive.
          </p>
          <button
            onClick={() => { setView("login"); setResetEmail(""); }}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]"
          >
            Back to sign in
          </button>

          {/* Demo shortcut */}
          <Link
            to="/reset-password?token=demo-reset-token"
            className="mt-3 flex h-10 w-full items-center justify-center rounded-xl border border-border text-xs font-medium text-muted-foreground transition-all hover:bg-white hover:shadow-xs"
          >
            Demo: Open reset link
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
