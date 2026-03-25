# Quick Role Reference Card

One-page reference for role-based navigation in Project Clarity.

---

## 🟣 Platform Admin

**Who**: SaaS platform owner  
**Sidebar**: 4 items  
**Settings**: ❌ Hidden  
**Badge**: ✅ Purple "Platform Admin"

```
Platform Dashboard  →  /admin
Agencies           →  /admin/agencies
Analytics          →  /admin/analytics
Billing            →  /admin/billing
```

---

## 🔵 Agency Admin

**Who**: Design firm administrator  
**Sidebar**: 9 items  
**Settings**: ✅ Visible  
**Badge**: ❌ None

```
Dashboard      →  /
Users          →  /settings/users
Settings       →  /settings
Audit Log      →  /settings/audit
Templates      →  /settings/templates
Projects       →  /projects
Budgets        →  /budgets
Library        →  /library
Reports        →  /reports
```

---

## 🟢 General User (Designer)

**Who**: Interior designer  
**Sidebar**: 5 items  
**Settings**: ✅ Visible  
**Badge**: ❌ None

```
Dashboard  →  /
Projects   →  /projects
Budgets    →  /budgets
Library    →  /library
Reports    →  /reports
```

---

## ⚪ Read-Only User

**Who**: View-only stakeholder  
**Sidebar**: 4 items  
**Settings**: ❌ Hidden  
**Badge**: ❌ None

```
Dashboard  →  /       [VIEW ONLY]
Projects   →  /projects  [VIEW ONLY]
Budgets    →  /budgets   [VIEW ONLY]
Library    →  /library   [VIEW ONLY]
```

---

## Test Credentials

| Role | Email | Name |
|------|-------|------|
| 🟣 Platform Admin | `admin@projectclarity.com` | Platform Administrator |
| 🔵 Agency Admin | `admin@luxeinteriors.com` | Jennifer Martinez |
| 🟢 Designer | `emily@luxeinteriors.com` | Emily Thompson |
| ⚪ Read-Only | `robert@luxeinteriors.com` | Robert Davis |

---

## Quick Check ✓

Login and verify you see ONLY these items:

- [ ] Platform Admin → 4 platform items (no projects/budgets)
- [ ] Agency Admin → 9 items (management + projects)
- [ ] Designer → 5 items (projects/budgets only)
- [ ] Read-Only → 4 items (view-only access)

---

**Implementation**: `/src/app/components/layouts/RootLayout.tsx`  
**Updated**: January 28, 2026
