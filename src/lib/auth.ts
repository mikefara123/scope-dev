/**
 * Auth API Layer
 * Mock implementation — structured to be easily swappable with real API calls.
 * All functions return Promises to simulate async API behavior.
 */

import { users, agencies } from "@/data/mock";
import { invitations } from "@/data/invitations";
import { UserRole, type User, type Agency, type SubscriptionTier } from "@/types";

// Simulated network delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Token storage keys
const TOKEN_KEY = "scope_token";
const REFRESH_KEY = "scope_refresh";
const USER_KEY = "scope_current_user";
const REMEMBER_KEY = "scope_remember";

// ========================================
// Token Helpers
// ========================================

function generateToken(): string {
  return `sc_${Date.now()}_${Math.random().toString(36).slice(2, 15)}`;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUserId(): string | null {
  return localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
}

function setTokens(userId: string, remember: boolean) {
  const token = generateToken();
  const refresh = generateToken();
  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(REFRESH_KEY, refresh);
  storage.setItem(USER_KEY, userId);

  if (remember) {
    localStorage.setItem(REMEMBER_KEY, "true");
  }
}

function clearTokens() {
  [TOKEN_KEY, REFRESH_KEY, USER_KEY, REMEMBER_KEY].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

// ========================================
// API Response Types
// ========================================

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface SignupResponse {
  success: boolean;
  user?: User;
  agency?: Agency;
  token?: string;
  error?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface InviteValidationResponse {
  success: boolean;
  invitation?: {
    email: string;
    agency_name: string;
    agency_logo_url?: string;
    role: UserRole;
  };
  error?: string;
}

export interface InviteAcceptResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// ========================================
// Auth API — Login
// ========================================

/**
 * Email/password login.
 * POST /api/auth/login
 */
export async function loginWithEmail(
  email: string,
  _password: string,
  remember: boolean = false
): Promise<AuthResponse> {
  await delay(600 + Math.random() * 400);

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return { success: false, error: "No account found with this email address." };
  }

  if (user.status === "suspended") {
    return { success: false, error: "This account has been suspended. Contact your administrator." };
  }

  setTokens(user.id, remember);
  return { success: true, user, token: getStoredToken()! };
}

/**
 * Social login (Google, Apple).
 * In production, redirects to OAuth flow.
 */
export async function loginWithSocial(
  _provider: "google" | "apple"
): Promise<AuthResponse> {
  await delay(800 + Math.random() * 600);

  // Mock: social login succeeds as Jennifer Martinez (Agency Admin)
  const user = users.find((u) => u.id === "user-1")!;
  setTokens(user.id, true);

  return { success: true, user, token: getStoredToken()! };
}

// ========================================
// Auth API — Signup
// ========================================

const LICENSE_MAP: Record<string, number> = {
  "Just me": 1,
  "2–5": 5,
  "6–10": 10,
  "11+": 25,
};

/**
 * Register a new agency + admin user.
 * POST /api/auth/signup
 */
export async function signupWithEmail(data: {
  name: string;
  email: string;
  password: string;
  agency_name: string;
  agency_type: "individual" | "company";
  team_size: string;
  subscription_tier: SubscriptionTier;
}): Promise<SignupResponse> {
  await delay(800 + Math.random() * 400);

  // Check duplicate email
  const existing = users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  // Create agency
  const agencyId = generateId("agency");
  const newAgency: Agency = {
    id: agencyId,
    name: data.agency_name,
    type: data.agency_type,
    status: "trial",
    subscription: {
      tier: data.subscription_tier,
      total_licenses: LICENSE_MAP[data.team_size] ?? 3,
      used_licenses: 1,
    },
    theme_colors: { primary: "#1a365d", secondary: "#14b8a6", background: "#f1f5f9" },
    defaults: { product_markup: 30, shipping_percentage: 8, other_cost_percentage: 5 },
    created_at: new Date().toISOString().split("T")[0],
  };
  agencies.push(newAgency);

  // Create admin user
  const userId = generateId("user");
  const newUser: User = {
    id: userId,
    agency_id: agencyId,
    email: data.email,
    name: data.name,
    role: UserRole.AGENCY_ADMIN,
    status: "active",
    created_at: new Date().toISOString().split("T")[0],
  };
  users.push(newUser);

  setTokens(userId, true);
  return { success: true, user: newUser, agency: newAgency, token: getStoredToken()! };
}

/**
 * Social signup (Google, Apple).
 * Returns a pre-filled user stub for step 2+.
 * POST /api/auth/signup/social
 */
export async function signupWithSocial(
  _provider: "google" | "apple"
): Promise<SignupResponse> {
  await delay(800 + Math.random() * 600);

  // Mock: return a pre-filled stub (not yet persisted)
  return {
    success: true,
    user: {
      id: "",
      agency_id: "",
      email: "designer@gmail.com",
      name: "Alex Designer",
      role: UserRole.AGENCY_ADMIN,
      status: "active",
      created_at: "",
    },
  };
}

// ========================================
// Auth API — Password Reset
// ========================================

/**
 * Request password reset email.
 * POST /api/auth/forgot-password
 */
export async function requestPasswordReset(
  email: string
): Promise<PasswordResetResponse> {
  await delay(500 + Math.random() * 500);

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  return {
    success: true,
    message: user
      ? `Password reset link sent to ${email}`
      : `If an account exists for ${email}, a reset link has been sent.`,
  };
}

/**
 * Reset password with token.
 * POST /api/auth/reset-password
 */
export async function resetPassword(
  _token: string,
  _newPassword: string
): Promise<AuthResponse> {
  await delay(600);
  return { success: true };
}

// ========================================
// Auth API — Invitations
// ========================================

/**
 * Validate an invitation token.
 * GET /api/invitations/validate?token=xxx
 */
export async function validateInviteToken(
  token: string
): Promise<InviteValidationResponse> {
  await delay(400 + Math.random() * 300);

  const invite = invitations.find(
    (i) => i.token === token && i.status === "pending"
  );

  if (!invite) {
    return { success: false, error: "This invitation link is invalid or has expired." };
  }

  if (new Date(invite.expires_at) < new Date()) {
    return { success: false, error: "This invitation has expired. Please ask your admin for a new invite." };
  }

  const agency = agencies.find((a) => a.id === invite.agency_id);

  return {
    success: true,
    invitation: {
      email: invite.email,
      agency_name: agency?.name ?? "Unknown Agency",
      agency_logo_url: agency?.logo_url,
      role: invite.role,
    },
  };
}

/**
 * Accept an invitation — create the user account.
 * POST /api/invitations/accept
 */
export async function acceptInvitation(data: {
  token: string;
  name: string;
  password: string;
}): Promise<InviteAcceptResponse> {
  await delay(700 + Math.random() * 400);

  const invite = invitations.find(
    (i) => i.token === data.token && i.status === "pending"
  );

  if (!invite) {
    return { success: false, error: "Invalid or expired invitation." };
  }

  // Create user
  const userId = generateId("user");
  const newUser: User = {
    id: userId,
    agency_id: invite.agency_id,
    email: invite.email,
    name: data.name,
    role: invite.role,
    status: "active",
    created_at: new Date().toISOString().split("T")[0],
  };
  users.push(newUser);

  // Mark invite as accepted
  invite.status = "accepted";
  invite.accepted_at = new Date().toISOString();

  // Update agency license count
  const agency = agencies.find((a) => a.id === invite.agency_id);
  if (agency) {
    agency.subscription.used_licenses++;
  }

  setTokens(userId, true);
  return { success: true, user: newUser, token: getStoredToken()! };
}

/**
 * Create and send an invitation (agency admin action).
 * POST /api/invitations
 */
export async function createInvitation(data: {
  email: string;
  role: UserRole;
  agency_id: string;
}): Promise<{ success: boolean; invite_url?: string; error?: string }> {
  await delay(500);

  const existing = users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );
  if (existing) {
    return { success: false, error: "A user with this email already exists." };
  }

  const token = generateToken();
  invitations.push({
    id: generateId("invite"),
    agency_id: data.agency_id,
    email: data.email,
    role: data.role,
    status: "pending",
    invited_by: getStoredUserId() ?? "",
    token,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    created_at: new Date().toISOString().split("T")[0],
  });

  return {
    success: true,
    invite_url: `${window.location.origin}/invite/accept?token=${token}`,
  };
}

// ========================================
// Session Management
// ========================================

/**
 * Refresh the auth token.
 * POST /api/auth/refresh
 */
export async function refreshToken(): Promise<AuthResponse> {
  const userId = getStoredUserId();
  if (!userId) return { success: false, error: "No session found." };

  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false, error: "User not found." };

  const remember = localStorage.getItem(REMEMBER_KEY) === "true";
  setTokens(user.id, remember);

  return { success: true, user, token: getStoredToken()! };
}

/**
 * Logout — clear all tokens and session data.
 * POST /api/auth/logout
 */
export async function logout(): Promise<void> {
  await delay(200);
  clearTokens();
}

/**
 * Get current session user from stored token.
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  const userId = getStoredUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  const user = users.find((u) => u.id === userId);
  if (!user) {
    clearTokens();
    return { success: false, error: "User not found." };
  }

  return { success: true, user };
}

/**
 * Role-based redirect path after login.
 */
export function getRedirectPath(user: User): string {
  switch (user.role) {
    case "platform_admin":
      return "/admin";
    case "agency_admin":
    case "general_user":
    case "read_only_user":
    default:
      return "/";
  }
}
