// Subscription plan queries
export const GET_SUBSCRIPTION_PLANS_QUERY = `
  query GetSubscriptionPlans($activeOnly: Boolean) {
    subscriptionPlans(activeOnly: $activeOnly) {
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

export const GET_SUBSCRIPTION_PLAN_QUERY = `
  query GetSubscriptionPlan($id: ID!) {
    subscriptionPlan(id: $id) {
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
      createdAt
      updatedAt
    }
  }
`;

export const GET_VENDOR_SUBSCRIPTION_QUERY = `
  query GetVendorSubscription($vendorId: ID!) {
    vendorSubscription(vendorId: $vendorId) {
      _id
      vendorId
      planId
      plan {
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
      }
      status
      startDate
      endDate
      trialEndDate
      autoRenew
      currentUsage {
        activeUsers
        totalProperties
        totalLeads
        totalDeals
        storageUsed
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_SUBSCRIPTION_QUERY = `
  query GetMySubscription {
    mySubscription {
      id
      vendorId
      planId
      plan {
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
        displayOrder
        isActive
      }
      availablePlans {
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
        displayOrder
        isActive
      }
      status
      startDate
      endDate
      trialEndDate
      autoRenew
      currentUsage {
        activeUsers
        totalProperties
        totalLeads
        totalDeals
        storageUsed
      }
      createdAt
      updatedAt
    }
  }
`;

export const CHECK_SUBSCRIPTION_STATUS_QUERY = `
  query CheckPlanSubscriptionStatus($vendorId: ID!) {
    checkPlanSubscriptionStatus(vendorId: $vendorId) {
      isValid
      canAddUser
      canAddProperty
      canAddLead
      canAddDeal
      limitReached
      daysRemaining
    }
  }
`;
