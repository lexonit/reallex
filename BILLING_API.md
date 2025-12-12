# Billing API Documentation

## Overview

The billing system provides comprehensive subscription and payment management for the Real Estate platform. It supports multiple subscription plans, payment methods, invoice generation, and subscription lifecycle management.

## Database Models

### 1. Plan Model (`backend/models/Plan.ts`)

Defines available subscription plans with features and pricing.

**Fields:**
- `name`: Enum (FREE, STARTER, PROFESSIONAL, ENTERPRISE) - Unique plan identifier
- `displayName`: String - User-friendly plan name
- `description`: String - Plan description
- `monthlyPrice`: Number - Monthly subscription cost
- `yearlyPrice`: Number - Yearly subscription cost (discount applied)
- `features`: Array<String> - List of included features
- `maxUsers`: Number - Maximum team members allowed
- `maxProperties`: Number - Maximum properties allowed
- `maxTemplates`: Number - Maximum templates allowed
- `supportLevel`: Enum (EMAIL, PRIORITY, DEDICATED) - Support tier
- `isActive`: Boolean - Plan availability
- `timestamps`: createdAt, updatedAt

**Indexes:**
- `name` (unique, indexed)
- `isActive` (indexed)

**Default Plans:**
```
FREE        - $0/month   - 5 users, 10 properties, 1 template
STARTER     - $99/month  - 15 users, 50 properties, 5 templates
PROFESSIONAL - $299/month - 50 users, 1000 properties, 20 templates
ENTERPRISE  - $999/month - Unlimited (custom)
```

### 2. Subscription Model (`backend/models/Subscription.ts`)

Manages vendor subscription status and billing information.

**Fields:**
- `vendorId`: ObjectId (required, indexed) - Reference to Vendor
- `plan`: Enum (FREE, STARTER, PROFESSIONAL, ENTERPRISE) - Current plan
- `status`: Enum (ACTIVE, CANCELLED, EXPIRED, PAUSED) - Subscription status
- `currentPeriodStart`: Date - Billing period start
- `currentPeriodEnd`: Date - Billing period end
- `amount`: Number - Current subscription amount
- `billingCycle`: Enum (MONTHLY, YEARLY) - Billing frequency
- `paymentMethodId`: String (optional) - Payment method reference
- `autoRenew`: Boolean - Auto-renewal flag
- `cancelledAt`: Date (optional) - Cancellation timestamp
- `timestamps`: createdAt, updatedAt

**Indexes:**
- `vendorId` (indexed)
- `vendorId + status` (compound index)

### 3. PaymentMethod Model (`backend/models/PaymentMethod.ts`)

Stores payment method information for subscriptions.

**Fields:**
- `vendorId`: ObjectId (required, indexed) - Reference to Vendor
- `type`: Enum (CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER)
- `cardLast4`: String - Last 4 digits
- `cardBrand`: String - Card issuer (Visa, Mastercard, etc.)
- `expiryMonth`: Number (optional)
- `expiryYear`: Number (optional)
- `isDefault`: Boolean - Primary payment method flag
- `isActive`: Boolean - Soft delete flag
- `timestamps`: createdAt, updatedAt

**Indexes:**
- `vendorId` (indexed)
- `vendorId + isDefault` (compound index)

### 4. Invoice Model (`backend/models/Invoice.ts`)

Tracks billing records and payment history.

**Fields:**
- `vendorId`: ObjectId (required, indexed) - Reference to Vendor
- `subscriptionId`: ObjectId (required) - Reference to Subscription
- `invoiceNumber`: String (unique, indexed) - Invoice identifier
- `amount`: Number - Invoice total
- `currency`: String - Currency code (default: USD)
- `status`: Enum (DRAFT, SENT, PAID, FAILED, CANCELLED)
- `billDate`: Date - Invoice generation date
- `dueDate`: Date - Payment due date
- `paidDate`: Date (optional) - Payment completion date
- `description`: String - Invoice description
- `lineItems`: Array of {description, quantity, unitPrice, amount}
- `subtotal`: Number - Amount before tax
- `tax`: Number - Tax amount
- `total`: Number - Final amount
- `pdfUrl`: String (optional) - Invoice PDF URL
- `timestamps`: createdAt, updatedAt

