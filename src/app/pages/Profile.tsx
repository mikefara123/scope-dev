import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, changeUserPassword } from "@/lib/api";
import { PasswordInput } from "@/app/components/auth/PasswordInput";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, Save, Shield, Building2, Calendar, Mail, Phone, User as UserIcon } from "lucide-react";

const roleLabels: Record<UserRole, string> = {
  [UserRole.PLATFORM_ADMIN]: "Platform Admin",
  [UserRole.AGENCY_ADMIN]: "Agency Admin",
  [UserRole.GENERAL_USER]: "Designer",
  [UserRole.READ_ONLY_USER]: "Read Only",
};

const roleBadgeColors: Record<UserRole, string> = {
  [UserRole.PLATFORM_ADMIN]: "bg-red-500/10 text-red-600 border border-red-500/20",
  [UserRole.AGENCY_ADMIN]: "bg-violet-500/10 text-violet-600 border border-violet-500/20",
  [UserRole.GENERAL_USER]: "bg-teal-500/10 text-teal-600 border border-teal-500/20",
  [UserRole.READ_ONLY_USER]: "bg-slate-500/10 text-slate-600 border border-slate-500/20",
};

export function Profile() {
  const { user, agency } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const res = await updateUserProfile(user.id, { name, email, phone });
    setIsSaving(false);
    if (res.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(res.error || "Failed to save profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    const res = await changeUserPassword(user.id, currentPassword, newPassword);
    setIsChangingPassword(false);
    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    } else {
      toast.error(res.error || "Failed to change password");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1>Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account information
        </p>
      </div>

      {/* Avatar + Role */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-2xl font-bold text-primary-foreground">
            {initials}
          </div>
          <div>
            <h2 className="text-lg">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", roleBadgeColors[user.role])}>
                {roleLabels[user.role]}
              </span>
              {agency && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  {agency.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </div>
          {user.last_login && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              Last login {new Date(user.last_login).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-base font-semibold">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-[13px] font-medium text-foreground">
              Full name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 text-sm text-foreground shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-email" className="mb-1.5 block text-[13px] font-medium text-foreground">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 text-sm text-foreground shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-phone" className="mb-1.5 block text-[13px] font-medium text-foreground">
              Phone number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-base font-semibold">Change Password</h3>
        <div className="space-y-4">
          <PasswordInput
            id="current-pw"
            value={currentPassword}
            onChange={setCurrentPassword}
            label="Current password"
            placeholder="Enter current password"
            autoComplete="current-password"
          />
          <PasswordInput
            id="new-pw"
            value={newPassword}
            onChange={setNewPassword}
            label="New password"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            showStrength
          />
          <div>
            <label htmlFor="confirm-pw" className="mb-1.5 block text-[13px] font-medium text-foreground">
              Confirm new password
            </label>
            <input
              id="confirm-pw"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1.5 text-xs text-error">Passwords do not match</p>
            )}
          </div>

          <button
            onClick={handleChangePassword}
            disabled={isChangingPassword || !currentPassword || newPassword.length < 8}
            className="flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-medium text-foreground shadow-xs transition-all hover:bg-muted active:scale-[0.99] disabled:opacity-60"
          >
            {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
