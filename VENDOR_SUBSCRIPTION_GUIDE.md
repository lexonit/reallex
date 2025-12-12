# Vendor Subscription Management System

## Overview
The system automatically creates and manages vendor subscriptions when a new vendor registers. The subscription details are displayed in the Settings > Subscription & Billing page.

## Registration to Subscription Flow

### Step 1: User Registration with Plan Selection
**Location**: `containers/auth/RegisterPage.tsx`

When a user registers:
1. User selects a subscription plan (Solo Agent, Brokerage, Enterprise)
2. Enters vendor details (name, email, etc.)
3. Submits registration form

### Step 2: Backend Processing
**Location**: `backend/graphql/resolvers/user.resolvers.ts` → `register` mutation

When registration is processed:

```typescript
// Step 1: Create Vendor
const vendor = await Vendor.create({
  name: input.vendorName,
  slug: input.vendorSlug,
  contactEmail: input.contactEmail,
  logoUrl: input.logoUrl,
  theme: input.theme,
  isActive: true
});

// Step 1.5: Create VendorSubscription
if (input.planId) {
  const plan = await SubscriptionPlan.findById(input.planId);
  
  await VendorSubscription.create({
    vendorId: vendor._id,
    planId: plan._id,
    startDate: new Date(),
    endDate: new Date() + 30 days, // 30-day trial
    status: 'trial',
    autoRenew: true,
    currentUsage: {
      activeUsers: 0,
      totalProperties: 0,
      totalLeads: 0,
      totalDeals: 0,
      storageUsed: 0
    }
  });
}

// Step 2: Create User
const user = await User.create({
  email: input.email,
  firstName: input.firstName,
  lastName: input.lastName,
  passwordHash: bcrypt.hash(input.password),
  role: 'VENDOR_ADMIN',
  vendorId: vendor._id,
  isActive: true
});
```

### Step 3: User Logs In
User can view their subscription in Settings

## Settings Page - Subscription Display

### Location
`containers/settings/SettingsPage.tsx` → "Subscription & Billing" tab
→ `containers/settings/SubscriptionSettings.tsx`

### Components Displayed

#### 1. Current Subscription Overview
Shows:
- Plan name and price (e.g., "Brokerage - $199.99/month")
- Status badge (ACTIVE, TRIAL, EXPIRED, CANCELLED)
- Renewal date
- Days remaining until renewal
- Auto-renew status
- Warning if expiring soon (< 7 days)

#### 2. Current Usage Statistics
Real-time metrics with progress bars:
- **Users**: Active users / Plan limit
- **Properties**: Total properties / Plan limit
- **Leads**: Total leads / Plan limit
- **Deals**: Total deals / Plan limit

Progress bar colors:
- 🟢 Green: 0-75% usage
- 🟠 Orange: 75-90% usage
- 🔴 Red: 90-100% usage

#### 3. Available Features
Dynamically shows enabled features based on subscription plan:
- ✅ Custom Branding
- ✅ API Access
- ✅ Advanced Analytics
- ✅ Priority Support
- ✅ Custom Integrations

#### 4. Plan Comparison & Upgrade
Shows all available plans with ability to upgrade:
- Display all active plans side-by-side
- Highlight current plan
- Upgrade button for higher plans
- Feature comparison grid

## GraphQL Queries Used

### Get User's Subscription
```graphql
query GetMySubscription {
  mySubscription {
    id
    vendorId
    planId
    plan { ... }
    status
    startDate
    endDate
    autoRenew
    currentUsage {
      activeUsers
      totalProperties
      totalLeads
      totalDeals
      storageUsed
    }
  }
}
```

**Location**: `graphql/queries/subscription.queries.ts` → `GET_MY_SUBSCRIPTION_QUERY`

### Get Available Plans
```graphql
query GetSubscriptionPlans($activeOnly: Boolean) {
  subscriptionPlans(activeOnly: $activeOnly) {
    id
    name
    slug
    description
    price
    billingCycle
    features { ... }
    isActive
  }
}
```

## Subscription Statuses

| Status | Description | Auto-Renew |
|--------|-------------|-----------|
| `TRIAL` | Free trial period (30 days) | Yes |
| `ACTIVE` | Paid active subscription | Configurable |
| `EXPIRED` | Subscription ended | No |
| `CANCELLED` | User cancelled subscription | No |
| `PAUSED` | Subscription paused temporarily | No |

## Feature Flags by Plan

### Solo Agent ($49.99/month)
- 1 Team Member
- 50 Properties
- 100 Leads
- 25 Deals
- 5GB Storage
- No premium features

### Brokerage ($199.99/month)
- 10 Team Members
- 500 Properties
- 1000 Leads
- 200 Deals
- 50GB Storage
- ✅ Custom Branding
- ✅ API Access
- ✅ Advanced Analytics
- ✅ Priority Support

### Enterprise ($499.99/month)
- 100 Team Members
- 10000 Properties
- 50000 Leads
- 5000 Deals
- 500GB Storage
- ✅ All Brokerage features
- ✅ Custom Integrations

## Database Models

