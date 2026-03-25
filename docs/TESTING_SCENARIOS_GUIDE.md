# Mock Data Testing Scenarios Guide

## Overview
The expanded mock data now includes **8 projects** and **13 budgets** covering diverse scenarios to test all application features comprehensively.

---

## 📋 Projects Overview

### Project 1: Johnson Residence - McLean Modern Renovation
**Status:** Active | **Budget:** $245,000 | **Type:** Residential Luxury

**Key Features:**
- 6 rooms (Living Room, Master Bedroom, Kitchen, Dining Room, Guest Bedroom, Home Office)
- 3 phases
- Premium quality default
- Multiple budgets at different lifecycle stages

**Budgets:**
1. **b1** - Initial Budget v1.2 - ✅ **Approved** (Phase 1)
   - 22 line items
   - Living Room, Kitchen, Dining Room
   - Total: $59,229
   - *Test: View approved budget, Excel export*

2. **b2** - Phase 2 Budget v1.0 - 🕐 **Pending Client** (Phase 2)
   - 18 line items
   - Master Bedroom, Home Office
   - Total: $41,042
   - *Test: Send for approval workflow*

3. **b2-interim** - Phase 2 Budget v1.1 - 📝 **Draft** (Phase 2)
   - 7 line items
   - Interim budget after changes
   - Total: $28,718
   - *Test: Interim budget creation, change tracking*

4. **b3-draft** - Final Touches Budget v1.0 - 📝 **Draft** (Phase 3)
   - 0 line items (empty)
   - Total: $0
   - *Test: Creating new budget from scratch*

**Testing Scenarios:**
- ✅ Multiple budget versions
- ✅ Budget lifecycle (Draft → Pending → Approved)
- ✅ Interim budget workflow
- ✅ Empty budget initialization

---

### Project 2: Smith Penthouse - Downtown Luxury Penthouse
**Status:** Active | **Budget:** $580,000 | **Type:** Ultra-Luxury

**Key Features:**
- 4 rooms (Great Room, Master Suite, Chef Kitchen, Terrace)
- 2 phases
- UltraLux quality default
- High-value items (>$20k each)
- 35% markup

**Budgets:**
1. **b3** - Penthouse Master Budget v2.1 - 🕐 **Pending Client** (Phase 1)
   - 5 luxury line items
   - Designer furniture, Murano glass chandelier
   - Total: $175,862
   - *Test: Ultra-luxury pricing, high markups*

2. **b4** - Penthouse Master Budget v2.0 - ❌ **Changes Requested** (Phase 1)
   - 3 line items (rejected version)
   - Total: $94,543
   - *Test: Budget rejection workflow, client feedback*

3. **b5** - Outdoor Living Budget v1.0 - 📝 **Draft** (Phase 2)
   - 0 line items (empty)
   - Total: $0
   - *Test: Phase 2 planning*

**Testing Scenarios:**
- ✅ Ultra-luxury price points
- ✅ Budget rejection and revision
- ✅ Version control (v2.0 → v2.1)
- ✅ High markup percentages
- ✅ Large individual item costs

---

### Project 3: Williams Estate - Country Estate Redesign
**Status:** Active | **Budget:** $425,000 | **Type:** Traditional Luxury

**Key Features:**
- 3 rooms (Formal Living, Library, Wine Cellar)
- 1 phase (complete project)
- Luxury quality default
- Status: Active (completed project)

**Budgets:**
1. **b6** - Estate Furnishings v1.0 - ✅ **Approved** (Phase 1)
   - 15 line items
   - Dining Room, Home Office
   - Total: $43,683
   - Approved: December 2025
   - *Test: Historical/completed project data*

**Testing Scenarios:**
- ✅ Completed project workflow
- ✅ Single-phase project
- ✅ Traditional design aesthetic
- ✅ Historical date ranges

---

### Project 4: Martinez Loft - Industrial Chic Conversion
**Status:** Active | **Budget:** $180,000 | **Type:** Budget-Conscious

**Key Features:**
- 3 rooms (Open Living Area, Bedroom Suite, Kitchen)
- 2 phases
- Quality tier default (most affordable)
- 28% markup
- Industrial/modern aesthetic

**Budgets:**
1. **b7** - Loft Essentials v1.0 - ✅ **Approved** (Phase 1)
   - 5 line items
   - Quality-tier items
   - Total: $8,251
   - *Test: Budget-friendly pricing*

