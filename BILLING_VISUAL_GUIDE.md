# Billing API - Visual Implementation Guide

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Components:                                               │  │
│  │  • SubscriptionStatus  • ChangePlan                       │  │
│  │  • AddPaymentMethod    • ViewInvoices                     │  │
│  │  • CancelSubscription  • ManagePayments                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│                    GraphQL Apollo Client                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    GRAPHQL API (Express)                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Queries:              │  Mutations:                       │  │
│  │ • getSubscription     │  • subscribe                      │  │
│  │ • getInvoices         │  • updatePaymentMethod            │  │
│  │ • getPaymentMethods   │  • addPaymentMethod               │  │
│  │ • getPlans            │  • removePaymentMethod            │  │
│  │                       │  • cancelSubscription             │  │
│  │                       │  • updateSubscription             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│                   Billing Resolvers                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Auth & Validation   • Auto Invoice Generation           │  │
│  │ • Vendor Scoping      • Billing Period Calculation        │  │
│  │ • Error Handling      • Default Payment Management        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (MongoDB)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Plans Collection      Subscriptions Collection          │   │
│  │  ┌─────────────────┐   ┌──────────────────────┐          │   │
│  │  │ • name (enum)   │   │ • vendorId (indexed) │          │   │
│  │  │ • displayName   │   │ • plan               │          │   │
│  │  │ • monthlyPrice  │   │ • status             │          │   │
│  │  │ • features      │   │ • amount             │          │   │
│  │  │ • maxUsers      │   │ • billingCycle       │          │   │
│  │  └─────────────────┘   │ • autoRenew          │          │   │
│  │                        └──────────────────────┘          │   │
│  │                                                          │   │
│  │  PaymentMethods Collection  Invoices Collection         │   │
│  │  ┌──────────────────────┐   ┌──────────────────────┐    │   │
│  │  │ • vendorId (idx)     │   │ • vendorId (idx)     │    │   │
│  │  │ • type               │   │ • invoiceNumber      │    │   │
│  │  │ • cardLast4          │   │ • amount             │    │   │
│  │  │ • cardBrand          │   │ • status             │    │   │
│  │  │ • isDefault (idx)    │   │ • lineItems []       │    │   │
│  │  │ • isActive           │   │ • subtotal, tax      │    │   │
│  │  └──────────────────────┘   │ • billDate, dueDate  │    │   │
│  │                             └──────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Indexes: 9 total | Compound indexes for vendor scoping        │
│  Seeded: 4 plans | Multi-tenant isolation: ✅                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Models

### Plan Model
```typescript
interface Plan {
  _id: ObjectId
  name: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  displayName: string
  description: string
  monthlyPrice: number        // Base price
  yearlyPrice: number         // Discounted annual price
  features: string[]          // Feature list
  maxUsers: number            // User limit
  maxProperties: number       // Property limit
  maxTemplates: number        // Template limit
  supportLevel: 'EMAIL' | 'PRIORITY' | 'DEDICATED'
  isActive: boolean
  timestamps: { createdAt, updatedAt }
}
```

### Subscription Model
```typescript
interface Subscription {
  _id: ObjectId
  vendorId: ObjectId          // Reference to Vendor
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED'
  currentPeriodStart: Date    // Billing starts
  currentPeriodEnd: Date      // Billing ends (auto-calculated)
  amount: number              // Current price (based on cycle)
  billingCycle: 'MONTHLY' | 'YEARLY'
  paymentMethodId: string     // Reference to payment method
  autoRenew: boolean          // Auto-renewal flag
  cancelledAt: Date | null    // Cancellation timestamp
  timestamps: { createdAt, updatedAt }
}
```

### PaymentMethod Model
```typescript
interface PaymentMethod {
  _id: ObjectId
  vendorId: ObjectId          // Reference to Vendor
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER'
  cardLast4: string           // Last 4 digits
  cardBrand: string           // Visa, Mastercard, etc.
  expiryMonth: number | null
  expiryYear: number | null
  isDefault: boolean          // Only one per vendor
  isActive: boolean           // Soft-delete flag
  timestamps: { createdAt, updatedAt }
}
```

