// Mock data for multi-tenant system
import type { Agency, User, Subscription, ProjectType, RoomTemplate, PlatformAnalytics, AgencyAnalytics } from '@/types/multi-tenant';
import { UserRole } from '@/types/multi-tenant';

// ========================================
// AGENCIES
// ========================================

export const mockAgencies: Agency[] = [
  {
    id: 'agency-1',
    name: 'Luxe Interiors Design Studio',
    type: 'company',
    status: 'active',
    subscription_tier: 'professional',
    total_licenses: 10,
    used_licenses: 7,
    theme_colors: {
      primary: '#1a365d',
      secondary: '#319795',
      background: '#ffffff',
    },
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    address: '123 Design Ave, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    website: 'https://luxeinteriors.com',
    tax_id: '12-3456789',
    default_product_markup: 35,
    default_shipping_percentage: 15,
    default_other_cost_percentage: 10,
    export_preferences: {
      show_client_product_cost: true,
      show_other_costs: true,
      show_shipping: true,
      show_sales_tax: true,
      show_total_item_cost: true,
      display_mode: 'line_item',
    },
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'agency-2',
    name: 'Modern Living Co.',
    type: 'company',
    status: 'active',
    subscription_tier: 'starter',
    total_licenses: 3,
    used_licenses: 3,
    theme_colors: {
      primary: '#2c5282',
      secondary: '#38b2ac',
      background: '#f7fafc',
    },
    default_product_markup: 30,
    default_shipping_percentage: 12,
    default_other_cost_percentage: 8,
    export_preferences: {
      show_client_product_cost: true,
      show_other_costs: false,
      show_shipping: true,
      show_sales_tax: true,
      show_total_item_cost: true,
      display_mode: 'summary',
    },
    created_at: '2024-03-20T14:30:00Z',
  },
  {
    id: 'agency-3',
    name: 'Sarah Chen Design',
    type: 'individual',
    status: 'trial',
    subscription_tier: 'starter',
    total_licenses: 1,
    used_licenses: 1,
    theme_colors: {
      primary: '#1a365d',
      secondary: '#319795',
      background: '#ffffff',
    },
    default_product_markup: 40,
    default_shipping_percentage: 15,
    default_other_cost_percentage: 10,
    export_preferences: {
      show_client_product_cost: true,
      show_other_costs: true,
      show_shipping: true,
      show_sales_tax: true,
      show_total_item_cost: true,
      display_mode: 'line_item',
    },
    created_at: '2025-01-10T09:00:00Z',
    trial_ends_at: '2025-02-10T09:00:00Z',
  },
];

// ========================================
// USERS
// ========================================

