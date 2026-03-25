# Project Clarity - Multi-Tenant SaaS Role Structure

## User Role Hierarchy

```
Platform Admin (SaaS Owner)
    └── Agency Admin (Design Firm Admin)
        ├── Interior Designer (General User)
        ├── Interior Designer (General User)
        └── Read-Only User
```

---

## 1. PLATFORM ADMIN (SaaS Owner)

**Role:** Manages the entire SaaS platform, all agencies, and billing

### Dashboard Features
- **Agency Overview**
  - Total active agencies
  - Total active users across all agencies
  - Monthly recurring revenue (MRR)
  - Agency growth metrics
  
- **User Engagement Analytics**
  - Approvals per week (platform-wide)
  - Charts of approvals by agency
  - Average approval value (with range)
  - Approvals by region (designer location)
  - Platform adoption metrics

- **Revenue Dashboard**
  - Subscription revenue by agency
  - License utilization rates
  - Churn analysis
  - Revenue forecasts

### Agency Management
- **View All Agencies**
  - Company name
  - Admin contact
  - Active licenses / Total licenses
  - Subscription tier
  - Status (Active, Trial, Suspended, Cancelled)
  - Joined date
  - Last activity
  
- **Agency Actions**
  - Create new agency account
  - Edit agency details
  - Suspend/Activate agency
  - View agency audit log
  - Impersonate agency admin (support mode)

### Billing & Payments
- **Manage Agency Subscriptions**
  - View subscription status
  - Change subscription tier
  - Add/remove licenses
  - Process refunds
  - View payment history
  
- **Payment Configuration**
  - Set pricing tiers
  - Configure payment gateway
  - Manage promo codes/discounts
  - Set up trial periods

### Platform Configuration
- **Standard Item Library Template**
  - Define default item categories
  - Set default quality tiers (Good, Better, Best)
  - Populate base item library
  - Set default cost ranges
  - Push library updates to agencies
  
- **Budget Export Templates**
  - Define standard export formats
  - Configure PDF layouts
  - Set up email templates
  - Approval workflow templates

- **System Settings**
  - Platform-wide defaults
  - Feature flags (enable/disable features per tier)
  - Integration settings (DocuSign, payment gateways, Google Maps API)
  - Email/notification settings

### Reports & Analytics
- Platform usage reports
- Revenue reports
- User engagement reports
- Support ticket analytics

### User Management (Platform Level)
- View all users across all agencies
- Support mode access
- Manage platform admin accounts

---

## 2. AGENCY ADMIN (Design Firm Admin)

**Role:** Manages their design agency's account, users, and company-wide settings

### Dashboard Features
- **Agency Overview**
  - Active projects count
  - Active budgets count
  - Total approved budgets this month
  - Average budget size
  - Current budgets in process
  - Actual vs budgeted costs variance
  - Budgets by month (chart)

- **Team Activity**
  - User activity logs
  - Recent approvals
  - Projects by designer
  - Team performance metrics

### Company Settings

#### Theme Customization
- **Brand Colors**
  - Primary color
  - Secondary color
  - Background color
  - Choose from preset palettes or custom colors
  - Preview theme in real-time

#### Company Information
- Company name
- Company logo upload
- Address
- Phone
- Website
- Tax ID / Business registration

#### Export Preferences
- **Line-Item Budget Display Options**
  - Client Product Cost (show/hide)
  - Other Costs (show/hide)
  - Shipping & Freight (show/hide)
  - Sales Tax (show/hide)
  - Total Item Cost (show/hide)
  
- **Display Preferences**
  - Totaled by line item OR bottom summary
  - Logo placement on exports
  - Footer text customization

#### Global Budget Defaults
- Default Product Markup (%)
- Default Shipping & Freight (%)
- Default Other Cost (%)
- Standard line items for ALL new projects (General section)
- Standard line items for each room

### User & License Management

#### User Management
- **View All Company Users**
  - Name, email, role
  - Last login
  - Active projects
  - Status (Active, Invited, Suspended)
  
- **Add New Users**
  - Send invitation email
  - Assign role (Admin, General User, Read-Only)
  - Assign to projects
  
- **Edit User**
  - Change role
  - Reset password
  - Suspend/Activate
  - Remove from projects
  - Delete user

#### License Management
- View active licenses vs. total licenses
- Purchase additional licenses
- Assign licenses to users
- View license history

#### Role Definitions
- **Admin User**: Full access to all agency features
- **General User**: Can create/edit projects and budgets
- **Read-Only User**: Can view projects and budgets only

### Item Library Management

#### Library Overview
- View all items in table format
- Filter by category, cost range
- Search by name or description
- Sort by name, category, cost

