# CSS Quick Reference Guide

## 🎨 Color Tokens - Cheat Sheet

### Most Common Tokens

```css
/* Backgrounds */
--background          /* Main app background: #f1f5f9 */
--card                /* White cards/panels: #ffffff */
--muted               /* Subtle backgrounds: #f1f5f9 */

/* Text */
--foreground          /* Main text: #1e293b */
--muted-foreground    /* Secondary text: #64748b */

/* Borders */
--border              /* Standard borders: #e2e8f0 */
--border-strong       /* Emphasis borders: #cbd5e1 */

/* Interactive */
--primary             /* Navy: #1a365d */
--secondary           /* Teal: #14b8a6 */
--destructive         /* Red: #ef4444 */

/* Status */
--color-success       /* Green: #10b981 */
--color-warning       /* Amber: #f59e0b */
--color-error         /* Red: #ef4444 */
--color-info          /* Blue: #3b82f6 */
```

## 🔧 Common Patterns

### Card Component
```tsx
<div className="bg-card text-card-foreground border-border rounded-lg p-6 shadow-soft">
  <h2>Card Title</h2>
  <p className="text-muted-foreground">Description text</p>
</div>
```

### Button Variants
```tsx
<Button variant="default">Primary Action</Button>      {/* Navy */}
<Button variant="secondary">Secondary</Button>         {/* Teal */}
<Button variant="destructive">Delete</Button>          {/* Red */}
<Button variant="outline">Cancel</Button>              {/* Outlined */}
<Button variant="ghost">Subtle</Button>                {/* No background */}
```

### Status Badge
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Inactive</Badge>
<Badge variant="default">Default</Badge>
```

### Input Field
```tsx
<Input 
  className="bg-input-background border-input-border focus:border-input-border-focus"
  placeholder="Enter text..."
/>
```

### Alert/Notice Box
```tsx
{/* Success */}
<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <p className="text-green-800">Success message</p>
</div>

{/* Warning */}
<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
  <p className="text-amber-800">Warning message</p>
</div>

{/* Error */}
<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <p className="text-red-800">Error message</p>
</div>
```

## 🎯 Contrast Rules

### ✅ GOOD Combinations

```tsx
/* Dark text on light backgrounds */
<div className="bg-card text-card-foreground" />
<div className="bg-muted text-muted-foreground" />

/* Light text on dark backgrounds */
<div className="bg-primary text-primary-foreground" />
<div className="bg-secondary text-secondary-foreground" />

/* Semantic colors with proper text */
<div className="bg-[--color-success] text-white" />
```

### ❌ AVOID These

```tsx
/* White on white */
<div className="bg-card text-white" />  ❌

/* Light on light */
<div className="bg-accent text-white" />  ❌

/* Dark on dark */
<div className="bg-primary text-primary" />  ❌

/* Same color for background and border */
<div className="bg-card border-card" />  ❌
```

## 🌈 Neutral Scale

Use for custom grays:

```tsx
/* Lightest to darkest */
var(--neutral-50)   /* #f8fafc - almost white */
var(--neutral-100)  /* #f1f5f9 - light gray */
var(--neutral-200)  /* #e2e8f0 - border color */
var(--neutral-300)  /* #cbd5e1 - subtle emphasis */
var(--neutral-400)  /* #94a3b8 - disabled text */
var(--neutral-500)  /* #64748b - secondary text */
var(--neutral-600)  /* #475569 - primary text */
var(--neutral-700)  /* #334155 - dark emphasis */
var(--neutral-800)  /* #1e293b - very dark */
var(--neutral-900)  /* #0f172a - nearly black */
```

## 📏 Spacing

```tsx
/* Tailwind spacing scale (use directly) */
<div className="p-1">   {/* 4px */}
<div className="p-2">   {/* 8px */}
<div className="p-3">   {/* 12px */}
<div className="p-4">   {/* 16px - most common */}
<div className="p-6">   {/* 24px - section spacing */}
<div className="p-8">   {/* 32px - large spacing */}