export const mockUsers: User[] = [
  // Platform Admin
  {
    id: 'user-platform-admin',
    agency_id: 'platform', // Special agency ID for platform admins
    email: 'admin@projectclarity.com',
    name: 'Platform Administrator',
    role: UserRole.PLATFORM_ADMIN,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2025-01-28T08:30:00Z',
  },
  
  // Agency 1 - Luxe Interiors (Company)
  {
    id: 'user-1',
    agency_id: 'agency-1',
    email: 'admin@luxeinteriors.com',
    name: 'Jennifer Martinez',
    role: UserRole.AGENCY_ADMIN,
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    created_at: '2024-01-15T10:00:00Z',
    last_login: '2025-01-28T09:00:00Z',
  },
  {
    id: 'user-2',
    agency_id: 'agency-1',
    email: 'emily@luxeinteriors.com',
    name: 'Emily Thompson',
    role: UserRole.GENERAL_USER,
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    created_at: '2024-01-16T11:00:00Z',
    last_login: '2025-01-27T16:30:00Z',
  },
  {
    id: 'user-3',
    agency_id: 'agency-1',
    email: 'michael@luxeinteriors.com',
    name: 'Michael Johnson',
    role: UserRole.GENERAL_USER,
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    created_at: '2024-01-16T11:00:00Z',
    last_login: '2025-01-28T07:45:00Z',
  },
  {
    id: 'user-4',
    agency_id: 'agency-1',
    email: 'lisa@luxeinteriors.com',
    name: 'Lisa Anderson',
    role: UserRole.GENERAL_USER,
    status: 'active',
    created_at: '2024-02-01T10:00:00Z',
    last_login: '2025-01-26T14:20:00Z',
  },
  {
    id: 'user-5',
    agency_id: 'agency-1',
    email: 'robert@luxeinteriors.com',
    name: 'Robert Davis',
    role: UserRole.READ_ONLY_USER,
    status: 'active',
    created_at: '2024-03-15T09:00:00Z',
    last_login: '2025-01-28T08:00:00Z',
  },
  
  // Agency 2 - Modern Living Co.
  {
    id: 'user-6',
    agency_id: 'agency-2',
    email: 'admin@modernliving.com',
    name: 'David Wilson',
    role: UserRole.AGENCY_ADMIN,
    status: 'active',
    created_at: '2024-03-20T14:30:00Z',
    last_login: '2025-01-27T18:00:00Z',
  },
  {
    id: 'user-7',
    agency_id: 'agency-2',
    email: 'amanda@modernliving.com',
    name: 'Amanda Rodriguez',
    role: UserRole.GENERAL_USER,
    status: 'active',
    created_at: '2024-03-21T10:00:00Z',
    last_login: '2025-01-28T09:30:00Z',
  },
  {
    id: 'user-8',
    agency_id: 'agency-2',
    email: 'james@modernliving.com',
    name: 'James Parker',
    role: UserRole.GENERAL_USER,
    status: 'active',
    created_at: '2024-04-10T11:00:00Z',
    last_login: '2025-01-25T15:00:00Z',
  },
  
  // Agency 3 - Sarah Chen Design (Individual)
  {
    id: 'user-9',
    agency_id: 'agency-3',
    email: 'sarah@sarahchendesign.com',
    name: 'Sarah Chen',
    role: UserRole.AGENCY_ADMIN,
    status: 'active',
    created_at: '2025-01-10T09:00:00Z',
    last_login: '2025-01-28T10:00:00Z',
  },
];

// Default user for development (Agency Admin at Luxe Interiors)
export const mockCurrentUser: User = mockUsers[1]; // Jennifer Martinez

// ========================================
// SUBSCRIPTIONS
// ========================================

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    agency_id: 'agency-1',
    tier: 'professional',
    status: 'active',
    billing_cycle: 'annual',
    price_per_license: 49,
    total_price: 490,
    currency: 'USD',
    started_at: '2024-01-15T10:00:00Z',
    current_period_start: '2025-01-15T10:00:00Z',
    current_period_end: '2026-01-15T10:00:00Z',
    payment_method: 'card',
    last_payment_date: '2025-01-15T10:00:00Z',
    next_payment_date: '2026-01-15T10:00:00Z',
  },
  {
    id: 'sub-2',
    agency_id: 'agency-2',
    tier: 'starter',
    status: 'active',
    billing_cycle: 'monthly',
    price_per_license: 39,
    total_price: 117,
    currency: 'USD',
    started_at: '2024-03-20T14:30:00Z',
    current_period_start: '2025-01-20T14:30:00Z',
    current_period_end: '2025-02-20T14:30:00Z',
    payment_method: 'card',
    last_payment_date: '2025-01-20T14:30:00Z',
    next_payment_date: '2025-02-20T14:30:00Z',
  },
  {
    id: 'sub-3',
    agency_id: 'agency-3',
    tier: 'starter',
    status: 'trial',
    billing_cycle: 'monthly',
    price_per_license: 39,
    total_price: 39,
    currency: 'USD',
    started_at: '2025-01-10T09:00:00Z',
    current_period_start: '2025-01-10T09:00:00Z',
    current_period_end: '2025-02-10T09:00:00Z',
    trial_ends_at: '2025-02-10T09:00:00Z',
  },
];

// ========================================
// PROJECT TYPES
// ========================================

