import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { resetPassword } from "@/lib/auth";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { PasswordInput } from "@/app/components/auth/PasswordInput";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type View = "form" | "success" | "invalid";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [view, setView] = useState<View>(token ? "form" : "invalid");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setView("success");
      } else {
        setError(res.error || "Failed to reset password. The link may have expired.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = password.length >= 8 && password === confirmPassword;

  return (
    <AuthLayout
      brandHeadline={
        <h1 className="text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-white">
          Secure your
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            account.
          </span>
        </h1>
      }
      brandSubtitle="Choose a strong password to keep your projects and budgets safe."
      brandPills={[]}
      brandTestimonial={undefined}
    >
      {/* ---- RESET FORM ---- */}
      {view === "form" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Create new password
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your new password must be at least 8 characters long.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-error/20 bg-error-light p-3 text-sm text-error-dark">
                {error}
              </div>
            )}

            <PasswordInput
              id="new-password"
              value={password}
              onChange={setPassword}
              label="New password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              showStrength
            />

            <div>
              <label
                htmlFor="confirm-new-password"
                className="mb-1.5 block text-[13px] font-medium text-foreground"
              >
                Confirm new password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-error">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Reset password"
              )}
            </button>
          </form>
        </div>
      )}

      {/* ---- SUCCESS ---- */}
      {view === "success" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-light">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Password updated
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your password has been reset successfully.
            <br />
            You can now sign in with your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]"
          >
            Go to Sign In
          </button>
        </div>
      )}

      {/* ---- INVALID TOKEN ---- */}
      {view === "invalid" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-error-light">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Invalid reset link
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This password reset link is invalid or has expired.
            <br />
            Please request a new one.
          </p>
          <Link
            to="/login"
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]"
          >
            Back to Sign In
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
