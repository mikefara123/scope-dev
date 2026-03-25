# Project Clarity - Multi-Tenant Implementation Roadmap

## Current State Assessment

### ✅ Already Implemented (Single-Tenant Mode)
- Login page
- Dashboard with project/budget overview
- Projects management (create, edit, list)
- Budget Builder with spreadsheet functionality
- Budget Preview (client view)
- Budget Comparison
- Actual Cost Tracking
- Settings page
- Item Library management
- Send for Approval workflow

### 🔄 Needs Multi-Tenant Adaptation
- User authentication (add role-based auth)
- Data models (add agency_id to all tables)
- Navigation (role-based menu visibility)
- Permissions (RBAC implementation)
- Settings (split into Platform/Agency/User levels)

---

## Implementation Phases

## PHASE 1: Foundation - Multi-Tenancy Core (Week 1-2)

### 1.1 Data Model Updates
**Goal:** Add agency/company support to existing data structures

```typescript
// New Entities

interface Agency {
  id: string;
  name: string;
  type: 'individual' | 'company';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  subscription_tier: 'starter' | 'professional' | 'enterprise';
  total_licenses: number;
  used_licenses: number;
  theme_colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  logo_url?: string;
  created_at: string;
  trial_ends_at?: string;
}

interface User {
  id: string;
  agency_id: string;  // NEW - links user to agency
  email: string;
  name: string;
  role: 'platform_admin' | 'agency_admin' | 'general_user' | 'read_only';  // NEW
  status: 'active' | 'invited' | 'suspended';
  last_login?: string;
  created_at: string;
}

interface Project {
  id: string;
  agency_id: string;  // NEW - isolate projects by agency
  // ... existing fields
}

interface Budget {
  id: string;
  agency_id: string;  // NEW - isolate budgets by agency
  // ... existing fields
}

// All existing entities need agency_id added
```

**Tasks:**
- [ ] Create Agency interface and mock data
- [ ] Add `agency_id` to all existing interfaces (Project, Budget, Customer, etc.)
- [ ] Add `role` field to User interface
- [ ] Update all mock data to include agency references

---

### 1.2 Role-Based Access Control (RBAC)
**Goal:** Implement permission system

```typescript
// src/lib/permissions.ts

export enum Permission {
  // Platform Admin only
  MANAGE_AGENCIES = 'manage_agencies',
  VIEW_PLATFORM_ANALYTICS = 'view_platform_analytics',
  MANAGE_PLATFORM_LIBRARY = 'manage_platform_library',
  
  // Agency Admin
  MANAGE_AGENCY_SETTINGS = 'manage_agency_settings',
  MANAGE_USERS = 'manage_users',
  MANAGE_ITEM_LIBRARY = 'manage_item_library',
  VIEW_AUDIT_LOG = 'view_audit_log',
  
  // General User
  CREATE_PROJECT = 'create_project',
  EDIT_PROJECT = 'edit_project',
  CREATE_BUDGET = 'create_budget',
  EDIT_BUDGET = 'edit_budget',
  SEND_APPROVAL = 'send_approval',
  TRACK_COSTS = 'track_costs',
  
  // Read-Only
  VIEW_PROJECT = 'view_project',
  VIEW_BUDGET = 'view_budget',
  EXPORT_BUDGET = 'export_budget',
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  platform_admin: [
    // All permissions
    ...Object.values(Permission)
  ],
  
  agency_admin: [
    Permission.MANAGE_AGENCY_SETTINGS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_ITEM_LIBRARY,
    Permission.VIEW_AUDIT_LOG,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.CREATE_BUDGET,
    Permission.EDIT_BUDGET,
    Permission.SEND_APPROVAL,
    Permission.TRACK_COSTS,
    Permission.VIEW_PROJECT,
    Permission.VIEW_BUDGET,
    Permission.EXPORT_BUDGET,
  ],
  
  general_user: [
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.CREATE_BUDGET,
    Permission.EDIT_BUDGET,
    Permission.SEND_APPROVAL,
    Permission.TRACK_COSTS,
    Permission.VIEW_PROJECT,
    Permission.VIEW_BUDGET,
    Permission.EXPORT_BUDGET,
  ],
  
  read_only: [
    Permission.VIEW_PROJECT,
    Permission.VIEW_BUDGET,
    Permission.EXPORT_BUDGET,
  ],
};

export function hasPermission(user: User, permission: Permission): boolean {
  return rolePermissions[user.role]?.includes(permission) ?? false;
}

export function canAccessProject(user: User, project: Project): boolean {
  // Platform admin can access all
  if (user.role === 'platform_admin') return true;
  
  // Must be same agency
  if (user.agency_id !== project.agency_id) return false;
  
  // Agency admin can access all agency projects
  if (user.role === 'agency_admin') return true;
  
  // General/Read-only users can only access assigned projects
  return project.collaborators?.includes(user.id) ?? false;
}
```

