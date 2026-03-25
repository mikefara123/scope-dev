// Role-Based Access Control (RBAC) System for Project Clarity

import type { User } from '@/types/multi-tenant';
import { UserRole } from '@/types/multi-tenant';

// All permissions in the system
export enum Permission {
  // ========================================
  // PLATFORM ADMIN ONLY
  // ========================================
  MANAGE_AGENCIES = 'manage_agencies',
  VIEW_ALL_AGENCIES = 'view_all_agencies',
  VIEW_PLATFORM_ANALYTICS = 'view_platform_analytics',
  MANAGE_PLATFORM_BILLING = 'manage_platform_billing',
  MANAGE_PLATFORM_LIBRARY = 'manage_platform_library',
  IMPERSONATE_USER = 'impersonate_user',
  MANAGE_PLATFORM_SETTINGS = 'manage_platform_settings',
  
  // ========================================
  // AGENCY ADMIN
  // ========================================
  MANAGE_AGENCY_SETTINGS = 'manage_agency_settings',
  MANAGE_AGENCY_THEME = 'manage_agency_theme',
  MANAGE_USERS = 'manage_users',
  INVITE_USERS = 'invite_users',
  MANAGE_LICENSES = 'manage_licenses',
  MANAGE_ITEM_LIBRARY = 'manage_item_library',
  MANAGE_PROJECT_TYPES = 'manage_project_types',
  MANAGE_ROOM_TEMPLATES = 'manage_room_templates',
  VIEW_AUDIT_LOG = 'view_audit_log',
  MANAGE_SUBSCRIPTION = 'manage_subscription',
  VIEW_AGENCY_ANALYTICS = 'view_agency_analytics',
  VIEW_ALL_AGENCY_PROJECTS = 'view_all_agency_projects',
  VIEW_ALL_AGENCY_BUDGETS = 'view_all_agency_budgets',
  EDIT_ALL_AGENCY_PROJECTS = 'edit_all_agency_projects',
  EDIT_ALL_AGENCY_BUDGETS = 'edit_all_agency_budgets',
  
  // ========================================
  // GENERAL USER (Interior Designer)
  // ========================================
  CREATE_PROJECT = 'create_project',
  EDIT_PROJECT = 'edit_project',
  DELETE_PROJECT = 'delete_project',
  VIEW_PROJECT = 'view_project',
  
  CREATE_BUDGET = 'create_budget',
  EDIT_BUDGET = 'edit_budget',
  DELETE_BUDGET = 'delete_budget',
  VIEW_BUDGET = 'view_budget',
  
  SEND_APPROVAL = 'send_approval',
  CREATE_INTERIM_BUDGET = 'create_interim_budget',
  
  TRACK_ACTUAL_COSTS = 'track_actual_costs',
  
  MANAGE_CUSTOMERS = 'manage_customers',
  VIEW_CUSTOMERS = 'view_customers',
  
  VIEW_ITEM_LIBRARY = 'view_item_library',
  REQUEST_LIBRARY_ITEM = 'request_library_item',
  
  EXPORT_BUDGET = 'export_budget',
  GENERATE_REPORTS = 'generate_reports',
  
  // ========================================
  // READ-ONLY USER
  // ========================================
  // Only has VIEW permissions (defined below)
}

// Map each role to their permissions
export const rolePermissions: Record<UserRole, Permission[]> = {
  // Platform Admin has ALL permissions
  [UserRole.PLATFORM_ADMIN]: Object.values(Permission),
  
  // Agency Admin
  [UserRole.AGENCY_ADMIN]: [
    // Agency management
    Permission.MANAGE_AGENCY_SETTINGS,
    Permission.MANAGE_AGENCY_THEME,
    Permission.MANAGE_USERS,
    Permission.INVITE_USERS,
    Permission.MANAGE_LICENSES,
    Permission.MANAGE_ITEM_LIBRARY,
    Permission.MANAGE_PROJECT_TYPES,
    Permission.MANAGE_ROOM_TEMPLATES,
    Permission.VIEW_AUDIT_LOG,
    Permission.MANAGE_SUBSCRIPTION,
    Permission.VIEW_AGENCY_ANALYTICS,
    
    // Full access to all agency projects/budgets
    Permission.VIEW_ALL_AGENCY_PROJECTS,
    Permission.VIEW_ALL_AGENCY_BUDGETS,
    Permission.EDIT_ALL_AGENCY_PROJECTS,
    Permission.EDIT_ALL_AGENCY_BUDGETS,
    
    // All general user permissions
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.VIEW_PROJECT,
    Permission.CREATE_BUDGET,
    Permission.EDIT_BUDGET,
    Permission.DELETE_BUDGET,
    Permission.VIEW_BUDGET,
    Permission.SEND_APPROVAL,
    Permission.CREATE_INTERIM_BUDGET,
    Permission.TRACK_ACTUAL_COSTS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_ITEM_LIBRARY,
    Permission.REQUEST_LIBRARY_ITEM,
    Permission.EXPORT_BUDGET,
    Permission.GENERATE_REPORTS,
  ],
  
  // General User (Interior Designer)
  [UserRole.GENERAL_USER]: [
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.VIEW_PROJECT,
    Permission.CREATE_BUDGET,
    Permission.EDIT_BUDGET,
    Permission.DELETE_BUDGET,
    Permission.VIEW_BUDGET,
    Permission.SEND_APPROVAL,
    Permission.CREATE_INTERIM_BUDGET,
    Permission.TRACK_ACTUAL_COSTS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_ITEM_LIBRARY,
    Permission.REQUEST_LIBRARY_ITEM,
    Permission.EXPORT_BUDGET,
    Permission.GENERATE_REPORTS,
  ],
  
  // Read-Only User
  [UserRole.READ_ONLY_USER]: [
    Permission.VIEW_PROJECT,
    Permission.VIEW_BUDGET,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_ITEM_LIBRARY,
    Permission.EXPORT_BUDGET,
  ],
};

