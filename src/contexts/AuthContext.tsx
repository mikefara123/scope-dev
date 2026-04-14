import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { type User, type Agency, type Permission, type SubscriptionTier, UserRole, rolePermissions } from "@/types";
import { agencies } from "@/data/mock";
import {
  getCurrentUser,
  loginWithEmail,
  loginWithSocial,
  signupWithEmail,
  signupWithSocial,
  acceptInvitation,
  logout as apiLogout,
  getRedirectPath,
  type AuthResponse,
  type SignupResponse,
  type InviteAcceptResponse,
} from "@/lib/auth";

interface AuthState {
  user: User | null;
  agency: Agency | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<AuthResponse>;
  socialLogin: (provider: "google" | "apple") => Promise<AuthResponse>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    agency_name: string;
    agency_type: "individual" | "company";
    team_size: string;
    subscription_tier: SubscriptionTier;
  }) => Promise<SignupResponse>;
  socialSignup: (provider: "google" | "apple") => Promise<SignupResponse>;
  acceptInvite: (data: { token: string; name: string; password: string }) => Promise<InviteAcceptResponse>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  isPlatformAdmin: () => boolean;
  isAdmin: () => boolean;
  getRedirect: () => string;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyAgencyTheme = useCallback((userAgency: Agency | null) => {
    if (userAgency) {
      const root = document.documentElement;
      root.style.setProperty("--brand-primary", userAgency.theme_colors.primary);
      root.style.setProperty("--brand-secondary", userAgency.theme_colors.secondary);
    }
  }, []);

  const setAuthUser = useCallback(
    (newUser: User | null) => {
      setUser(newUser);
      if (newUser && newUser.role !== UserRole.PLATFORM_ADMIN) {
        const userAgency = agencies.find((a) => a.id === newUser.agency_id) ?? null;
        setAgency(userAgency);
        applyAgencyTheme(userAgency);
      } else {
        setAgency(null);
      }
    },
    [applyAgencyTheme]
  );

  // Restore session on mount
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res.success && res.user) {
          setAuthUser(res.user);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [setAuthUser]);

  const login = useCallback(
    async (email: string, password: string, remember = false) => {
      const res = await loginWithEmail(email, password, remember);
      if (res.success && res.user) setAuthUser(res.user);
      return res;
    },
    [setAuthUser]
  );

  const socialLogin = useCallback(
    async (provider: "google" | "apple") => {
      const res = await loginWithSocial(provider);
      if (res.success && res.user) setAuthUser(res.user);
      return res;
    },
    [setAuthUser]
  );

  const signup = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      agency_name: string;
      agency_type: "individual" | "company";
      team_size: string;
      subscription_tier: SubscriptionTier;
    }) => {
      const res = await signupWithEmail(data);
      if (res.success && res.user) {
        setAuthUser(res.user);
        if (res.agency) setAgency(res.agency);
      }
      return res;
    },
    [setAuthUser]
  );

  const socialSignup = useCallback(
    async (provider: "google" | "apple") => {
      return await signupWithSocial(provider);
    },
    []
  );

  const acceptInvite = useCallback(
    async (data: { token: string; name: string; password: string }) => {
      const res = await acceptInvitation(data);
      if (res.success && res.user) setAuthUser(res.user);
      return res;
    },
    [setAuthUser]
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setAgency(null);
    // Reset theme colors to defaults
    document.documentElement.style.removeProperty("--brand-primary");
    document.documentElement.style.removeProperty("--brand-secondary");
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => {
      if (!user) return false;
      return rolePermissions[user.role]?.includes(permission) ?? false;
    },
    [user]
  );

  const isPlatformAdmin = useCallback(
    () => user?.role === UserRole.PLATFORM_ADMIN,
    [user]
  );

  const isAdmin = useCallback(
    () =>
      user?.role === UserRole.PLATFORM_ADMIN ||
      user?.role === UserRole.AGENCY_ADMIN,
    [user]
  );

  const getRedirect = useCallback(
    () => (user ? getRedirectPath(user) : "/login"),
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        agency,
        isLoading,
        login,
        socialLogin,
        signup,
        socialSignup,
        acceptInvite,
        logout,
        hasPermission,
        isPlatformAdmin,
        isAdmin,
        getRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
