import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Agency } from '@/types/multi-tenant';
import { Permission, hasPermission, canAccessProject, canEditProject, canAccessBudget, canEditBudget, isAdmin, isPlatformAdmin } from '@/lib/permissions';
import { mockUsers, mockCurrentUser, getAgencyById } from '@/data/mock-multi-tenant';

interface AuthContextType {
  user: User | null;
  agency: Agency | null;
  isLoading: boolean;
  
  // Convenience properties
  userRole: string | null;
  currentUser: User | null;
  
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Permission checks
  hasPermission: (permission: Permission) => boolean;
  canAccessProject: (project: { agency_id: string; collaborators?: string[] }) => boolean;
  canEditProject: (project: { agency_id: string; collaborators?: string[] }) => boolean;
  canAccessBudget: (budget: { agency_id: string; collaborators?: string[] }) => boolean;
  canEditBudget: (budget: { agency_id: string; collaborators?: string[] }) => boolean;
  
  // Role checks
  isAdmin: () => boolean;
  isPlatformAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    loadCurrentUser();
  }, []);

  // Load user and their agency
  const loadCurrentUser = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading from localStorage or API
      const storedUserId = localStorage.getItem('currentUserId');
      
      if (storedUserId) {
        const loadedUser = mockUsers.find(u => u.id === storedUserId);
        
        if (loadedUser) {
          setUser(loadedUser);
          
          // Load agency (skip for platform admin)
          if (loadedUser.agency_id !== 'platform') {
            const loadedAgency = getAgencyById(loadedUser.agency_id);
            if (loadedAgency) {
              setAgency(loadedAgency);
              
              // Apply agency theme colors
              applyTheme(loadedAgency);
            }
          }
        }
      } else {
        // Default to mock current user for development
        setUser(mockCurrentUser);
        const defaultAgency = getAgencyById(mockCurrentUser.agency_id);
        if (defaultAgency) {
          setAgency(defaultAgency);
          applyTheme(defaultAgency);
        }
        localStorage.setItem('currentUserId', mockCurrentUser.id);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply agency theme colors to CSS variables
  const applyTheme = (agency: Agency) => {
    const root = document.documentElement;
    
    // Convert hex to HSL and apply
    const primary = hexToHSL(agency.theme_colors.primary);
    const secondary = hexToHSL(agency.theme_colors.secondary);
    
    if (primary) {
      root.style.setProperty('--primary', `${primary.h} ${primary.s}% ${primary.l}%`);
    }
    
    if (secondary) {
      root.style.setProperty('--secondary', `${secondary.h} ${secondary.s}% ${secondary.l}%`);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock authentication - find user by email
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // In real app, verify password here
      // For now, accept any password
      
      setUser(foundUser);
      
      // Load agency
      if (foundUser.agency_id !== 'platform') {
        const userAgency = getAgencyById(foundUser.agency_id);
        if (userAgency) {
          setAgency(userAgency);
          applyTheme(userAgency);
        }
      }
      
      // Store in localStorage
      localStorage.setItem('currentUserId', foundUser.id);
      
      // Update last login
      foundUser.last_login = new Date().toISOString();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setAgency(null);
    localStorage.removeItem('currentUserId');
    
    // Reset theme to default
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
  };

  // Permission check wrapper
  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(user, permission);
  };

  // Project access wrapper
  const checkProjectAccess = (project: { agency_id: string; collaborators?: string[] }): boolean => {
    return canAccessProject(user, project);
  };

  // Project edit wrapper
  const checkProjectEdit = (project: { agency_id: string; collaborators?: string[] }): boolean => {
    return canEditProject(user, project);
  };

  // Budget access wrapper
  const checkBudgetAccess = (budget: { agency_id: string; collaborators?: string[] }): boolean => {
    return canAccessBudget(user, budget);
  };

  // Budget edit wrapper
  const checkBudgetEdit = (budget: { agency_id: string; collaborators?: string[] }): boolean => {
    return canEditBudget(user, budget);
  };

  // Admin check wrapper
  const checkIsAdmin = (): boolean => {
    return isAdmin(user);
  };

  // Platform admin check wrapper
  const checkIsPlatformAdmin = (): boolean => {
    return isPlatformAdmin(user);
  };

  const value: AuthContextType = {
    user,
    agency,
    isLoading,
    userRole: user?.role || null,
    currentUser: user,
    login,
    logout,
    hasPermission: checkPermission,
    canAccessProject: checkProjectAccess,
    canEditProject: checkProjectEdit,
    canAccessBudget: checkBudgetAccess,
    canEditBudget: checkBudgetEdit,
    isAdmin: checkIsAdmin,
    isPlatformAdmin: checkIsPlatformAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper: Convert hex color to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}