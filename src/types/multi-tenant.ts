// Multi-tenant types for Project Clarity SaaS platform

export type SubscriptionTier = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'suspended' | 'cancelled';
export type AccountType = 'individual' | 'company';
export type UserStatus = 'active' | 'invited' | 'suspended';

// UserRole as enum for better component usage
export enum UserRole {
  PLATFORM_ADMIN = 'platform_admin',
  AGENCY_ADMIN = 'agency_admin',
  GENERAL_USER = 'general_user',
  READ_ONLY_USER = 'read_only'
}

// Agency (Design Firm or Individual)
export interface Agency {
  id: string;
  name: string;
  type: AccountType;
  status: SubscriptionStatus;
  subscription_tier: SubscriptionTier;
  
  // Licensing
  total_licenses: number;
  used_licenses: number;
  
  // Branding
  theme_colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  logo_url?: string;
  
  // Company Info
  address?: string;
  phone?: string;
  website?: string;
  tax_id?: string;
  
  // Budget Defaults
  default_product_markup: number; // percentage
  default_shipping_percentage: number;
  default_other_cost_percentage: number;
  
  // Export Preferences
  export_preferences: {
    show_client_product_cost: boolean;
    show_other_costs: boolean;
    show_shipping: boolean;
    show_sales_tax: boolean;
    show_total_item_cost: boolean;
    display_mode: 'line_item' | 'summary'; // totaled by line item or bottom summary
  };
  
  // Timestamps
  created_at: string;
  trial_ends_at?: string;
  updated_at?: string;
}

// User with role and agency
export interface User {
  id: string;
  agency_id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  phone?: string;
  
  // Timestamps
  last_login?: string;
  created_at: string;
  invited_at?: string;
  invited_by?: string; // user_id who invited
}

// Subscription details
export interface Subscription {
  id: string;
  agency_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  
  // Billing
  billing_cycle: 'monthly' | 'annual';
  price_per_license: number;
  total_price: number;
  currency: 'USD' | 'EUR' | 'GBP';
  
  // Dates
  started_at: string;
  current_period_start: string;
  current_period_end: string;
  trial_ends_at?: string;
  cancelled_at?: string;
  
  // Payment
  payment_method?: 'card' | 'invoice';
  last_payment_date?: string;
  next_payment_date?: string;
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  agency_id: string;
  user_id: string;
  user_name: string;
  
  // Action details
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'send' | 'login' | 'logout';
  resource_type: 'project' | 'budget' | 'item' | 'user' | 'agency' | 'settings' | 'library';
  resource_id: string;
  resource_name?: string;
  
  // Change details
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  
  // Metadata
  ip_address?: string;
  user_agent?: string;
  
  // Timestamp
  created_at: string;
}

// Project Type Template
export interface ProjectType {
  id: string;
  agency_id: string;
  name: string;
  description?: string;
  
  // Default rooms for this project type
  default_rooms: string[];
  
  // Default line items
  default_general_items: string[]; // item library IDs
  default_room_items: Record<string, string[]>; // room name -> item IDs
  
  created_at: string;
  updated_at?: string;
}

// Room Template
export interface RoomTemplate {
  id: string;
  agency_id: string;
  name: string;
  description?: string;
  
  // Default line items for this room
  default_items: string[]; // item library IDs
  
  created_at: string;
  updated_at?: string;
}

// Platform-wide analytics
export interface PlatformAnalytics {
  // Agency metrics
  total_agencies: number;
  active_agencies: number;
  trial_agencies: number;
  
  // User metrics
  total_users: number;
  active_users_today: number;
  active_users_this_week: number;
  active_users_this_month: number;
  
  // Revenue metrics
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  
  // Engagement metrics
  approvals_this_week: number;
  approvals_this_month: number;
  average_approval_value: number;
  
  // Budget metrics
  total_budgets: number;
  approved_budgets: number;
  budgets_this_month: number;
  
  // Project metrics
  total_projects: number;
  projects_this_month: number;
}

// Agency-wide analytics
export interface AgencyAnalytics {
  // Team metrics
  total_users: number;
  active_users: number;
  
  // Project metrics
  total_projects: number;
  active_projects: number;
  
  // Budget metrics
  total_budgets: number;
  approved_budgets: number;
  budgets_in_draft: number;
  budgets_pending_approval: number;
  
  // Financial metrics
  total_approved_value: number;
  average_budget_size: number;
  actual_vs_budgeted_variance: number; // percentage
  
  // Time metrics
  average_approval_turnaround_days: number;
  budgets_this_month: number;
  approvals_this_month: number;
}