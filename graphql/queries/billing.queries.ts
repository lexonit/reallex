export const GET_PLANS_QUERY = `
  query GetPlans {
    getPlans {
      id
      name
      displayName
      description
      monthlyPrice
      yearlyPrice
      features
      maxUsers
      maxProperties
      maxTemplates
      supportLevel
    }
  }
`;

export const AVAILABLE_PLANS_QUERY = `
  query AvailablePlans {
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
      isActive
      displayOrder
    }
  }
`;

export const ALL_SUBSCRIPTION_PLANS_QUERY = `
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
`;

export const GET_BILLING_DATA_QUERY = `
  query GetBillingData {
    getSubscription {
      id
      plan
      status
      amount
      billingCycle
      currentPeriodStart
      currentPeriodEnd
      autoRenew
      paymentMethodId
    }
    getInvoices(limit: 10, offset: 0) {
      id
      invoiceNumber
      amount
      currency
      status
      billDate
      dueDate
      paidDate
      total
      pdfUrl
    }
    getPaymentMethods {
      id
      type
      cardLast4
      cardBrand
      expiryMonth
      expiryYear
      isDefault
    }
    getPlans {
      id
      name
      displayName
      monthlyPrice
      yearlyPrice
      features
      maxUsers
      maxProperties
      maxTemplates
      supportLevel
    }
  }
`;
