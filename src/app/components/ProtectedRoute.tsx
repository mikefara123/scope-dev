import { Navigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/lib/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requirePlatformAdmin?: boolean;
  requireAgencyAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission,
  requirePlatformAdmin = false,
  requireAgencyAdmin = false
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission, isPlatformAdmin, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check platform admin requirement
  if (requirePlatformAdmin && !isPlatformAdmin()) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            This page is only accessible to Platform Administrators.
          </p>
        </div>
      </div>
    );
  }

  // Check agency admin requirement
  if (requireAgencyAdmin && !isAdmin()) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            This page is only accessible to Administrators.
          </p>
        </div>
      </div>
    );
  }

  // Check specific permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
}

// Wrapper for routes that require authentication only (no specific permissions)
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
