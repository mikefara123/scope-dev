# Design SaaS - Budget Management Platform for Interior Designers

## 📋 Overview

**Design SaaS** is a comprehensive budget management SaaS application built specifically for interior designers and design agencies. It provides a multi-tenant platform that streamlines the entire budget lifecycle—from creation to client approval—with Excel-like functionality, intelligent item libraries, and collaborative workflows.

The platform serves three distinct user roles with tailored experiences for each, enabling efficient budget management, team collaboration, and seamless client interactions.

---

## 🎯 Core Purpose

Interior designers face significant challenges managing project budgets:
- **Manual Spreadsheets**: Error-prone, difficult to collaborate on, and lack version control
- **Client Communication**: Endless email chains for budget approvals and revisions
- **Item Pricing**: Repeatedly researching and pricing the same items across projects
- **Team Collaboration**: Multiple designers working on budgets without real-time sync
- **Professional Presentation**: Generic spreadsheets don't reflect design agency branding

**Design SaaS solves these problems** by providing a purpose-built platform that handles the entire budget workflow with intelligence, automation, and professional polish.

---

## 👥 User Roles

### 1. **SaaS Owner (Platform Admin)**
The platform administrator who manages the entire multi-tenant system.

**Responsibilities:**
- Manage all design agencies on the platform
- Monitor platform usage and analytics
- Handle billing and subscriptions
- Provide technical support
- Configure platform-wide settings

**Key Pages:**
- Platform Admin Dashboard
- Agency Management
- User Analytics
- System Configuration

---

### 2. **Design Agency Admin**
The owner/manager of a design agency who manages their team and clients.

**Responsibilities:**
- Manage agency settings and branding
- Add/remove team members (designers)
- Create and manage clients
- Define agency-wide item libraries
- Set up project templates
- Review team performance

**Key Pages:**
- Agency Dashboard
- Team Management
- Client Management
- Agency Item Library
- Project Templates
- Agency Settings

---

### 3. **Interior Designer**
The individual designer who creates budgets and manages projects.

**Responsibilities:**
- Create and manage projects
- Build detailed budgets using BudgetBuilder
- Add line items from libraries or create custom ones
- Send budgets to clients for approval
- Track interim budgets and revisions
- Collaborate with team members
- Export budgets to various formats

**Key Pages:**
- Projects Page (list/card view)
- Budgets Page (list/card view)
- BudgetBuilder (main budget creation interface)
- Item Library
- Client Portal
- Export Center

---

## 🎨 Design System

### Color Palette
- **Primary Color**: Navy `#1a365d` - Used for primary actions, headers, and key UI elements
- **Secondary Color**: Teal `#319795` - Used for accents, secondary actions, and highlights
- **Design Philosophy**: Solid colors only, no gradients
- **Accessibility**: WCAG AA compliant contrast ratios throughout

### UI Components
- **Buttons**: Standardized button system with consistent styling and hover states
- **Forms**: TextInput, Select, and other form controls following design system
- **Tables**: Notion/Asana-style inline editing with Excel-like functionality
- **Navigation**: Sidebar navigation with role-based menu items
- **Modals**: Consistent modal system for confirmations and forms

---

## ✨ Key Features

### 1. **Multi-Tenant Architecture**
- Complete isolation between design agencies
- Each agency has its own:
  - Team members
  - Clients
  - Projects
  - Budgets
  - Item libraries
  - Branding settings

---

### 2. **Budget Builder (Excel-like Interface)**

The heart of Design SaaS—a powerful, intuitive budget creation tool.

#### Room Sections
- Organize budget items by room (Living Room, Kitchen, Master Bedroom, etc.)
- Collapsible sections for better organization
- Drag-and-drop items between rooms
- Quick section summaries and totals

#### Line Item Management
- **Inline Editing**: Click any cell to edit (Notion/Asana-style)
- **Columns**:
  - Item/Description
  - Category (Furniture, Lighting, Textiles, etc.)
  - Quantity
  - Unit Cost
  - Shipping
  - Other
  - Tax
  - Total (auto-calculated)
