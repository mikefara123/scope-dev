// Data types for Project Clarity

export type ProjectStatus = 'Active' | 'On Hold' | 'Completed';
export type BudgetStatus = 'Draft' | 'In Review (Internal)' | 'In Review (Client)' | 'Rejected' | 'Confirmed' | 'Tracking' | 'Completed' | 'Archived';
export type QualityLevel = 'Quality' | 'Premium' | 'Luxury' | 'UltraLux' | 'Custom';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  squareFootage: number;
}

export interface Phase {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  clientName: string;
  projectName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  status: ProjectStatus;
  contacts: Contact[];
  rooms: Room[];
  phases: Phase[];
  defaultQuality: QualityLevel;
  defaultMarkup: number;
  defaultShipping: number;
  defaultOther: number;
  totalBudgeted: number;
  approvedAmount: number;
  pendingAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetLineItem {
  id: string;
  itemNumber: number;
  itemName: string;
  category?: string; // Item category (Furniture, Lighting, etc.)
  details: string;
  phase: string;
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
  room: string;
  overrides?: {
    netCost?: boolean;
    quality?: boolean;
    shipping?: boolean;
    other?: boolean;
    tax?: boolean;
  };
}

export interface Budget {
  id: string;
  projectId: string;
  name: string;
  version: string;
  status: BudgetStatus;
  phase?: string;
  lineItems: BudgetLineItem[];
  subtotal: number;
  totalShipping: number;
  totalOther: number;
  totalTax: number;
  grandTotal: number;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  approvedAt?: Date;
  // Internal approval fields
  assignedApproverId?: string;
  internalApprovalStatus?: 'not_required' | 'pending' | 'approved' | 'rejected';
  internalApprovedBy?: string;
  internalApprovedAt?: Date;
  internalApprovalNotes?: string;
}

export interface LibraryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  unit: string;
  qualityPrice?: number;
  premiumPrice?: number;
  luxuryPrice?: number;
  ultraLuxPrice?: number;
  description: string;
  scope: 'global' | 'agency' | 'personal'; // global = platform-wide, agency = agency-specific, personal = user-specific
  agencyId?: string; // Set if scope is 'agency'
  createdBy?: string; // User ID who created it
  vendor?: string;
  sku?: string;
  imageUrl?: string;
  notes?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  type: 'budget_created' | 'budget_approved' | 'budget_sent' | 'project_created' | 'budget_revised';
  message: string;
  projectId?: string;
  budgetId?: string;
  timestamp: Date;
  user: string;
}