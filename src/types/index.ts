// ========================================
// User Roles & Permissions
// ========================================

export enum UserRole {
  PLATFORM_ADMIN = "platform_admin",
  AGENCY_ADMIN = "agency_admin",
  GENERAL_USER = "general_user",
  READ_ONLY_USER = "read_only_user",
}

export enum Permission {
  // Platform
  VIEW_PLATFORM_DASHBOARD = "view_platform_dashboard",
  MANAGE_AGENCIES = "manage_agencies",
  MANAGE_PLATFORM_USERS = "manage_platform_users",
  VIEW_PLATFORM_ANALYTICS = "view_platform_analytics",
  MANAGE_BILLING = "manage_billing",
  MANAGE_GLOBAL_LIBRARY = "manage_global_library",
  MANAGE_PLATFORM_SETTINGS = "manage_platform_settings",
  VIEW_AUDIT_LOG = "view_audit_log",

  // Agency
  MANAGE_AGENCY_SETTINGS = "manage_agency_settings",
  MANAGE_AGENCY_USERS = "manage_agency_users",
  MANAGE_AGENCY_LIBRARY = "manage_agency_library",
  MANAGE_TEMPLATES = "manage_templates",
  VIEW_AGENCY_REPORTS = "view_agency_reports",

  // Projects & Budgets
  CREATE_PROJECT = "create_project",
  EDIT_PROJECT = "edit_project",
  VIEW_PROJECTS = "view_projects",
  DELETE_PROJECT = "delete_project",
  CREATE_BUDGET = "create_budget",
  EDIT_BUDGET = "edit_budget",
  VIEW_BUDGETS = "view_budgets",
  DELETE_BUDGET = "delete_budget",
  SEND_FOR_APPROVAL = "send_for_approval",
  APPROVE_BUDGET = "approve_budget",
  TRACK_ACTUAL_COSTS = "track_actual_costs",

  // Library & Export
  VIEW_LIBRARY = "view_library",
  MANAGE_PERSONAL_LIBRARY = "manage_personal_library",
  EXPORT_DATA = "export_data",
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.PLATFORM_ADMIN]: [
    Permission.VIEW_PLATFORM_DASHBOARD,
    Permission.MANAGE_AGENCIES,
    Permission.MANAGE_PLATFORM_USERS,
    Permission.VIEW_PLATFORM_ANALYTICS,
    Permission.MANAGE_BILLING,
    Permission.MANAGE_GLOBAL_LIBRARY,
    Permission.MANAGE_PLATFORM_SETTINGS,
    Permission.VIEW_AUDIT_LOG,
  ],
  [UserRole.AGENCY_ADMIN]: [
    Permission.MANAGE_AGENCY_SETTINGS,
    Permission.MANAGE_AGENCY_USERS,
    Permission.MANAGE_AGENCY_LIBRARY,
    Permission.MANAGE_TEMPLATES,
    Permission.VIEW_AGENCY_REPORTS,
    Permission.VIEW_AUDIT_LOG,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.VIEW_PROJECTS,
    Permission.DELETE_PROJECT,
    Permission.CREATE_BUDGET,
    Permission.EDIT_BUDGET,
    Permission.VIEW_BUDGETS,
    Permission.DELETE_BUDGET,
    Permission.SEND_FOR_APPROVAL,
    Permission.APPROVE_BUDGET,
    Permission.TRACK_ACTUAL_COSTS,
    Permission.VIEW_LIBRARY,
    Permission.MANAGE_PERSONAL_LIBRARY,
    Permission.EXPORT_DATA,
  ],
  [UserRole.GENERAL_USER]: [
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.VIEW_PROJECTS,
    Permission.CREATE_BUDGET,
    Permission.EDIT_BUDGET,
    Permission.VIEW_BUDGETS,
    Permission.SEND_FOR_APPROVAL,
    Permission.TRACK_ACTUAL_COSTS,
    Permission.VIEW_LIBRARY,
    Permission.MANAGE_PERSONAL_LIBRARY,
    Permission.EXPORT_DATA,
    Permission.VIEW_AGENCY_REPORTS,
  ],
  [UserRole.READ_ONLY_USER]: [
    Permission.VIEW_PROJECTS,
    Permission.VIEW_BUDGETS,
    Permission.VIEW_LIBRARY,
    Permission.EXPORT_DATA,
  ],
};