- **Bulk Actions**: Delete, duplicate, move items
- **Quick Add**: Instantly add new line items

#### Drag-and-Drop
- Reorder items within sections
- Move items between room sections
- Intuitive visual feedback during drag operations

#### Real-Time Calculations
- Automatic total calculation: `(Unit Cost × Quantity) + Shipping + Other + Tax`
- Section subtotals
- Grand total with formatting (e.g., `$1,234.56`)
- All monetary values formatted with `.toLocaleString()` for proper currency display

---

### 3. **Item Library System**

Multi-level scoping for intelligent item reuse across the platform.

#### Three Library Levels

**Platform Library** (Global)
- Managed by SaaS Owner
- Available to all agencies
- Common items used across the industry
- Example: Standard furniture pieces, common lighting fixtures

**Agency Library**
- Managed by Design Agency Admin
- Available to all designers in the agency
- Agency-specific preferred vendors and items
- Custom items used frequently by the agency

**Project Library**
- Created by individual designers
- Specific to a single project
- One-off custom items
- Imported items from other libraries

#### Library Features
- **Quick Search**: Find items instantly by name, category, or vendor
- **Drag-and-Drop**: Drag items directly into BudgetBuilder
- **Item Details**: Store pricing, vendor info, notes, and images
- **AI Suggestions**: Get intelligent item recommendations based on room type and style

---

### 4. **Project & Budget Management**

#### Projects Page
- **Dual View Modes**:
  - **List View**: Dense, table-based view for quick scanning
  - **Card View**: Visual cards with project details and thumbnails
- **Project Details**:
  - Client name and contact
  - Project address
  - Status (Active, On Hold, Completed)
  - Budget count and total value
  - Team members assigned
- **Three-Dot Menu**: Quick actions (Edit, Duplicate, Archive, Delete)
- **Filtering & Search**: Find projects quickly

#### Budgets Page
- **Dual View Modes**: List and Card views
- **Budget Details**:
  - Associated project
  - Version number (for tracking revisions)
  - Status (Draft, Pending Approval, Approved, Rejected)
  - Total amount
  - Last modified date
- **Quick Actions**: Open in BudgetBuilder, Send for Approval, Export, Duplicate

---

### 5. **Client Approval Workflows**

#### Designer Workflow
1. Complete budget in BudgetBuilder
2. Click "Send for Approval"
3. System generates unique approval link
4. Email sent to client with link and PDF preview
5. Track approval status in real-time

#### Client Workflow
1. Receive email with approval link
2. Open Client Portal (no login required, secure token-based access)
3. Review budget in read-only, beautifully formatted view
4. Add comments or request changes
5. Approve with digital signature
6. Receive confirmation email

#### Features
- **Digital Signatures**: Legally binding e-signatures
- **Version Tracking**: All revisions are saved
- **Comment System**: Clients can leave feedback on specific line items
- **Interim Budgets**: Create "what-if" scenarios without affecting approved budgets
- **Approval History**: Full audit trail of all approvals and rejections

---

### 6. **Project Templates**

Accelerate budget creation with reusable templates.

#### Template Features
- **Pre-defined Room Sections**: Standard rooms for common project types
- **Common Line Items**: Frequently used items pre-populated
- **Default Categories**: Standard categorization
- **Customizable**: Edit templates to match agency workflow

#### Template Types
- Residential Remodel
- New Construction
- Kitchen & Bath
- Living Spaces
- Commercial Office
- Hospitality
- Custom Templates (created by agency)

---

### 7. **Team Collaboration**

#### Real-Time Features
- Multiple designers can view budgets simultaneously
- Activity feed showing recent changes
- @mentions in comments
- Notifications for budget updates

#### Permissions
- **Owner**: Full access, can delete projects
- **Editor**: Can edit budgets and line items
- **Viewer**: Read-only access
- **Client**: Approval access only

---

### 8. **Export & Reporting**

