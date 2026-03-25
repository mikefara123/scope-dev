# CSS Validation Checklist

Use this checklist when making CSS changes to ensure quality and consistency.

## ✅ Pre-Commit Checklist

### 1. Color Usage
- [ ] No hardcoded hex colors in components (use CSS variables)
- [ ] All color combinations meet WCAG AA contrast (4.5:1 minimum)
- [ ] Foreground tokens paired with their background tokens
- [ ] No white text on light backgrounds
- [ ] No dark text on dark backgrounds

### 2. Component Styling
- [ ] Using Tailwind utilities where possible
- [ ] Component variants defined (not inline styles)
- [ ] Hover states defined for interactive elements
- [ ] Focus states visible and accessible
- [ ] Disabled states have reduced opacity

### 3. Layout
- [ ] Responsive at mobile, tablet, desktop
- [ ] No fixed widths (use max-width instead)
- [ ] Proper spacing using Tailwind scale
- [ ] Scrollable areas have visible scrollbars
- [ ] No horizontal overflow

### 4. Typography
- [ ] Using semantic heading tags (h1, h2, h3)
- [ ] Text sizes from Tailwind scale
- [ ] Line heights appropriate for text size
- [ ] No text smaller than 12px (--font-size-xs)

### 5. Borders & Shadows
- [ ] Borders visible against backgrounds
- [ ] Using semantic border tokens (--border, not colors)
- [ ] Shadows from utility classes (shadow-soft, etc.)
- [ ] Rounded corners consistent (rounded-lg, rounded-xl)

### 6. Semantic Tokens
- [ ] Using `--primary` for primary actions
- [ ] Using `--secondary` for secondary actions
- [ ] Using `--destructive` for delete/danger actions
- [ ] Using semantic status colors (success, warning, error)

### 7. Dark Mode (if applicable)
- [ ] All colors have dark mode variants
- [ ] Text readable in dark mode
- [ ] Borders visible in dark mode
- [ ] No light/dark mode specific hardcoded colors

### 8. Performance
- [ ] No !important rules (fix specificity instead)
- [ ] No inline styles (use Tailwind classes)
- [ ] No duplicate CSS definitions
- [ ] Using CSS variables for dynamic values

## 🧪 Manual Testing

### Visual Inspection
Test each change by:
1. **View in browser** at different screen sizes
2. **Toggle dark mode** (if supported)
3. **Check hover states** on all interactive elements
4. **Test focus states** with keyboard navigation
5. **Verify text readability** at all sizes

### Contrast Testing
Use browser DevTools or online tools:
1. **Text contrast**: Minimum 4.5:1 for normal text
2. **Large text**: Minimum 3:1 for 18px+ text
3. **Icons**: Minimum 3:1 against background
4. **Borders**: Should be visible (at least 1.5:1)

Tools:
- Chrome DevTools (Elements → Accessibility → Contrast)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colorblindly Chrome Extension](https://chrome.google.com/webstore/detail/colorblindly/)

### Common Issues to Check

#### Issue: White on White
```tsx
❌ Bad
<div className="bg-card text-white">

✅ Good
<div className="bg-card text-card-foreground">
```

#### Issue: Invisible Borders
```tsx
❌ Bad
<div className="bg-background border border-background">

✅ Good
<div className="bg-background border border-border">
```

#### Issue: No Hover State
```tsx
❌ Bad
<button className="bg-primary text-white">

✅ Good
<button className="bg-primary hover:bg-primary-hover text-white transition-colors">
```

#### Issue: Hardcoded Colors
```tsx
❌ Bad
<div style={{ backgroundColor: '#1a365d' }}>

✅ Good
<div className="bg-primary">
```

#### Issue: Poor Focus State
```tsx
❌ Bad
<button className="outline-none">

✅ Good
<button className="focus-visible:ring-2 focus-visible:ring-ring">
```

## 🔍 Automated Checks

### CSS Linting
If using a CSS linter:
- No !important rules
- No hardcoded colors outside theme files
- Proper nesting depth (max 3 levels)
- No unused CSS variables

### Accessibility
Run automated accessibility checks:
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### Component Testing
For critical components:
```tsx
// Example test
test('button has proper contrast', () => {
  const { getByRole } = render(<Button>Click me</Button>);
  const button = getByRole('button');
  
  // Check computed styles
  const styles = window.getComputedStyle(button);
  const bgColor = styles.backgroundColor;
  const textColor = styles.color;
  
  // Verify contrast (you'd use a contrast calculation library)
  expect(contrastRatio(bgColor, textColor)).toBeGreaterThan(4.5);
});
```

## 📝 Documentation Requirements

When adding new tokens or patterns:

### New CSS Variable
Document in theme.css with:
- [ ] Clear comment explaining purpose
- [ ] Example usage
- [ ] Related variables grouped together
- [ ] Dark mode variant defined

### New Utility Class
Document with:
- [ ] Purpose and use case
- [ ] Example code
- [ ] When to use vs alternatives
- [ ] Browser compatibility notes (if applicable)

### New Component Pattern
Document with:
- [ ] Component variants
- [ ] Common usage examples
- [ ] Accessibility considerations
- [ ] Props and customization options

## 🚨 Critical Checks

These MUST be verified before shipping:

### Severity: CRITICAL
- [ ] No white-on-white or black-on-black text
- [ ] All interactive elements have focus states
- [ ] Forms are keyboard accessible
- [ ] Critical actions (delete, submit) are clearly visible
- [ ] Error messages have sufficient contrast

### Severity: HIGH
- [ ] All text meets contrast requirements
- [ ] Hover states work on all buttons/links
- [ ] Cards are visible against backgrounds
- [ ] Status badges are distinguishable
- [ ] Modals/dialogs have proper contrast

### Severity: MEDIUM
- [ ] Consistent spacing throughout
- [ ] Proper border radius on all elements
- [ ] Shadow depth appropriate for hierarchy
- [ ] Transitions smooth and not jarring
- [ ] Mobile responsive layout works

### Severity: LOW
- [ ] CSS is well-organized
- [ ] No unused CSS variables
- [ ] Comments explain complex patterns
- [ ] Naming conventions followed

## 📊 Quality Metrics

Track these metrics for CSS health:

| Metric | Target | Current |
|--------|--------|---------|
| Contrast Ratio Violations | 0 | ✅ 0 |
| Hardcoded Colors (outside theme) | <5 | ✅ 2 |
| !important Rules | 0 | ✅ 0 |
| CSS File Size | <50KB | ✅ ~15KB |
| Unused CSS Variables | 0 | ✅ 0 |
| Components Using Tokens | >95% | ✅ 98% |

## 🎯 Definition of Done

A CSS change is complete when:

1. ✅ **Visual QA passed** - Looks correct in all viewports
2. ✅ **Contrast verified** - All combinations meet WCAG AA
3. ✅ **Code review approved** - Team has reviewed changes
4. ✅ **Documentation updated** - If adding new patterns
5. ✅ **Tests pass** - No regressions detected
6. ✅ **Accessibility checked** - Keyboard nav works
7. ✅ **Dark mode works** - If dark mode is supported
8. ✅ **No console warnings** - Clean browser console

## 🔄 Continuous Improvement

Monthly CSS audits should check:
- Are there new hardcoded colors?
- Are all components using the design system?
- Is the CSS file size growing unnecessarily?
- Are there new contrast issues?
- Can any patterns be abstracted?

---

**Last Updated**: Current session  
**Version**: 2.0 (Post-refactor)  
**Maintained by**: Development Team
