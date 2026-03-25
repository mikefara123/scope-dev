import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import type { SubscriptionTier } from "@/types";
import { cn } from "@/lib/utils";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { SocialButtons } from "@/app/components/auth/SocialButtons";
import { PasswordInput } from "@/app/components/auth/PasswordInput";
import { StepIndicator } from "@/app/components/auth/StepIndicator";
import { PlanCard } from "@/app/components/auth/PlanCard";
import {
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  User,
  Building2,
} from "lucide-react";

const STEPS = ["Account", "Agency", "Plan", "Welcome"];

const TEAM_SIZES = ["Just me", "2–5", "6–10", "11+"];

const PLANS: {
  tier: SubscriptionTier;
  name: string;
  price: string;
  licenses: string;
  highlight?: string;
  isPopular?: boolean;
}[] = [
  {
    tier: "starter",
    name: "Starter",
    price: "Free",
    licenses: "Up to 3 users",
    highlight: "14-day trial",
  },
  {
    tier: "professional",
    name: "Professional",
    price: "$49",
    licenses: "Up to 10 users",
    highlight: "Best value",
    isPopular: true,
  },
  {
    tier: "enterprise",
    name: "Enterprise",
    price: "Custom",
    licenses: "Unlimited users",
    highlight: "Contact sales",
  },
];

const PLAN_FEATURES = [
  { label: "Projects & budgets", starter: true, professional: true, enterprise: true },
  { label: "Item library", starter: true, professional: true, enterprise: true },
  { label: "Client approval portal", starter: true, professional: true, enterprise: true },
  { label: "Reports & analytics", starter: false, professional: true, enterprise: true },
  { label: "Templates & audit log", starter: false, professional: true, enterprise: true },
  { label: "Custom branding", starter: false, professional: false, enterprise: true },
  { label: "API access", starter: false, professional: false, enterprise: true },
];

interface FormData {
  name: string;
  email: string;
  password: string;
  agencyName: string;
  agencyType: "individual" | "company";
  teamSize: string;
  subscriptionTier: SubscriptionTier;
}

