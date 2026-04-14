import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { validateInviteToken } from "@/lib/auth";
import { PasswordInput } from "@/app/components/auth/PasswordInput";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { Loader2, AlertCircle, Users } from "lucide-react";

interface InviteInfo {
  email: string;
  agency_name: string;
  agency_logo_url?: string;
  role: string;
}

export function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { acceptInvite, getRedirect } = useAuth();
  const token = searchParams.get("token") ?? "";

  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [validating, setValidating] = useState(true);
  const [validationError, setValidationError] = useState("");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setValidationError("No invitation token provided.");
      setValidating(false);
      return;
    }

    validateInviteToken(token).then((res) => {
      if (res.success && res.invitation) {
        setInvite(res.invitation);
      } else {
        setValidationError(res.error || "Invalid invitation.");
      }
      setValidating(false);
    });
  }, [token]);

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
      const res = await acceptInvite({ token, name, password });
      if (res.success) {
        navigate(getRedirect());
      } else {
        setError(res.error || "Failed to accept invitation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = name.trim() && password.length >= 8 && password === confirmPassword;

  return (
    <AuthLayout
      brandHeadline={
        invite ? (
          <h1 className="text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-white">
            You're invited to
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              {invite.agency_name}
            </span>
          </h1>
        ) : undefined
      }
      brandSubtitle={
        invite
          ? "Accept your invitation to start collaborating with your team on Scope."
          : undefined
      }
      brandPills={invite ? ["Collaborate", "Design", "Deliver"] : undefined}
    >
      {/* Loading state */}
      {validating && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          <p className="mt-4 text-sm text-muted-foreground">Validating invitation...</p>
        </div>
      )}

      {/* Error state */}
      {!validating && validationError && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-error-light">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Invalid invitation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {validationError}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please contact your agency admin for a new invitation link.
          </p>
          <Link
            to="/login"
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]"
          >
            Go to Sign In
          </Link>
        </div>
      )}

      {/* Accept form */}
      {!validating && invite && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Agency badge */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{invite.agency_name}</p>
              <p className="text-xs text-muted-foreground">
                You'll join as a {invite.role === "general_user" ? "Designer" : invite.role === "agency_admin" ? "Admin" : "Viewer"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Set up your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete your profile to join the team
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-error/20 bg-error-light p-3 text-sm text-error-dark">
                {error}
              </div>
            )}

            {/* Email (read-only) */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                Email address
              </label>
              <input
                type="email"
                value={invite.email}
                readOnly
                className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-sm text-muted-foreground shadow-xs outline-none cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="invite-name" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Full name
              </label>
              <input
                id="invite-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                required
                autoFocus
                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            {/* Password */}
            <PasswordInput
              id="invite-password"
              value={password}
              onChange={setPassword}
              label="Password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              showStrength
            />

            {/* Confirm password */}
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Confirm password
              </label>
              <input
                id="confirm-password"
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
                `Join ${invite.agency_name}`
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-secondary hover:text-secondary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
