import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Receipt, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Menu,
  Building2,
  Users,
  CreditCard,
  FileText,
  LogOut,
  ChevronDown,
  Layers
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/lib/permissions';
import { getRoleDisplayName, getRoleBadgeColor } from '@/lib/permissions';
import { UserRole } from '@/types/multi-tenant';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: Permission;
  roles?: UserRole[]; // Specific roles that can see this item
}

// Platform Admin Navigation - ONLY for platform admins
const platformAdminNavigation: NavItem[] = [
  { name: 'Platform Dashboard', href: '/admin', icon: LayoutDashboard, roles: [UserRole.PLATFORM_ADMIN] },
  { name: 'Agencies', href: '/admin/agencies', icon: Building2, roles: [UserRole.PLATFORM_ADMIN] },
  { name: 'Users', href: '/admin/users', icon: Users, roles: [UserRole.PLATFORM_ADMIN] },
  { name: 'Library', href: '/library', icon: BookOpen, roles: [UserRole.PLATFORM_ADMIN] },
  // { name: 'Templates', href: '/settings/templates', icon: Layers, roles: [UserRole.PLATFORM_ADMIN] }, // Hidden for V1 - will focus on room selection at budget creation
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: [UserRole.PLATFORM_ADMIN] },
  { name: 'Billing', href: '/admin/billing', icon: CreditCard, roles: [UserRole.PLATFORM_ADMIN] },
];

// Agency Admin Navigation - Agency management features
const agencyAdminNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: [UserRole.AGENCY_ADMIN] },
  { name: 'Projects', href: '/projects', icon: FolderKanban, permission: Permission.VIEW_PROJECT, roles: [UserRole.AGENCY_ADMIN] },
  { name: 'Budgets', href: '/budgets', icon: Receipt, permission: Permission.VIEW_BUDGET, roles: [UserRole.AGENCY_ADMIN] },
  // { name: 'Templates', href: '/settings/templates', icon: Layers, permission: Permission.MANAGE_AGENCY_SETTINGS, roles: [UserRole.AGENCY_ADMIN] }, // Hidden for V1 - will focus on room selection at budget creation
  { name: 'Library', href: '/library', icon: BookOpen, permission: Permission.VIEW_ITEM_LIBRARY, roles: [UserRole.AGENCY_ADMIN] },
  { name: 'Reports', href: '/reports', icon: BarChart3, permission: Permission.VIEW_AGENCY_ANALYTICS, roles: [UserRole.AGENCY_ADMIN] },
  { name: 'Audit Log', href: '/settings/audit', icon: FileText, permission: Permission.VIEW_AUDIT_LOG, roles: [UserRole.AGENCY_ADMIN] },
  { name: 'Users', href: '/settings/users', icon: Users, permission: Permission.MANAGE_USERS, roles: [UserRole.AGENCY_ADMIN] },
  { name: 'Settings', href: '/settings', icon: Settings, permission: Permission.MANAGE_AGENCY_SETTINGS, roles: [UserRole.AGENCY_ADMIN] },
];

// Designer Navigation - Project and budget management
const designerNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: [UserRole.GENERAL_USER, UserRole.AGENCY_ADMIN] },
  { name: 'Projects', href: '/projects', icon: FolderKanban, permission: Permission.VIEW_PROJECT, roles: [UserRole.GENERAL_USER, UserRole.AGENCY_ADMIN] },
  { name: 'Budgets', href: '/budgets', icon: Receipt, permission: Permission.VIEW_BUDGET, roles: [UserRole.GENERAL_USER, UserRole.AGENCY_ADMIN] },
  { name: 'Library', href: '/library', icon: BookOpen, permission: Permission.VIEW_ITEM_LIBRARY, roles: [UserRole.GENERAL_USER, UserRole.AGENCY_ADMIN] },
  { name: 'Reports', href: '/reports', icon: BarChart3, permission: Permission.GENERATE_REPORTS, roles: [UserRole.GENERAL_USER] },
];