2. **b8** - Loft Finishes v1.0 - 🕐 **Pending Client** (Phase 2)
   - 4 line items
   - Mixed quality tiers
   - Total: $21,068
   - *Test: Phase 2 approval workflow*

**Testing Scenarios:**
- ✅ Budget-conscious pricing
- ✅ Quality tier items
- ✅ Lower markup percentages
- ✅ Industrial/loft design style
- ✅ Smaller budget totals

---

### Project 5: Chen Family - Contemporary Townhouse
**Status:** Active | **Budget:** $195,000 | **Type:** Modern Family

**Key Features:**
- 6 rooms (Living, Dining, Kitchen, Master, 2 Kids Bedrooms)
- 2 phases
- Premium quality default
- Multi-generational living
- Smart home integration

**Budgets:**
1. **b9** - Townhouse Phase 1 v1.0 - 📝 **Draft** (Phase 1)
   - 7 line items
   - Living Room, Kitchen
   - Total: $36,877
   - *Test: In-progress budget creation*

**Testing Scenarios:**
- ✅ Family-focused design
- ✅ Contemporary style
- ✅ Multi-room townhouse
- ✅ Recently created project (Jan 2026)
- ✅ Draft budget editing

---

### Project 6: TechStart Office - Startup Office Design
**Status:** Active | **Budget:** $280,000 | **Type:** Commercial

**Key Features:**
- 4 commercial spaces (Open Work Area, Conference Rooms, Break Room, Reception)
- 1 phase
- Quality tier default
- 25% markup (commercial rate)
- 50-person capacity

**Budgets:**
1. **b10** - Office Buildout v1.0 - 🕐 **Pending Client** (Phase 1)
   - 5 line items with high quantities (25 desks, 25 chairs)
   - Total: $72,994
   - *Test: Commercial project, bulk quantities*

**Testing Scenarios:**
- ✅ Commercial vs. residential
- ✅ Bulk item quantities
- ✅ Office furniture categories
- ✅ Different markup structure
- ✅ Corporate client workflow

---

### Project 7: Anderson Brownstone - Historic Brownstone Restoration
**Status:** ✅ Completed | **Budget:** $350,000 | **Type:** Historic

**Key Features:**
- 3 rooms (Parlor, Formal Dining, Study)
- 1 phase (Complete Restoration)
- Luxury quality default
- Historical preservation focus
- Project dates: Oct 2025 - Dec 2025

**Budgets:**
1. **b11** - Restoration Furnishings v1.0 - ✅ **Approved** (Complete)
   - 15 line items
   - Traditional/historic style
   - Total: $48,590
   - *Test: Completed/archived project*

**Testing Scenarios:**
- ✅ Completed project status
- ✅ Historical restoration
- ✅ Traditional design elements
- ✅ Archived data viewing
- ✅ Past date ranges

---

### Project 8: Rivera Beach House - Coastal Modern Retreat
**Status:** Active | **Budget:** $290,000 | **Type:** Vacation Home

**Key Features:**
- 4 spaces (Great Room, Master Suite, Guest Bedrooms, Deck & Outdoor)
- 2 phases
- Premium quality default
- 7% shipping (coastal location)
- Beach/coastal design

**Budgets:**
1. **b12** - Beach House Interior v1.0 - ✅ **Approved** (Phase 1)
   - 12 line items
   - Living Room, Master Bedroom
   - Total: $52,486
   - *Test: Coastal project, higher shipping costs*

2. **b13** - Outdoor Living v1.0 - 📝 **Draft** (Phase 2)
   - 0 line items (empty)
   - Total: $0
   - *Test: Outdoor furniture planning*

**Testing Scenarios:**
- ✅ Coastal/beach design
- ✅ Higher shipping percentages
- ✅ Vacation home workflow
- ✅ Indoor/outdoor phases
- ✅ Out-of-state project

---

## 🎯 Testing Scenarios by Feature

### Budget Status Testing
- **Draft:** b2-interim, b3-draft, b5, b9, b13 (5 budgets)
- **Pending Client:** b2, b3, b8, b10 (4 budgets)
- **Approved:** b1, b6, b7, b11, b12 (5 budgets)
- **Changes Requested:** b4 (1 budget)

### Quality Tier Testing
- **Quality:** b7, b8, b10 (Martinez Loft, TechStart Office)
- **Premium:** b1, b2, b9, b12 (Most projects)
- **Luxury:** b6, b11 (Williams Estate, Anderson Brownstone)
- **UltraLux:** b3, b4 (Smith Penthouse)