**Indexes:**
- `vendorId + status` (for filtering invoices by vendor and status)
- `vendorId + billDate DESC` (for sorting by date)

## GraphQL API

### Enums

```graphql
enum PlanType {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

enum BillingCycleType {
  MONTHLY
  YEARLY
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PAUSED
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  FAILED
  CANCELLED
}

enum PaymentMethodType {
  CREDIT_CARD
  DEBIT_CARD
  BANK_TRANSFER
}

enum SupportLevel {
  EMAIL
  PRIORITY
  DEDICATED
}
```

### Types

```graphql
type Plan {
  id: ID!
  name: PlanType!
  displayName: String!
  description: String!
  monthlyPrice: Float!
  yearlyPrice: Float!
  features: [String!]!
  maxUsers: Int!
  maxProperties: Int!
  maxTemplates: Int!
  supportLevel: SupportLevel!
  isActive: Boolean!
  createdAt: String!
  updatedAt: String!
}

type Subscription {
  id: ID!
  vendorId: ID!
  plan: PlanType!
  status: SubscriptionStatus!
  currentPeriodStart: String!
  currentPeriodEnd: String!
  amount: Float!
  billingCycle: BillingCycleType!
  paymentMethodId: String
  autoRenew: Boolean!
  cancelledAt: String
  createdAt: String!
  updatedAt: String!
}

type PaymentMethod {
  id: ID!
  vendorId: ID!
  type: PaymentMethodType!
  cardLast4: String!
  cardBrand: String!
  expiryMonth: Int
  expiryYear: Int
  isDefault: Boolean!
  isActive: Boolean!
  createdAt: String!
  updatedAt: String!
}

type LineItem {
  description: String!
  quantity: Int!
  unitPrice: Float!
  amount: Float!
}

type Invoice {
  id: ID!
  vendorId: ID!
  subscriptionId: ID!
  invoiceNumber: String!
  amount: Float!
  currency: String!
  status: InvoiceStatus!
  billDate: String!
  dueDate: String!
  paidDate: String
  description: String!
  lineItems: [LineItem!]!
  subtotal: Float!
  tax: Float!
  total: Float!
  pdfUrl: String
  createdAt: String!
  updatedAt: String!
}

type BillingData {
  currentSubscription: Subscription
  invoices: [Invoice!]!
  paymentMethods: [PaymentMethod!]!
  availablePlans: [Plan!]!
}
```

### Queries

#### `getSubscription: Subscription`
Get the current subscription for the authenticated vendor.

**Example:**
```graphql
query {
  getSubscription {
    id
    plan
    status
    amount
    billingCycle
    currentPeriodEnd
    autoRenew
  }
}
```

#### `getInvoices(limit: Int, offset: Int): [Invoice!]!`
Retrieve invoices for the current vendor (paginated, sorted by date descending).

**Parameters:**
- `limit`: Number of results (default: 10)
- `offset`: Pagination offset (default: 0)

**Example:**
```graphql
query {
  getInvoices(limit: 20, offset: 0) {
    id
    invoiceNumber
    amount
    status
    billDate
    dueDate
  }
}
```

#### `getPaymentMethods: [PaymentMethod!]!`
Retrieve all active payment methods for the current vendor.

**Example:**
```graphql
query {
  getPaymentMethods {
    id
    type
    cardLast4
    cardBrand
    isDefault
  }
}
```

#### `getPlans: [Plan!]!`
Retrieve all active subscription plans (public, no auth required).

**Example:**
```graphql
query {
  getPlans {
    id
    name
    displayName
    monthlyPrice
    yearlyPrice
    features
    maxUsers
    maxProperties
  }
}
```