/* Or use CSS variables */
padding: var(--spacing-sm);   /* 8px */
padding: var(--spacing-md);   /* 16px */
padding: var(--spacing-lg);   /* 24px */
```

## 🔲 Border Radius

```tsx
/* Tailwind utilities (preferred) */
<div className="rounded">      {/* 8px */}
<div className="rounded-lg">   {/* 12px */}
<div className="rounded-xl">   {/* 16px */}
<div className="rounded-full"> {/* Circle/pill */}

/* Or CSS variables */
border-radius: var(--radius);      /* 8px */
border-radius: var(--radius-lg);   /* 12px */
border-radius: var(--radius-xl);   /* 16px */
```

## 🌑 Shadows

```tsx
/* Tailwind utilities */
<div className="shadow-sm">   {/* Subtle */}
<div className="shadow">      {/* Standard */}
<div className="shadow-md">   {/* Medium */}
<div className="shadow-lg">   {/* Large */}

/* Custom shadow utilities */
<div className="shadow-soft">      {/* Card elevation */}
<div className="shadow-elevated">  {/* Hover state */}
<div className="shadow-float">     {/* Modal/popover */}
```

## 🎬 Transitions

```tsx
/* Tailwind (preferred) */
<div className="transition-all duration-200">
<div className="transition-colors duration-150">

/* CSS variables */
transition: all var(--transition-fast);   /* 150ms */
transition: all var(--transition-base);   /* 200ms */
transition: all var(--transition-smooth); /* 300ms */
```

## 🔍 Focus States

```tsx
/* Standard focus ring */
<button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">

/* Custom focus visible utility */
<button className="focus-visible-ring">

/* Subtle focus */
<input className="focus:border-ring" />
```

## 💡 Pro Tips

### 1. Use Semantic Tokens
```tsx
/* Good - semantic */
<div className="bg-card text-card-foreground">

/* Bad - hardcoded */
<div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
```

### 2. Let Foreground Follow Background
```tsx
/* Good - paired tokens */
<div className="bg-primary text-primary-foreground">

/* Bad - mismatched */
<div className="bg-primary text-white">
```

### 3. Use Component Variants
```tsx
/* Good - variant system */
<Button variant="destructive">

/* Bad - custom styling */
<button className="bg-red-500 text-white">
```

### 4. Consistent Border Usage
```tsx
/* Good - semantic border */
<div className="border border-border">

/* Bad - arbitrary color */
<div className="border border-gray-300">
```

### 5. Hover States
```tsx
/* Good - smooth hover */
<div className="bg-card hover:bg-card-hover transition-colors">

/* Also good - muted fallback */
<div className="bg-card hover:bg-muted transition-colors">
```

## ⚡ Performance Tips

1. **Prefer Tailwind classes** over inline styles
2. **Use CSS variables** for dynamic theming
3. **Avoid !important** - fix specificity instead
4. **Group related classes** for readability
5. **Use `cn()` utility** to merge classes safely

## 🛠️ Debugging

### Color Not Showing?
1. Check browser DevTools computed styles
2. Verify CSS variable exists in theme.css
3. Check for typos in variable name
4. Ensure no CSS conflicts

### Contrast Issues?
1. Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Minimum ratio: 4.5:1 for text
3. Use foreground tokens with background tokens

### Class Not Working?
1. Check Tailwind is processing the file
2. Verify class name spelling
3. Check for CSS specificity issues
4. Use `!` prefix for important (sparingly)

## 📚 Additional Resources

- **Full documentation**: See `/CSS_ARCHITECTURE.md`
- **Migration guide**: See `/CSS_MIGRATION_GUIDE.md`
- **Theme source**: `/src/styles/theme.css`
- **Components**: `/src/app/components/ui/*`

---

**Quick Links**:
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Radix UI Colors](https://www.radix-ui.com/colors)
- [WCAG Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
