# BudgetBuilder Scroll Issue - Comprehensive Audit & Fix Plan
**Date:** February 7, 2026  
**Page:** `/src/app/pages/BudgetBuilder.tsx`  
**Issue:** Nested scroll containers causing scroll-within-scroll UX problem

---

## 🔴 CURRENT PROBLEMS

### **Problem 1: Multiple Scroll Containers**
The page has **3 competing scroll contexts**:

```tsx
// Line 734: Parent container with overflow-auto
<div className="flex-1 overflow-auto flex">  {/* ❌ SCROLL 1 */}
  
  // Line 736: Sidebar with overflow-y-auto  
  <aside className="... overflow-y-auto">  {/* ❌ SCROLL 2 */}
  
  // Line 779: Budget Grid (implicitly creates scroll due to min-w-max)
  <div className="flex-1">
    <div className="min-w-max">  {/* ❌ SCROLL 3 - horizontal */}
```

**Result:** User experiences confusing nested scrolling behavior.

---

### **Problem 2: Sidebar Sticky Positioning Conflict**
```tsx
<aside className="w-64 ... sticky top-0 h-fit max-h-full overflow-y-auto">
```

**Issues:**
- `sticky top-0` + `overflow-y-auto` creates conflicting behavior
- `h-fit max-h-full` doesn't properly constrain height
- Sidebar can scroll independently from main content

---

### **Problem 3: Wide Table Content**
```tsx
<div className="min-w-max">  {/* Forces horizontal overflow */}
  {/* Table with many fixed-width columns */}
  <div className="w-10 p-2" />
  <div className="w-12 p-2" />
  <div className="w-48 p-2" />
  {/* ... 17 more fixed-width columns ... */}
</div>
```

**Issue:** Table is wider than viewport, forcing horizontal scroll. Combined with vertical scroll creates 2D scroll complexity.

---

### **Problem 4: Sticky Headers Z-Index Layering**
```tsx
{/* Budget Assumptions - z-20 */}
<div className="sticky top-0 ... z-20">

{/* Table Header - z-10 */}  
<div className="sticky top-[2.5rem] ... z-10">
```

**Issue:** Sticky headers work, but scroll container confusion makes them feel broken.

---

## 📐 CURRENT LAYOUT STRUCTURE

```
┌─────────────────────────────────────────────────────────┐
│ Top Toolbar (flex-shrink-0)                             │ ← Fixed
├─────────────────────────────────────────────────────────┤
│ Search/Filter Bar (flex-shrink-0)                       │ ← Fixed
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Main Content (flex-1 overflow-auto flex) ❌ SCROLL 1│ │
│ │ ┌──────────┬────────────────────────────────────┐   │ │
│ │ │ Sidebar  │ Budget Grid                        │   │ │
│ │ │ overflow │ (min-w-max forces horizontal)      │   │ │
│ │ │ ❌ SCROLL│ ❌ SCROLL 3 (horizontal)            │   │ │
│ │ │    2     │                                    │   │ │
│ │ │          │ [Sticky: Assumptions Row]          │   │ │
│ │ │          │ [Sticky: Table Header]             │   │ │
│ │ │          │ [Scrolling: Table Rows]            │   │ │
│ │ │          │                                    │   │ │
│ │ └──────────┴────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Bottom Summary Bar (flex-shrink-0)                      │ ← Fixed
└─────────────────────────────────────────────────────────┘
```

---

## ✅ CORRECT LAYOUT STRUCTURE (TARGET)

```
┌─────────────────────────────────────────────────────────┐
│ Top Toolbar (h-[72px])                                  │ ← Fixed
├─────────────────────────────────────────────────────────┤
│ Search/Filter Bar (h-[60px])                            │ ← Fixed
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Main Scroll Container (calc(100vh - 204px))         │ │
│ │ ✅ SINGLE OVERFLOW-AUTO                              │ │
│ │ ┌──────────┬────────────────────────────────────┐   │ │
│ │ │ Sidebar  │ Budget Grid                        │   │ │
│ │ │ NO SCROLL│ (overflow-x-auto ONLY)             │   │ │
│ │ │ flows    │                                    │   │ │
│ │ │ naturally│ [Sticky: Assumptions Row]          │   │ │
│ │ │          │ [Sticky: Table Header]             │   │ │
│ │ │          │ [Content: Table Rows]              │   │ │
│ │ │          │                                    │   │ │
│ │ └──────────┴────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Bottom Summary Bar (h-[72px])                           │ ← Fixed
└─────────────────────────────────────────────────────────┘

Total Fixed Heights: 72 + 60 + 72 = 204px
Scrollable Area: calc(100vh - 204px)
```