#### Export Formats
- **PDF**: Professional, branded budget documents
- **Excel**: Full Excel export with formulas intact
- **CSV**: For data analysis and import into other systems
- **Custom Templates**: Use agency-branded PDF templates

#### Export Options
- Include/exclude specific sections
- Show/hide pricing details
- Add custom headers and footers
- Include designer notes
- Attach item images

---

## 📖 User Scenarios & Stories

### Scenario 1: New Project Budget Creation

**As an interior designer**, I want to quickly create a budget for a new client's living room redesign.

**User Story:**
1. Designer logs in and clicks "New Project"
2. Fills in client details: "Sarah Johnson - Living Room Redesign"
3. Clicks "Create Budget" and selects "Living Spaces Template"
4. BudgetBuilder opens with pre-populated room sections:
   - Living Room
   - Dining Room
5. Designer clicks "Living Room" section
6. Opens Item Library sidebar
7. Searches for "sofa modern gray"
8. Drags "Modern Gray Sectional Sofa" from library into budget
9. Inline edits quantity to `1` and adds shipping cost `$200`
10. Continues adding items: coffee table, accent chairs, lighting, rugs
11. Reviews totals: Living Room total is `$8,450`
12. Clicks "Send for Approval" to send to client

**Outcome:** Budget created in 15 minutes instead of 2 hours with spreadsheets.

---

### Scenario 2: Client Approval with Revisions

**As a client**, I want to review my designer's budget and request changes before approving.

**User Story:**
1. Client receives email: "Your Living Room Budget is Ready for Review"
2. Clicks secure link to Client Portal
3. Views beautifully formatted budget with room sections and item images
4. Reviews line items and notices "Accent Chair Pair" is over budget
5. Clicks comment icon on that line item
6. Adds comment: "Love these but can we find something under $800 for the pair?"
7. Clicks "Request Changes" button with overall comment: "Everything looks great except chairs"
8. Designer receives notification
9. Designer finds alternative chairs at `$750`
10. Updates budget and re-sends for approval
11. Client reviews updated budget and clicks "Approve"
12. Adds digital signature
13. Both parties receive confirmation email with approved PDF

**Outcome:** Streamlined approval process, clear communication, no email chains.

---

### Scenario 3: Agency Item Library Management

**As a design agency admin**, I want to create an agency-wide library of our preferred vendors and frequently used items.

**User Story:**
1. Admin logs into agency dashboard
2. Navigates to "Agency Item Library"
3. Clicks "Add Category" and creates "Preferred Lighting Fixtures"
4. Clicks "Add Item" and fills in details:
   - Name: "Arteriors Caviar Adjustable Pendant"
   - Category: Lighting
   - Vendor: "Arteriors"
   - Unit Cost: `$850`
   - Notes: "Net price, our discount already applied"
   - Uploads product image
5. Saves item
6. Repeats for 50+ commonly used items
7. All designers in agency can now access these items
8. Designer searches "pendant" in Item Library
9. Sees agency items marked with special badge
10. Drags item into budget—pre-filled with correct pricing

**Outcome:** Consistency across team, faster budget creation, negotiated pricing locked in.

---

### Scenario 4: Interim Budget Tracking

**As an interior designer**, I want to create an interim budget to explore "what-if" scenarios without affecting the approved budget.

**User Story:**
1. Designer has approved budget for `$50,000` kitchen remodel
2. Client asks: "What if we upgrade to marble countertops?"
3. Designer opens approved budget in BudgetBuilder
4. Clicks "Create Interim Budget"
5. System creates a copy marked "Interim - Marble Upgrade"
6. Designer edits "Countertops" line item:
   - Changes from "Quartz" to "Marble"
   - Updates unit cost from `$4,500` to `$8,200`
7. Reviews new total: `$53,700`
8. Exports PDF marked "Option 2: Marble Upgrade"
9. Sends to client for consideration
10. Client approves upgrade
11. Designer clicks "Promote to Main Budget"
12. Interim budget becomes the new approved version
13. Original budget archived as "Version 1"