#### Item Actions (3-dot menu)
- Edit Item
- Duplicate Item
- Delete Item (with confirmation)

#### Item Details
- Name
- Category (multi-select)
- Description
- Units (Quantity, Yards, Feet, Square Feet)
- Quality Tiers & Costs:
  - Good: $X
  - Better: $Y
  - Best: $Z
  
#### Library Analytics
- # of approved budgets using this item
- Average cost assigned in approved budgets
- Usage frequency

#### Library Versioning
- Version history tracking
- Revert to previous version
- Audit trail of changes

#### Platform Library Updates
- Review new items pushed by Platform Admin
- Approve/reject inclusion in agency library

### Project Type & Room Template Management

#### Project Types
- Define project types (Residential, Commercial, Hospitality, etc.)
- Set default rooms per project type
- Set default budget line items per project type

#### Room Templates
- Define standard room names
- Assign default line items per room
- Create room templates for quick setup

### Customer Management
- View all customers across all projects
- Customer details (name, email, phone, address)
- View projects by customer
- Customer notes and history
- Multiple projects per customer

### Subscription & Billing
- View current subscription tier
- Upgrade/downgrade subscription
- Add/remove licenses
- View payment history
- Update payment method
- View invoices

### Audit Log
- History of all changes in the agency tenant
- Searchable by project, user, date
- Filter by action type (created, edited, deleted, approved)
- Export audit logs

### Reports (Agency-Wide)
- Team performance reports
- Budget approval rates
- Revenue by project
- Customer reports
- Cost variance reports

---

## 3. INTERIOR DESIGNER (General User)

**Role:** Creates and manages budgets for client projects

### Dashboard
- **My Projects Overview**
  - Active projects count
  - Pending approvals
  - Recently updated budgets
  - Quick actions (New Project, New Budget)

- **My Activity**
  - Total approved budgets
  - Average budget size
  - Current budgets in process
  - Actual vs budgeted costs
  - My budgets by month

### Projects Tab

#### View Projects
- All projects (if admin) or Assigned projects
- Filter by status, customer, date
- Search by project name or customer

#### New Project (+ symbol)
- **Customer Information**
  - Customer Name 1
  - Customer Name 2
  - Customer Email (primary) - comma separated, validated
  - Customer Email (cc) - comma separated, validated
  - Customer Phone
  - Customer Notes
  
- **Project Details**
  - Project Address (Street, City, State, Zip, Country)
    - Google Maps smart lookup with auto-categorization
    - Auto-populate local sales tax
    - Auto-detect local currency
  - Project Square Feet
  - Project Type (dropdown from admin-defined types)
  
- **Project Setup**
  - Room/Area Names (freeform, comma separated)
  - Phase Names (if applicable)
  - Collaborators (assign other designers from team)

#### Edit Project
- Modify project details
- Add/remove collaborators
- Change status
- Archive project

#### Project Detail View
- Project info card
- Customer info card
- List of budgets for this project
- Quick actions (New Budget, View Customer)

### Customers Subtab
- View all my customers
- Edit customer information
- View projects by customer
- Customer notes

### Budgets Tab

#### View Budgets
- Organized by Project
- Filter by status (Draft, Sent, Approved, In Progress)
- Search by budget name or customer

#### New Budget (+ symbol)
- Must select a Project first
- Budget automatically set up with:
  - General section at top
  - Room sections (from project setup)
  - Miscellaneous Items at bottom

#### Budget Builder (Excel-like Spreadsheet)

**View Modes:**
- Organized by Room Name (default)
- Organized by Item Category

**Room/Section Structure:**
- Collapsible sections per room
- Line items within each room
- Subtotals per room
- Grand total at bottom

**Add Item Row:**
- Start typing item name
- Search shows matching items from library (name + category)
- AI suggestions if no exact match
- Option to "Add to Library" (sends request to admin)

**Item Row Columns:**
- Item Name (dropdown/searchable)
- Category (auto-filled from library)
- Description
- Quality Level (Good/Better/Best dropdown)
- Quantity
- Units
- Net Cost (auto-filled based on quality level)
- Markup % (default from settings, editable)
- Markup $ (calculated)
- Shipping % (default from settings, editable)
- Shipping $ (calculated)
- Other % (default from settings, editable)
- Other $ (calculated)
- Tax % (auto-filled from project location, editable)
- Tax $ (calculated)
- Total Item Cost (calculated)
- Released? (checkbox - for interim budgets only)
- Actual Net Cost (for cost tracking)
- Actual Shipping (for cost tracking)
- Actual Other (for cost tracking)

