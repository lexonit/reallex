# Subscription Management System

## Overview
Complete end-to-end subscription management system with three pricing tiers, automated limit enforcement, and real-time usage tracking.

## Pricing Plans

### 1. Solo Agent - $49.99/month
- **Max Users**: 1
- **Max Properties**: 50
- **Max Leads**: 100
- **Max Deals**: 20
- **Max Storage**: 5GB
- **Features**: Basic CRM, Email Templates, Mobile App
- **Target**: Individual real estate agents

### 2. Brokerage - $199.99/month
- **Max Users**: 10
- **Max Properties**: 500
- **Max Leads**: 1,000
- **Max Deals**: 200
- **Max Storage**: 50GB
- **Features**: All Solo features + Team Management, Advanced Analytics, API Access, Custom Branding
- **Target**: Small to medium brokerages

### 3. Enterprise - $499.99/month
- **Max Users**: 100
- **Max Properties**: Unlimited
- **Max Leads**: Unlimited
- **Max Deals**: Unlimited
- **Max Storage**: 500GB
- **Features**: All Brokerage features + Dedicated Support, White Label, SSO, Custom Integrations
- **Target**: Large brokerages and enterprises

## Architecture

### Backend Components

#### Models
1. **SubscriptionPlan** (`backend/models/SubscriptionPlan.ts`)
   - Stores plan details, pricing, and feature limits
   - Fields: name, slug, price, billingCycle, features, isActive
   - Indexed by slug for fast lookups

2. **VendorSubscription** (`backend/models/VendorSubscription.ts`)
   - Tracks vendor subscriptions and usage
   - Fields: vendorId, planId, status, currentUsage, dates
   - Methods: `isValid()`, `canAddUser()`
   - Automatically tracks usage stats

#### GraphQL API

**Types** (`backend/graphql/types/subscription.types.ts`)
- SubscriptionPlan, VendorSubscription, SubscriptionFeatures, UsageStats
- Enums: SubscriptionStatus, BillingCycle

**Queries**
```graphql
subscriptionPlans: [SubscriptionPlan]
mySubscription: VendorSubscription
checkSubscriptionStatus: SubscriptionStatus
```

**Mutations**
```graphql
createSubscriptionPlan(input): SubscriptionPlan
updateSubscriptionPlan(id, input): SubscriptionPlan
deleteSubscriptionPlan(id): Boolean
assignSubscription(vendorId, planId): VendorSubscription
cancelSubscription(vendorId): VendorSubscription
updateUsageStats(vendorId): VendorSubscription
```

#### Middleware (`backend/middleware/subscription.ts`)
- **checkSubscriptionLimits(resourceType)**: REST API middleware
- **checkGraphQLSubscriptionLimit(context, resourceType)**: GraphQL resolver check
- **addSubscriptionToContext(context)**: Adds subscription to GraphQL context
- **updateUsageStatsInternal(vendorId)**: Real-time usage calculation

#### Limit Enforcement
The system automatically checks limits before:
- Creating properties (REST: `POST /api/properties`, GraphQL: `createProperty`)
- Creating leads (REST: `POST /api/leads`, GraphQL: `createLead`)
- Creating deals (REST: `POST /api/deals`, GraphQL: `createDeal`)
- Inviting users (GraphQL: `inviteUser`)

Error response format:
```json
{
  "error": "Subscription limit reached: You have reached the maximum number of properties (50/50) allowed on the Solo Agent plan. Please upgrade your subscription."
}
```

### Frontend Components

#### User Interface

**SubscriptionSettings** (`containers/settings/SubscriptionSettings.tsx`)
- User-facing subscription management page
- Features:
  - Current plan display with expiry date
  - Real-time usage bars (color-coded: 90%+ red, 75%+ orange)
  - Plan comparison cards with all features
  - Upgrade/downgrade functionality
  - Expiry warnings (30 days, 7 days, expired)
- Route: `/settings/subscription`

**PricingManagement** (`containers/admin/PricingManagement.tsx`)
- Super admin pricing management interface
- Features:
  - DataTable view of all plans
  - Create/Edit/Delete plans
  - Toggle plan activation
  - Edit all features and pricing
  - Validation (price > 0, unique slugs)
