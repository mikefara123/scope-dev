# 📤 How to Send a Budget for Approval

## Quick Guide

### Step 1: Open a Budget
1. Navigate to **Projects** (from sidebar)
2. Click on any project
3. Click on a budget to open the **Budget Builder**

### Step 2: Click "Send for Approval"
In the top toolbar, you'll see:
```
[← Back] [Budget Name] [Status Badge] [Save] [Preview] [Send for Approval]
```
Click the **"Send for Approval"** button (teal/secondary color with envelope icon)

### Step 3: Configure the Approval
A modal will open with the following options:

#### 📧 **Email Recipients**
- **Primary Recipients** (Required): 
  - These people can approve/reject the budget
  - Enter email, click "Add"
  - Shows green checkmark when valid
  - Example: `john@client.com`, `mary@client.com`

- **CC Recipients** (Optional):
  - These people receive a copy for their records
  - Cannot approve/reject
  - Example: `assistant@client.com`

#### 💬 **Custom Message** (Optional)
Add a personal message to your client, like:
```
Hi John and Mary,

I'm excited to share this budget with you. I've carefully 
selected each piece to match your vision for a modern, 
coastal aesthetic. Please review and let me know if you 
have any questions!

Best regards,
Sarah
```

#### 👁️ **Display Options**
Choose what your client will see:

**Toggles:**
- ☑️ Show Line Items (individual products)
- ☑️ Show Room Summary
- ☐ Show Markup % (usually hidden from clients)
- ☑️ Show Shipping
- ☑️ Show Tax
- ☐ Include Item Notes

**Cost Breakdown:**
- **Detailed**: Show all cost components (recommended)
- **Summary**: Totals by room only
- **Product Only**: Hide markup, show tax & shipping at bottom

### Step 4: Send
Click **"Send for Approval"** (bottom right of modal)

You'll see a success message:
```
✓ Budget sent to 2 recipient(s) for approval
```

---

## What Happens Next?

### 1. System Generates Approval Link
The system creates a unique, secure link like:
```
https://yoursite.com/approve/abc123xyz456def789
```

### 2. Email Sent to Client(s)
Your clients receive an email with:
- Project name
- Budget name
- Total amount
- Link to review and approve

### 3. Client Reviews Budget
They click the link and see:
- Clean, professional budget display
- All items organized by room
- Clear totals
- Your custom message

### 4. Client Takes Action
They can:
- ✅ **Approve** - Enter name, optional comments, click "Approve Budget"
- ❌ **Request Changes** - Add comments explaining changes, click "Request Changes"

### 5. You Get Notified
You'll receive notification of:
- Approval (budget is now locked ✓)
- Rejection with client comments

---

## 🔒 Important: Budget Locking

**After approval, the budget is LOCKED:**
- ✅ Cannot be edited (protects both parties)
- ✅ Prevents tampering
- ✅ Creates legal record
- ✅ To make changes, create an "Interim Budget"

---

## 💡 Tips

### Best Practices:
1. **Always preview first** - Click "Preview" to see what clients will see
2. **Add a personal message** - Makes it more engaging
3. **Hide markup** - Most designers don't show markup % to clients
4. **Use detailed breakdown** - Clients appreciate transparency
5. **Add both partners** - For couples, add both emails as primary recipients

### Common Scenarios:

**Couple (both need to approve):**
```
Primary Recipients:
- john@email.com
- mary@email.com
```

**Client + Their Assistant (FYI):**
```
Primary Recipients:
- client@email.com

CC Recipients:
- assistant@email.com
```

**Multiple Decision Makers:**
```
Primary Recipients:
- ceo@company.com
- cfo@company.com
- facilities@company.com
```

---

## Troubleshooting

**"Please add at least one recipient email"**
→ You must add at least one primary email address

**Email not validating (showing red)**
→ Check for typos, ensure format is: name@domain.com

**Button disabled / grayed out**
→ Budget may already be locked/approved, check status badge

**Modal not opening**
→ Refresh the page and try again

---

## Testing the Flow

Want to test? Use a mock email:
1. Enter: `test@example.com`
2. Configure display options
3. Click "Send for Approval"
4. Check browser console for approval token
5. Visit: `/approve/[token]` to see customer view

---

## Customer View Example

When your client clicks the link, they see:

```
┌─────────────────────────────────────────────┐
│  🏢 Acme Design Studio                      │
│     Budget Review & Approval                │
│                            [Awaiting Approval]│
└─────────────────────────────────────────────┘

Riverside Penthouse
Budget v1.0 - Living Room & Kitchen

Designer: Sarah Johnson
Sent Date: January 28, 2026
Total Amount: $13,671.00

"Hi John and Mary, I'm excited to share..."

┌─────────────────────────────────────────────┐
│  Living Room                                │
│  - Westwood Sectional Sofa    $5,017.60    │
│  - Marble Coffee Table        $2,838.40    │
│  - Area Rug 9x12             $3,721.20    │
│  Living Room Total           $11,537.20    │
└─────────────────────────────────────────────┘

[Similar for other rooms]

Total Amount: $13,671.00

Your Name: [___________________]

Comments: [___________________]

[Request Changes]  [Approve Budget]
```

Clean, professional, easy to understand! ✨

---

## Next Steps After This

Once approval system is working, you can:
- View approval history
- Track approval status
- Create interim budgets (for approved budgets)
- Export to PDF
- Set up email templates