### Mutations

#### `subscribe(input: SubscriptionInput!): Subscription!`
Create or update a subscription. Automatically creates an invoice.

**Input:**
```graphql
input SubscriptionInput {
  plan: PlanType!              # Target plan
  billingCycle: BillingCycleType!  # MONTHLY or YEARLY
  paymentMethodId: String      # Optional payment method ID
}
```

**Example:**
```graphql
mutation {
  subscribe(input: {
    plan: PROFESSIONAL
    billingCycle: YEARLY
    paymentMethodId: "pm_123"
  }) {
    id
    plan
    status
    amount
    currentPeriodStart
    currentPeriodEnd
  }
}
```

**Behavior:**
- Validates plan exists
- Validates payment method if provided
- Calculates billing period (1 month or 1 year from now)
- Sets amount based on plan pricing and billing cycle
- Creates subscription with status ACTIVE
- Automatically generates invoice for the subscription

#### `updatePaymentMethod(paymentMethodId: ID!, input: PaymentMethodInput!): PaymentMethod!`
Update an existing payment method. If marked as default, removes default flag from others.

**Input:**
```graphql
input PaymentMethodInput {
  type: PaymentMethodType!
  cardLast4: String!
  cardBrand: String!
  expiryMonth: Int
  expiryYear: Int
  isDefault: Boolean
}
```

**Example:**
```graphql
mutation {
  updatePaymentMethod(paymentMethodId: "pm_123", input: {
    type: CREDIT_CARD
    cardLast4: "4242"
    cardBrand: "Visa"
    expiryMonth: 12
    expiryYear: 2025
    isDefault: true
  }) {
    id
    isDefault
  }
}
```

#### `addPaymentMethod(input: PaymentMethodInput!): PaymentMethod!`
Add a new payment method. If marked as default, removes default flag from others.

**Input:**
```graphql
input PaymentMethodInput {
  type: PaymentMethodType!
  cardLast4: String!
  cardBrand: String!
  expiryMonth: Int
  expiryYear: Int
  isDefault: Boolean
}
```

**Example:**
```graphql
mutation {
  addPaymentMethod(input: {
    type: CREDIT_CARD
    cardLast4: "5678"
    cardBrand: "Mastercard"
    expiryMonth: 6
    expiryYear: 2026
    isDefault: false
  }) {
    id
    type
    cardLast4
    isDefault
  }
}
```

#### `removePaymentMethod(paymentMethodId: ID!): Boolean!`
Soft delete a payment method (marks isActive as false).

**Example:**
```graphql
mutation {
  removePaymentMethod(paymentMethodId: "pm_123")
}
```

**Returns:** `true` if successful, `false` if payment method not found

#### `cancelSubscription(reason: String): Subscription!`
Cancel the current subscription.

**Parameters:**
- `reason`: String (optional) - Cancellation reason

**Example:**
```graphql
mutation {
  cancelSubscription(reason: "switching providers") {
    id
    status
    cancelledAt
    autoRenew
  }
}
```

**Behavior:**
- Sets status to CANCELLED
- Sets cancelledAt timestamp
- Disables autoRenew

#### `updateSubscription(plan: PlanType!, billingCycle: BillingCycleType!): Subscription!`
Change the subscription plan or billing cycle.

**Parameters:**
- `plan`: PlanType - New plan tier
- `billingCycle`: BillingCycleType - New billing frequency

**Example:**
```graphql
mutation {
  updateSubscription(plan: ENTERPRISE, billingCycle: YEARLY) {
    id
    plan
    amount
    currentPeriodStart
    currentPeriodEnd
  }
}
```

**Behavior:**
- Validates plan exists
- Recalculates billing period
- Updates amount based on new plan and cycle
- Resets currentPeriodStart and currentPeriodEnd

## Access Control

All billing operations require authentication (except `getPlans`).

