# Subscription Plans API Documentation

## Overview
Complete API endpoint to fetch all available subscription plan details with comprehensive information about features, pricing, and limits.

## API Endpoint

### Query: `allSubscriptionPlansWithDetails`

**Purpose**: Fetch all active subscription plans with complete details

**Authentication**: ❌ Not required (Public API)

**Query**:
```graphql
query AllSubscriptionPlansWithDetails {
  allSubscriptionPlansWithDetails {
    id
    name
    slug
    description
    price
    billingCycle
    features {
      maxUsers
      maxProperties
      maxLeads
      maxDeals
      maxStorage
      customBranding
      apiAccess
      advancedAnalytics
      prioritySupport
      customIntegrations
    }
    isActive
    displayOrder
    createdAt
    updatedAt
  }
}
```

## Response Example

```json
{
  "data": {
    "allSubscriptionPlansWithDetails": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Solo Agent",
        "slug": "solo-agent",
        "description": "Perfect for individual real estate agents starting their business",
        "price": 49.99,
        "billingCycle": "monthly",
        "features": {
          "maxUsers": 1,
          "maxProperties": 50,
          "maxLeads": 100,
          "maxDeals": 25,
          "maxStorage": 5,
          "customBranding": false,
          "apiAccess": false,
          "advancedAnalytics": false,
          "prioritySupport": false,
          "customIntegrations": false
        },
        "isActive": true,
        "displayOrder": 1,
        "createdAt": "2025-12-12T10:30:00Z",
        "updatedAt": "2025-12-12T10:30:00Z"
      },
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Brokerage",
        "slug": "brokerage",
        "description": "Designed for small to medium-sized real estate brokerages",
        "price": 199.99,
        "billingCycle": "monthly",
        "features": {
          "maxUsers": 10,
          "maxProperties": 500,
          "maxLeads": 1000,
          "maxDeals": 200,
          "maxStorage": 50,
          "customBranding": true,
          "apiAccess": true,
          "advancedAnalytics": true,
          "prioritySupport": true,
          "customIntegrations": false
        },
        "isActive": true,
        "displayOrder": 2,
        "createdAt": "2025-12-12T10:30:00Z",
        "updatedAt": "2025-12-12T10:30:00Z"
      },
      {
        "id": "507f1f77bcf86cd799439013",
        "name": "Enterprise",
        "slug": "enterprise",
        "description": "Unlimited power for large real estate organizations",
        "price": 499.99,
        "billingCycle": "monthly",
        "features": {
          "maxUsers": 100,
          "maxProperties": 10000,
          "maxLeads": 50000,
          "maxDeals": 5000,
          "maxStorage": 500,
          "customBranding": true,
          "apiAccess": true,
          "advancedAnalytics": true,
          "prioritySupport": true,
          "customIntegrations": true
        },
        "isActive": true,
        "displayOrder": 3,
        "createdAt": "2025-12-12T10:30:00Z",
        "updatedAt": "2025-12-12T10:30:00Z"
      }
    ]
  }
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID | Unique identifier for the subscription plan |
| `name` | String | Plan name (e.g., "Solo Agent", "Brokerage") |
| `slug` | String | URL-friendly identifier (e.g., "solo-agent", "brokerage") |
| `description` | String | Human-readable plan description |
| `price` | Float | Monthly or yearly price depending on billingCycle |
| `billingCycle` | String | "monthly" or "yearly" |
| `isActive` | Boolean | Whether the plan is currently available |
| `displayOrder` | Int | Sort order for displaying plans (1 = first) |
| `createdAt` | String | ISO 8601 timestamp of plan creation |
| `updatedAt` | String | ISO 8601 timestamp of last update |

### Features Object

| Feature | Type | Description |
|---------|------|-------------|
| `maxUsers` | Int | Maximum number of team members |
| `maxProperties` | Int | Maximum number of properties |
| `maxLeads` | Int | Maximum number of leads |
| `maxDeals` | Int | Maximum number of deals |
| `maxStorage` | Int | Maximum storage in GB |
| `customBranding` | Boolean | White-label capabilities |
| `apiAccess` | Boolean | API access for integrations |
| `advancedAnalytics` | Boolean | Advanced analytics and reporting |
| `prioritySupport` | Boolean | Priority customer support |
| `customIntegrations` | Boolean | Custom integrations support |

## Frontend Usage

### TypeScript/React Example

```typescript
import { graphqlRequest } from '@/lib/graphql';
import { ALL_SUBSCRIPTION_PLANS_QUERY } from '@/graphql/queries/billing.queries';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billingCycle: string;
  features: PlanFeatures;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

async function loadSubscriptionPlans(): Promise<Plan[]> {
  try {
    const data = await graphqlRequest(ALL_SUBSCRIPTION_PLANS_QUERY, {});
    return data?.allSubscriptionPlansWithDetails || [];
  } catch (error) {
    console.error('Failed to load plans:', error);
    return [];
  }
}
```

## Use Cases

1. **Registration Page**: Display available plans during signup
2. **Pricing Page**: Show all plans with detailed feature comparison
3. **Plan Selection**: Allow users to compare and select a plan
4. **Admin Dashboard**: View and manage available subscription tiers
5. **Mobile App**: Fetch plans for mobile clients

## Error Handling

```graphql
{
  allSubscriptionPlansWithDetails {
    # Query will return empty array [] if no active plans exist
  }
}
```

- Returns empty array `[]` if no active plans found
- Returns error if database connection fails
- Public endpoint - no authentication errors

## Related Queries

- `availablePlans`: Alternative query (returns same data)
- `subscriptionPlans(activeOnly: Boolean)`: Fetch with optional filtering
- `subscriptionPlan(id: ID!)`: Get single plan details

## Integration Points

- **Register Screen**: `AVAILABLE_PLANS_QUERY` or `ALL_SUBSCRIPTION_PLANS_QUERY`
- **Pricing Page**: `ALL_SUBSCRIPTION_PLANS_QUERY`
- **Plan Comparison**: `ALL_SUBSCRIPTION_PLANS_QUERY`
- **Admin Panel**: `subscriptionPlans()` or `ALL_SUBSCRIPTION_PLANS_QUERY`

## API Endpoints Summary

| Endpoint | Purpose | Auth Required |
|----------|---------|----------------|
| `allSubscriptionPlansWithDetails` | Get all plans with complete details | ❌ No |
| `availablePlans` | Get available plans (legacy) | ❌ No |
| `subscriptionPlans(activeOnly)` | Get plans with filtering | ❌ No |
| `subscriptionPlan(id)` | Get single plan by ID | ✅ Yes |
