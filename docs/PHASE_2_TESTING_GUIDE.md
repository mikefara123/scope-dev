# Phase 2: Platform Admin Portal - Testing Guide 🧪

## Quick Test Checklist

### Step 1: Login as Platform Admin ✅
```
Email: admin@projectclarity.com
Password: anything
```

**Expected Result:**
- Login successful
- Purple "Platform Admin" badge appears in header
- Sidebar shows platform admin navigation items

---

## Test Each Platform Admin Page

### 1. Platform Dashboard (`/admin`)

**What to Check:**
- [ ] 4 metric cards display:
  - Total Agencies: 3
  - Active Users: 9 (7 active today)
  - Monthly Revenue: $3,647
  - Approvals This Month: 48

- [ ] Charts render:
  - [ ] Budget Approvals Trend (line chart going up)
  - [ ] Revenue Growth (bar chart showing growth)
  - [ ] Agency Status pie chart (2 active, 1 trial)
  - [ ] Subscription Tiers pie chart (2 starter, 1 professional)

- [ ] Quick Stats panel shows:
  - [ ] Active Subscriptions: 2
  - [ ] Trial Accounts: 1
  - [ ] Total Projects: 89
  - [ ] Total Budgets: 156

- [ ] Recent Activity feed displays:
  - [ ] 4 recent activities
  - [ ] Agency names
  - [ ] Action types
  - [ ] Values for approvals
  - [ ] Time stamps

**How to Test:**
1. Click "Platform Dashboard" in sidebar
2. Scroll through entire page
3. Hover over charts to see tooltips
4. Verify all numbers match expected values

---

### 2. Agencies Management (`/admin/agencies`)

**What to Check:**
- [ ] Header shows "Agencies" title
- [ ] "Add Agency" button in top right

- [ ] Search and filters work:
  - [ ] Type "Luxe" in search → Shows 1 result
  - [ ] Select "Trial" status → Shows Sarah Chen Design
  - [ ] Select "Professional" tier → Shows Luxe Interiors
  - [ ] Clear filters → Shows all 3 agencies

- [ ] Table displays all agencies:
  - [ ] Luxe Interiors Design Studio (logo, Active, Professional, 5/10 users)
  - [ ] Modern Living Co. (Active, Starter, 3/3 users - notice full)
  - [ ] Sarah Chen Design (Trial, Starter, 1/1 user)

- [ ] Actions dropdown works:
  - [ ] Click three dots on any agency
  - [ ] See: View Details, Edit, Suspend/Activate, Delete
  - [ ] Different options for active vs trial

- [ ] Summary cards at bottom:
  - [ ] Total Agencies: 3
  - [ ] Active: 2 (green)
  - [ ] Trial: 1 (orange)
  - [ ] Total Users: 9

**How to Test:**
1. Navigate to `/admin/agencies`
2. Try searching for each agency
3. Test each filter option
4. Click action menu on each agency
5. Verify license counts are accurate

---

### 3. Platform Analytics (`/admin/analytics`)

**What to Check:**

#### User Engagement Tab:
- [ ] 4 metric cards:
  - [ ] Active Today: 7 (78% of total)
  - [ ] Active This Week: 8 (89% of total)
  - [ ] Active This Month: 9 (100%)
  - [ ] Approvals/Week: 12 (+8%)

- [ ] User Engagement Trend chart:
  - [ ] 3 colored areas (DAU, WAU, MAU)
  - [ ] Shows growth over 5 weeks
  - [ ] Hover shows exact values

- [ ] Budget Approvals by Value chart:
  - [ ] 4 bars ($0-50k, $50-100k, $100-150k, $150k+)
  - [ ] Different colors per bar

#### Revenue Tab:
- [ ] 3 metric cards:
  - [ ] MRR: $3,647 (+12.5%)
  - [ ] ARR: $43,764
  - [ ] ARPU: $405

- [ ] Revenue Growth chart:
  - [ ] Blue line for MRR
  - [ ] Green line for New MRR
  - [ ] Shows 7 months of data

- [ ] Retention & Churn chart:
  - [ ] 100% retention (green area)
  - [ ] 0% churn
  - [ ] Success message below chart

#### Regional Tab:
- [ ] 3 regions displayed:
  - [ ] West Coast: 4 users, 2 agencies (green)
  - [ ] East Coast: 3 users, 1 agency (blue)
  - [ ] Midwest: 2 users, 0 agencies (orange)

- [ ] Progress bars show distribution
- [ ] 3 cards with detailed breakdowns

#### Features Tab:
- [ ] 5 features with adoption rates:
  - [ ] Budget Builder: 95%
  - [ ] Client Approvals: 88%
  - [ ] Item Library: 90%
  - [ ] Cost Tracking: 72%
  - [ ] Reports: 65%

- [ ] "Most Used Features" card shows top 3
- [ ] "Growth Opportunities" card shows lower adoption features

**How to Test:**
1. Navigate to `/admin/analytics`
2. Click each tab (Engagement, Revenue, Regional, Features)
3. Verify all charts render
4. Check that numbers are consistent across views
5. Hover over charts to see interactive tooltips

---