### VendorSubscription Model
```typescript
{
  _id: ObjectId,
  vendorId: ObjectId (Reference),
  planId: ObjectId (Reference),
  status: String ('active' | 'trial' | 'expired' | 'cancelled' | 'paused'),
  startDate: Date,
  endDate: Date,
  trialEndDate: Date (Optional),
  autoRenew: Boolean,
  currentUsage: {
    activeUsers: Number,
    totalProperties: Number,
    totalLeads: Number,
    totalDeals: Number,
    storageUsed: Number (in GB)
  },
  paymentMethod: String (Optional),
  lastPaymentDate: Date (Optional),
  nextPaymentDate: Date (Optional),
  notes: String (Optional),
  cancelledAt: Date (Optional),
  cancelReason: String (Optional),
  createdAt: Date,
  updatedAt: Date
}
```

### SubscriptionPlan Model
```typescript
{
  _id: ObjectId,
  name: String ('Solo Agent' | 'Brokerage' | 'Enterprise'),
  slug: String ('solo-agent' | 'brokerage' | 'enterprise'),
  description: String,
  price: Number,
  billingCycle: String ('monthly' | 'yearly'),
  features: {
    maxUsers: Number,
    maxProperties: Number,
    maxLeads: Number,
    maxDeals: Number,
    maxStorage: Number (GB),
    customBranding: Boolean,
    apiAccess: Boolean,
    advancedAnalytics: Boolean,
    prioritySupport: Boolean,
    customIntegrations: Boolean
  },
  isActive: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Queries
- `mySubscription`: Get current user's subscription (requires auth)
- `subscriptionPlans(activeOnly)`: Get available plans (no auth required)
- `subscriptionPlan(id)`: Get single plan details (requires auth)
- `checkPlanSubscriptionStatus(vendorId)`: Check usage limits
- `allSubscriptionPlansWithDetails`: Get all plans with details (no auth required)

### Mutations
- `assignSubscription(input)`: Assign plan to vendor (admin only)
- `updateVendorSubscription(vendorId, planId)`: Change vendor's plan
- `cancelVendorSubscription(vendorId, reason)`: Cancel subscription
- `updateUsageStats(vendorId)`: Update usage metrics (admin only)

## Usage Limit Enforcement

The system enforces limits through `checkPlanSubscriptionStatus` query:

```typescript
{
  isValid: Boolean,           // Is subscription valid
  canAddUser: Boolean,        // Current users < max users
  canAddProperty: Boolean,    // Current properties < max properties
  canAddLead: Boolean,        // Current leads < max leads
  canAddDeal: Boolean,        // Current deals < max deals
  limitReached: String|null,  // Error message if limit reached
  daysRemaining: Number       // Days until renewal
}
```

Use this to prevent users from exceeding their plan limits.

## Automatic Updates

### Usage Statistics
When users perform actions (create property, invite team member, etc.):
1. Action is completed
2. `updateUsageStatsInternal()` is called
3. `VendorSubscription.currentUsage` is updated with real counts from database:
   - Active users count
   - Total properties count
   - Total leads count
   - Total deals count

### Expiration Tracking
- Subscription automatically marked as `EXPIRED` on renewal date
- If `autoRenew: true`, new subscription period is created
- Users get warning if expiring in < 7 days

## Settings Page Navigation

To access subscription settings:
1. User logs in
2. Navigate to Settings (gear icon)
3. Click "Subscription & Billing" in left sidebar
4. View current plan details and usage
5. Upgrade plan if needed

## Registration Flow Diagram

```
User Registration Page
        ↓
   Select Plan
        ↓
   Enter Details
        ↓
   Submit Form
        ↓
Backend Registration Process
   ├─ Create Vendor
   ├─ Create VendorSubscription
   └─ Create User
        ↓
   Generate Auth Token
        ↓
   User Logged In
        ↓
Settings Page
   └─ View Subscription
```

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| "Plan not found" | Invalid planId | Select valid plan from list |
| "Usage limit reached" | Exceeded plan limits | Upgrade to higher plan |
| "Subscription expired" | Renewal date passed | Renew subscription |
| "Unauthorized" | Not vendor admin | Only admins can view |

## Testing

### Test Registration Flow
1. Go to Register page
2. Fill in all fields
3. Select "Brokerage" plan
4. Submit
5. Login with new credentials
6. Go to Settings > Subscription & Billing
7. Verify plan displays correctly

### Test Usage Tracking
1. Login as registered user
2. Create properties/leads/deals
3. Check usage in Settings
4. Verify percentages increase

### Test Upgrade
1. View subscription settings
2. Select higher plan
3. Click Upgrade
4. Verify plan updated
5. Check new limits displayed

## Future Enhancements

1. **Payment Integration**
   - Stripe/PayPal integration
   - Automatic billing
   - Payment history

2. **Custom Plans**
   - Admin ability to create custom plans
   - Per-vendor custom limits

3. **Downgrade Logic**
   - Prevent downgrade if usage exceeds new plan limits
   - Warn users about data loss

4. **Plan Change History**
   - Track all plan changes
   - Show billing timeline

5. **Renewal Automation**
   - Auto-renewal without manual intervention
   - Email reminders before expiry

6. **Analytics**
   - Usage trends
   - Cost analysis
   - Upgrade recommendations