- Route: `/admin/pricing`
- Access: SUPER_ADMIN only

#### GraphQL Queries/Mutations
- **Queries**: `graphql/queries/subscription.queries.ts`
- **Mutations**: `graphql/mutations/subscription.mutations.ts`

## Setup Instructions

### 1. Database Initialization
```bash
# Seed default subscription plans
cd backend
npm run seed:subscriptions
```

This will create the three default plans (Solo Agent, Brokerage, Enterprise).

### 2. Environment Variables
No additional environment variables needed. Uses existing MongoDB connection.

### 3. GraphQL Schema
The subscription types are automatically included in the GraphQL schema at `/graphql`.

### 4. Testing Subscriptions

#### Assign a subscription to a vendor:
```graphql
mutation {
  assignSubscription(
    vendorId: "vendor_id_here"
    planId: "plan_id_here"
  ) {
    _id
    status
    currentUsage {
      activeUsers
      activeProperties
      activeLeads
      activeDeals
    }
  }
}
```

#### Check current subscription:
```graphql
query {
  mySubscription {
    _id
    plan {
      name
      price
      features {
        maxUsers
        maxProperties
        maxLeads
        maxDeals
      }
    }
    status
    currentUsage {
      activeUsers
      activeProperties
      activeLeads
      activeDeals
      storageUsed
    }
  }
}
```

## Usage Patterns

### For Developers

#### Adding limit checks to new resources:
```typescript
// REST API
import { checkSubscriptionLimits } from '../middleware/subscription';
router.post('/new-resource', checkSubscriptionLimits('resourceType') as any, createResource);

// GraphQL Resolver
const { checkGraphQLSubscriptionLimit } = await import('../../middleware/subscription');
await checkGraphQLSubscriptionLimit(context, 'resourceType');
```

#### Updating usage stats:
Usage stats are automatically updated when:
- Resources are created/deleted
- Users are activated/deactivated
- Manual update: Call `updateUsageStats` mutation

### For Super Admins

#### Create a new plan:
1. Navigate to `/admin/pricing`
2. Click "Create New Plan"
3. Fill in plan details:
   - Name, slug (unique identifier)
   - Price and billing cycle
   - Feature limits
   - Feature toggles (team management, analytics, etc.)
4. Set display order for sorting
5. Activate the plan

#### Modify existing plan:
1. Navigate to `/admin/pricing`
2. Click on the plan row
3. Edit fields in the modal
4. Save changes

#### Deactivate a plan:
1. Navigate to `/admin/pricing`
2. Click the plan
3. Uncheck "Active"
4. Existing subscriptions remain active, but new users cannot subscribe

### For Vendors/Users

#### View current subscription:
1. Navigate to Settings → Subscription
2. View current plan, usage, and expiry date
3. Usage bars show how close you are to limits:
   - Green: < 75%
   - Orange: 75-90%
   - Red: > 90%

#### Upgrade subscription:
1. Navigate to Settings → Subscription
2. Browse available plans
3. Click "Upgrade to [Plan Name]"
4. Confirm upgrade
5. Limits are immediately increased

## Database Schema