### 4. Billing Management (`/admin/billing`)

**What to Check:**
- [ ] 4 metric cards:
  - [ ] Total MRR: $3,647
  - [ ] Total ARR: $43,764
  - [ ] Active Subscriptions: 2 (green)
  - [ ] Trial Accounts: 1 (orange)

#### Subscriptions Tab:
- [ ] Search by agency name works
- [ ] Status filter works
- [ ] Table shows 3 subscriptions:
  - [ ] Luxe Interiors: Professional, Active, Annual, $490
  - [ ] Modern Living Co.: Starter, Active, Monthly, $117
  - [ ] Sarah Chen: Starter, Trial, Monthly, $39 (N/A payment)

- [ ] Status badges colored correctly:
  - [ ] Active = green with checkmark
  - [ ] Trial = orange with clock

- [ ] Next payment dates shown for active subscriptions

#### Payment History Tab:
- [ ] 3 successful payments displayed
- [ ] Dates: Jan 15, Jan 20, Dec 15
- [ ] All show "Succeeded" status (green)
- [ ] Download invoice button for each

#### Failed Payments Tab:
- [ ] Shows success message
- [ ] Green checkmark icon
- [ ] "No Failed Payments" heading
- [ ] "All payments processing successfully" text

**How to Test:**
1. Navigate to `/admin/billing`
2. Switch between tabs
3. Search for "Luxe" in Subscriptions tab
4. Filter by "Active" status
5. Check that trial subscription shows "N/A" for next payment
6. Verify all successful payments in Payment History

---

## Cross-Page Consistency Checks

### Data Consistency:
- [ ] Total agencies is 3 everywhere
- [ ] Total users is 9 everywhere
- [ ] MRR is $3,647 everywhere
- [ ] Active subscriptions is 2 everywhere

### Navigation:
- [ ] All 4 platform admin pages appear in sidebar
- [ ] Purple "Platform Admin" badge shows on all pages
- [ ] Clicking between pages works smoothly
- [ ] Browser back button works

### UI Consistency:
- [ ] All pages use same card style
- [ ] All tables have same styling
- [ ] All badges use consistent colors
- [ ] All charts use brand colors

---

## Role-Based Access Test

### Test as Non-Platform Admin:

1. **Logout** (click user dropdown → Logout)

2. **Login as Agency Admin:**
   ```
   Email: admin@luxeinteriors.com
   Password: any
   ```

3. **Try to access platform pages:**
   - [ ] Navigate to `/admin` → See "Access Denied"
   - [ ] Navigate to `/admin/agencies` → See "Access Denied"
   - [ ] No platform admin items in sidebar
   - [ ] No purple badge in header

4. **Verify standard navigation:**
   - [ ] See: Dashboard, Projects, Budgets, Library, Reports, Settings, Users, Audit Log
   - [ ] Don't see: Platform Dashboard, Agencies, Analytics, Billing

---

## Performance Checks

- [ ] All pages load in under 2 seconds
- [ ] Charts animate smoothly
- [ ] Search/filter is responsive (no lag)
- [ ] No console errors
- [ ] Tables handle 3+ rows without issues

---

## Visual Checks

- [ ] All charts have proper spacing
- [ ] Text is readable on all backgrounds
- [ ] Icons align with text
- [ ] Cards have consistent padding
- [ ] Responsive: works on smaller screens (resize browser)

---

## Bug Hunting

Look for:
- [ ] Broken chart tooltips
- [ ] Missing data in tables
- [ ] Incorrect calculations
- [ ] Console errors or warnings
- [ ] Styling inconsistencies

---

## ✅ Final Verification

### Platform Admin Can:
- [x] View platform dashboard with metrics
- [x] See all agencies in one place
- [x] Filter and search agencies
- [x] View detailed analytics with charts
- [x] See revenue and subscription data
- [x] Monitor payment history
- [x] Check feature adoption

### Platform Admin Cannot (Future Features):
- [ ] Create new agency (button exists but not wired)
- [ ] Edit agency details (menu item exists but not wired)
- [ ] Suspend/activate agency (menu item exists but not wired)
- [ ] Download invoices (button exists but not wired)

---

## Success Criteria

**Phase 2 is successful if:**
- ✅ All 4 platform admin pages load
- ✅ All charts render without errors
- ✅ All data is accurate and consistent
- ✅ Role-based access control works
- ✅ Search and filters function
- ✅ Navigation is smooth
- ✅ No console errors

---

## Common Issues & Solutions

### Issue: Charts not rendering
**Solution:** Check that Recharts is installed: `npm list recharts`

### Issue: "Access Denied" when logged in as platform admin
**Solution:** Check localStorage - ensure user role is 'platform_admin'

### Issue: Data shows as 0 or undefined
**Solution:** Verify mock-multi-tenant.ts is imported correctly

### Issue: Navigation items not showing
**Solution:** Clear browser cache and reload

---

## Next Steps After Testing

Once all checks pass:
- ✅ Phase 2 is verified complete
- 🚀 Ready to start Phase 3: Agency Admin Features
- 📝 Document any bugs found
- 💡 Note any UX improvements

---

**Happy Testing! 🎉**