**Item Actions (3-dot menu):**
- Edit Item (unlock row for editing)
- Move Item
  - Within Room
  - To Other Room (select room)
- Duplicate Item
  - Within Room
  - To Other Room(s) (multi-select)
- Delete Item (with confirmation)

**Bulk Actions:**
- Ctrl+click to select multiple items
- 3-dot menu appears above top selected item
- Bulk move, duplicate, or delete

**Right Panel - Item Details:**
- When item selected, show detailed view
- Item image (if available)
- Full description
- Vendor information
- Notes
- Links

**Auto-Calculations:**
- All monetary values calculated in real-time
- Room subtotals
- Grand total
- Running totals update as items added/edited

**Budget Status:**
- Draft (editable)
- Sent for Approval (locked, view-only)
- Approved (locked, cannot edit)
- Revision in Progress (interim budget)

#### Send for Approval

**Approval Export Workflow:**
1. Click "Send for Approval" button
2. Confirm email recipients
   - Primary (from project customer email)
   - CC (from project customer cc email)
   - Edit if needed
3. Select display options:
   - Line item detail with all costs
   - Summary by room only
   - Product cost only (tax/shipping at bottom)
4. Preview PDF export
5. Send for approval
6. Customer receives email with link to approval portal

**Digital Signature:**
- Integration with DocuSign (if available)
- OR internal signature pad for customer approval
- Confirmation language display
- Legal authorization text

**Approval Portal (Customer View):**
- Clean, minimalist budget display
- Clear totals and sections
- Confirmation language: "I approve this budget for [Project Name]"
- Signature field
- Option to add notes
- Approve or Reject buttons

**Post-Approval:**
- Designer notified via email
- Budget locked (cannot be edited)
- Approval date/time stamped
- Customer notes saved
- PDF snapshot saved

#### Interim Budgets

**Create Interim Budget:**
- Based on prior approved version
- Digital fingerprint links to origin budget
- Chain of custody tracking

**Interim Budget Features:**
- Add/delete items (tracked)
- Edit quantities/costs
- New "Released?" column for purchased items
- Variance tracking to prior approved version

**Interim Approval Export:**
- Same workflow as initial approval
- PLUS option to show:
  - Added items (green shaded rows)
  - Removed items (red shaded, strikethrough)
  - Variance summary at bottom:
    - Prior approved budget total
    - Current budget total
    - Net change
  - Purchasing summary:
    - Total cost of released items
    - Remaining budget

**Released Items:**
- Checkbox indicates item has been purchased
- Released items cannot be removed
- Can only be modified if necessary
- Tracks actual costs vs. budgeted

### Budget Comparison
- Compare any two budget versions
- Side-by-side or overlay view
- Visual indicators (green/red/yellow)
- Released items highlighted
- Export comparison report

### Actual Cost Tracking
- Log actual costs per item:
  - Actual net cost
  - Actual shipping
  - Actual other costs
- Variance to budget calculations
- Cost tracking by room or project
- Financial reconciliation

### Library Tab (Read-Only for General Users)
- View item library
- Search and filter
- Reference costs
- Cannot edit (admin only)

### Reports
- My budget tracking report
- Actual vs. budget variance
- Project closeout reports
- Customer financial reports

**Budget Tracking Report:**
- Actual cost vs. budget by line item or room
- Variance at item, room, or project level
- Option to show added/removed items
- Financial tracking:
  - Deposits received to date
  - Value of released items
  - Remaining deposit balance
  - Balance owed from customer

**Closeout Export:**
- 100% actual costs
- Variance to original budget (optional)
- Final deposit reconciliation
- Project profit/loss summary

### Settings (Read-Only)
- View company settings
- View theme
- Cannot modify (admin only)

---

## 4. READ-ONLY USER

**Role:** Can view projects and budgets but cannot edit

### Permissions
- ✅ View projects (assigned only)
- ✅ View budgets
- ✅ View customers
- ✅ View item library
- ✅ View reports
- ✅ Export/print budgets
- ❌ Create/edit projects
- ❌ Create/edit budgets
- ❌ Send for approval
- ❌ Modify any settings
- ❌ Manage users

---

## Feature Access Matrix