**Outcome:** Easy scenario planning, clean version history, no risk of accidentally changing approved budgets.

---

### Scenario 5: Multi-Designer Collaboration

**As a design agency with multiple designers**, I want two designers to collaborate on a large whole-home project.

**User Story:**
1. Lead Designer creates project: "Miller Residence - Whole Home"
2. Creates budget and adds room sections:
   - Living Room
   - Kitchen
   - Master Suite
   - Guest Rooms (2)
   - Bathrooms (3)
3. Lead Designer clicks "Add Collaborator"
4. Selects "Junior Designer - Emma" with "Editor" permissions
5. Emma receives notification
6. Emma opens BudgetBuilder and focuses on "Guest Rooms"
7. Both designers work simultaneously
8. Emma adds items to Guest Room 1
9. Lead Designer sees activity indicator: "Emma added 3 items to Guest Room 1"
10. Lead Designer reviews Emma's work and leaves comment: "Great selections!"
11. Emma gets notification and responds
12. Lead Designer finalizes budget and sends for approval
13. Activity log shows full collaboration history

**Outcome:** Efficient team collaboration, real-time updates, clear accountability.

---

### Scenario 6: Platform Admin Managing Agencies

**As a SaaS platform owner**, I want to monitor all design agencies using the platform and manage subscriptions.

**User Story:**
1. Platform Admin logs into admin dashboard
2. Views metrics:
   - Total Agencies: 47
   - Total Active Users: 312
   - Total Budgets Created This Month: 1,248
   - Revenue: `$15,340/month`
3. Clicks "Agency Management"
4. Sees list of all agencies with:
   - Agency name
   - Number of users
   - Subscription tier
   - Status (Active, Trial, Suspended)
5. Notices "Luxe Interiors" is on trial, ending in 3 days
6. Clicks three-dot menu > "Extend Trial"
7. Adds 14 more days
8. System sends email to agency admin
9. Reviews "Design Studio Co" that exceeded user limit
10. Clicks "Upgrade to Pro Plan"
11. Updates billing and notifies agency admin
12. Reviews platform analytics for business insights

**Outcome:** Efficient platform management, proactive customer support, clear visibility into all agencies.

---

## 🛠️ Technical Implementation

### Technology Stack
- **Frontend**: React with TypeScript
- **Routing**: React Router (Data mode pattern)
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library following design system
- **State Management**: React hooks and context
- **Data**: Currently frontend-only with mock data (Supabase integration ready)

### Key Technical Features

#### React Fast Refresh Compatibility
- Custom TextInput component (`/src/app/components/ui/text-input.tsx`)
- Proper module exports to prevent "r is not a function" errors
- Backwards compatibility maintained

#### Component Architecture
- **Design System Components**: `/src/app/components/ui/`
  - `button.tsx`: Primary, secondary, outline, ghost variants
  - `text-input.tsx`: Standard text input with focus states
  - `select.tsx`: Dropdown selections
  - `modal.tsx`: Consistent modal dialogs
  - `card.tsx`: Card layouts for list/card views

- **Feature Components**: `/src/app/components/`
  - `BudgetBuilder/`: Main budget creation interface
  - `ItemLibrary/`: Item library sidebar and management
  - `ClientPortal/`: Client approval interface
  - `ProjectCard/`: Project card component
  - `BudgetCard/`: Budget card component

#### Data Formatting
- All monetary values use `.toLocaleString()` for proper formatting
- Consistent currency display across all components
- Real-time calculation updates

#### Accessibility
- WCAG AA compliant contrast ratios
- Keyboard navigation support
- Screen reader friendly
- Focus management in modals

---

## 🚀 Development Phases Completed

### Phase 1: Foundation
- Multi-tenant architecture
- User role system
- Authentication scaffolding
- Basic navigation

### Phase 2: Budget Core
- BudgetBuilder interface
- Room sections
- Line item management
- Basic calculations

