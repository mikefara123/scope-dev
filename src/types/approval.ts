export interface BudgetApproval {
  id: string;
  budgetId: string;
  budgetVersion: number;
  sentBy: string; // User ID
  sentByName: string;
  sentAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string; // Customer name
  approvedAt?: Date;
  customerNotes?: string;
  customerEmail: string[];
  ccEmails: string[];
  approvalToken: string; // Unique token for accessing approval page
  displayOptions: ApprovalDisplayOptions;
  budgetSnapshot: any; // Full budget data at time of approval
  ipAddress?: string;
  userAgent?: string;
}

export interface ApprovalDisplayOptions {
  showLineItems: boolean;
  showRoomSummary: boolean;
  costBreakdown: 'detailed' | 'summary' | 'product-only';
  showMarkup: boolean;
  showShipping: boolean;
  showTax: boolean;
  includeNotes: boolean;
  customMessage?: string;
}

export interface ApprovalHistory {
  budgetId: string;
  approvals: BudgetApproval[];
  currentApproval?: BudgetApproval;
  isLocked: boolean;
  lockedAt?: Date;
  lockedBy?: string;
}