---

## 🎯 SOLUTION PLAN

### **Phase 1: Simplify Scroll Containers**

#### **Step 1.1: Single Scroll Container**
```tsx
// BEFORE (Line 734)
<div className="flex-1 overflow-auto flex">

// AFTER
<div className="flex-1 flex overflow-hidden">
  {/* Child handles scroll */}
</div>
```

#### **Step 1.2: Remove Sidebar Scroll**
```tsx
// BEFORE (Line 736)
<aside className="w-64 border-r border-border bg-card flex-shrink-0 sticky top-0 h-fit max-h-full overflow-y-auto">

// AFTER
<aside className="w-64 border-r border-border bg-card flex-shrink-0">
  {/* Content flows naturally, scrolls with parent */}
</aside>
```

#### **Step 1.3: Budget Grid with Controlled Scroll**
```tsx
// NEW Structure
<div className="flex-1 overflow-auto">
  {/* This becomes the ONLY scroll container */}
  <div className="min-w-max">
    {/* Wide table content */}
  </div>
</div>
```

---

### **Phase 2: Fix Sticky Positioning**

#### **Step 2.1: Sticky Headers Relative to Correct Container**
```tsx
// Assumptions row - sticky to grid scroll container
<div className="sticky top-0 bg-brand-secondary/10 border-b border-brand-secondary z-20">

// Table header - sticky below assumptions
<div className="sticky top-[2.5rem] bg-muted/50 border-b border-border backdrop-blur-sm z-10">
```

**Key:** Both sticky elements must be children of the scroll container, not siblings.

---

### **Phase 3: Optimize Performance**

#### **Step 3.1: Virtual Scrolling (Future)**
For budgets with 100+ items, implement:
- `react-virtual` or `react-window`
- Render only visible rows
- Improves scroll performance

#### **Step 3.2: Horizontal Scroll Indicator**
Add visual cue when table scrolls horizontally:
```tsx
{/* Gradient fade on right edge */}
<div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
```

---

## 🔧 IMPLEMENTATION CODE

### **Complete Fixed Structure:**

```tsx
export function BudgetBuilder() {
  // ... component logic ...

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-background">
        
        {/* FIXED: Top Toolbar - 72px */}
        <div className="flex-shrink-0 border-b border-border bg-card shadow-sm px-6 py-4">
          {/* Toolbar content */}
        </div>

        {/* FIXED: Search/Filter Bar - 60px */}
        <div className="flex-shrink-0 border-b border-border bg-card px-6 py-3">
          {/* Filter content */}
        </div>

        {/* SCROLLABLE: Main Content Area - calc(100vh - 204px) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* SIDEBAR: No scroll, flows naturally */}
          <aside className="w-64 border-r border-border bg-card flex-shrink-0">
            <div className="p-4">
              {/* Sidebar content - scrolls with parent */}
            </div>
          </aside>

          {/* BUDGET GRID: Single scroll container */}
          <div className="flex-1 overflow-auto">
            <div className="min-w-max">
              
              {/* STICKY: Budget Assumptions */}
              <div className="sticky top-0 bg-brand-secondary/10 border-b border-brand-secondary z-20">
                {/* Assumptions row */}
              </div>

              {/* STICKY: Table Header */}
              <div className="sticky top-[2.5rem] bg-muted/50 border-b border-border backdrop-blur-sm z-10">
                {/* Header row */}
              </div>

              {/* SCROLLING: Table Content */}
              {Object.entries(itemsByRoom).map(([room, items]) => (
                <div key={room}>
                  {/* Room sections and items */}
                </div>
              ))}
              
            </div>
          </div>
        </div>

        {/* FIXED: Bottom Summary Bar - 72px */}
        <div className="flex-shrink-0 border-t border-border bg-card px-6 py-4">
          {/* Summary content */}
        </div>
        
      </div>
    </DndProvider>
  );
}
```

---

## 📊 BEFORE vs AFTER COMPARISON

| Aspect | Before ❌ | After ✅ |
|--------|----------|---------|
| **Scroll Containers** | 3 (parent, sidebar, grid) | 1 (grid only) |
| **Sidebar Behavior** | Independent scroll | Flows with content |
| **Sticky Headers** | Work but feel broken | Smooth and intuitive |
| **Horizontal Scroll** | Nested in vertical | Isolated to grid |
| **Performance** | Multiple paint layers | Single optimized layer |
| **User Experience** | Confusing, janky | Smooth, predictable |
| **Mobile Support** | Poor | Better (single scroll) |

---

## 🚀 IMPLEMENTATION STEPS