### Price Range Testing
- **Under $10k:** b7 ($8,251)
- **$20k-$50k:** b2-interim, b6, b8, b9, b11, b12
- **$50k-$100k:** b1, b10
- **Over $100k:** b3 ($175,862), b4 ($94,543)

### Item Category Testing
Each budget includes diverse categories:
- **Furniture:** Sofas, chairs, tables, beds, dressers
- **Lighting:** Chandeliers, pendants, floor lamps, table lamps
- **Window Treatments:** Drapery, shades, roman shades
- **Floor Covering:** Area rugs, runners
- **Artwork & Accessories:** Canvas art, sculptures, pillows

### Room Testing
Diverse room types across projects:
- **Residential:** Living Room, Master Bedroom, Kitchen, Dining Room, Home Office, Guest Bedroom
- **Commercial:** Open Work Area, Conference Rooms, Break Room, Reception
- **Special:** Wine Cellar, Library, Terrace, Deck & Outdoor

### Markup Testing
- **25%:** TechStart Office (commercial rate)
- **28%:** Martinez Loft (budget-conscious)
- **30%:** Johnson Residence, Chen Family, Rivera Beach House (standard residential)
- **32%:** Williams Estate, Anderson Brownstone (luxury residential)
- **35%:** Smith Penthouse (ultra-luxury)

### Quantity Testing
- **Single items:** Most furniture pieces (qty: 1)
- **Pairs:** Nightstands, lamps (qty: 2)
- **Sets:** Dining chairs (qty: 4-12)
- **Bulk:** Office desks/chairs (qty: 25)
- **By measurement:** Drapery yards (qty: 18-24)

---

## 🔍 Specific Test Cases

### Test Case 1: Drag & Drop with Filters
1. Open **b1** (Johnson Residence - Initial Budget)
2. Filter by Category: "Furniture"
3. Drag Coffee Table above Sectional Sofa
4. Verify reordering persists

### Test Case 2: Sorting Multi-Room Budget
1. Open **b1** (22 items across 3 rooms)
2. Sort by "Total" descending
3. Verify all rooms maintain integrity
4. Sort by "Category" ascending
5. Verify items grouped correctly

### Test Case 3: Real-Time Preview
1. Open **b2** (Pending Client)
2. Click "Send for Approval"
3. Toggle "Show Markup %" off → preview hides markup
4. Change breakdown to "Product Only" → preview updates
5. Add custom message → preview shows message

### Test Case 4: Empty Budget Creation
1. Open **b3-draft** (empty budget)
2. Add new room "Foyer"
3. Add items from library
4. Test drag and drop with minimal data

### Test Case 5: Bulk Quantities
1. Open **b10** (Office Buildout)
2. Verify 25 desks shown as single line item
3. Check total calculation: 25 × $1,062 = $26,550
4. Test editing quantity field

### Test Case 6: Ultra-Luxury Pricing
1. Open **b3** (Smith Penthouse)
2. Verify items over $20,000 each
3. Check 35% markup calculations
4. Test currency formatting for large numbers

### Test Case 7: Budget Rejection Workflow
1. View **b4** (Changes Requested status)
2. Note rejection date
3. Compare to **b3** (revised version)
4. Identify changes made

### Test Case 8: Completed Project
1. View **Project 7** (Anderson Brownstone)
2. Check "Completed" status
3. View **b11** (approved budget)
4. Verify historical dates (Nov 2025)

### Test Case 9: Category Filtering
1. Open **b1** (diverse categories)
2. Filter: Category = "Lighting"
3. Verify only Floor Lamp, Pendant Lights visible
4. Filter: Category = "Furniture"
5. Count items in each room

### Test Case 10: Phase Management
1. View **Project 1** (3 phases)
2. Check Phase 1 budget (approved)
3. Check Phase 2 budget (pending)
4. Check Phase 3 budget (draft/empty)
5. Test phase progression workflow

---

## 📊 Data Statistics

### Projects by Status
- **Active:** 7 projects
- **Completed:** 1 project (Anderson Brownstone)

### Projects by Type
- **Residential:** 7 projects
- **Commercial:** 1 project (TechStart Office)

### Budgets by Status
- **Draft:** 5 budgets (38%)
- **Pending Client:** 4 budgets (31%)
- **Approved:** 4 budgets (31%)
- **Changes Requested:** 1 budget (8%)

