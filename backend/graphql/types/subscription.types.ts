export const subscriptionTypes = `
  type SubscriptionPlan {
    id: ID!
    name: String!
    slug: String!
    description: String!
    price: Float!
    billingCycle: String!
    features: PlanFeatures!
    isActive: Boolean!
    displayOrder: Int!
    createdAt: String!
    updatedAt: String!
  }

  type PlanFeatures {
    maxUsers: Int!
    maxProperties: Int!
    maxLeads: Int!
    maxDeals: Int!
    maxStorage: Int!
    customBranding: Boolean!
    apiAccess: Boolean!
    advancedAnalytics: Boolean!
    prioritySupport: Boolean!
    customIntegrations: Boolean!
  }

  type VendorSubscription {
    id: ID!
    vendorId: ID!
    planId: ID!
    plan: SubscriptionPlan
    availablePlans: [SubscriptionPlan!]!
    status: String!
    startDate: String!
    endDate: String!
    trialEndDate: String
    autoRenew: Boolean!
    currentUsage: UsageStats!
    paymentMethod: String
    lastPaymentDate: String
    nextPaymentDate: String
    notes: String
    cancelledAt: String
    cancelReason: String
    createdAt: String!
    updatedAt: String!
  }

  type UsageStats {
    activeUsers: Int!
    totalProperties: Int!
    totalLeads: Int!
    totalDeals: Int!
    storageUsed: Float!
  }

  type PlanSubscriptionStatus {
    isValid: Boolean!
    canAddUser: Boolean!
    canAddProperty: Boolean!
    canAddLead: Boolean!
    canAddDeal: Boolean!
    limitReached: String
    daysRemaining: Int
  }

  input PlanFeaturesInput {
    maxUsers: Int!
    maxProperties: Int!
    maxLeads: Int!
    maxDeals: Int!
    maxStorage: Int!
    customBranding: Boolean
    apiAccess: Boolean
    advancedAnalytics: Boolean
    prioritySupport: Boolean
    customIntegrations: Boolean
  }

  input CreateSubscriptionPlanInput {
    name: String!
    slug: String!
    description: String!
    price: Float!
    billingCycle: String!
    features: PlanFeaturesInput!
    isActive: Boolean
    displayOrder: Int
  }

  input UpdateSubscriptionPlanInput {
    name: String
    description: String
    price: Float
    billingCycle: String
    features: PlanFeaturesInput
    isActive: Boolean
    displayOrder: Int
  }

  input AssignSubscriptionInput {
    vendorId: ID!
    planId: ID!
    startDate: String
    endDate: String
    trialEndDate: String
    autoRenew: Boolean
  }
`;

export const subscriptionQueries = `
  subscriptionPlans(activeOnly: Boolean): [SubscriptionPlan!]!
  subscriptionPlan(id: ID!): SubscriptionPlan
  allSubscriptionPlansWithDetails: [SubscriptionPlan!]!
  vendorSubscription(vendorId: ID!): VendorSubscription
  mySubscription: VendorSubscription
  checkPlanSubscriptionStatus(vendorId: ID!): PlanSubscriptionStatus!
`;

export const subscriptionMutations = `
  createSubscriptionPlan(input: CreateSubscriptionPlanInput!): SubscriptionPlan!
  updateSubscriptionPlan(id: ID!, input: UpdateSubscriptionPlanInput!): SubscriptionPlan!
  deleteSubscriptionPlan(id: ID!): Boolean!
  assignSubscription(input: AssignSubscriptionInput!): VendorSubscription!
  updateVendorSubscription(vendorId: ID!, planId: ID!): VendorSubscription!
  cancelVendorSubscription(vendorId: ID!, reason: String): VendorSubscription!
  updateUsageStats(vendorId: ID!): VendorSubscription!
`;
