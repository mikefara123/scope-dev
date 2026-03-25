# Budget Workflow - Complete Implementation Spec

This document outlines the comprehensive budget management workflow that needs to be implemented for Project Clarity.

## Status: Partially Implemented ✅❌

**What's Done:**
- ✅ Budget creation modal with project assignment
- ✅ Budget listing page
- ✅ Basic budget builder interface
- ✅ Budget preview page
- ✅ Send for approval modal

**What's Missing:**
- ❌ Spreadsheet-like budget builder (inline editing)
- ❌ Item library integration with search/AI suggestions
- ❌ Add/edit/move/duplicate/delete line items
- ❌ Interim budget creation and tracking
- ❌ Actual cost tracking
- ❌ Customer approval interface
- ❌ Export functionality (PDF with various options)
- ❌ Variance tracking and reporting

---

## Phase 6A: Budget Creation ✅ COMPLETE

### Features Implemented:

1. **"New Budget" Button** ✅
   - Prominent "+" icon button on Budgets page
   - Opens Create Budget modal

2. **Create Budget Modal** ✅
   - Project assignment (required dropdown)
   - Budget name input
   - Phase/stage input
   - Description textarea
   - Default settings (markup %, shipping %, other %)
   - Pulls agency defaults
   - "Create Budget" action

---

## Phase 6B: Enhanced Budget Builder (NEXT TO BUILD)

### 1. Budget Structure

**Organization:**
```
GENERAL (top section)
  - Line items that aren't room-specific
  
ROOM NAME 1
  - Line items for this room
  
ROOM NAME 2
  - Line items for this room
  
MISCELLANEOUS ITEMS (bottom section)
  - Catch-all for other items
```

**Implementation:**
- Sections are collapsible
- Show/hide sections
- Drag-and-drop to reorder sections
- Each section shows subtotal

### 2. Spreadsheet-Like Interface

**Table Columns:**
1. Checkbox (multi-select)
2. Drag handle (reordering)
3. Item Name (editable inline, searchable)
4. Category (auto-filled from library)
5. Quality Level (dropdown: Quality, Premium, Luxury, UltraLux)
6. Quantity (editable)
7. Unit Cost (auto-filled from library based on quality)
8. Markup % (editable)
9. Markup $ (calculated)
10. Shipping % (editable)
11. Shipping $ (calculated)
12. Other % (editable)
13. Other $ (calculated)
14. Tax % (editable)
15. Tax $ (calculated)
16. Total (calculated)
17. Actions (three-dot menu)

**Key Features:**
- Inline editing (no popup boxes)
- Tab to move between fields
- Auto-save on blur
- Real-time calculations
- Keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+D for duplicate)

### 3. "Add Item" Functionality

**Add Item Button:**
- At bottom of each section
- Opens new blank row
- Start typing in Name column
- Auto-search item library as you type

**Item Search:**
- Shows matching items from library
- Displays: Name, Category, Quality prices
- Click to select and auto-fill
- Shows "No results found" if no match

**AI Suggestions (if no match):**
```
┌─────────────────────────────────────────────┐
│ No exact matches found for "custom chair"  │
│                                             │
│ Similar items in library:                  │
│ • Dining Chair - Tables & Cabinets          │
│ • Accent Chair - Sofas & Chairs             │
│ • Office Chair - Home Office                │
│                                             │
│ [+ Add "custom chair" to Library]           │
└─────────────────────────────────────────────┘
```

**Add to Library:**
- Opens modal with fields:
  - Name *
  - Category * (dropdown)
  - Description
  - Quality Price
  - Premium Price
  - Luxury Price
  - UltraLux Price
  - Unit (Each, Linear Foot, Square Foot, etc.)
- Sends request to Agency Admin for approval
- Temporarily adds to budget as "Pending Library Approval"

### 4. Three-Dot Menu Actions

**Per Item:**
```
┌─────────────────────────┐
│ Edit Item               │
│ Move Item               │
│ Duplicate Item          │
│ ──────────────────      │
│ Delete Item             │
└─────────────────────────┘
```

**Edit Item:**
- Unlocks row input fields
- Change any value
- Click outside or press Enter to save