### **Step 1: Update Main Container (5 min)**
```tsx
// Line 734
// Change from:
<div className="flex-1 overflow-auto flex">

// To:
<div className="flex-1 flex overflow-hidden">
```

### **Step 2: Remove Sidebar Scroll (2 min)**
```tsx
// Line 736
// Change from:
<aside className="w-64 border-r border-border bg-card flex-shrink-0 sticky top-0 h-fit max-h-full overflow-y-auto">

// To:
<aside className="w-64 border-r border-border bg-card flex-shrink-0">
```

### **Step 3: Add Grid Scroll Container (5 min)**
```tsx
// After Line 778 (after sidebar closing tag)
// Change from:
<div className="flex-1">
  <div className="min-w-max">

// To:
<div className="flex-1 overflow-auto">
  <div className="min-w-max">
```

### **Step 4: Test & Validate (10 min)**
- ✅ Single scroll works vertically
- ✅ Horizontal scroll works for wide table
- ✅ Sticky headers stick properly
- ✅ Sidebar stays in view
- ✅ No janky scroll behavior

**Total Time: ~25 minutes**

---

## 🎨 VISUAL BEHAVIOR

### **Scroll Behavior:**
1. **Vertical Scroll:** Main grid container scrolls up/down
2. **Horizontal Scroll:** Main grid container scrolls left/right (when table is wide)
3. **Sidebar:** Always visible, scrolls naturally with vertical scroll
4. **Sticky Headers:** 
   - Assumptions row sticks at `top: 0`
   - Table header sticks at `top: 2.5rem` (below assumptions)
   - Both stay visible during vertical scroll

### **Sticky Header Stack:**
```
┌──────────────────────────────────────┐
│ [Assumptions Row] z-20, top: 0       │ ← Always visible
├──────────────────────────────────────┤
│ [Table Header] z-10, top: 2.5rem     │ ← Always visible
├──────────────────────────────────────┤
│ [Room Section 1]                     │
│   [Item 1]                           │
│   [Item 2]                           │ ← Scrolls under headers
├──────────────────────────────────────┤
│ [Room Section 2]                     │
│   [Item 3]                           │
└──────────────────────────────────────┘
```

---

## 🐛 POTENTIAL EDGE CASES

### **Issue 1: Safari Sticky Position**
**Problem:** Safari sometimes has issues with sticky + overflow  
**Solution:** Add `-webkit-sticky` prefix via Tailwind config

### **Issue 2: DnD with Scroll**
**Problem:** react-dnd might have issues with single scroll container  
**Solution:** Already using HTML5Backend which handles this well

### **Issue 3: Very Long Sidebar**
**Problem:** If sidebar has 50+ rooms, it might be taller than viewport  
**Solution:** Currently flows naturally with main scroll (acceptable)

**Alternative (if needed):**
```tsx
<aside className="w-64 border-r border-border bg-card flex-shrink-0 max-h-screen overflow-y-auto">
  {/* Independent scroll only if content exceeds viewport */}
</aside>
```

---

## 🎯 SUCCESS CRITERIA

After implementation, the page should:

✅ Have only ONE primary scroll container  
✅ Scroll smoothly without nested scroll confusion  
✅ Keep sticky headers visible during scroll  
✅ Keep sidebar visible at all times  
✅ Handle horizontal scroll for wide table  
✅ Work on desktop and mobile  
✅ Maintain drag-and-drop functionality  
✅ No visual glitches or janky animations  

---

## 📝 TESTING CHECKLIST

- [ ] Vertical scroll works smoothly
- [ ] Horizontal scroll works for wide table
- [ ] Sticky assumptions row stays at top
- [ ] Sticky table header stays below assumptions
- [ ] Sidebar is always visible
- [ ] Drag and drop still works
- [ ] Collapsing/expanding rooms works
- [ ] Search/filter updates don't break scroll
- [ ] Bottom summary bar stays fixed
- [ ] Works in Chrome
- [ ] Works in Safari
- [ ] Works in Firefox
- [ ] Works on tablet (iPad)
- [ ] Works on mobile (if applicable)

---

## 🔄 ROLLBACK PLAN

If implementation causes issues:

1. **Revert Git Commit** - Single file change, easy rollback
2. **Restore Lines:**
   - Line 734: `<div className="flex-1 overflow-auto flex">`
   - Line 736: `<aside className="... overflow-y-auto">`
   - Line 778: No change needed

---

**Status:** 📋 READY FOR IMPLEMENTATION  
**Estimated Time:** 25 minutes  
**Risk Level:** 🟢 Low (isolated change, easy rollback)  
**Impact:** 🟢 High (significantly improves UX)