### SubscriptionPlan
```typescript
{
  name: String (required)
  slug: String (unique, required)
  description: String
  price: Number (required, min: 0)
  billingCycle: 'monthly' | 'yearly' (default: 'monthly')
  features: {
    maxUsers: Number (required)
    maxProperties: Number (required, -1 = unlimited)
    maxLeads: Number (required, -1 = unlimited)
    maxDeals: Number (required, -1 = unlimited)
    maxStorage: Number (in GB)
    teamManagement: Boolean
    advancedAnalytics: Boolean
    apiAccess: Boolean
    customBranding: Boolean
    dedicatedSupport: Boolean
    whiteLabel: Boolean
    sso: Boolean
    customIntegrations: Boolean
  }
  isActive: Boolean (default: true)
  displayOrder: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

### VendorSubscription
```typescript
{
  vendorId: ObjectId (required, indexed)
  planId: ObjectId (required, ref: 'SubscriptionPlan')
  status: 'active' | 'trial' | 'expired' | 'cancelled' | 'suspended'
  startDate: Date
  endDate: Date
  trialEndsAt: Date
  lastPaymentDate: Date
  currentUsage: {
    activeUsers: Number (default: 0)
    activeProperties: Number (default: 0)
    activeLeads: Number (default: 0)
    activeDeals: Number (default: 0)
    storageUsed: Number (in GB, default: 0)
  }
  paymentInfo: {
    stripeCustomerId: String
    stripeSubscriptionId: String
    paymentMethod: String
  }
  createdAt: Date
  updatedAt: Date
}
```

## API Reference

### REST Endpoints
All REST endpoints automatically check subscription limits before resource creation:
- `POST /api/properties` - Check property limit
- `POST /api/leads` - Check lead limit
- `POST /api/deals` - Check deal limit

### GraphQL Endpoints

#### Queries
- `subscriptionPlans: [SubscriptionPlan]` - Get all active plans
- `mySubscription: VendorSubscription` - Get current user's subscription
- `checkSubscriptionStatus: SubscriptionStatus` - Check if subscription is valid

#### Mutations (User)
- `assignSubscription(vendorId: ID!, planId: ID!): VendorSubscription` - Assign plan to vendor
- `cancelSubscription(vendorId: ID!): VendorSubscription` - Cancel subscription
- `updateUsageStats(vendorId: ID!): VendorSubscription` - Refresh usage stats

#### Mutations (Super Admin)
- `createSubscriptionPlan(input: SubscriptionPlanInput!): SubscriptionPlan` - Create new plan
- `updateSubscriptionPlan(id: ID!, input: SubscriptionPlanInput!): SubscriptionPlan` - Update plan
- `deleteSubscriptionPlan(id: ID!): Boolean` - Delete plan (soft delete if has active subscriptions)

## Security

### Access Control
- **Super Admin**: Full access to all subscription management
- **Vendor Admin**: Can view own subscription, upgrade/downgrade
- **Other Roles**: Read-only access to own subscription

### Validation
- All numeric limits must be >= -1 (-1 means unlimited)
- Prices must be > 0
- Plan slugs must be unique
- Cannot delete plans with active subscriptions
- Cannot exceed subscription limits (enforced at API level)

## Monitoring

### Usage Tracking
- Real-time usage calculation from database
- Usage stats updated on:
  - Resource creation/deletion
  - Manual refresh via `updateUsageStats`
- Usage displayed in user interface with visual indicators

### Expiry Warnings
- 30 days before expiry: Yellow badge
- 7 days before expiry: Orange badge
- Expired: Red badge with "Expired" status

## Future Enhancements

### Potential Features
1. **Payment Integration**
   - Stripe integration for automatic billing
   - Invoice generation
   - Payment history

2. **Trial Management**
   - Automatic trial to paid conversion
   - Trial usage restrictions
   - Trial extension capabilities

3. **Usage Alerts**
   - Email notifications at 75%, 90%, 100% usage
   - Webhook notifications for external systems
   - SMS alerts for critical limits

4. **Analytics**
   - Revenue tracking per plan
   - Churn rate analysis
   - Upgrade/downgrade trends
   - Usage patterns

5. **Advanced Features**
   - Custom plans for specific vendors
   - Add-ons (extra storage, users, etc.)
   - Volume discounts
   - Annual billing with discount

## Troubleshooting

### Subscription not found
- Ensure vendor has an assigned subscription
- Check `vendorId` matches the current user's vendor
- Run `assignSubscription` mutation to create one

### Limit not enforced
- Check middleware is added to the route/resolver
- Verify subscription status is 'active' or 'trial'
- Check if limit is set to -1 (unlimited)

### Usage stats incorrect
- Run `updateUsageStats` mutation to recalculate
- Check database for orphaned records
- Verify soft-delete is working (isDeleted flag)

### GraphQL schema not found
- Restart server after adding subscription types
- Check `backend/graphql/schema/index.ts` includes subscription types
- Verify `graphql-tag` package is installed

## Support
For questions or issues with the subscription system, contact the development team or refer to:
- GraphQL Playground: `http://localhost:5000/graphql`
- Database: MongoDB collections `subscriptionplans` and `vendorsubscriptions`