### Invoice Model
```typescript
interface Invoice {
  _id: ObjectId
  vendorId: ObjectId          // Reference to Vendor
  subscriptionId: ObjectId    // Reference to Subscription
  invoiceNumber: string       // Unique: INV-{timestamp}-{random}
  amount: number              // Total amount (may differ from subscription)
  currency: string            // Default: 'USD'
  status: 'DRAFT' | 'SENT' | 'PAID' | 'FAILED' | 'CANCELLED'
  billDate: Date              // Invoice generation date
  dueDate: Date               // Payment due date (30 days later)
  paidDate: Date | null       // Payment confirmation date
  description: string         // 'Plan name - billing period'
  lineItems: {
    description: string       // 'Professional - yearly'
    quantity: number          // 1
    unitPrice: number         // Plan price
    amount: number            // Quantity × unitPrice
  }[]
  subtotal: number            // Before tax
  tax: number                 // Default: 0
  total: number               // subtotal + tax
  pdfUrl: string | null       // PDF storage URL (future)
  timestamps: { createdAt, updatedAt }
}
```

## 🔄 GraphQL Operations Flow

### Subscription Flow (Step by Step)

```
1. USER VIEWS PLANS
   ┌──────────────────┐
   │ Frontend Loads   │
   │ getPlans Query   │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ GraphQL Query    │
   │ (No Auth)        │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Resolver:        │
   │ Plan.find({      │
   │   isActive: true │
   │ })               │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ MongoDB Returns  │
   │ All 4 Plans      │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Display Plans    │
   │ to User          │
   └──────────────────┘


2. USER ADDS PAYMENT METHOD
   ┌──────────────────┐
   │ Frontend Form    │
   │ Submits Data     │
   └────────┬─────────┘
            ↓
   ┌──────────────────────────┐
   │ Mutation: addPaymentMethod│
   │ (Authenticated)          │
   └────────┬─────────────────┘
            ↓
   ┌──────────────────┐
   │ Resolver Checks: │
   │ • Auth ✓         │
   │ • Input ✓        │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Mark Others      │
   │ isDefault=false  │
   │ for this Vendor  │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Create Record in │
   │ PaymentMethods   │
   │ Collection       │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Return New ID    │
   │ to Frontend      │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Store ID for     │
   │ subscription     │
   └──────────────────┘


3. USER SUBSCRIBES
   ┌──────────────────┐
   │ Frontend Select: │
   │ • Plan           │
   │ • Cycle          │
   │ • Payment        │
   └────────┬─────────┘
            ↓
   ┌──────────────────────────┐
   │ Mutation: subscribe()    │
   │ (Authenticated)          │
   └────────┬─────────────────┘
            ↓
   ┌──────────────────┐
   │ Resolver:        │
   │ • Validate Plan  │
   │ • Validate PM    │
   │ • Check Auth     │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Calculate:       │
   │ • Period Start   │
   │ • Period End     │
   │ • Amount         │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Create/Update    │
   │ Subscription Doc │
   │ status=ACTIVE    │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ AUTO-GENERATE    │
   │ Invoice for      │
   │ subscription     │
   │ (status=SENT)    │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Return:          │
   │ Subscription     │
   │ with details     │
   └────────┬─────────┘
            ↓
   ┌──────────────────┐
   │ Frontend Shows   │
   │ Success + Plan   │
   │ Details          │
   └──────────────────┘
```

## 📈 Database Seeding Process

```
npm run seed
    ↓
Connect to MongoDB
    ↓
Clear existing collections:
  • plans
  • subscriptions
  • paymentmethods
  • invoices
    ↓
Create 4 Plans:
  ✅ FREE        ($0)
  ✅ STARTER     ($99)
  ✅ PROFESSIONAL($299)
  ✅ ENTERPRISE  ($999)
    ↓
Each Plan includes:
  • Pricing (monthly + yearly)
  • Features list
  • User/property/template limits
  • Support level
  • Timestamps
    ↓
Create Demo Data:
  • Users
  • Vendors
  • Properties
  • Audit Logs
    ↓
Database Ready! ✅
```

## 🔐 Multi-Tenancy Architecture

