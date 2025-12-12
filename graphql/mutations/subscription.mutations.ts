// Subscription mutations
export const CREATE_SUBSCRIPTION_PLAN_MUTATION = `
  mutation CreateSubscriptionPlan($input: CreateSubscriptionPlanInput!) {
    createSubscriptionPlan(input: $input) {
      _id
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
    }
  }
`;

export const UPDATE_SUBSCRIPTION_PLAN_MUTATION = `
  mutation UpdateSubscriptionPlan($id: ID!, $input: UpdateSubscriptionPlanInput!) {
    updateSubscriptionPlan(id: $id, input: $input) {
      _id
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
    }
  }
`;

export const DELETE_SUBSCRIPTION_PLAN_MUTATION = `
  mutation DeleteSubscriptionPlan($id: ID!) {
    deleteSubscriptionPlan(id: $id)
  }
`;

export const ASSIGN_SUBSCRIPTION_MUTATION = `
  mutation AssignSubscription($input: AssignSubscriptionInput!) {
    assignSubscription(input: $input) {
      _id
      vendorId
      planId
      plan {
        name
        price
      }
      status
      startDate
      endDate
      trialEndDate
      autoRenew
    }
  }
`;

export const UPDATE_VENDOR_SUBSCRIPTION_MUTATION = `
  mutation UpdateVendorSubscription($vendorId: ID!, $planId: ID!) {
    updateVendorSubscription(vendorId: $vendorId, planId: $planId) {
      _id
      vendorId
      planId
      plan {
        name
        price
      }
      status
    }
  }
`;

export const CANCEL_SUBSCRIPTION_MUTATION = `
  mutation CancelVendorSubscription($vendorId: ID!, $reason: String) {
    cancelVendorSubscription(vendorId: $vendorId, reason: $reason) {
      _id
      status
      cancelledAt
      cancelReason
    }
  }
`;

export const UPDATE_USAGE_STATS_MUTATION = `
  mutation UpdateUsageStats($vendorId: ID!) {
    updateUsageStats(vendorId: $vendorId) {
      _id
      currentUsage {
        activeUsers
        totalProperties
        totalLeads
        totalDeals
        storageUsed
      }
    }
  }
`;
