import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, Permission } from "@/types";
import {
  LayoutDashboard,
  FolderKanban,
  DollarSign,
  BookOpen,
  BarChart3,
  Settings,
  Users,
  Shield,
  Building2,
  CreditCard,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

function getNavItems(role: UserRole, hasPermission: (p: Permission) => boolean): NavItem[] {
  if (role === UserRole.PLATFORM_ADMIN) {
    return [
      { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
      { label: "Agencies", to: "/admin/agencies", icon: Building2 },
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Analytics", to: "/admin/analytics", icon: TrendingUp },
      { label: "Billing", to: "/admin/billing", icon: CreditCard },
      { label: "Library", to: "/library", icon: BookOpen },
    ];
  }

  const items: NavItem[] = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  ];

  if (hasPermission(Permission.VIEW_PROJECTS)) {
    items.push({ label: "Projects", to: "/projects", icon: FolderKanban });
  }
  if (hasPermission(Permission.VIEW_BUDGETS)) {
    items.push({ label: "Budgets", to: "/budgets", icon: DollarSign });
  }
  if (hasPermission(Permission.VIEW_LIBRARY)) {
    items.push({ label: "Library", to: "/library", icon: BookOpen });
  }
  if (hasPermission(Permission.VIEW_AGENCY_REPORTS)) {
    items.push({ label: "Reports", to: "/reports", icon: BarChart3 });
  }

  // Admin-only items
  if (role === UserRole.AGENCY_ADMIN) {
    items.push({ label: "Users", to: "/settings/users", icon: Users });
    items.push({ label: "Settings", to: "/settings", icon: Settings });
  }

  return items;
}

export function RootLayout() {
  const { user, agency, logout, hasPermission, isPlatformAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const navItems = getNavItems(user.role, hasPermission);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <span className="text-sm font-bold text-secondary-foreground">S</span>
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-semibold">Scope</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-2 space-y-1">
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronLeft className="h-4 w-4 shrink-0" />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* User info — clickable to profile */}
          {!collapsed && (
            <NavLink
              to="/profile"
              className="block rounded-lg bg-sidebar-accent/30 px-3 py-2 transition-colors hover:bg-sidebar-accent/50"
            >
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-sidebar-foreground/60">
                {agency?.name ?? "Platform Admin"}
              </div>
            </NavLink>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-3">
            {isPlatformAdmin() && (
              <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                <Shield className="h-3 w-3" />
                Platform Admin
              </span>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground" aria-label={user.name}>
              {user.name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
