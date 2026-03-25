# Role-Based Visibility Testing Guide

Use this guide to test that each role sees only their intended features.

## Test Users

### 🟣 Platform Admin
- **Email**: `admin@projectclarity.com`
- **Name**: Platform Administrator
- **Password**: (use your test password)

### 🔵 Agency Admin (Luxe Interiors)
- **Email**: `admin@luxeinteriors.com`
- **Name**: Jennifer Martinez
- **Password**: (use your test password)

### 🟢 General User / Designer (Luxe Interiors)
- **Email**: `emily@luxeinteriors.com`
- **Name**: Emily Thompson
- **Password**: (use your test password)

### ⚪ Read-Only User (Luxe Interiors)
- **Email**: `robert@luxeinteriors.com`
- **Name**: Robert Davis
- **Password**: (use your test password)

---

## Test Scenarios

### ✅ Test 1: Platform Admin Navigation

**Login as**: `admin@projectclarity.com`

**Expected Sidebar Navigation (4 items)**:
1. ✅ Platform Dashboard
2. ✅ Agencies
3. ✅ Analytics
4. ✅ Billing

**Should NOT see**:
- ❌ Dashboard (regular)
- ❌ Projects
- ❌ Budgets
- ❌ Library
- ❌ Reports
- ❌ Users
- ❌ Settings
- ❌ Audit Log
- ❌ Templates

**User Dropdown Check**:
- ✅ Role badge shows "Platform Admin"
- ❌ NO "Settings" menu item
- ✅ "Log out" button present

**Header Check**:
- ✅ Purple "Platform Admin" badge visible in header

---

### ✅ Test 2: Agency Admin Navigation

**Login as**: `admin@luxeinteriors.com`

**Expected Sidebar Navigation (9 items)**:
1. ✅ Dashboard
2. ✅ Users
3. ✅ Settings
4. ✅ Audit Log
5. ✅ Templates
6. ✅ Projects
7. ✅ Budgets
8. ✅ Library
9. ✅ Reports

**Should NOT see**:
- ❌ Platform Dashboard
- ❌ Agencies
- ❌ Platform Analytics
- ❌ Platform Billing

**User Dropdown Check**:
- ✅ Role badge shows "Agency Admin"
- ✅ Agency name shows "Luxe Interiors Design Studio"
- ✅ "Settings" menu item present
- ✅ "Log out" button present

**Header Check**:
- ❌ NO Platform Admin badge

**Functional Tests**:
- ✅ Can access `/settings/users`
- ✅ Can access `/settings/audit`
- ✅ Can access `/settings/templates`
- ✅ Can access `/projects`
- ✅ Can access `/budgets`

---

### ✅ Test 3: General User / Designer Navigation

**Login as**: `emily@luxeinteriors.com`

**Expected Sidebar Navigation (5 items)**:
1. ✅ Dashboard
2. ✅ Projects
3. ✅ Budgets
4. ✅ Library
5. ✅ Reports

**Should NOT see**:
- ❌ Platform Dashboard
- ❌ Agencies
- ❌ Analytics
- ❌ Billing
- ❌ Users
- ❌ Settings (in sidebar)
- ❌ Audit Log
- ❌ Templates

**User Dropdown Check**:
- ✅ Role badge shows "Designer"
- ✅ Agency name shows "Luxe Interiors Design Studio"
- ✅ "Settings" menu item present (for personal settings)
- ✅ "Log out" button present

**Header Check**:
- ❌ NO Platform Admin badge

**Functional Tests**:
- ✅ Can access `/projects`
- ✅ Can access `/budgets`
- ✅ Can access `/library`
- ✅ Can access `/reports`
- ❌ CANNOT access `/settings/users` (should redirect or show error)
- ❌ CANNOT access `/settings/audit`
- ❌ CANNOT access `/admin/*`

---

### ✅ Test 4: Read-Only User Navigation

**Login as**: `robert@luxeinteriors.com`

**Expected Sidebar Navigation (4 items)**:
1. ✅ Dashboard
2. ✅ Projects (view only)
3. ✅ Budgets (view only)
4. ✅ Library (view only)

**Should NOT see**:
- ❌ Reports
- ❌ Platform admin pages
- ❌ Agency management (Users, Settings, Audit, Templates)

