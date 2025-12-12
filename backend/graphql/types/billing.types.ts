export const billingTypes = `
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

  input SubscriptionInput {
    plan: PlanType!
    billingCycle: BillingCycleType!
    paymentMethodId: String
  }

  input PaymentMethodInput {
    type: PaymentMethodType!
    cardLast4: String!
    cardBrand: String!
    expiryMonth: Int
    expiryYear: Int
    isDefault: Boolean
  }
`;

export const billingQueries = `
  getSubscription: Subscription
  getInvoices(limit: Int, offset: Int): [Invoice!]!
  getPaymentMethods: [PaymentMethod!]!
  getPlans: [Plan!]!
  availablePlans: [SubscriptionPlan!]!
`;

export const billingMutations = `
  subscribe(input: SubscriptionInput!): Subscription!
  updatePaymentMethod(paymentMethodId: ID!, input: PaymentMethodInput!): PaymentMethod!
  addPaymentMethod(input: PaymentMethodInput!): PaymentMethod!
  removePaymentMethod(paymentMethodId: ID!): Boolean!
  cancelSubscription(reason: String): Subscription!
  updateSubscription(plan: PlanType!, billingCycle: BillingCycleType!): Subscription!
`;