export function Signup() {
  const navigate = useNavigate();
  const { signup, socialSignup, getRedirect } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    agencyName: "",
    agencyType: "company",
    teamSize: "2–5",
    subscriptionTier: "professional",
  });

  const update = (fields: Partial<FormData>) => setForm((f) => ({ ...f, ...fields }));

  const handleSocialSignup = async (provider: "google" | "apple") => {
    setError("");
    setIsLoading(true);
    try {
      const res = await socialSignup(provider);
      if (res.success && res.user) {
        update({ name: res.user.name, email: res.user.email });
        setStep(2);
      } else {
        setError(res.error || "Social signup failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSignup = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        agency_name: form.agencyName,
        agency_type: form.agencyType,
        team_size: form.teamSize,
        subscription_tier: form.subscriptionTier,
      });
      if (res.success) {
        setStep(4);
      } else {
        setError(res.error || "Signup failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => navigate(getRedirect());

  const canAdvanceStep1 = form.name.trim() && form.email.trim() && form.password.length >= 8;
  const canAdvanceStep2 = form.agencyName.trim();

  return (
    <AuthLayout
      brandHeadline={
        <h1 className="text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-white">
          Start managing
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            budgets like a pro.
          </span>
        </h1>
      }
      brandSubtitle="Join thousands of interior designers who trust Scope to streamline their budget workflow."
      brandPills={["Free 14-day trial", "No credit card required", "Setup in minutes"]}
    >
      {/* Step indicator (steps 1-3 only) */}
      {step < 4 && (
        <div className="mb-8">
          <StepIndicator steps={STEPS.slice(0, 3)} currentStep={step} />
        </div>
      )}

      {/* ====== STEP 1: Account ====== */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started with Scope in under a minute
            </p>
          </div>

          <SocialButtons
            onGoogle={() => handleSocialSignup("google")}
            disabled={isLoading}
            label="up"
          />

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-error/20 bg-error-light p-3 text-sm text-error-dark">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Jane Smith"
                autoComplete="name"
                required
                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Work email
              </label>
              <input
                id="signup-email"
                type="email"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="you@company.com"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            <PasswordInput
              id="signup-password"
              value={form.password}
              onChange={(v) => update({ password: v })}
              label="Password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              showStrength
            />

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canAdvanceStep1 || isLoading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
            >
              Continue
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-secondary hover:text-secondary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      )}

      {/* ====== STEP 2: Agency ====== */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-2 duration-400">
          <button
            onClick={() => setStep(1)}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Tell us about your agency
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll customize your experience based on your setup
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="agency-name" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Agency / studio name
              </label>
              <input
                id="agency-name"
                type="text"
                value={form.agencyName}
                onChange={(e) => update({ agencyName: e.target.value })}
                placeholder="Luxe Interiors Design Studio"
                autoFocus
                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            {/* Agency type */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-foreground">
                How do you work?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["individual", "company"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => update({ agencyType: type })}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                      form.agencyType === type
                        ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20"
                        : "border-border bg-white hover:border-border-strong"
                    )}
                  >
                    {type === "individual" ? (
                      <User className={cn("h-5 w-5", form.agencyType === type ? "text-secondary" : "text-muted-foreground")} />
                    ) : (
                      <Building2 className={cn("h-5 w-5", form.agencyType === type ? "text-secondary" : "text-muted-foreground")} />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {type === "individual" ? "Solo Designer" : "Design Firm"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Team size */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-foreground">
                Team size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TEAM_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => update({ teamSize: size })}
                    className={cn(
                      "rounded-xl border-2 py-2.5 text-sm font-medium transition-all",
                      form.teamSize === size
                        ? "border-secondary bg-secondary/5 text-secondary ring-2 ring-secondary/20"
                        : "border-border bg-white text-muted-foreground hover:border-border-strong"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!canAdvanceStep2}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ====== STEP 3: Plan ====== */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-2 duration-400">
          <button
            onClick={() => setStep(2)}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Choose your plan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start free for 14 days. Upgrade or cancel anytime.
            </p>
          </div>

          {error && (
            <div className="mb-4 animate-in fade-in slide-in-from-top-1 rounded-xl border border-error/20 bg-error-light p-3 text-sm text-error-dark">
              {error}
            </div>
          )}

          {/* Plan cards — horizontal */}
          <div className="flex gap-3">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.tier}
                tier={plan.tier}
                name={plan.name}
                price={plan.price}
                licenses={plan.licenses}
                highlight={plan.highlight}
                isSelected={form.subscriptionTier === plan.tier}
                isPopular={plan.isPopular}
                onSelect={() => update({ subscriptionTier: plan.tier })}
              />
            ))}
          </div>

          {/* Feature comparison */}
          <div className="mt-5 rounded-xl border border-border bg-white p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              What's included
            </p>
            <div className="space-y-2">
              {PLAN_FEATURES.map((f) => {
                const included =
                  form.subscriptionTier === "enterprise"
                    ? f.enterprise
                    : form.subscriptionTier === "professional"
                    ? f.professional
                    : f.starter;
                return (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                        included ? "bg-secondary/10" : "bg-muted"
                      )}
                    >
                      {included ? (
                        <Check className="h-2.5 w-2.5 text-secondary" />
                      ) : (
                        <span className="block h-0.5 w-2 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        included ? "text-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      {f.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmitSignup}
            disabled={isLoading}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Start free trial"
            )}
          </button>

          <p className="mt-3 text-center text-xs text-muted-foreground/70">
            No credit card required. Cancel anytime.
          </p>
        </div>
      )}

      {/* ====== STEP 4: Welcome ====== */}
      {step === 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-400">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome to Scope!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your agency <span className="font-medium text-foreground">{form.agencyName}</span> is
            all set up. Let's start building your first project.
          </p>
          <button
            onClick={goToDashboard}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