**User Dropdown Check**:
- ✅ Role badge shows "Read-Only"
- ✅ Agency name shows "Luxe Interiors Design Studio"
- ❌ NO "Settings" menu item
- ✅ "Log out" button present

**Header Check**:
- ❌ NO Platform Admin badge

**Functional Tests**:
- ✅ Can access `/projects` (but no edit buttons)
- ✅ Can access `/budgets` (but no edit buttons)
- ✅ Can access `/library` (but cannot add items)
- ❌ CANNOT access `/reports`
- ❌ CANNOT access `/settings/*`
- ❌ CANNOT access `/admin/*`

---

## Cross-Role Testing

### Test 5: Role Switching
Test that logging out and logging in as different roles shows correct navigation immediately.

1. Login as Platform Admin → See 4 platform items
2. Logout
3. Login as Agency Admin → See 9 items (management + designer)
4. Logout
5. Login as General User → See 5 designer items
6. Logout
7. Login as Read-Only → See 4 view-only items

---

## URL Access Testing

Even if navigation is hidden, users should be prevented from directly accessing unauthorized URLs.

### Platform Admin Should Be Blocked From:
- ❌ `/projects`
- ❌ `/budgets`
- ❌ `/library`
- ❌ `/settings/users`

### General User Should Be Blocked From:
- ❌ `/admin/*`
- ❌ `/settings/users`
- ❌ `/settings/audit`
- ❌ `/settings/templates`

### Read-Only User Should Be Blocked From:
- ❌ `/admin/*`
- ❌ `/settings/*`
- ❌ `/reports`

**Note**: URL blocking requires ProtectedRoute components, which may be a future enhancement if not already implemented.

---

## Visual Verification Checklist

For each logged-in user, verify:

### Sidebar
- [ ] Correct number of navigation items
- [ ] Correct item labels
- [ ] Correct icons
- [ ] No unauthorized items visible

### User Dropdown
- [ ] Correct role badge color and text
- [ ] Agency name displayed (if applicable)
- [ ] Settings link visibility matches role
- [ ] All expected menu items present

### Header
- [ ] Platform Admin badge only for platform admin
- [ ] Date display present
- [ ] No extra badges for other roles

### Navigation State
- [ ] Active page highlighted correctly
- [ ] Sidebar collapse/expand works
- [ ] User avatar displays or shows initials

---

## Automated Test Cases (Future)

```typescript
describe('Role-Based Navigation', () => {
  test('Platform Admin sees only platform pages', () => {
    const nav = getVisibleNavigation(platformAdminUser);
    expect(nav).toHaveLength(4);
    expect(nav.map(i => i.name)).toEqual([
      'Platform Dashboard',
      'Agencies',
      'Analytics',
      'Billing'
    ]);
  });

  test('Agency Admin sees management + designer pages', () => {
    const nav = getVisibleNavigation(agencyAdminUser);
    expect(nav).toHaveLength(9);
    expect(nav.some(i => i.name === 'Users')).toBe(true);
    expect(nav.some(i => i.name === 'Projects')).toBe(true);
  });

  test('General User sees only designer pages', () => {
    const nav = getVisibleNavigation(generalUser);
    expect(nav).toHaveLength(5);
    expect(nav.some(i => i.name === 'Users')).toBe(false);
  });

  test('Read-Only User sees only view pages', () => {
    const nav = getVisibleNavigation(readOnlyUser);
    expect(nav).toHaveLength(4);
    expect(nav.some(i => i.name === 'Reports')).toBe(false);
  });
});
```

---

## Issues to Report

If you find any of these issues, please report:

1. **Wrong Navigation Items**: User sees items they shouldn't
2. **Missing Navigation Items**: User doesn't see items they should
3. **Settings Link**: Appears for wrong roles or missing for correct roles
4. **Role Badge**: Wrong color, text, or visibility
5. **URL Access**: User can access unauthorized pages by typing URL
6. **Permission Errors**: User gets permission errors on pages they should access

---

## Testing Sign-Off

- [ ] Platform Admin tested - all checks pass
- [ ] Agency Admin tested - all checks pass
- [ ] General User tested - all checks pass
- [ ] Read-Only User tested - all checks pass
- [ ] Role switching tested - works correctly
- [ ] Visual elements verified - all correct
- [ ] No unauthorized access found

**Tested By**: _________________  
**Date**: _________________  
**Status**: ✅ PASS / ❌ FAIL

---

**Last Updated**: January 28, 2026