// Helper: Check if user has a specific permission
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return rolePermissions[user.role]?.includes(permission) ?? false;
}

// Helper: Check if user has ANY of the given permissions
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some(permission => hasPermission(user, permission));
}

// Helper: Check if user has ALL of the given permissions
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every(permission => hasPermission(user, permission));
}

// Resource-level access control
export interface Resource {
  agency_id: string;
  collaborators?: string[]; // user IDs who can access this resource
  created_by?: string; // user ID who created it
}

// Helper: Check if user can access a specific project
export function canAccessProject(user: User | null, project: Resource): boolean {
  if (!user) return false;
  
  // Platform admin can access everything
  if (user.role === UserRole.PLATFORM_ADMIN) return true;
  
  // Must be same agency
  if (user.agency_id !== project.agency_id) return false;
  
  // Agency admin can access all agency projects
  if (user.role === UserRole.AGENCY_ADMIN) return true;
  
  // General/Read-only users can only access assigned projects
  return project.collaborators?.includes(user.id) ?? false;
}

// Helper: Check if user can edit a specific project
export function canEditProject(user: User | null, project: Resource): boolean {
  if (!user) return false;
  
  // Must have view access first
  if (!canAccessProject(user, project)) return false;
  
  // Platform admin can edit everything
  if (user.role === UserRole.PLATFORM_ADMIN) return true;
  
  // Agency admin can edit all agency projects
  if (user.role === UserRole.AGENCY_ADMIN) return true;
  
  // General users can edit if they have permission
  if (user.role === UserRole.GENERAL_USER) {
    return hasPermission(user, Permission.EDIT_PROJECT);
  }
  
  // Read-only cannot edit
  return false;
}

// Helper: Check if user can access a specific budget
export function canAccessBudget(user: User | null, budget: Resource): boolean {
  // Same logic as projects for now
  return canAccessProject(user, budget);
}

// Helper: Check if user can edit a specific budget
export function canEditBudget(user: User | null, budget: Resource): boolean {
  if (!user) return false;
  
  // Must have view access first
  if (!canAccessBudget(user, budget)) return false;
  
  // Platform admin can edit everything
  if (user.role === UserRole.PLATFORM_ADMIN) return true;
  
  // Agency admin can edit all agency budgets
  if (user.role === UserRole.AGENCY_ADMIN) return true;
  
  // General users can edit if they have permission
  if (user.role === UserRole.GENERAL_USER) {
    return hasPermission(user, Permission.EDIT_BUDGET);
  }
  
  // Read-only cannot edit
  return false;
}

// Helper: Get user's role display name
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    [UserRole.PLATFORM_ADMIN]: 'Platform Admin',
    [UserRole.AGENCY_ADMIN]: 'Agency Admin',
    [UserRole.GENERAL_USER]: 'Designer',
    [UserRole.READ_ONLY_USER]: 'Read-Only',
  };
  return roleNames[role];
}

// Helper: Get role badge color
export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    [UserRole.PLATFORM_ADMIN]: 'bg-purple-100 text-purple-800',
    [UserRole.AGENCY_ADMIN]: 'bg-blue-100 text-blue-800',
    [UserRole.GENERAL_USER]: 'bg-green-100 text-green-800',
    [UserRole.READ_ONLY_USER]: 'bg-gray-100 text-gray-800',
  };
  return colors[role];
}

// Helper: Check if user is admin (platform or agency)
export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role === UserRole.PLATFORM_ADMIN || user.role === UserRole.AGENCY_ADMIN;
}

// Helper: Check if user is platform admin
export function isPlatformAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role === UserRole.PLATFORM_ADMIN;
}

// Helper: Check if user can manage other users
export function canManageUsers(user: User | null): boolean {
  return hasPermission(user, Permission.MANAGE_USERS);
}

// Helper: Check if user can see agency settings
export function canAccessAgencySettings(user: User | null): boolean {
  return hasPermission(user, Permission.MANAGE_AGENCY_SETTINGS);
}

// Helper: Filter projects by user access
export function filterAccessibleProjects<T extends Resource>(
  user: User | null,
  projects: T[]
): T[] {
  if (!user) return [];
  
  // Platform admin sees all
  if (user.role === UserRole.PLATFORM_ADMIN) return projects;
  
  // Filter by agency
  const agencyProjects = projects.filter(p => p.agency_id === user.agency_id);
  
  // Agency admin sees all agency projects
  if (user.role === UserRole.AGENCY_ADMIN) return agencyProjects;
  
  // General/Read-only users see only assigned projects
  return agencyProjects.filter(p => canAccessProject(user, p));
}

// Helper: Filter budgets by user access
export function filterAccessibleBudgets<T extends Resource>(
  user: User | null,
  budgets: T[]
): T[] {
  return filterAccessibleProjects(user, budgets); // Same logic
}