**Move Item:**
```
┌──────────────────────────────────┐
│ Move item to:                    │
│                                  │
│ ○ General                        │
│ ○ Living Room                    │
│ ○ Master Bedroom                 │
│ ○ Kitchen                        │
│ ○ Miscellaneous Items            │
│                                  │
│ [Cancel]  [Move Item]            │
└──────────────────────────────────┘
```

**Duplicate Item:**
- Within Room: Creates copy in same section
- To Other Room: Shows room selector (can select multiple)
- Copies all values including quality, markup, etc.

**Delete Item:**
- Shows confirmation dialog:
```
┌────────────────────────────────────┐
│ Delete Item?                       │
│                                    │
│ Are you sure you want to delete    │
│ "Sofa - 3 Seat" from Living Room? │
│                                    │
│ This action cannot be undone.      │
│                                    │
│ [Cancel]  [Delete]                 │
└────────────────────────────────────┘
```

### 5. Multi-Select Actions

**Ctrl+Click to select multiple items:**
- Selected rows highlight
- Three-dot menu appears above top selected item
- Menu shows:
  - Move Selected Items
  - Duplicate Selected Items
  - Delete Selected Items (# items)

**Example:**
```
┌─────────────────────────────────────┐
│ 3 items selected                    │
│ • Move Selected Items               │
│ • Duplicate Selected Items          │
│ • Delete Selected Items (3)         │
└─────────────────────────────────────┘
```

### 6. Budget View Options

**Toggle between:**
- **By Room** (default)
  - Sections: General → Room 1 → Room 2 → Misc
- **By Category**
  - Sections: Sofas & Chairs → Tables & Cabinets → Lighting → etc.

**Implementation:**
- Toggle button in toolbar
- Re-groups items on the fly
- Maintains all item data

---

## Phase 6C: Interim Budgets

### 1. Approved Budget Locking

**Rules:**
- Once approved, budget becomes READ-ONLY
- Cannot be edited by anyone (even admins)
- Locked indicator on budget card
- "Create Interim Budget" button appears

**Why:**
- Prevents tampering
- Maintains audit trail
- Client sees exactly what they approved
- No backend support needed for "undo approval"

### 2. Create Interim Budget

**Button Location:**
- On approved budget detail page
- Opens modal:

```
┌────────────────────────────────────────┐
│ Create Interim Budget                  │
│                                        │
│ This will create a new budget based    │
│ on the approved version:               │
│                                        │
│ Base Budget: Initial Budget v1.2       │
│ Approved: Jan 20, 2026                 │
│                                        │
│ New Budget Name:                       │
│ [Interim Budget v1.3           ]       │
│                                        │
│ Description:                           │
│ [Updates to living room items  ]       │
│                                        │
│ [Cancel]  [Create Interim Budget]      │
└────────────────────────────────────────┘
```

**Result:**
- Creates new budget linked to parent
- Shows "chain of custody" (digital fingerprint)
- New budget is editable
- Breadcrumb shows lineage

### 3. Interim Budget Features

**Visual Indicators:**
```
Parent Budget: Initial Budget v1.2 → THIS: Interim Budget v1.3
```

**New Columns:**
- "Released?" checkbox (per item)
  - Confirms item has been purchased
  - Locks the item from further edits
  - Used for purchasing summary

**Tracking Changes:**
- Added items: Green shaded row
- Removed items: Red shaded, strikethrough
- Modified items: Orange shaded
- Unchanged items: Normal

**Variance Display:**
```
┌───────────────────────────────────────────┐
│ Budget Variance Summary                   │
│                                           │
│ Previous Approved:    $51,620             │
│ Current Budget:       $54,380             │
│ Variance:            +$2,760 (+5.3%)      │
│                                           │
│ Items Added:          3 items (+$4,200)   │
│ Items Removed:        1 item (-$1,440)    │
│                                           │
│ Purchasing Summary:                       │
│ Released to Date:     $12,450 (22.9%)     │
│ Remaining to Release: $41,930             │
└───────────────────────────────────────────┘
```

---

## Phase 6D: Actual Cost Tracking

### 1. Actual Cost Columns

**Additional columns in budget builder:**
- Actual Net Cost (editable)
- Actual Shipping (editable)
- Actual Other Costs (editable)
- Variance to Budget (calculated)

**Enable via toggle:**
- "Track Actual Costs" switch in toolbar
- Shows/hides actual cost columns
- Available only on approved/interim budgets

### 2. Variance Tracking

**Per Item:**
- Shows $ and % variance
- Color coded:
  - Green: Under budget
  - Red: Over budget
  - Gray: Not yet purchased

**Per Room:**
- Room subtotal variance
- Shows aggregate over/under

**Per Budget:**
- Total budget variance
- Variance by category
- Variance by room

---

## Phase 6E: Approval Workflow

### 1. Send for Approval

**From Budget Builder:**
- "Send for Approval" button
- Opens modal (already exists)
- Select client email addresses
- Add optional message
- Select display options:
  - Line item detail (all costs visible)
  - Summary by room (totals only)
  - Line item cost (product only, tax/shipping at bottom)

### 2. Client Approval Interface

**URL Structure:**
- `/approve/[budgetId]/[token]`
- Public URL (no login required)
- Token validates access

**Interface:**
```
┌─────────────────────────────────────────────┐
│ Budget Approval Request                     │
│                                             │
│ From: Luxe Interiors Design Studio          │
│ Project: Johnson Residence                  │
│ Budget: Initial Budget v1.2                 │
│                                             │
│ [Budget Details Table]                      │
│                                             │
│ Grand Total: $51,620                        │
│                                             │
│ Client Notes (optional):                    │
│ [                                    ]      │
│                                             │
│ ☑ I have reviewed and approve this budget  │
│                                             │
│ Signature:                                  │
│ [                                    ]      │
│                                             │
│ [Reject Budget]  [Approve Budget]           │
└─────────────────────────────────────────────┘
```

**Actions:**
- **Approve**: Locks budget, sends notification to designer
- **Reject**: Adds notes, sends notification, budget stays in draft

### 3. Approval Tracking

**Budget gains:**
- Status: "Approved" or "Rejected"
- Approved by: Client name
- Approved at: Timestamp
- Client notes: Stored with budget
- Digital signature: Image or typed name

**Notifications:**
- Email to designer(s) on project
- In-app notification
- Shows client notes if rejected

---

## Phase 6F: Export Functionality

### 1. Initial Budget Approval Export

**Export button → Opens modal:**
```
┌────────────────────────────────────────┐
│ Export Budget for Approval             │
│                                        │
│ Send To:                               │
│ [client@email.com              ] [+]   │
│                                        │
│ Display Options:                       │
│ ○ Line Item Detail (all costs)         │
│ ○ Summary by Room (totals only)        │
│ ○ Line Item Cost (product + summary)   │
│                                        │
│ Show on Export:                        │
│ ☑ Client Product Cost                  │
│ ☑ Shipping                             │
│ ☑ Other Costs                          │
│ ☑ Sales Tax                            │
│ ☑ Total Item Cost                      │
│                                        │
│ Message (optional):                    │
│ [                              ]       │
│                                        │
│ [Cancel]  [Send for Approval]          │
└────────────────────────────────────────┘
```

**Result:**
- Sends email with PDF attached
- PDF contains approval link
- Logs export in audit trail

### 2. Interim Budget Approval Export

**Same as initial, plus:**
- Show variance to prior budget (checkbox)
- Newly added items (green)
- Removed items (red, strikethrough)
- Variance summary at bottom

### 3. Budget Tracking Report

**Export Options:**
```
┌────────────────────────────────────────┐
│ Export Budget Tracking Report          │
│                                        │
│ Display By:                            │
│ ○ Line Item                            │
│ ○ Room                                 │
│                                        │
│ Show:                                  │
│ ☑ Actual costs vs. budget              │
│ ☑ Variance by item/room                │
│ ☑ Newly added items (green)            │
│ ☑ Removed items (red)                  │
│                                        │
│ Financial Tracking:                    │
│ ☑ Deposits received to date            │
│ ☑ Value of released items              │
│ ☑ Remaining deposit balance            │
│                                        │
│ [Cancel]  [Export PDF]                 │
└────────────────────────────────────────┘
```

### 4. Closeout Export

**Final project report:**
- 100% actual costs
- Variance to original budget (optional)
- Final deposit reconciliation:
  - Total deposits received
  - Total spent
  - Final balance (refund or owed)

---

## Phase 6G: Additional Features

### 1. DocuSign Integration (Optional)

**If budget allows:**
- Integrate DocuSign API
- Send budget as DocuSign envelope
- Legally binding e-signature
- Automatic return and storage

**If not:**
- Internal approval system (as specified above)
- Digital signature capture
- Timestamp and IP logging
- PDF generation with signature

### 2. Keyboard Shortcuts

**Budget Builder:**
- `Tab` - Move to next cell
- `Enter` - Save cell and move down
- `Ctrl+C` - Copy item
- `Ctrl+V` - Paste item
- `Ctrl+D` - Duplicate item
- `Ctrl+S` - Save budget
- `Ctrl+Z` - Undo
- `Delete` - Delete selected items

### 3. Drag and Drop

**Line Items:**
- Drag handle on left of each row
- Drag to reorder within section
- Drag to move between sections
- Visual indicator while dragging

**Sections:**
- Drag to reorder sections (General, Rooms, Misc)

---

## Implementation Priority

### Phase 6B (High Priority - Core Budget Builder)
1. Spreadsheet-like table with inline editing
2. Item library search/integration
3. Add item functionality
4. Three-dot menu (Edit, Move, Duplicate, Delete)
5. Multi-select actions

### Phase 6C (High Priority - Interim Budgets)
1. Lock approved budgets
2. Create interim budget from approved
3. Track changes (added/removed/modified)
4. Variance display
5. Released items tracking

### Phase 6D (Medium Priority - Actual Costs)
1. Actual cost columns
2. Variance tracking
3. Over/under budget indicators

### Phase 6E (High Priority - Approvals)
1. Client approval interface
2. Public approval URL
3. Signature capture
4. Approve/reject workflow
5. Notifications

### Phase 6F (Medium Priority - Exports)
1. PDF export with options
2. Email delivery
3. Variance reports
4. Tracking reports
5. Closeout reports

### Phase 6G (Low Priority - Polish)
1. Keyboard shortcuts
2. Drag and drop
3. DocuSign integration

---

## Technical Considerations

### 1. Data Model Updates Needed

```typescript
// Budget
interface Budget {
  // Existing fields...
  parentBudgetId?: string; // For interim budgets
  isLocked: boolean; // Approved budgets are locked
  approvedBy?: string; // Client name
  approvedAt?: Date;
  approvedSignature?: string; // Image URL or typed name
  clientNotes?: string;
  approvalToken?: string; // For public approval link
}

// LineItem
interface LineItem {
  // Existing fields...
  isReleased?: boolean; // Purchased?
  actualNetCost?: number;
  actualShipping?: number;
  actualOther?: number;
  changeType?: 'added' | 'removed' | 'modified' | null; // For interim budgets
  libraryItemApprovalStatus?: 'approved' | 'pending' | null;
}
```

### 2. API Endpoints Needed

```
POST   /api/budgets                    - Create budget
PUT    /api/budgets/:id                - Update budget
POST   /api/budgets/:id/interim        - Create interim budget
POST   /api/budgets/:id/send-approval  - Send for approval
POST   /api/budgets/:id/approve        - Client approval
POST   /api/budgets/:id/reject         - Client rejection
GET    /api/budgets/:id/export         - Export PDF
POST   /api/line-items                 - Add line item
PUT    /api/line-items/:id             - Update line item
DELETE /api/line-items/:id             - Delete line item
POST   /api/line-items/bulk-move       - Move multiple items
POST   /api/line-items/bulk-duplicate  - Duplicate multiple items
```

### 3. State Management

Consider using:
- React Query (for server state)
- Zustand (for local state)
- Immer (for immutable updates)

Or stick with useState + useContext for now.

---

## Success Criteria

✅ Budget creation is intuitive and quick  
✅ Budget builder feels like Excel/Google Sheets  
✅ Item library integration is seamless  
✅ Approved budgets are truly locked  
✅ Interim budgets clearly show changes  
✅ Client approval is professional and easy  
✅ Exports match approved budgets 100%  
✅ Variance tracking is automatic  
✅ No backend support needed for approval issues  

---

**Last Updated:** January 28, 2026  
**Status:** Specification complete, ready for implementation  
**Estimated Effort:** 3-4 weeks for full implementation