**Tasks:**
- [ ] Create permissions.ts file
- [ ] Define all permissions
- [ ] Create role-to-permission mapping
- [ ] Create helper functions (hasPermission, canAccess, etc.)

---

### 1.3 Authentication Context Update
**Goal:** Track current user and agency

```typescript
// src/contexts/AuthContext.tsx

interface AuthContextType {
  user: User | null;
  agency: Agency | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  canAccessProject: (project: Project) => boolean;
  isLoading: boolean;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  
  // Load user and agency data on mount
  useEffect(() => {
    loadCurrentUser();
  }, []);
  
  const hasPermission = (permission: Permission) => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) ?? false;
  };
  
  // ... implementation
}
```

**Tasks:**
- [ ] Create AuthContext
- [ ] Add agency state
- [ ] Add permission checking methods
- [ ] Create ProtectedRoute component
- [ ] Update Login page to set user + agency

---

### 1.4 Navigation Updates
**Goal:** Show/hide menu items based on role

```typescript
// src/components/layouts/RootLayout.tsx

function getNavigationItems(user: User): NavItem[] {
  const items: NavItem[] = [];
  
  // Platform Admin gets special admin nav
  if (user.role === 'platform_admin') {
    items.push(
      { label: 'Platform Dashboard', path: '/admin', icon: LayoutDashboard },
      { label: 'Agencies', path: '/admin/agencies', icon: Building2 },
      { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      { label: 'Billing', path: '/admin/billing', icon: CreditCard },
    );
  }
  
  // Everyone else sees standard nav
  items.push({ label: 'Dashboard', path: '/', icon: LayoutDashboard });
  
  if (hasPermission(user, Permission.CREATE_PROJECT)) {
    items.push({ label: 'Projects', path: '/projects', icon: Briefcase });
  }
  
  if (hasPermission(user, Permission.CREATE_BUDGET)) {
    items.push({ label: 'Budgets', path: '/budgets', icon: Receipt });
  }
  
  items.push({ label: 'Library', path: '/library', icon: BookOpen });
  
  if (hasPermission(user, Permission.MANAGE_AGENCY_SETTINGS)) {
    items.push({ label: 'Settings', path: '/settings', icon: Settings });
    items.push({ label: 'Users', path: '/settings/users', icon: Users });
    items.push({ label: 'Audit Log', path: '/settings/audit', icon: FileText });
  }
  
  return items;
}
```

**Tasks:**
- [ ] Update navigation to be role-aware
- [ ] Hide admin menu items from non-admins
- [ ] Show platform admin menu for platform admins
- [ ] Add permission checks to all routes

---

## PHASE 2: Platform Admin Portal (Week 3-4)

### 2.1 Platform Admin Dashboard
**New Page:** `/admin/dashboard`

**Components:**
- Agency overview cards (total agencies, active users, MRR)
- User engagement charts
- Approvals per week (all agencies)
- Revenue metrics
- Recent agency activity

**Tasks:**
- [ ] Create PlatformAdminDashboard component
- [ ] Create agency stats cards
- [ ] Create engagement charts (recharts)
- [ ] Add route to /admin/dashboard

---

### 2.2 Agency Management
**New Page:** `/admin/agencies`