// Read-Only Navigation - View-only features
const readOnlyNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: [UserRole.READ_ONLY_USER] },
  { name: 'Projects', href: '/projects', icon: FolderKanban, permission: Permission.VIEW_PROJECT, roles: [UserRole.READ_ONLY_USER] },
  { name: 'Budgets', href: '/budgets', icon: Receipt, permission: Permission.VIEW_BUDGET, roles: [UserRole.READ_ONLY_USER] },
  { name: 'Library', href: '/library', icon: BookOpen, permission: Permission.VIEW_ITEM_LIBRARY, roles: [UserRole.READ_ONLY_USER] },
];

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, agency, hasPermission, isPlatformAdmin, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filter navigation items based on user role
  const getVisibleNavigation = (): NavItem[] => {
    if (!user) return [];

    // Platform Admin - ONLY sees platform admin pages
    if (user.role === UserRole.PLATFORM_ADMIN) {
      return platformAdminNavigation.filter(item => 
        !item.permission || hasPermission(item.permission)
      );
    }

    // Agency Admin - sees all agency navigation items in order
    if (user.role === UserRole.AGENCY_ADMIN) {
      return agencyAdminNavigation.filter(item => 
        (!item.permission || hasPermission(item.permission)) &&
        (!item.roles || item.roles.includes(user.role))
      );
    }

    // General User (Designer) - sees project/budget management
    if (user.role === UserRole.GENERAL_USER) {
      return designerNavigation.filter(item => 
        (!item.permission || hasPermission(item.permission)) &&
        (!item.roles || item.roles.includes(user.role))
      );
    }

    // Read-Only User - sees view-only features
    if (user.role === UserRole.READ_ONLY_USER) {
      return readOnlyNavigation.filter(item => 
        (!item.permission || hasPermission(item.permission)) &&
        (!item.roles || item.roles.includes(user.role))
      );
    }

    return [];
  };

  const navigation = getVisibleNavigation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  // Get user initials
  const getUserInitials = () => {
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col transition-all duration-300 ease-in-out bg-primary text-white border-r border-white/10',
          'h-screen sticky top-0',
          isSidebarCollapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isSidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">
                Design SaaS
              </h1>
              {agency && (
                <p className="text-xs mt-0.5 text-white/70">
                  {agency.name}
                </p>
              )}
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                )}
              >
                {isActive && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r bg-secondary"
                  />
                )}
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-white/10">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full focus:outline-none">
                <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <div 
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0",
                      user.avatar_url ? "bg-transparent" : "bg-secondary"
                    )}
                    style={{ 
                      backgroundImage: user.avatar_url ? `url(${user.avatar_url})` : 'none',
                      backgroundSize: 'cover'
                    }}
                  >
                    {!user.avatar_url && (
                      <span className="text-sm font-semibold text-white">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate text-white">
                      {user.name}
                    </p>
                    <p className="text-xs truncate text-white/70">
                      {getRoleDisplayName(user.role)}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/70" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-muted-foreground">Role:</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', getRoleBadgeColor(user.role))}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                </DropdownMenuItem>
                {agency && (
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2 w-full">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs truncate">{agency.name}</span>
                    </div>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {/* Only show Settings link for users who can access settings */}
                {(user.role === UserRole.AGENCY_ADMIN || user.role === UserRole.GENERAL_USER) && (
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Collapsed user avatar */}
        {isSidebarCollapsed && (
          <div className="p-4 border-t border-sidebar-border flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div 
                  className="h-9 w-9 rounded-full flex items-center justify-center hover:ring-2 hover:ring-sidebar-accent transition-all"
                  style={{ 
                    backgroundColor: user.avatar_url ? 'transparent' : 'var(--accent)',
                    backgroundImage: user.avatar_url ? `url(${user.avatar_url})` : 'none',
                    backgroundSize: 'cover'
                  }}
                >
                  {!user.avatar_url && (
                    <span className="text-sm font-semibold text-white">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-muted-foreground">Role:</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', getRoleBadgeColor(user.role))}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                </DropdownMenuItem>
                {agency && (
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2 w-full">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs truncate">{agency.name}</span>
                    </div>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {/* Only show Settings link for users who can access settings */}
                {(user.role === UserRole.AGENCY_ADMIN || user.role === UserRole.GENERAL_USER) && (
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
          <div className="flex-1 flex items-center gap-4">
            {/* Role badge for quick reference */}
            {isPlatformAdmin() && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">Platform Admin</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}