### Budget Value Range
- **Minimum:** $0 (empty drafts)
- **Maximum:** $175,862 (Smith Penthouse)
- **Average:** ~$45,000 (non-zero budgets)
- **Total:** $585,485 (all budgets)

### Line Items
- **Total Across All Budgets:** 120+ line items
- **Categories Represented:** 6 (Furniture, Lighting, Window Treatments, Floor Covering, Artwork & Accessories, Technology)
- **Room Types:** 20+ unique rooms
- **Quality Tiers Used:** All 4 (Quality, Premium, Luxury, UltraLux)

---

## 🚀 Quick Start Testing Guide

### Test the Budget Builder Enhancements

1. **Navigate to Budget Builder**
   ```
   Projects → Johnson Residence → Initial Budget (b1) → Edit
   ```

2. **Test Drag & Drop**
   - Grab any item by grip handle
   - Drag to reorder
   - Drag between rooms (e.g., Kitchen to Dining Room)

3. **Test Sorting**
   - Click "Item Name" header → sorts A-Z
   - Click again → sorts Z-A
   - Try "Total" column → sorts by price

4. **Test Search & Filter**
   - Search: "sofa" → finds sectional
   - Filter Category: "Lighting" → shows lamps only
   - Filter Phase: "Phase 1" → shows phase items
   - Click "Clear Filters" → resets

5. **Test Real-Time Preview**
   - Click "Send for Approval"
   - Toggle options on left
   - Watch preview update on right
   - Try all display options

6. **Test Section Management**
   - View totals under each section
   - Click + to add new room
   - Click + next to section to add item

### Test Different Scenarios

1. **Ultra-Luxury:** Project 2 → Budget b3
2. **Budget-Conscious:** Project 4 → Budget b7
3. **Commercial:** Project 6 → Budget b10
4. **Empty Budget:** Project 1 → Budget b3-draft
5. **Rejected Budget:** Project 2 → Budget b4

---

## 🎨 Visual Testing Checklist

- [ ] Drag visual feedback (opacity, cursor)
- [ ] Sort icons display correctly (↑↓⇅)
- [ ] Filter dropdown population
- [ ] Clear filters button visibility
- [ ] Section totals formatting
- [ ] Category badge styling
- [ ] Empty state for b3-draft, b5, b13
- [ ] Large number formatting ($175,862)
- [ ] Preview layout (split-screen)
- [ ] Status badge colors
- [ ] Bulk quantity display (25 desks)

---

## 🐛 Edge Cases to Test

1. **Empty Budget**
   - Open b3-draft, b5, or b13
   - Verify no errors with 0 items
   - Test adding first item

2. **Single Item Budget**
   - Create budget with 1 item
   - Test drag (should do nothing)
   - Test sort (no change)

3. **Large Quantities**
   - View b10 office budget
   - Verify 25× calculations correct
   - Test editing quantity

4. **Long Item Names**
   - Check text truncation
   - Hover for full text
   - Verify responsive layout

5. **Multiple Rooms with Same Name**
   - Try adding duplicate room
   - Verify behavior

6. **Filter with No Results**
   - Filter Category: "Technology"
   - Verify "no items" state or empty display

7. **Special Characters**
   - Item names with quotes
   - Room names with ampersands
   - Verify proper escaping

---

## 📚 Additional Resources

### Related Files
- `/src/app/pages/BudgetBuilder.tsx` - Main component
- `/src/app/components/budgets/SendForApprovalModal.tsx` - Preview modal
- `/src/app/data/mockData.ts` - This data file
- `/src/app/data/types.ts` - TypeScript interfaces

### Testing Tools
- React DevTools - Component inspection
- Browser DevTools - Network/console monitoring
- React DnD DevTools - Drag and drop debugging

---

## 🎉 Summary

The expanded mock data provides comprehensive coverage for testing all budget management features:

✅ **8 diverse projects** (residential, commercial, luxury, budget-conscious)  
✅ **13 budgets** covering all workflow stages  
✅ **120+ line items** across 6 categories  
✅ **All 4 quality tiers** represented  
✅ **Various price ranges** ($0 - $175k)  
✅ **Multiple statuses** (draft, pending, approved, rejected)  
✅ **Edge cases** (empty budgets, bulk quantities, ultra-luxury)  
✅ **Historical data** (completed projects)  

Happy testing! 🚀