**Features:**
- Table of all agencies
- Filter by status, tier, date
- Search by name
- Create new agency modal
- Edit agency modal
- View agency details page

**Components:**
- AgenciesList table
- CreateAgencyModal
- EditAgencyModal
- AgencyDetailView

**Tasks:**
- [ ] Create agencies list page
- [ ] Create agency table with sorting/filtering
- [ ] Create add agency modal
- [ ] Create edit agency modal
- [ ] Create agency detail view
- [ ] Add suspend/activate actions

---

### 2.3 Platform Analytics
**New Page:** `/admin/analytics`

**Dashboards:**
- User engagement (approvals, budgets created)
- Revenue analytics (MRR, growth, churn)
- Regional breakdown (map view)
- Usage metrics (features used, adoption rates)

**Tasks:**
- [ ] Create analytics dashboard
- [ ] Add engagement charts
- [ ] Add revenue charts
- [ ] Add regional map visualization
- [ ] Add export to CSV/PDF

---

### 2.4 Platform Billing
**New Page:** `/admin/billing`

**Features:**
- All agency subscriptions
- Payment history
- Failed payments
- Refunds
- Promo codes

**Tasks:**
- [ ] Create billing dashboard
- [ ] Create subscription list
- [ ] Create payment history table
- [ ] Add refund workflow
- [ ] Add promo code management

---

### 2.5 Platform Library Management
**New Page:** `/admin/library`

**Features:**
- Manage platform-wide item library template
- Define default categories
- Set default quality tiers
- Push updates to agencies
- Track agency adoption

**Tasks:**
- [ ] Create platform library page
- [ ] Allow editing platform template
- [ ] Create "push to agencies" workflow
- [ ] Show adoption status per agency

---

## PHASE 3: Agency Admin Features (Week 5-6)

### 3.1 Company Settings Enhancement
**Update Page:** `/settings`

**Split into Tabs:**
- **General**: Company info, logo
- **Theme**: Color customization with preview
- **Budget Defaults**: Markup, shipping, tax defaults
- **Export Preferences**: Display options
- **Integrations**: Google Maps API, DocuSign

**Tasks:**
- [ ] Split settings into tabbed interface
- [ ] Add theme customizer with live preview
- [ ] Add budget defaults section
- [ ] Add export preferences
- [ ] Save settings per agency

---

### 3.2 User Management
**New Page:** `/settings/users`

**Features:**
- List all agency users
- Show role, status, last login
- Invite new user (send email)
- Edit user role
- Suspend/activate user
- License utilization display

**Components:**
- UsersList table
- InviteUserModal
- EditUserModal
- LicenseCounter

**Tasks:**
- [ ] Create users management page
- [ ] Create user table with actions
- [ ] Create invite user modal (email)
- [ ] Create edit user modal (role change)
- [ ] Show license count (X of Y used)
- [ ] Add suspend/activate actions

---

### 3.3 Item Library Enhancement
**Update Page:** `/library`

**Add Agency-Level Features:**
- Version history
- Usage analytics (per item)
- Bulk import/export
- Approve platform updates
- Custom categories

**Tasks:**
- [ ] Add version history to library
- [ ] Show usage stats per item
- [ ] Add bulk import from CSV
- [ ] Add bulk export to CSV
- [ ] Show pending platform updates with approve/reject

---

### 3.4 Project Type & Room Templates
**New Page:** `/settings/templates`

**Features:**
- Define project types
- Set default rooms per project type
- Create room templates
- Assign default line items per room

**Components:**
- ProjectTypesList
- CreateProjectTypeModal
- RoomTemplateEditor

**Tasks:**
- [ ] Create templates management page
- [ ] Create project type CRUD
- [ ] Create room template editor
- [ ] Link templates to project creation

---

### 3.5 Audit Log
**New Page:** `/settings/audit`

**Features:**
- Complete history of changes
- Filter by user, project, action type, date
- Search by keyword
- Export audit log

**Tasks:**
- [ ] Create audit log page
- [ ] Create audit log table with filters
- [ ] Add search functionality
- [ ] Add export to CSV

---