export const mockProjectTypes: ProjectType[] = [
  {
    id: 'pt-1',
    agency_id: 'agency-1',
    name: 'Residential - Full Home',
    description: 'Complete home interior design project',
    default_rooms: ['Living Room', 'Dining Room', 'Kitchen', 'Primary Bedroom', 'Guest Bedroom', 'Bathroom'],
    default_general_items: [],
    default_room_items: {},
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'pt-2',
    agency_id: 'agency-1',
    name: 'Commercial - Office',
    description: 'Office space design',
    default_rooms: ['Reception', 'Conference Room', 'Open Office', 'Private Offices', 'Break Room'],
    default_general_items: [],
    default_room_items: {},
    created_at: '2024-01-15T10:00:00Z',
  },
];

// ========================================
// ROOM TEMPLATES
// ========================================

export const mockRoomTemplates: RoomTemplate[] = [
  {
    id: 'rt-1',
    agency_id: 'agency-1',
    name: 'Living Room',
    description: 'Standard living room setup',
    default_items: [],
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'rt-2',
    agency_id: 'agency-1',
    name: 'Primary Bedroom',
    description: 'Master bedroom with ensuite',
    default_items: [],
    created_at: '2024-01-15T10:00:00Z',
  },
];

// ========================================
// ANALYTICS
// ========================================

export const mockPlatformAnalytics: PlatformAnalytics = {
  total_agencies: 3,
  active_agencies: 2,
  trial_agencies: 1,
  total_users: 9,
  active_users_today: 7,
  active_users_this_week: 8,
  active_users_this_month: 9,
  mrr: 3647, // (490 + 117 + 0) monthly equivalent
  arr: 43764,
  approvals_this_week: 12,
  approvals_this_month: 48,
  average_approval_value: 125000,
  total_budgets: 156,
  approved_budgets: 98,
  budgets_this_month: 23,
  total_projects: 89,
  projects_this_month: 14,
};

export const mockAgencyAnalytics: Record<string, AgencyAnalytics> = {
  'agency-1': {
    total_users: 5,
    active_users: 5,
    total_projects: 42,
    active_projects: 18,
    total_budgets: 87,
    approved_budgets: 56,
    budgets_in_draft: 12,
    budgets_pending_approval: 19,
    total_approved_value: 6850000,
    average_budget_size: 122321,
    actual_vs_budgeted_variance: -3.2, // 3.2% under budget
    average_approval_turnaround_days: 4.5,
    budgets_this_month: 12,
    approvals_this_month: 8,
  },
  'agency-2': {
    total_users: 3,
    active_users: 3,
    total_projects: 28,
    active_projects: 11,
    total_budgets: 52,
    approved_budgets: 32,
    budgets_in_draft: 8,
    budgets_pending_approval: 12,
    total_approved_value: 3920000,
    average_budget_size: 122500,
    actual_vs_budgeted_variance: 2.1, // 2.1% over budget
    average_approval_turnaround_days: 3.8,
    budgets_this_month: 8,
    approvals_this_month: 6,
  },
  'agency-3': {
    total_users: 1,
    active_users: 1,
    total_projects: 5,
    active_projects: 3,
    total_budgets: 8,
    approved_budgets: 4,
    budgets_in_draft: 2,
    budgets_pending_approval: 2,
    total_approved_value: 485000,
    average_budget_size: 121250,
    actual_vs_budgeted_variance: -1.5,
    average_approval_turnaround_days: 5.2,
    budgets_this_month: 3,
    approvals_this_month: 1,
  },
};

// Helper to get agency by ID
export function getAgencyById(agencyId: string): Agency | undefined {
  return mockAgencies.find(a => a.id === agencyId);
}

// Helper to get user by ID
export function getUserById(userId: string): User | undefined {
  return mockUsers.find(u => u.id === userId);
}

// Helper to get users by agency
export function getUsersByAgency(agencyId: string): User[] {
  return mockUsers.filter(u => u.agency_id === agencyId);
}

// Helper to get subscription by agency
export function getSubscriptionByAgency(agencyId: string): Subscription | undefined {
  return mockSubscriptions.find(s => s.agency_id === agencyId);
}

// Helper to get agency analytics
export function getAgencyAnalytics(agencyId: string): AgencyAnalytics | undefined {
  return mockAgencyAnalytics[agencyId];
}