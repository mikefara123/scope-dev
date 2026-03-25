# Design SaaS - CSS Architecture Documentation

## 📋 Overview

This document outlines the CSS architecture for Design SaaS, ensuring maintainability, consistency, and ease of updates.

## 🎨 Design System Tokens

### Brand Colors
- **Primary (Navy)**: `#1a365d` - Used for primary actions, main navigation
- **Secondary (Teal)**: `#14b8a6` - Used for secondary actions, accents, focus states

### Color Philosophy
- **Solid colors only** - No gradients (per design requirements)
- **High contrast ratios** - WCAG AA compliant (4.5:1 minimum)
- **Consistent semantic meaning** - Success = green, error = red, etc.

## 📁 File Structure

```
/src/styles/
├── index.css           # Main entry point (imports all styles)
├── tailwind.css        # Tailwind configuration
├── theme.css           # Complete design system tokens
└── fonts.css           # Font imports (empty, reserved for custom fonts)
```

## 🔧 Token Categories

### 1. Surface Colors
Controls backgrounds and card surfaces:
- `--background`: Main app background (#f1f5f9)
- `--card`: White cards/panels (#ffffff)
- `--popover`: Dropdowns/menus (#ffffff)
- `--muted`: Subtle backgrounds (#f1f5f9)

**Contrast Rule**: `--card` should always have visible contrast against `--background`

### 2. Interactive Colors
Buttons, links, and interactive elements:
- `--primary`: Navy (#1a365d)
- `--secondary`: Teal (#14b8a6)
- `--destructive`: Red (#ef4444)

Each has a `*-foreground` variant for text color (always #ffffff for accessibility)

### 3. Semantic Colors
Functional meanings:
- `--color-success`: Green (#10b981)
- `--color-warning`: Amber (#f59e0b)
- `--color-error`: Red (#ef4444)
- `--color-info`: Blue (#3b82f6)

### 4. Neutral Scale
Grayscale for flexibility:
- `--neutral-50` to `--neutral-900`
- Based on Tailwind's slate color palette
- Used for borders, text, and subtle backgrounds

## 🎯 Best Practices

### ✅ DO:
1. **Use semantic tokens** instead of raw colors
   ```css
   /* Good */
   background: var(--card);
   
   /* Bad */
   background: #ffffff;
   ```

2. **Ensure contrast** when combining colors
   ```css
   /* Good - white text on dark background */
   .button {
     background: var(--primary);
     color: var(--primary-foreground);
   }
   ```

3. **Use Tailwind utilities** for common patterns
   ```tsx
   <div className="bg-card text-card-foreground">
   ```

4. **Reference hover states** when available
   ```css
   /* Good */
   background: var(--card-hover);
   
   /* Fallback if not defined */
   background: var(--muted);
   ```

### ❌ DON'T:
1. **Don't use gradients** (per design requirements)
   ```css
   /* Bad */
   background: linear-gradient(...);
   ```

2. **Don't hardcode colors** in components
   ```tsx
   /* Bad */
   <div style={{ backgroundColor: '#ffffff' }}>
   
   /* Good */
   <div className="bg-card">
   ```

3. **Don't mix color systems**
   ```css
   /* Bad - inconsistent */
   border: 1px solid #e2e8f0;
   
   /* Good - using token */
   border: 1px solid var(--border);
   ```

4. **Don't create low-contrast combinations**
   ```css
   /* Bad - white on light gray */
   background: var(--muted);
   color: #ffffff;
   
   /* Good */
   background: var(--muted);
   color: var(--muted-foreground);
   ```

## 🔍 Common Issues & Solutions

### Issue 1: White text on white background
**Problem**: Using `color: white` on a light background
**Solution**: Always pair backgrounds with their foreground variants
```tsx
// Bad
<div className="bg-card text-white">

// Good
<div className="bg-card text-card-foreground">
```

### Issue 2: Invisible borders
**Problem**: Border same color as background
**Solution**: Use semantic border tokens
```css
/* Bad */
border: 1px solid var(--background);

/* Good */
border: 1px solid var(--border);
```

### Issue 3: Inconsistent component styles
**Problem**: Components don't match the design system
**Solution**: Use component library variants
```tsx
// Bad
<button style={{ background: '#14b8a6' }}>

// Good
<Button variant="secondary">
```

## 🎨 Component Styling Guide

### Cards
```tsx
<Card className="bg-card text-card-foreground border-border">
```

### Buttons
```tsx
<Button variant="default">     {/* Navy */}
<Button variant="secondary">   {/* Teal */}
<Button variant="destructive"> {/* Red */}
<Button variant="outline">     {/* Border only */}
```

### Inputs
```tsx
<Input className="bg-input-background border-input-border focus:border-input-border-focus" />
```

### Badges
```tsx
<Badge variant="success">  {/* Green */}
<Badge variant="warning">  {/* Amber */}
<Badge variant="destructive"> {/* Red */}
```

## 🌓 Dark Mode

Dark mode automatically switches token values:
- Backgrounds become darker
- Text becomes lighter
- Borders adjust for visibility
- Brand colors remain consistent

**No manual dark mode classes needed** - tokens handle everything!

## 📏 Spacing System

Use consistent spacing tokens:
```tsx
<div className="p-4">   {/* 1rem = --spacing-md */}
<div className="gap-6"> {/* 1.5rem = --spacing-lg */}
```

Standard scale: `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px)

## 🔄 Updating Colors

### To change the primary color:
1. Update `--brand-primary` in `theme.css`
2. Update related variants: `*-light` and `*-dark`
3. Test all button variants
4. Check sidebar color

### To change the secondary color:
1. Update `--brand-secondary` in `theme.css`
2. Update related variants
3. Test focus states (ring colors)
4. Check link colors

### Adding a new semantic color:
1. Define in semantic colors section
2. Add light and dark variants
3. Create Tailwind mapping in `@theme inline`
4. Add component variant if needed

## 🧪 Testing Checklist

When making CSS changes, verify:
- [ ] All text is readable (contrast ratio > 4.5:1)
- [ ] Cards are visible against backgrounds
- [ ] Buttons have clear hover states
- [ ] Focus states are visible
- [ ] Borders are visible where expected
- [ ] Dark mode works correctly
- [ ] No white-on-white or black-on-black issues

## 🚀 Performance

- **CSS variables are fast** - browser-native, no JS needed
- **Minimal CSS output** - Tailwind purges unused classes
- **No runtime theme switching overhead**

## 📚 Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## 🔗 Related Files

- `/src/app/components/ui/*` - Reusable UI components
- `/src/styles/theme.css` - Design tokens (this document's source)
- `/tailwind.config.js` - Not used (Tailwind v4 uses CSS-based config)