// ========================================
// Multi-Tenant Models
// ========================================

export type SubscriptionTier = "starter" | "professional" | "enterprise";
export type AgencyStatus = "active" | "suspended" | "trial";
export type UserStatus = "active" | "invited" | "suspended";

export interface Agency {
  id: string;
  name: string;
  type: "individual" | "company";
  status: AgencyStatus;
  subscription: {
    tier: SubscriptionTier;
    total_licenses: number;
    used_licenses: number;
  };
  theme_colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  logo_url?: string;
  address?: string;
  phone?: string;
  website?: string;
  defaults: {
    product_markup: number;
    shipping_percentage: number;
    other_cost_percentage: number;
  };
  created_at: string;
}

export interface User {
  id: string;
  agency_id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  phone?: string;
  last_login?: string;
  created_at: string;
}

// ========================================
// Invitations
// ========================================

export type InviteStatus = "pending" | "accepted" | "expired" | "revoked";

export interface Invitation {
  id: string;
  agency_id: string;
  email: string;
  role: UserRole;
  status: InviteStatus;
  invited_by: string;
  token: string;
  expires_at: string;
  created_at: string;
  accepted_at?: string;
}

// ========================================
// Project Models
// ========================================

export type ProjectStatus = "active" | "on_hold" | "completed";
export type QualityLevel = "quality" | "premium" | "luxury" | "ultra_lux";

export interface Contact {
  name: string;
  email: string;
  phone: string;
  isPrimary?: boolean;
}

export interface Room {
  id: string;
  name: string;
  floor?: string;
  squareFootage?: number;
}

export interface Phase {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  agency_id: string;
  clientName: string;
  projectName: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  contacts: Contact[];
  rooms: Room[];
  phases: Phase[];
  status: ProjectStatus;
  defaultQuality: QualityLevel;
  defaultMarkup: number;
  defaultShipping: number;
  defaultOther: number;
  totalBudgeted: number;
  approvedAmount: number;
  pendingAmount: number;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Budget Models
// ========================================

export type BudgetStatus =
  | "draft"
  | "in_review"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "revised";

export interface BudgetLineItem {
  id: string;
  itemNumber: number;
  itemName: string;
  category: string;
  details?: string;
  phase?: string;
  room?: string;
  quality: QualityLevel;
  quantity: number;
  unit: string;
  netCost: number;
  markupPercent: number;
  itemCost: number;
  shipping: number;
  other: number;
  tax: number;
  total: number;
  overrides: Record<string, boolean>;
}

export interface Budget {
  id: string;
  projectId: string;
  name: string;
  version: number;
  status: BudgetStatus;
  lineItems: BudgetLineItem[];
  subtotal: number;
  totalShipping: number;
  totalOther: number;
  totalTax: number;
  grandTotal: number;
  assignedApproverId?: string;
  internalApprovalStatus?: "pending" | "approved" | "rejected";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  approvedAt?: string;
}

// ========================================
// Library Models
// ========================================

export type LibraryScope = "global" | "agency" | "personal";

export interface LibraryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  qualityPrice: number;
  premiumPrice: number;
  luxuryPrice: number;
  ultraLuxPrice: number;
  scope: LibraryScope;
  agencyId?: string;
  createdBy?: string;
  vendor?: string;
  sku?: string;
  imageUrl?: string;
  tags: string[];
  notes?: string;
  isActive: boolean;
}

// ========================================
// Activity / Audit
// ========================================

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
}
