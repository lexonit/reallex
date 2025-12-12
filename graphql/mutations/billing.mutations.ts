export const ADD_PAYMENT_METHOD_MUTATION = `
  mutation AddPaymentMethod($input: PaymentMethodInput!) {
    addPaymentMethod(input: $input) {
      id
      type
      cardLast4
      cardBrand
      expiryMonth
      expiryYear
      isDefault
      createdAt
    }
  }
`;

export const UPDATE_PAYMENT_METHOD_MUTATION = `
  mutation UpdatePaymentMethod($paymentMethodId: String!, $input: PaymentMethodInput!) {
    updatePaymentMethod(paymentMethodId: $paymentMethodId, input: $input) {
      id
      type
      cardLast4
      cardBrand
      expiryMonth
      expiryYear
      isDefault
      createdAt
    }
  }
`;

export const REMOVE_PAYMENT_METHOD_MUTATION = `
  mutation RemovePaymentMethod($paymentMethodId: String!) {
    removePaymentMethod(paymentMethodId: $paymentMethodId) {
      success
      message
    }
  }
`;

export const SUBSCRIBE_MUTATION = `
  mutation Subscribe($input: SubscribeInput!) {
    subscribe(input: $input) {
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
  }
`;

export const UPDATE_SUBSCRIPTION_MUTATION = `
  mutation UpdateSubscription($subscriptionId: String!, $input: UpdateSubscriptionInput!) {
    updateSubscription(subscriptionId: $subscriptionId, input: $input) {
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
  }
`;

export const CANCEL_SUBSCRIPTION_MUTATION = `
  mutation CancelSubscription($subscriptionId: String!, $immediate: Boolean) {
    cancelSubscription(subscriptionId: $subscriptionId, immediate: $immediate) {
      success
      message
      subscription {
        id
        status
        cancelledAt
      }
    }
  }
`;