| Feature | Platform Admin | Agency Admin | General User | Read-Only |
|---------|----------------|--------------|--------------|-----------|
| **Manage Agencies** | ✅ | ❌ | ❌ | ❌ |
| **Platform Analytics** | ✅ | ❌ | ❌ | ❌ |
| **Billing (All Agencies)** | ✅ | ❌ | ❌ | ❌ |
| **Company Settings** | ✅ (all) | ✅ (own) | 👁️ View | 👁️ View |
| **Theme Customization** | ✅ | ✅ | ❌ | ❌ |
| **User Management** | ✅ (all) | ✅ (own) | ❌ | ❌ |
| **License Management** | ✅ | ✅ | ❌ | ❌ |
| **Item Library Management** | ✅ (platform) | ✅ (agency) | Request | 👁️ View |
| **Project Type Management** | ✅ | ✅ | ❌ | ❌ |
| **Create Projects** | ✅ | ✅ | ✅ | ❌ |
| **Edit Projects** | ✅ (all) | ✅ (all) | ✅ (assigned) | ❌ |
| **View Projects** | ✅ (all) | ✅ (all) | ✅ (assigned) | 👁️ (assigned) |
| **Create Budgets** | ✅ | ✅ | ✅ | ❌ |
| **Edit Budgets** | ✅ (all) | ✅ (all) | ✅ (own) | ❌ |
| **Send for Approval** | ✅ | ✅ | ✅ | ❌ |
| **View Approvals** | ✅ (all) | ✅ (all) | ✅ (own) | 👁️ (assigned) |
| **Actual Cost Tracking** | ✅ | ✅ | ✅ | ❌ |
| **Reports (Agency)** | ✅ (all) | ✅ (own) | ✅ (own) | 👁️ (assigned) |
| **Audit Log** | ✅ (all) | ✅ (own) | ❌ | ❌ |
| **Subscription Management** | ✅ (all) | ✅ (own) | ❌ | ❌ |

---

## Account Types

### Individual User Account
- Single user environment
- Contains all admin privileges
- No role assignment needed
- Functions as both Agency Admin and General User
- Full control over settings, library, projects, budgets

### Company User Account
- Design firm with multiple users
- Allocated base licenses (e.g., 5 users)
- Additional licenses available for purchase
- Role assignment required:
  - User Admin (Agency Admin)
  - General User
  - Read-Only User
- Collaborative environment

---

## Implementation Priority

### Phase 1: Core Multi-Tenancy
1. Agency/Company data model
2. User role definitions (Platform Admin, Agency Admin, General User, Read-Only)
3. Role-based access control (RBAC)
4. Agency-level settings and isolation

### Phase 2: Platform Admin Portal
1. Agency management dashboard
2. User engagement analytics
3. Billing & subscription management
4. Platform library management

### Phase 3: Agency Admin Features
1. Company settings (theme, defaults)
2. User & license management
3. Item library customization
4. Audit logs

### Phase 4: Enhanced Designer Experience
1. Interim budgets with variance tracking
2. Released items tracking
3. Actual cost logging
4. Budget comparison views

### Phase 5: Customer Portal
1. Approval workflow
2. Digital signature integration
3. Customer view of budgets
4. Approval notifications

---

## Key UX Flows by Role

### Platform Admin
1. Onboard new agency → Set up account → Allocate licenses
2. Monitor platform health → Review analytics → Identify issues
3. Push library update → Agencies review → Approve/reject
4. Handle agency support request → Impersonate admin → Resolve issue

### Agency Admin
1. First-time setup → Customize theme → Configure library → Set defaults
2. Add new user → Assign role → Invite → User accepts
3. Review audit log → Find change → Contact user → Discuss
4. Purchase additional licenses → Update subscription → Assign to users

### Interior Designer
1. New project → Add customer → Set up rooms → Create first budget
2. Build budget → Add items → Calculate totals → Send for approval
3. Customer approves → Lock budget → Start purchasing → Track actual costs
4. Create interim budget → Show variance → Re-send for approval
5. Project complete → Closeout report → Reconcile financials

### Read-Only User
1. Review project → View budget → Export PDF → Share with team
2. Check approval status → View customer notes → Follow up internally

---

## Data Isolation & Security

- **Platform Admin**: Access to all agencies' data
- **Agency Admin**: Access only to their agency's data
- **General User**: Access only to assigned projects
- **Read-Only User**: View-only access to assigned projects

**Row-Level Security:**
- All queries filter by `agency_id`
- Users can only see data within their agency
- Platform admin bypasses agency filter

**Audit Trail:**
- All actions logged with user, timestamp, action type
- Changes tracked at field level
- Immutable audit log

---

## Subscription Tiers (Example)

### Starter
- 1-3 users
- 10 active projects
- Basic item library
- Email support

### Professional
- 4-10 users
- Unlimited projects
- Custom item library
- Priority support
- Advanced reporting

### Enterprise
- Unlimited users
- Unlimited projects
- Custom integrations
- Dedicated account manager
- Custom training

---

This structure provides complete role separation while maintaining a clean, intuitive user experience for each user type.
