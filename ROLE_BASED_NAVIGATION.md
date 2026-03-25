# Role-Based Navigation & Feature Visibility

This document explains how Project Clarity implements role-based navigation and feature visibility to ensure each user only sees features relevant to their role.

## Overview

Project Clarity now has **complete role-based visibility** where each user role sees a tailored navigation menu and can only access features relevant to their responsibilities.

## Role-Specific Navigation

### 1. Platform Admin (SaaS Owner)
**Purpose**: Manages the entire SaaS platform, agencies, and billing

**Visible Navigation**:
- Platform Dashboard (`/admin`)
- Agencies Management (`/admin/agencies`)
- Platform Analytics (`/admin/analytics`)
- Billing Management (`/admin/billing`)

**What They DON'T See**:
- Individual agency features (projects, budgets, library)
- Agency settings
- User management (except through agencies)

**Rationale**: Platform Admins focus on high-level platform operations, not day-to-day design work.

---

### 2. Agency Admin (Design Firm Admin)
**Purpose**: Manages their design agency's settings, team, and can also work on projects

**Visible Navigation**:
- Dashboard (`/`)
- Users (`/settings/users`)
- Settings (`/settings`)
- Audit Log (`/settings/audit`)
- Templates (`/settings/templates`)
- Projects (`/projects`)
- Budgets (`/budgets`)
- Library (`/library`)
- Reports (`/reports`)

**What They DON'T See**:
- Platform admin pages (`/admin/*`)

**Rationale**: Agency Admins need both management tools (users, settings, audit) AND designer tools (projects, budgets) to run their firm.

---

### 3. General User (Interior Designer)
**Purpose**: Creates and manages design projects and budgets

**Visible Navigation**:
- Dashboard (`/`)
- Projects (`/projects`)
- Budgets (`/budgets`)
- Library (`/library`)
- Reports (`/reports`)

**What They DON'T See**:
- Platform admin pages
- Agency management (Users, Audit Log, Templates)
- Settings page

**Rationale**: Designers focus on their work—projects and budgets. They don't need admin features.

---

### 4. Read-Only User
**Purpose**: Views projects and budgets without making changes

**Visible Navigation**:
- Dashboard (`/`)
- Projects (`/projects`) - View only
- Budgets (`/budgets`) - View only
- Library (`/library`) - View only

**What They DON'T See**:
- Platform admin pages
- Agency management
- Settings page
- Reports (no analytics access)

**Rationale**: Read-only users can review work but cannot modify anything or access management features.

---

## Implementation Details

### Navigation Filter Logic
Location: `/src/app/components/layouts/RootLayout.tsx`

The `getVisibleNavigation()` function filters navigation items based on:
1. **User Role**: Each role has a predefined set of navigation items
2. **Permissions**: Items are checked against the user's permissions from RBAC
3. **Role Array**: Some items explicitly define which roles can see them

### Key Code Structure

```typescript
// Platform Admin - sees ONLY platform management
if (user.role === UserRole.PLATFORM_ADMIN) {
  return platformAdminNavigation.filter(...)
}

// Agency Admin - sees agency management + designer features
if (user.role === UserRole.AGENCY_ADMIN) {
  const agencyItems = agencyAdminNavigation.filter(...)
  const designerItems = designerNavigation.filter(...)
  return merged and deduplicated items
}

// General User - sees only designer features
if (user.role === UserRole.GENERAL_USER) {
  return designerNavigation.filter(...)
}

// Read-Only - sees only view features
if (user.role === UserRole.READ_ONLY_USER) {
  return readOnlyNavigation.filter(...)
}
```

### Settings Menu Visibility

The Settings menu item in user dropdown is conditionally shown:
- ✅ Visible for: `AGENCY_ADMIN`, `GENERAL_USER`
- ❌ Hidden for: `PLATFORM_ADMIN`, `READ_ONLY_USER`

This prevents users from trying to access pages they don't have permission to see.

---

## Permission-Based Access Control

In addition to navigation visibility, the RBAC system (in `/src/lib/permissions.ts`) controls:

1. **Page-level access**: ProtectedRoute components check permissions
2. **Feature-level access**: UI elements check permissions before rendering
3. **Resource-level access**: Users can only view/edit projects they're assigned to

### Example Permission Checks

```typescript
// Check if user can create a project
if (hasPermission(Permission.CREATE_PROJECT)) {
  // Show "New Project" button
}

// Check if user can manage users
if (hasPermission(Permission.MANAGE_USERS)) {
  // Show user management features
}
```

---

## User Testing Matrix

| Role | Dashboard | Projects | Budgets | Library | Reports | Users | Settings | Audit | Templates | Platform Admin |
|------|-----------|----------|---------|---------|---------|-------|----------|-------|-----------|----------------|
| Platform Admin | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ All |
| Agency Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| General User | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Read-Only | ✅ | ✅ View | ✅ View | ✅ View | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Benefits of This Approach

1. **Cleaner UX**: Users see only what they need—no clutter
2. **Security**: Navigation doesn't even show unauthorized pages
3. **Role Clarity**: Each role has a distinct, purposeful interface
4. **Scalability**: Easy to add new roles or adjust permissions
5. **Multi-Tenant**: Platform admins are completely separated from agency operations

---

## Future Enhancements

1. **Custom Roles**: Allow agencies to create custom roles with specific permissions
2. **Feature Flags**: Enable/disable features per subscription tier
3. **Contextual Navigation**: Show different items based on current workflow
4. **Favorites**: Allow users to pin frequently used pages

---

## Related Files

- `/src/app/components/layouts/RootLayout.tsx` - Navigation rendering and filtering
- `/src/lib/permissions.ts` - RBAC permission definitions and helpers
- `/src/types/multi-tenant.ts` - UserRole enum and type definitions
- `/src/contexts/AuthContext.tsx` - Authentication and permission checking
- `/src/app/components/ProtectedRoute.tsx` - Route-level permission enforcement

---

**Last Updated**: January 28, 2026  
**Status**: ✅ Fully Implemented