- **getSubscription**: Vendor must have active subscription
- **getInvoices**: Vendor can view own invoices only
- **getPaymentMethods**: Vendor can view own payment methods only
- **getPlans**: Public (no auth required)
- **subscribe**: Vendor must be authenticated
- **updatePaymentMethod**: Vendor must own the payment method
- **addPaymentMethod**: Vendor must be authenticated
- **removePaymentMethod**: Vendor must own the payment method
- **cancelSubscription**: Vendor must own the subscription
- **updateSubscription**: Vendor must own the subscription

## Multi-Tenancy

All billing operations are scoped to the current vendor (derived from context.user.vendorId):

```typescript
// vendorId filtering applied in all queries/mutations
const subscription = await Subscription.findOne({
  vendorId: user.vendorId
});
```

## Implementation Details

### Billing Period Calculation

- **Monthly**: Starts today, ends 1 month from now
- **Yearly**: Starts today, ends 1 year from now

```typescript
const now = new Date();
if (billingCycle === 'MONTHLY') {
  endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 1);
} else {
  endDate = new Date(now);
  endDate.setFullYear(endDate.getFullYear() + 1);
}
```

### Invoice Generation

Invoices are automatically created when:
1. A subscription is created (`subscribe` mutation)
2. Subscriptions are updated (future implementation)

Invoice fields are pre-populated:
- `invoiceNumber`: Unique format `INV-{timestamp}-{random}`
- `lineItems`: Single item with plan name and price
- `status`: Set to SENT (ready for payment)
- `dueDate`: 30 days after bill date

### Payment Method Defaults

- Only one payment method can be default per vendor
- Updating/adding with `isDefault: true` automatically sets all others to `isDefault: false`
- No validation on expiry - handled by payment processor

## Usage Example

### Complete Subscription Flow

1. **Get available plans:**
```graphql
query {
  getPlans {
    name
    displayName
    monthlyPrice
    yearlyPrice
    features
  }
}
```

2. **Add payment method:**
```graphql
mutation {
  addPaymentMethod(input: {
    type: CREDIT_CARD
    cardLast4: "4242"
    cardBrand: "Visa"
    expiryMonth: 12
    expiryYear: 2025
    isDefault: true
  }) {
    id
  }
}
```

3. **Subscribe to plan:**
```graphql
mutation {
  subscribe(input: {
    plan: PROFESSIONAL
    billingCycle: YEARLY
    paymentMethodId: "pm_abc123"
  }) {
    id
    plan
    status
    amount
    currentPeriodEnd
  }
}
```

4. **Check subscription status:**
```graphql
query {
  getSubscription {
    plan
    status
    amount
    currentPeriodEnd
    autoRenew
  }
}
```

5. **View invoices:**
```graphql
query {
  getInvoices(limit: 10) {
    invoiceNumber
    amount
    status
    billDate
    pdfUrl
  }
}
```

## Files Structure

```
backend/
├── models/
│   ├── Subscription.ts      # Subscription model
│   ├── PaymentMethod.ts     # Payment method model
│   ├── Invoice.ts           # Invoice model
│   └── Plan.ts              # Plan model
├── graphql/
│   ├── types/
│   │   └── billing.types.ts # GraphQL types and enums
│   └── resolvers/
│       └── billing.resolvers.ts # GraphQL resolvers
└── seed/
    └── seed.ts              # Database seeding (includes plans)
```

## Future Enhancements

1. **Webhook Handling**: Process payment events from external providers
2. **Stripe Integration**: Connect to Stripe for real payment processing
3. **Usage-Based Billing**: Track usage metrics for overage charges
4. **Proration**: Calculate partial month charges for mid-cycle changes
5. **Renewal Automation**: Automatic subscription renewal on period end
6. **Receipt Generation**: PDF invoice generation and email delivery
7. **Payment Retry**: Automatic retry logic for failed payments
8. **Dunning Management**: Handle expired/invalid payment methods
9. **Multi-Currency**: Support for different currencies per region
10. **Custom Billing**: Support for custom enterprise agreements