## PHASE 4: Enhanced Designer Experience (Week 7-8)

### 4.1 Interim Budget Workflow
**Update:** Budget Builder

**New Features:**
- "Create Interim Budget" button on approved budgets
- Link to original budget (chain of custody)
- Track added/removed items
- "Released?" checkbox column
- Variance calculations

**Tasks:**
- [ ] Add "Create Interim" button to approved budgets
- [ ] Link interim to original (parent_budget_id)
- [ ] Add "Released?" column to budget builder
- [ ] Calculate variance vs. parent budget
- [ ] Prevent deletion of released items

---

### 4.2 Budget Comparison Enhancements
**Update:** `/budgets/:budgetId/compare`

**Already Implemented:**
- ✅ Side-by-side view
- ✅ Overlay view
- ✅ Released checkbox
- ✅ Visual indicators

**Additional Enhancements:**
- [ ] Compare across multiple versions (not just 2)
- [ ] Timeline view of all budget versions
- [ ] Highlight released items that changed

---

### 4.3 Actual Cost Tracking Enhancements
**Update:** `/budgets/:budgetId/actual-costs`

**Add:**
- Variance alerts (over budget items in red)
- Project-level variance summary
- Financial reconciliation section
- Link to closeout report

**Tasks:**
- [ ] Add variance alerts
- [ ] Add project summary card
- [ ] Create financial reconciliation section
- [ ] Link to closeout report

---

### 4.4 Advanced Reporting
**New Page:** `/reports`

**Report Types:**
- Budget Tracking Report
- Variance Report
- Closeout Report
- Customer Financial Statement

**Tasks:**
- [ ] Create reports page
- [ ] Create budget tracking report generator
- [ ] Create variance report with charts
- [ ] Create closeout report template
- [ ] Create customer financial statement
- [ ] Add export to PDF for all reports

---

## PHASE 5: Customer Portal (Week 9-10)

### 5.1 Digital Signature Integration
**Options:**
- DocuSign API integration (premium)
- OR internal signature pad (free)

**Tasks:**
- [ ] Research DocuSign API pricing
- [ ] If feasible: Integrate DocuSign
- [ ] If not: Create signature pad component using canvas
- [ ] Add signature to approval workflow
- [ ] Save signed PDF

---

### 5.2 Approval Portal Enhancement
**Update:** `/budgets/:budgetId/preview`

**Features:**
- Cleaner customer-facing design
- Clear approval language
- Signature field (DocuSign or internal)
- Notes field for customer
- Legal authorization text
- Approve/Reject buttons

**Tasks:**
- [ ] Redesign preview for customer experience
- [ ] Add signature field
- [ ] Add approval language
- [ ] Add notes field
- [ ] Create approve/reject workflow
- [ ] Send notification to designer

---

### 5.3 Approval Notifications
**Email Templates:**
- Budget sent for approval (to customer)
- Budget approved (to designer)
- Budget rejected (to designer with notes)
- Interim budget sent for re-approval

**Tasks:**
- [ ] Create email template system
- [ ] Create 4 email templates
- [ ] Integrate email sending (mock for now)
- [ ] Add notification preferences to settings

---

## PHASE 6: Polish & Production Ready (Week 11-12)

### 6.1 Onboarding Flows

**First-time Platform Admin:**
1. Create platform account
2. Set platform defaults
3. Create first agency
4. Invite agency admin

**First-time Agency Admin:**
1. Accept invitation
2. Complete company profile
3. Customize theme
4. Set budget defaults
5. Invite team members
6. Review item library

**First-time Designer:**
1. Accept invitation
2. Create first project
3. Create first budget
4. Send for approval (guided tour)

**Tasks:**
- [ ] Create onboarding wizard for platform admin
- [ ] Create onboarding wizard for agency admin
- [ ] Create onboarding wizard for designer
- [ ] Add tooltips and guided tours (use intro.js or similar)
- [ ] Create help documentation

---

### 6.2 Error Handling & Recovery

**Scenarios:**
- User edits budget → realizes mistake → wants to undo
- Customer rejects budget → designer needs to revise
- Multi-user conflict (two designers editing same budget)
- Network error during approval submission