```
Request comes in with JWT token
    ↓
Extract user from token
    ↓
Get vendorId from user
    ↓
┌────────────────────────────────┐
│ ALL QUERIES DO THIS:           │
│                                │
│ Subscription.findOne({         │
│   vendorId: user.vendorId ◄────┼── User's vendor only
│ })                             │
│                                │
│ • Vendor A cannot see          │
│   Vendor B's data              │
│ • Each vendor is isolated      │
│ • Database enforces filtering  │
│                                │
└────────────────────────────────┘
```

## 📊 Pricing Calculation

```
User selects PROFESSIONAL plan
    ↓
┌─────────────────────────────────────────────┐
│ IF Monthly (MONTHLY):                       │
│   Amount = 299                              │
│   Period = 1 month from now                 │
│   Display: "$299/month"                     │
│                                             │
│ IF Yearly (YEARLY):                         │
│   Amount = 2990                             │
│   Period = 1 year from now                  │
│   Display: "$2,990/year" ($249/month avg)   │
└─────────────────────────────────────────────┘
    ↓
Save to Subscription collection
    ↓
Invoice shows:
  • lineItems[0]:
    - description: "Professional - yearly"
    - quantity: 1
    - unitPrice: 2990
    - amount: 2990
  • subtotal: 2990
  • tax: 0
  • total: 2990
```

## 📋 Invoice Generation Process

```
Subscription Created
    ↓
Automatically create Invoice:
    ↓
Generate unique number:
  invoiceNumber = "INV-{timestamp}-{random}"
  Example: "INV-1704067200000-234"
    ↓
Set invoice details:
  • vendorId: from subscription
  • subscriptionId: from subscription
  • billDate: today
  • dueDate: 30 days from today
  • status: 'SENT'
    ↓
Create line items:
  [{
    description: "{Plan Name} - {Cycle}",
    quantity: 1,
    unitPrice: {amount from plan},
    amount: {quantity × unitPrice}
  }]
    ↓
Calculate totals:
  • subtotal: sum of line items
  • tax: 0 (configurable)
  • total: subtotal + tax
    ↓
Save to database
    ↓
Invoice ready for payment tracking
```

## 🔗 Data Relationships

```
┌──────────────┐
│   Vendor     │
│   (existing) │
│              │
│ _id: xyz     │
└──────┬───────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ↓                                 ↓
┌──────────────────┐      ┌──────────────────────┐
│  Subscription    │      │   PaymentMethod      │
│                  │      │                      │
│ • vendorId: xyz  │      │ • vendorId: xyz      │
│ • plan           │      │ • type               │
│ • status         │      │ • cardLast4          │
│ • amount         │      │ • isDefault          │
│ • paymentMethodId├──────┤ • isActive           │
│                  │      └──────────────────────┘
│ _id: abc         │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│     Invoice      │
│                  │
│ • vendorId: xyz  │
│ • subscriptionId │
│   (references)   │
│ • invoiceNumber  │
│ • amount         │
│ • lineItems[]    │
└──────────────────┘
```

## ✅ Implementation Checklist

```
Backend Models:
  [✅] Plan.ts              (Mongoose schema + interface)
  [✅] Subscription.ts      (Mongoose schema + interface)
  [✅] PaymentMethod.ts     (Mongoose schema + interface)
  [✅] Invoice.ts           (Mongoose schema + interface)

GraphQL Layer:
  [✅] billing.types.ts     (6 enums, 8 types, 2 inputs)
  [✅] billing.resolvers.ts (10 operations)
  [✅] schema/index.ts      (integration)
  [✅] resolvers/index.ts   (exported)

Database:
  [✅] All 4 collections exist
  [✅] 9 indexes created
  [✅] Seeding works
  [✅] 4 plans created

Documentation:
  [✅] BILLING_README.md
  [✅] BILLING_COMPLETION.md
  [✅] BILLING_API.md
  [✅] BILLING_IMPLEMENTATION.md
  [✅] BILLING_GRAPHQL_EXAMPLES.graphql
  [✅] BILLING_FRONTEND_GUIDE.tsx
  [✅] types/billing.types.ts

Testing:
  [✅] Database seeding successful
  [✅] No compilation errors
  [✅] All 4 plans in database
  [✅] Multi-tenancy verified
  [✅] Auth checks in place
```

---

**Status: ✅ COMPLETE - Ready for use**

