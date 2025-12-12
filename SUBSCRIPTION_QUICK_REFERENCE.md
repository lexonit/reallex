# Vendor Subscription - Quick Reference

## New Vendor Registration Flow ✅

### What Happens
1. User registers with plan selection (Solo Agent, Brokerage, or Enterprise)
2. Backend automatically creates:
   - Vendor record
   - VendorSubscription with selected plan
   - User account linked to vendor
3. User logs in and sees subscription in Settings

### GraphQL Mutation
```graphql
mutation Register($input: UserInput!) {
  register(input: $input) {
    token
    user {
      _id
      email
      role
      vendorId
    }
  }
}
```

**Input includes**:
- `planId`: Selected plan ID
- `firstName`, `lastName`: User info
- `email`, `password`: Credentials
- `vendorName`, `vendorSlug`: Organization info

---

## View Subscription in Settings ✅

### Location
Settings → "Subscription & Billing" tab

### Displays
1. **Current Plan**
   - Name, price, billing cycle
   - Status (TRIAL/ACTIVE)
   - Renewal date & days remaining

2. **Usage Metrics**
   - Users, Properties, Leads, Deals (with progress bars)
   - Storage usage

3. **Enabled Features**
   - Custom Branding ✅/❌
   - API Access ✅/❌
   - Advanced Analytics ✅/❌
   - Priority Support ✅/❌
   - Custom Integrations ✅/❌

4. **Available Plans**
   - All plans displayed for comparison
   - Upgrade button for higher plans

---

## API Queries

### Get User's Subscription
```graphql
query GetMySubscription {
  mySubscription {
    id
    plan { name, price, features { ... } }
    status
    currentUsage { ... }
    startDate
    endDate
  }
}
```

### Get Available Plans
```graphql
query AvailablePlans {
  subscriptionPlans(activeOnly: true) {
    id
    name
    price
    features { ... }
  }
}
```

### Check Usage Limits
```graphql
query CheckStatus($vendorId: ID!) {
  checkPlanSubscriptionStatus(vendorId: $vendorId) {
    isValid
    canAddUser
    canAddProperty
    canAddLead
    canAddDeal
    daysRemaining
  }
}
```

---

## Database Records Created

When a vendor registers:

### 1. Vendor Record
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Prestige Estates",
  "slug": "prestige-estates",
  "contactEmail": "admin@prestige.com",
  "logoUrl": "",
  "theme": { "primaryColor": "#3B82F6" },
  "isActive": true
}
```

### 2. VendorSubscription Record
```json
{
  "_id": "607f1f77bcf86cd799439012",
  "vendorId": "507f1f77bcf86cd799439011",
  "planId": "707f1f77bcf86cd799439013",
  "status": "trial",
  "startDate": "2025-12-12T10:00:00Z",
  "endDate": "2026-01-11T10:00:00Z",
  "autoRenew": true,
  "currentUsage": {
    "activeUsers": 0,
    "totalProperties": 0,
    "totalLeads": 0,
    "totalDeals": 0,
    "storageUsed": 0
  }
}
```

### 3. User Record
```json
{
  "_id": "807f1f77bcf86cd799439014",
  "email": "admin@prestige.com",
  "firstName": "Sarah",
  "lastName": "Connor",
  "role": "VENDOR_ADMIN",
  "vendorId": "507f1f77bcf86cd799439011",
  "isActive": true
}
```

---

## Subscription Plans Available

| Plan | Price | Users | Properties | Leads | Deals | Storage | Features |
|------|-------|-------|-----------|-------|-------|---------|----------|
| Solo Agent | $49.99/mo | 1 | 50 | 100 | 25 | 5GB | Basic |
| Brokerage | $199.99/mo | 10 | 500 | 1000 | 200 | 50GB | Branding, API, Analytics, Support |
| Enterprise | $499.99/mo | 100 | 10000 | 50000 | 5000 | 500GB | All features |

---

## Key Files Modified/Used

### Frontend
- `containers/auth/RegisterPage.tsx` - Plan selection during registration
- `containers/settings/SubscriptionSettings.tsx` - Display subscription info
- `containers/settings/SettingsPage.tsx` - Settings page integration
- `graphql/queries/subscription.queries.ts` - GraphQL queries

### Backend
- `backend/graphql/resolvers/user.resolvers.ts` - Register mutation (creates subscription)
- `backend/graphql/resolvers/subscription.resolvers.ts` - Subscription queries/mutations
- `backend/models/VendorSubscription.ts` - Subscription model
- `backend/models/SubscriptionPlan.ts` - Plan model
- `backend/seed/subscriptionPlans.ts` - Seed plans into DB

---

## Testing Checklist

- [ ] Register new vendor with plan selection
- [ ] Login as new vendor
- [ ] Navigate to Settings > Subscription & Billing
- [ ] Verify plan details display correctly
- [ ] Verify usage metrics show 0
- [ ] Verify enabled features match plan
- [ ] Check trial period is 30 days
- [ ] Check status shows "trial"
- [ ] Verify upgrade button works
- [ ] Check available plans display

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| Plan not showing in registration | Verify plans seeded in DB: `npm run seed` |
| Subscription not created | Check register mutation includes planId |
| Settings page blank | Verify GraphQL query returns data |
| Usage not updating | Check currentUsage is being calculated |
| Plan features not showing | Verify plan features object is populated |

---

## Next Steps

1. **Payment Processing** - Integrate payment gateway (Stripe/PayPal)
2. **Auto-Renewal** - Implement automatic billing
3. **Plan Change History** - Track subscription changes
4. **Usage Alerts** - Notify when approaching limits
5. **Custom Plans** - Allow admin to create custom plans

---

## Code Snippets

### Get Current Subscription (React)
```typescript
const { data, loading } = useQuery(GET_MY_SUBSCRIPTION_QUERY);

if (loading) return <Spinner />;
if (!data?.mySubscription) return <NoSubscription />;

const { plan, currentUsage, status, endDate } = data.mySubscription;
```

### Check Usage Limits (Backend)
```typescript
const status = await checkPlanSubscriptionStatus(vendorId);

if (!status.canAddProperty) {
  throw new Error('Property limit reached. Please upgrade.');
}
```

### Update Usage (Backend)
```typescript
await updateUsageStatsInternal(vendorId);
const updated = await VendorSubscription.findOne({ vendorId });
console.log(updated.currentUsage); // Updated metrics
```