### Phase 3: Item Libraries
- Three-level library scoping (Platform, Agency, Project)
- Drag-and-drop from library to budget
- Item search and filtering

### Phase 4: Advanced Features
- Project templates
- Client approval workflows
- Digital signatures
- Interim budget tracking

### Phase 5: UI/UX Polish
- Notion/Asana-style inline editing
- List/card view toggles
- Three-dot menus
- Modern UI components

### Phase 6: System Refinements
- Button contrast overhaul (WCAG AA)
- CSS conflict resolution
- TextInput component creation
- Dollar value formatting
- Category column overlap fix

---

## 📱 Pages & Routes

### Public Routes
- `/` - Landing Page
- `/login` - Login Page
- `/signup` - Signup Page
- `/client-portal/:token` - Client Approval Portal (token-based, no auth required)

### Platform Admin Routes
- `/platform-admin` - Platform Admin Dashboard
- `/platform-admin/agencies` - Agency Management
- `/platform-admin/analytics` - Platform Analytics

### Agency Admin Routes
- `/agency-dashboard` - Agency Dashboard
- `/agency/team` - Team Management
- `/agency/clients` - Client Management
- `/agency/item-library` - Agency Item Library
- `/agency/templates` - Project Templates
- `/agency/settings` - Agency Settings

### Designer Routes
- `/projects` - Projects Page (list/card view)
- `/budgets` - Budgets Page (list/card view)
- `/budget/:id` - BudgetBuilder (main budget interface)
- `/item-library` - Item Library
- `/export/:budgetId` - Export Center

---

## 🎯 Success Metrics

**For Designers:**
- **Time Saved**: 70% reduction in budget creation time
- **Accuracy**: 95% reduction in calculation errors
- **Client Satisfaction**: Faster approval cycles, professional presentation

**For Agencies:**
- **Team Efficiency**: Real-time collaboration, consistent pricing
- **Revenue Growth**: More budgets = more projects = more revenue
- **Client Retention**: Professional tools improve client experience

**For Platform:**
- **User Adoption**: High engagement with core features
- **Retention**: Low churn due to workflow integration
- **Scalability**: Multi-tenant architecture supports growth

---

## 🔮 Future Enhancements

### Planned Features
- **AI-Powered Suggestions**: ML-based item recommendations based on project type and style
- **Vendor Integration**: Direct pricing updates from vendor APIs
- **Mobile App**: Native iOS/Android apps for on-site budget updates
- **Advanced Analytics**: Budget trends, profitability analysis, vendor performance
- **Client Self-Service**: Clients can select items from curated catalogs
- **Purchase Order Management**: Convert approved budgets to POs
- **Invoice Generation**: Create invoices from budgets
- **Time Tracking**: Track time spent on budget creation for profitability analysis

---

## 📄 File Structure

```
/src
  /app
    /components
      /ui                    # Design system components
        button.tsx
        text-input.tsx
        select.tsx
        modal.tsx
        card.tsx
      /BudgetBuilder         # Budget creation components
      /ItemLibrary           # Item library components
      /ClientPortal          # Client approval components
      /figma                 # Imported Figma components
    /routes                  # Route definitions
    /pages                   # Page components
    /utils                   # Helper functions
    App.tsx                  # Main app entry point
  /styles
    theme.css                # Design system tokens
    fonts.css                # Font imports
  /imports                   # Imported assets (SVGs, images)
```

---

## 🤝 Contributing

### Code Standards
- Follow existing design system patterns
- Use TypeScript for all new components
- Maintain WCAG AA accessibility compliance
- Write semantic HTML
- Use Tailwind utility classes consistently

### Component Guidelines
- All new components go in `/src/app/components/`
- UI components go in `/src/app/components/ui/`
- Feature components go in feature-specific folders
- Use proper TypeScript interfaces for props

---

## 📞 Support

For questions, bug reports, or feature requests, contact the development team.

---

**Design SaaS** - Empowering interior designers to create professional budgets with confidence and speed. 🎨✨
