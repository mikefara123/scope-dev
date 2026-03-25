# Navigation by Role - Visual Guide

Quick reference showing exactly what navigation items each user role sees in Project Clarity.

---

## 🟣 Platform Admin (SaaS Owner)

**Goal**: Manage the entire SaaS platform

```
📊 Platform Dashboard  (/admin)
🏢 Agencies           (/admin/agencies)
📈 Analytics          (/admin/analytics)
💳 Billing            (/admin/billing)
```

**Total Items**: 4  
**Focus**: Platform operations, not individual projects

---

## 🔵 Agency Admin (Design Firm Admin)

**Goal**: Manage agency + work on projects

```
📊 Dashboard          (/)
👥 Users              (/settings/users)
⚙️  Settings          (/settings)
📄 Audit Log          (/settings/audit)
📋 Templates          (/settings/templates)
📁 Projects           (/projects)
💰 Budgets            (/budgets)
📚 Library            (/library)
📊 Reports            (/reports)
```

**Total Items**: 9  
**Focus**: Full agency management + designer capabilities

---

## 🟢 General User (Interior Designer)

**Goal**: Create and manage design projects

```
📊 Dashboard          (/)
📁 Projects           (/projects)
💰 Budgets            (/budgets)
📚 Library            (/library)
📊 Reports            (/reports)
```

**Total Items**: 5  
**Focus**: Project and budget management

---

## ⚪ Read-Only User

**Goal**: View projects and budgets only

```
📊 Dashboard          (/)
📁 Projects           (/projects)    [VIEW ONLY]
💰 Budgets            (/budgets)     [VIEW ONLY]
📚 Library            (/library)     [VIEW ONLY]
```

**Total Items**: 4  
**Focus**: Read-only access to core features

---

## Comparison Table

| Navigation Item | Platform Admin | Agency Admin | General User | Read-Only |
|-----------------|----------------|--------------|--------------|-----------|
| **Platform Dashboard** | ✅ | ❌ | ❌ | ❌ |
| **Agencies** | ✅ | ❌ | ❌ | ❌ |
| **Platform Analytics** | ✅ | ❌ | ❌ | ❌ |
| **Platform Billing** | ✅ | ❌ | ❌ | ❌ |
| **Dashboard** | ❌ | ✅ | ✅ | ✅ |
| **Projects** | ❌ | ✅ | ✅ | 👁️ View |
| **Budgets** | ❌ | ✅ | ✅ | 👁️ View |
| **Library** | ❌ | ✅ | ✅ | 👁️ View |
| **Reports** | ❌ | ✅ | ✅ | ❌ |
| **Users** | ❌ | ✅ | ❌ | ❌ |
| **Settings** | ❌ | ✅ | ❌ | ❌ |
| **Audit Log** | ❌ | ✅ | ❌ | ❌ |
| **Templates** | ❌ | ✅ | ❌ | ❌ |

---

## Dropdown Menu Items

### Platform Admin Dropdown
```
[User Info]
━━━━━━━━━━━━━
Role: Platform Admin
━━━━━━━━━━━━━
🚪 Log out
```
**Note**: No Settings link (platform admins manage settings differently)

### Agency Admin Dropdown
```
[User Info]
━━━━━━━━━━━━━
Role: Agency Admin
🏢 [Agency Name]
━━━━━━━━━━━━━
⚙️  Settings
🚪 Log out
```

### General User Dropdown
```
[User Info]
━━━━━━━━━━━━━
Role: Designer
🏢 [Agency Name]
━━━━━━━━━━━━━
⚙️  Settings
🚪 Log out
```

### Read-Only Dropdown
```
[User Info]
━━━━━━━━━━━━━
Role: Read-Only
🏢 [Agency Name]
━━━━━━━━━━━━━
🚪 Log out
```
**Note**: No Settings link (read-only users can't change settings)

---

## Header Badges

Only **Platform Admin** sees a role badge in the header:
```
┌─────────────────────────────────────────┐
│ 🟣 Platform Admin    |    [Date]        │
└─────────────────────────────────────────┘
```

Other roles don't have header badges (cleaner interface).

---

## Key Design Decisions

1. **Platform Admin Isolation**: Completely separate from agency operations
2. **Agency Admin = Super User**: Can manage agency AND work like a designer
3. **Designer Simplicity**: Only project-focused features
4. **Read-Only Minimalism**: Absolute minimum for viewing

---

**Implementation Status**: ✅ Complete  
**Last Updated**: January 28, 2026