**Tasks:**
- [ ] Add undo/redo functionality to budget builder
- [ ] Add auto-save with conflict detection
- [ ] Add rejection workflow (email + status change)
- [ ] Add retry logic for failed submissions
- [ ] Add error boundaries with user-friendly messages

---

### 6.3 Performance Optimization

**Large Budget Handling:**
- Budgets with 100+ line items
- Virtual scrolling for large tables
- Lazy loading of budget items
- Debounced calculations

**Tasks:**
- [ ] Implement virtual scrolling for budget builder (react-window)
- [ ] Optimize calculation performance
- [ ] Add loading states for slow operations
- [ ] Add pagination for large project lists

---

### 6.4 Security & Data Validation

**Security:**
- Row-level security (agency isolation)
- Input sanitization
- XSS protection
- CSRF protection

**Validation:**
- Email validation
- Phone number validation
- Currency validation
- Required field validation

**Tasks:**
- [ ] Add input validation to all forms
- [ ] Sanitize user inputs
- [ ] Add CSRF tokens
- [ ] Implement row-level security
- [ ] Add rate limiting

---

## Migration Strategy (If Deploying to Existing Users)

### Option 1: Fresh Start (Recommended for MVP)
- Launch as new multi-tenant platform
- Existing users migrate manually
- Provide migration tools/support

### Option 2: Data Migration
1. Create default agency for existing users
2. Migrate all existing data to agency
3. Assign all users to agency as "agency_admin"
4. Users can then invite team members

---

## Technology Stack Additions

### Backend (When Moving to Supabase)
- **Supabase Auth** with custom claims for roles
- **Row Level Security (RLS)** for agency isolation
- **Supabase Functions** for email sending, PDF generation
- **Supabase Storage** for logos, signatures, exports

### Frontend Libraries to Add
- [ ] `react-signature-canvas` - For signature pad (if not using DocuSign)
- [ ] `react-window` - Virtual scrolling for large budgets
- [ ] `intro.js` - Onboarding tours
- [ ] `react-pdf` - PDF generation/preview
- [ ] `react-email` - Email template creation

---

## Success Metrics

### Platform Admin Metrics
- Total agencies
- MRR growth
- Churn rate
- User engagement (DAU/MAU)
- Average budgets per agency

### Agency Admin Metrics
- Team utilization (active users / total licenses)
- Projects per month
- Approval rate
- Cost variance accuracy

### Designer Metrics
- Budgets created per week
- Approval turnaround time
- Customer satisfaction (if feedback collected)
- Project profitability

---

## Next Steps

### Immediate (This Week)
1. ✅ Document role structure (DONE)
2. ✅ Document implementation roadmap (DONE)
3. **Review and approve approach** with stakeholder
4. Begin Phase 1: Multi-tenancy foundation

### Short Term (Next 2 Weeks)
1. Implement RBAC system
2. Add agency context
3. Update navigation
4. Create platform admin dashboard

### Medium Term (Next 4-6 Weeks)
1. Build platform admin portal
2. Enhance agency admin features
3. Improve designer workflows

### Long Term (2-3 Months)
1. Customer portal with signatures
2. Advanced reporting
3. Onboarding flows
4. Production deployment with Supabase backend

---

## Questions for Review

1. **Subscription Model**: Should we implement Stripe for billing, or start with manual billing?

2. **DocuSign**: Is the cost acceptable, or should we build internal signature solution?

3. **Individual vs Company**: Should individual users have simplified UI, or same UI with features disabled?

4. **Platform Admin Access**: Should platform admins be able to impersonate agency admins for support?

5. **Data Migration**: Do you have existing users that need migration, or is this a fresh launch?

6. **Priority**: Which phase should we prioritize first?
   - Platform admin portal (SaaS owner needs)
   - Agency admin features (design firm needs)
   - Designer enhancements (end user needs)

7. **Approval Workflow**: Should customers need to create accounts, or anonymous link-based approval?

---

**Ready to begin implementation upon your approval of this roadmap!**
