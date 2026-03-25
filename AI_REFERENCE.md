# Scope — AI Reference & Sprint Plan

> **Purpose:** Single source of truth for AI assistants working on this codebase.
> Covers architecture, business logic, user flows, and the sprint-by-sprint rebuild plan.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Core Business Flow](#core-business-flow)
6. [Data Models](#data-models)
7. [Design System](#design-system)
8. [Multi-Tenant System](#multi-tenant-system)
9. [Sprint Plan](#sprint-plan)

---

## Project Overview

**Scope** is a multi-tenant SaaS platform for interior design firms to manage project budgets, track costs, collaborate with clients on approvals, and maintain a reusable item library.

### Key Capabilities

- **Project Management** — Create projects with client info, rooms, phases, quality defaults
- **Budget Builder** — Drag-and-drop line item editor with auto-calculated markup, shipping, tax, totals
- **Approval Workflow** — 5-step send-for-approval wizard → secure token-based client approval portal
- **Item Library** — Multi-scope catalog (global / agency / personal) with 4 quality tiers
- **Cost Tracking** — Compare budgeted vs. actual costs post-approval
- **Reports & Analytics** — Agency/project metrics, budget approval rates, cost summaries
- **Multi-Tenant** — Agencies with custom branding, subscription tiers, license management
- **Role-Based Access** — 4 user roles with granular permission sets

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.3.1 + TypeScript |
| Router | React Router 7.13.0 |
| Build | Vite 6.3.5 |
| Styling | Tailwind CSS 4.1.12 + CSS custom properties |
| UI Components | Radix UI primitives + shadcn/ui pattern |
| Charts | Recharts 2.15.2 |
| Drag & Drop | react-dnd 16.0.1 + HTML5 backend |
| Forms | react-hook-form 7.55.0 |
| Notifications | Sonner 2.0.3 |
| Animation | Motion 12.23.24, tw-animate-css |
| Utilities | clsx, tailwind-merge, date-fns, lucide-react |

---

## Architecture

### Directory Structure

```
src/
├── main.tsx                        # React entry point
├── styles/
│   ├── index.css                   # Style imports
│   ├── tailwind.css                # Tailwind config + @theme inline tokens
│   └── theme.css                   # CSS variables, dark mode, base styles
├── lib/
│   └── utils.ts                    # cn() class merge utility
├── types/
│   └── index.ts                    # All TypeScript types, enums, permission maps
├── data/
│   └── mock.ts                     # Mock data: agencies, users, projects, budgets, library, activities
├── contexts/
│   └── AuthContext.tsx              # Auth state, login/logout, permission checks, agency theming
└── app/
    ├── App.tsx                     # BrowserRouter + AuthProvider + Routes + Toaster
    ├── components/
    │   ├── ProtectedRoute.tsx      # Auth guard (redirects to /login)
    │   ├── ui/                     # Reusable UI components (shadcn/ui pattern)
    │   ├── common/                 # App-specific reusable components
    │   ├── modals/                 # Modal dialogs (create, edit, delete, approve)
    │   └── budgets/                # Budget-specific components
    ├── layouts/
    │   └── RootLayout.tsx          # Sidebar + top bar + role-based nav + <Outlet />
    └── pages/                      # Route page components
        ├── Login.tsx
        ├── Dashboard.tsx
        ├── ProjectsList.tsx
        ├── ProjectDetail.tsx
        ├── BudgetBuilder.tsx
        ├── BudgetsList.tsx
        ├── BudgetPreview.tsx
        ├── BudgetComparison.tsx
        ├── ActualCostTracking.tsx
        ├── CustomerApproval.tsx
        ├── ClientApprovalDashboard.tsx
        ├── ItemLibrary.tsx
        ├── Reports.tsx
        ├── Settings.tsx
        ├── UserManagement.tsx
        ├── AuditLog.tsx
        ├── TemplatesManagement.tsx
        ├── Documentation.tsx
        └── admin/
            ├── PlatformDashboard.tsx
            ├── AgenciesManagement.tsx
            ├── PlatformAnalytics.tsx
            ├── BillingManagement.tsx
            ├── PlatformAdminUsers.tsx
            └── AgencyUsersManagement.tsx
```

### Routing

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/` | Dashboard | All authenticated |
| `/projects` | Projects List | VIEW_PROJECTS |
| `/projects/:projectId` | Project Detail | VIEW_PROJECTS |
| `/projects/:projectId/budgets/:budgetId` | Budget Builder | EDIT_BUDGET |
| `/budgets` | Budgets List | VIEW_BUDGETS |
| `/budgets/:budgetId/preview` | Budget Preview | VIEW_BUDGETS |
| `/budgets/:budgetId/compare` | Budget Comparison | VIEW_BUDGETS |
| `/budgets/:budgetId/actual-costs` | Actual Cost Tracking | TRACK_ACTUAL_COSTS |
| `/library` | Item Library | VIEW_LIBRARY |
| `/reports` | Reports | VIEW_AGENCY_REPORTS |
| `/settings` | Settings | AGENCY_ADMIN |
| `/settings/users` | User Management | MANAGE_AGENCY_USERS |
| `/settings/audit` | Audit Log | VIEW_AUDIT_LOG |
| `/settings/templates` | Templates | MANAGE_TEMPLATES |
| `/approve/:token` | Customer Approval | Public (token-based) |
| `/client-approval/:token` | Client Approval Dashboard | Public (token-based) |
| `/documentation` | Documentation | Public |
| `/admin` | Platform Dashboard | PLATFORM_ADMIN |
| `/admin/agencies` | Agencies Management | MANAGE_AGENCIES |
| `/admin/users` | Platform Users | MANAGE_PLATFORM_USERS |
| `/admin/analytics` | Platform Analytics | VIEW_PLATFORM_ANALYTICS |
| `/admin/billing` | Billing Management | MANAGE_BILLING |
| `/admin/agencies/:agencyId/users` | Agency Users | MANAGE_AGENCIES |

---

## User Roles & Permissions

### Roles

| Role | Description | Scope |
|------|-------------|-------|
| `PLATFORM_ADMIN` | Operates the entire SaaS platform | Cross-agency |
| `AGENCY_ADMIN` | Manages one design agency/firm | Single agency |
| `GENERAL_USER` | Interior designer / team member | Single agency |
| `READ_ONLY_USER` | View-only stakeholder | Single agency |

### Permission Matrix

| Permission | Platform Admin | Agency Admin | General User | Read Only |
|-----------|:-:|:-:|:-:|:-:|
| VIEW_PLATFORM_DASHBOARD | ✓ | | | |
| MANAGE_AGENCIES | ✓ | | | |
| MANAGE_PLATFORM_USERS | ✓ | | | |
| VIEW_PLATFORM_ANALYTICS | ✓ | | | |
| MANAGE_BILLING | ✓ | | | |
| MANAGE_GLOBAL_LIBRARY | ✓ | | | |
| MANAGE_PLATFORM_SETTINGS | ✓ | | | |
| MANAGE_AGENCY_SETTINGS | | ✓ | | |
| MANAGE_AGENCY_USERS | | ✓ | | |
| MANAGE_AGENCY_LIBRARY | | ✓ | | |
| MANAGE_TEMPLATES | | ✓ | | |
| VIEW_AUDIT_LOG | ✓ | ✓ | | |
| VIEW_AGENCY_REPORTS | | ✓ | ✓ | |
| CREATE_PROJECT | | ✓ | ✓ | |
| EDIT_PROJECT | | ✓ | ✓ | |
| VIEW_PROJECTS | | ✓ | ✓ | ✓ |
| DELETE_PROJECT | | ✓ | | |
| CREATE_BUDGET | | ✓ | ✓ | |
| EDIT_BUDGET | | ✓ | ✓ | |
| VIEW_BUDGETS | | ✓ | ✓ | ✓ |
| DELETE_BUDGET | | ✓ | | |
| SEND_FOR_APPROVAL | | ✓ | ✓ | |
| APPROVE_BUDGET | | ✓ | | |
| TRACK_ACTUAL_COSTS | | ✓ | ✓ | |
| VIEW_LIBRARY | | ✓ | ✓ | ✓ |
| MANAGE_PERSONAL_LIBRARY | | ✓ | ✓ | |
| EXPORT_DATA | | ✓ | ✓ | ✓ |

### Role-Based Navigation

**Platform Admin sidebar:**
Dashboard, Agencies, Users, Analytics, Billing, Library

**Agency Admin sidebar:**
Dashboard, Projects, Budgets, Library, Reports, Users, Settings

**General User (Designer) sidebar:**
Dashboard, Projects, Budgets, Library, Reports

**Read-Only sidebar:**
Dashboard, Projects, Budgets, Library

---

## Core Business Flow

### 1. Project Creation
```
Create Project → Enter client info (name, contacts, address)
               → Define rooms (name, floor, square footage)
               → Define phases (Phase 1 - Living Areas, etc.)
               → Set defaults (quality level, markup %, shipping %, other %)
               → Status: Active
```

### 2. Budget Creation & Editing
```
Create Budget for Project → Name, initial version = 1
                          → Status: Draft
                          → Add line items:
                             - From library (auto-fills prices by quality tier)
                             - Manual entry
                          → Each line item has:
                             - Item info (name, category, details, phase, room)
                             - Quality level → drives base price
                             - Quantity & unit
                             - Net cost (base price)
                             - Markup % → itemCost = netCost × (1 + markup/100)
                             - Shipping (netCost × shipping%)
                             - Other costs (netCost × other%)
                             - Tax (on itemCost + shipping + other)
                             - Total = itemCost + shipping + other + tax
                          → Any field can be manually overridden (tracked in overrides map)
                          → Drag & drop to reorder or move between rooms
```

### 3. Approval Workflow (5 Steps)
```
Step 1: Review       → Summary of budget details, line item count, totals
Step 2: Internal     → (Optional) Select internal approver from agency users
Step 3: Client Info  → Enter recipient emails, CC list, custom message
Step 4: Export Opts  → Configure visibility: show/hide markup, shipping, tax, product cost
                     → Choose display mode: line items vs. summary only
Step 5: Confirm      → Review all settings → Send
                     → Generates secure token → Budget status = "pending_approval"
                     → Client receives link: /approve/:token
```

### 4. Client Approval (Public Portal)
```
Client clicks token link → No login required
                         → Sees budget with configured visibility
                         → Sees message from designer
                         → Can approve or reject
                         → Can add notes/comments
                         → On approve: budget status = "approved", approvedAt set
                         → On reject: budget status = "rejected", notes saved
```

### 5. Post-Approval
```
Actual Cost Tracking → For each approved line item, enter actual costs
                     → Compare budgeted vs actual
                     → Track variances

Budget Comparison    → Compare two budget versions side-by-side
                     → Highlight changed line items, added/removed items
                     → Show total difference
```

### 6. Supporting Flows

**Item Library:**
- 3 scopes: Global (platform-wide), Agency (firm-specific), Personal (user-specific)
- 4 quality tiers per item: Quality, Premium, Luxury, Ultra Lux — each with its own price
- Categories: Furniture, Lighting, Textiles, Window Treatments, Accessories, etc.
- Search by name, filter by category/scope/status
- Admin can add/edit/deactivate items

**Reports:**
- Agency-level analytics: total projects, budget values, approval rates
- Project-level analytics: budget breakdowns by category, room, phase
- Chart visualizations (line, bar, pie via Recharts)

**User Management (Agency Admin):**
- Invite new users with role assignment
- Edit user roles and status
- Deactivate/reactivate users
- View last login, activity

**Audit Log:**
- Chronological record of all actions
- Who did what, when, to which resource
- Filterable by user, action type, date range

---

## Data Models

### Agency
```typescript
{
  id, name, type (individual/company), status (active/suspended/trial),
  subscription: { tier, total_licenses, used_licenses },
  theme_colors: { primary, secondary, background },
  logo_url, address, phone, website,
  defaults: { product_markup, shipping_percentage, other_cost_percentage },
  created_at
}
```

### User
```typescript
{
  id, agency_id, email, name,
  role (platform_admin/agency_admin/general_user/read_only_user),
  status (active/invited/suspended),
  avatar_url, phone, last_login, created_at
}
```

### Project
```typescript
{
  id, agency_id, clientName, projectName,
  address, city, state, zip,
  contacts: [{ name, email, phone, isPrimary }],
  rooms: [{ id, name, floor, squareFootage }],
  phases: [{ id, name }],
  status (active/on_hold/completed),
  defaultQuality, defaultMarkup, defaultShipping, defaultOther,
  totalBudgeted, approvedAmount, pendingAmount,
  createdAt, updatedAt
}
```

### Budget
```typescript
{
  id, projectId, name, version,
  status (draft/in_review/pending_approval/approved/rejected/revised),
  lineItems: BudgetLineItem[],
  subtotal, totalShipping, totalOther, totalTax, grandTotal,
  assignedApproverId, internalApprovalStatus,
  notes, createdAt, updatedAt, sentAt, approvedAt
}
```

### BudgetLineItem
```typescript
{
  id, itemNumber, itemName, category, details, phase, room,
  quality (quality/premium/luxury/ultra_lux),
  quantity, unit,
  netCost, markupPercent, itemCost, shipping, other, tax, total,
  overrides: Record<string, boolean>  // tracks manually overridden fields
}
```

### LibraryItem
```typescript
{
  id, name, category, subcategory,
  qualityPrice, premiumPrice, luxuryPrice, ultraLuxPrice,
  scope (global/agency/personal),
  agencyId, createdBy,
  vendor, sku, imageUrl, tags, notes, isActive
}
```

---

## Design System

### Brand Colors
- **Primary (Navy):** `#1a365d` — sidebar, primary buttons, headings
- **Secondary (Teal):** `#14b8a6` — accents, CTAs, focus rings, charts
- **Neutrals:** Slate scale from `#f8fafc` (50) to `#0f172a` (900)

### Semantic Colors
- **Success:** `#10b981` (green) — approved, active, positive trends
- **Warning:** `#f59e0b` (amber) — pending, on hold, attention needed
- **Error:** `#ef4444` (red) — rejected, destructive actions, alerts
- **Info:** `#3b82f6` (blue) — informational, override indicators

### Key Design Patterns
- Cards with `rounded-xl border border-border bg-card shadow-sm`
- Buttons: primary (navy), secondary (teal), destructive (red), ghost, outline
- Status badges: colored pill with `rounded-full px-2 py-0.5 text-xs font-medium`
- Sidebar: dark (navy bg), with active state indicator
- Forms: white bg inputs, teal focus ring, labeled fields
- Tables: compact rows for budget line items
- Modals: Radix Dialog with overlay

### Agency Theming
Each agency can have custom `primary` and `secondary` colors applied via CSS variables at runtime. The AuthContext sets `--brand-primary` and `--brand-secondary` on `document.documentElement` when a user logs in.

---

## Multi-Tenant System

### Subscription Tiers
| Tier | Licenses | Features |
|------|----------|----------|
| Starter | 1-3 | Basic projects, budgets, library |
| Professional | Up to 10 | + Reports, templates, audit log |
| Enterprise | Unlimited | + Custom branding, priority support |

### Data Scoping
- All projects, budgets, users are scoped by `agency_id`
- Library items have a `scope` field: `global` (all agencies), `agency` (one firm), `personal` (one user)
- Platform admin can see and manage all agencies
- Agency users only see their own agency's data

### Mock Agencies (for development)
1. **Luxe Interiors Design Studio** — Professional, 10 licenses, active
2. **Modern Living Co.** — Starter, 3 licenses, active
3. **Sarah Chen Design** — Starter, 1 license, trial

---

## Sprint Plan

### Sprint 2 — Authentication & Entry (Mar 25 – Apr 8)

**Frontend:**
- [ ] Login screen UI (polished, branded, responsive)
- [ ] Email/password login flow with validation
- [ ] Social login button integration (Google, Apple — UI + placeholders)
- [ ] Forgot password flow (form → confirmation screen)
- [ ] Remember me checkbox handling (persistent session)

**Backend (mock/API-ready):**
- [ ] Auth API structure (login, register, refresh, logout endpoints)
- [ ] Social auth integration hooks
- [ ] Session/token handling (JWT pattern with localStorage)
- [ ] Password reset endpoint mock
- [ ] Role-based redirect logic:
  - Platform Admin → `/admin`
  - Agency Admin → `/`
  - General User → `/`
  - Read-Only → `/`

---

### Sprint 3 — Agency Dashboard: Core (Apr 8 – Apr 29)

- [ ] Sidebar navigation (collapsible, role-filtered, active states, agency branding)
- [ ] Dashboard page (KPI stat cards, charts, recent activity feed)
- [ ] Profile page (view/edit user profile, avatar, contact info)
- [ ] Settings page (agency settings, defaults, branding, export preferences)
- [ ] Upcoming deadlines widget (project deadlines, budget due dates)
- [ ] My Projects view (card + list toggle, search, filter by status)
- [ ] Create a Project modal/flow (client info, rooms, phases, defaults)

---

### Sprint 4 — Agency Dashboard: Budgets & Library (Apr 29 – May 6)

- [ ] Budgets list page (search, filter by status/project, sort)
- [ ] New budget creation flow (select project, name, initial setup)
- [ ] Budget Builder page:
  - [ ] Drag & drop line items between rooms
  - [ ] Inline editing (quantity, price, markup overrides)
  - [ ] Auto-calculation engine (markup, shipping, other, tax, totals)
  - [ ] View by room vs. flat list toggle
  - [ ] Sort by item number, name, category, phase, cost
- [ ] Item Library page (multi-scope, search, filter by category)
- [ ] Export functionality (budget export with visibility options)
- [ ] Import functionality (bulk item import)

---

### Sprint 5 — Agency Dashboard: Admin Features (May 6 – May 20)

- [ ] User Management page:
  - [ ] User list with role badges, status, last login
  - [ ] Invite user modal (email, role selection)
  - [ ] Edit user modal (change role, status)
  - [ ] Deactivate/reactivate users
- [ ] Audit Log page:
  - [ ] Chronological activity list
  - [ ] Filter by user, action type, date range
  - [ ] Action detail view

---

### Sprint 6 — Designer Dashboard: Core (May 20 – Jun 4)

- [ ] Designer-specific sidebar (Dashboard, Projects, Budgets, Library, Reports)
- [ ] Designer profile page (personal info, preferences)
- [ ] Designer settings (notification preferences, default quality, display options)
- [ ] My Projects view (only projects assigned to or created by designer)
- [ ] Project creation flow (same as agency admin but scoped to designer)
- [ ] Project filters (status, client, date range, search)
- [ ] Upcoming deadlines (designer's active projects only)

---

### Sprint 7 — Designer Dashboard: Budget Workflow (Jun 4 – Jun 18)

- [ ] All Budgets view (designer's budgets across projects)
- [ ] New budget creation (within project context)
- [ ] Budget search (by name, project, client)
- [ ] Budget filters (status, date, project)
- [ ] Budget card component (summary: name, project, status, total, last updated)
- [ ] Budget settings (name, defaults, markup/shipping/other overrides)
- [ ] Send for Approval workflow (5-step wizard):
  - [ ] Step 1: Review summary
  - [ ] Step 2: Internal approval (select approver)
  - [ ] Step 3: Client info (recipients, CC, message)
  - [ ] Step 4: Export options (visibility toggles)
  - [ ] Step 5: Confirmation & send
- [ ] Budget preview (client-facing view with configured visibility)
- [ ] Edit budget / add items (inline editing, library picker)

---

### Sprint 8 — Designer Dashboard: Library & Export (Jun 18 – Jul 1)

- [ ] Library page (designer view — global + agency + personal items)
- [ ] Library search (name, vendor, SKU, tags)
- [ ] Library filters (category, scope, price range, active status)
- [ ] Add personal library items
- [ ] Export budget (PDF-ready layout, configurable visibility)
- [ ] Export library items (CSV/spreadsheet format)

---

### Sprint 9 — Designer Dashboard: Reports (Jul 1 – Jul 18)

- [ ] Reports page (designer-scoped analytics)
- [ ] Recent reports list (previously generated/viewed reports)
- [ ] Report types:
  - [ ] Project budget summary
  - [ ] Budget vs. actual costs
  - [ ] Category breakdown
  - [ ] Approval status overview
- [ ] Download reports (PDF, CSV export)
- [ ] Chart visualizations (Recharts: line, bar, pie)

---

### Sprint 10 — Client Approval Portal: Part 1 (Jul 18 – Jul 31)

- [ ] Client approval portal layout (public, no login required)
- [ ] Budget listing page (client sees their budgets via token)
- [ ] Review budget page:
  - [ ] Budget details with configured visibility (markup, shipping, tax shown/hidden)
  - [ ] Line item view or summary view (based on designer's export settings)
  - [ ] Grand total and breakdown
- [ ] Budget approval flow:
  - [ ] Approve button with confirmation
  - [ ] Deny/reject button with required reason
- [ ] Comment from designer (display message set during send-for-approval)
- [ ] Response to designer (client notes, questions, change requests)

---

### Sprint 11 — Client Approval Portal: Part 2 (Jul 31 – Aug 14)

- [ ] Polish and edge cases for approval portal
- [ ] Multi-budget approval (client has multiple pending budgets)
- [ ] Budget version history (client sees revision trail)
- [ ] Enhanced review budget page:
  - [ ] Category grouping view
  - [ ] Room-by-room breakdown
  - [ ] Expandable line item details
- [ ] Approval confirmation screen with next steps
- [ ] Denial flow with structured feedback
- [ ] Comment thread (designer ↔ client back-and-forth)
- [ ] Response notifications (toast + email placeholder)
- [ ] Mobile-responsive approval experience
- [ ] Accessibility audit and fixes

---

## Notes for AI Assistants

### Conventions
- **Imports:** Use `@/` path alias for all `src/` imports
- **Components:** Functional components with named exports (not default)
- **Styling:** Tailwind utility classes; use `cn()` from `@/lib/utils` for conditional classes
- **State:** React Context for global state (auth); local state for page/component-level
- **Types:** All types in `@/types/index.ts`; import individually, not `import * as`
- **Mock data:** All in `@/data/mock.ts`; structured to be easily swappable with real API calls

### Patterns to Follow
- UI components follow shadcn/ui pattern: Radix primitive + Tailwind + `cn()` + `cva()` for variants
- Modals use Radix Dialog with standard overlay/content structure
- Forms use controlled components or react-hook-form for complex forms
- Tables use compact rows (`.compact-row`) for budget line items
- Status indicators use colored pills with semantic colors
- Cards use `rounded-xl border border-border bg-card p-5 shadow-sm`
- Page layout: `<div className="space-y-6">` with h1 header, then content sections

### What NOT to Do
- Don't add features not in the current sprint scope
- Don't create separate files for types that belong in `@/types/index.ts`
- Don't use inline `style={{}}` — use Tailwind classes or CSS variables
- Don't redefine Tailwind utility classes in custom CSS (causes specificity conflicts)
- Don't use `default export` — always use named exports
- Don't skip the permission check when rendering role-gated UI
