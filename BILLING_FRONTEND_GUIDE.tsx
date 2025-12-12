/**
 * Billing API - Frontend Integration Guide
 * 
 * This guide shows how to use the billing API in React components
 */

// ============================================
// 1. IMPORT THE TYPES
// ============================================

import {
  Plan,
  Subscription,
  PaymentMethod,
  Invoice,
  SubscriptionInput,
  PaymentMethodInput,
  PlanType,
  BillingCycleType,
  formatPrice,
  isSubscriptionActive,
  getRemainingDays,
  formatPaymentMethod
} from '../types/billing.types';


// ============================================
// 2. IMPORT APOLLO/GRAPHQL
// ============================================

import { useQuery, useMutation } from '@apollo/client';
import { GET_BILLING_DATA_QUERY } from '../graphql/queries/billing.queries';
import {
  SUBSCRIBE_MUTATION,
  ADD_PAYMENT_METHOD_MUTATION,
  UPDATE_PAYMENT_METHOD_MUTATION,
  REMOVE_PAYMENT_METHOD_MUTATION,
  CANCEL_SUBSCRIPTION_MUTATION,
  UPDATE_SUBSCRIPTION_MUTATION
} from '../graphql/mutations/billing.mutations';


// ============================================
// 3. FETCH BILLING DATA
// ============================================

/**
 * Hook to fetch all billing data at once
 */
export function useBillingData() {
  const { data, loading, error, refetch } = useQuery(GET_BILLING_DATA_QUERY);

  return {
    plans: data?.getPlans || [],
    subscription: data?.getSubscription || null,
    paymentMethods: data?.getPaymentMethods || [],
    invoices: data?.getInvoices || [],
    loading,
    error,
    refetch
  };
}


// ============================================
// 4. SUBSCRIBE TO A PLAN
// ============================================

/**
 * Example component to subscribe to a plan
 */
export function SubscribeToPlanExample() {
  const { plans, refetch } = useBillingData();
  const [subscribe, { loading }] = useMutation(SUBSCRIBE_MUTATION);

  const handleSubscribe = async (plan: Plan) => {
    try {
      // Use a stored payment method ID
      const paymentMethodId = localStorage.getItem('defaultPaymentMethodId');

      if (!paymentMethodId) {
        alert('Please add a payment method first');
        return;
      }

      const { data } = await subscribe({
        variables: {
          input: {
            plan: plan.name,
            billingCycle: BillingCycleType.YEARLY,
            paymentMethodId
          }
        }
      });

      console.log('Subscription created:', data.subscribe);
      
      // Refresh billing data
      refetch();
      
      // Show success message
      alert(`Successfully subscribed to ${plan.displayName}!`);
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="billing-plans">
      <h2>Choose Your Plan</h2>
      {plans.map(plan => (
        <div key={plan.id} className="plan-card">
          <h3>{plan.displayName}</h3>
          <p className="price">{formatPrice(plan.monthlyPrice)}/month</p>
          <ul className="features">
            {plan.features.map(feature => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe(plan)}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </div>
      ))}
    </div>
  );
}


// ============================================
// 5. DISPLAY CURRENT SUBSCRIPTION
// ============================================

/**
 * Component to show current subscription status
 */
export function SubscriptionStatusExample() {
  const { subscription } = useBillingData();

  if (!subscription) {
    return <p>No active subscription</p>;
  }

  const remainingDays = getRemainingDays(subscription);
  const isActive = isSubscriptionActive(subscription);

  return (
    <div className="subscription-status">
      <h3>Your Subscription</h3>
      
      {isActive && (
        <>
          <p>
            <strong>Plan:</strong> {subscription.plan}
          </p>
          <p>
            <strong>Amount:</strong> {formatPrice(subscription.amount)}/{subscription.billingCycle.toLowerCase()}
          </p>
          <p>
            <strong>Period Ends:</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
          <p>
            <strong>Days Remaining:</strong> {remainingDays} days
          </p>
          <p>
            <strong>Auto Renewal:</strong> {subscription.autoRenew ? 'Enabled' : 'Disabled'}
          </p>
        </>
      )}

      {!isActive && (
        <p className="text-warning">
          Your subscription is {subscription.status}
        </p>
      )}
    </div>
  );
}


// ============================================
// 6. MANAGE PAYMENT METHODS
// ============================================

/**
 * Component to add a payment method
 */
export function AddPaymentMethodExample() {
  const { refetch } = useBillingData();
  const [addPayment, { loading }] = useMutation(ADD_PAYMENT_METHOD_MUTATION);
  const [formData, setFormData] = React.useState<PaymentMethodInput>({
    type: 'CREDIT_CARD',
    cardLast4: '',
    cardBrand: 'Visa',
    expiryMonth: 12,
    expiryYear: new Date().getFullYear() + 5,
    isDefault: false
  });

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await addPayment({
        variables: { input: formData }
      });

      console.log('Payment method added:', data.addPaymentMethod);
      
      // Store as default if needed
      if (data.addPaymentMethod.isDefault) {
        localStorage.setItem(
          'defaultPaymentMethodId',
          data.addPaymentMethod.id
        );
      }

      // Refresh data
      refetch();
      alert('Payment method added successfully!');
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  return (
    <form onSubmit={handleAddPayment} className="payment-form">
      <h3>Add Payment Method</h3>

      <input
        type="text"
        placeholder="Last 4 digits"
        value={formData.cardLast4}
        onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Card brand (Visa, Mastercard, etc.)"
        value={formData.cardBrand}
        onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value })}
        required
      />

      <label>
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
        />
        Set as default payment method
      </label>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Adding...' : 'Add Payment Method'}
      </button>
    </form>
  );
}


/**
 * Component to list and manage payment methods
 */
export function PaymentMethodsListExample() {
  const { paymentMethods, refetch } = useBillingData();
  const [removePayment] = useMutation(REMOVE_PAYMENT_METHOD_MUTATION);

  const handleRemove = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    try {
      await removePayment({
        variables: { paymentMethodId }
      });

      refetch();
      alert('Payment method removed');
    } catch (error) {
      console.error('Failed to remove payment method:', error);
    }
  };

  return (
    <div className="payment-methods">
      <h3>Payment Methods</h3>

      {paymentMethods.length === 0 ? (
        <p>No payment methods saved</p>
      ) : (
        <ul className="payment-list">
          {paymentMethods.map(pm => (
            <li key={pm.id} className={pm.isDefault ? 'default' : ''}>
              <span className="method-info">
                {formatPaymentMethod(pm)}
                {pm.isDefault && <span className="badge">Default</span>}
              </span>

              <button
                onClick={() => handleRemove(pm.id)}
                className="btn-danger btn-small"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// ============================================
// 7. VIEW INVOICES
// ============================================

/**
 * Component to display invoices
 */
export function InvoicesListExample() {
  const { invoices } = useBillingData();

  return (
    <div className="invoices">
      <h3>Billing History</h3>

      {invoices.length === 0 ? (
        <p>No invoices yet</p>
      ) : (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{new Date(invoice.billDate).toLocaleDateString()}</td>
                <td>{formatPrice(invoice.total)}</td>
                <td>
                  <span className={`status-${invoice.status.toLowerCase()}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  {invoice.pdfUrl && (
                    <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                      Download PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


// ============================================
// 8. UPGRADE/DOWNGRADE PLAN
// ============================================

/**
 * Component to change subscription plan
 */
export function ChangePlanExample() {
  const { plans, subscription, refetch } = useBillingData();
  const [updateSubscription, { loading }] = useMutation(UPDATE_SUBSCRIPTION_MUTATION);

  const handleChangePlan = async (newPlan: Plan) => {
    if (!subscription) {
      alert('No active subscription');
      return;
    }

    if (newPlan.name === subscription.plan) {
      alert('You are already on this plan');
      return;
    }

    try {
      const { data } = await updateSubscription({
        variables: {
          plan: newPlan.name,
          billingCycle: subscription.billingCycle
        }
      });

      console.log('Plan updated:', data.updateSubscription);
      refetch();
      alert(`Successfully updated to ${newPlan.displayName}!`);
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  if (!subscription) {
    return <p>No active subscription</p>;
  }

  return (
    <div className="change-plan">
      <h3>Change Your Plan</h3>
      <p>Current Plan: <strong>{subscription.plan}</strong></p>

      <div className="plan-options">
        {plans.map(plan => (
          <button
            key={plan.id}
            onClick={() => handleChangePlan(plan)}
            disabled={loading || plan.name === subscription.plan}
            className={`plan-btn ${plan.name === subscription.plan ? 'active' : ''}`}
          >
            {plan.displayName}
            <br />
            <small>{formatPrice(plan.monthlyPrice)}/month</small>
          </button>
        ))}
      </div>
    </div>
  );
}


// ============================================
// 9. CANCEL SUBSCRIPTION
// ============================================

/**
 * Component to cancel subscription
 */
export function CancelSubscriptionExample() {
  const { subscription, refetch } = useBillingData();
  const [cancelSub, { loading }] = useMutation(CANCEL_SUBSCRIPTION_MUTATION);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      const reason = prompt('Please tell us why you are cancelling (optional)');

      const { data } = await cancelSub({
        variables: {
          reason: reason || undefined
        }
      });

      console.log('Subscription cancelled:', data.cancelSubscription);
      refetch();
      alert('Your subscription has been cancelled');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  if (!subscription || subscription.status !== 'ACTIVE') {
    return null;
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="btn-danger"
    >
      {loading ? 'Cancelling...' : 'Cancel Subscription'}
    </button>
  );
}


// ============================================
// 10. COMPLETE BILLING PAGE
// ============================================

/**
 * Full billing page component combining everything
 */
export function BillingPageComplete() {
  const { loading, error } = useBillingData();

  if (error) {
    return (
      <div className="error-message">
        Failed to load billing data. Please try again later.
      </div>
    );
  }

  return (
    <div className="billing-page">
      <h1>Billing & Subscription</h1>

      {loading && <div className="loading">Loading...</div>}

      <div className="billing-sections">
        <section className="section">
          <SubscriptionStatusExample />
        </section>

        <section className="section">
          <ChangePlanExample />
        </section>

        <section className="section">
          <AddPaymentMethodExample />
        </section>

        <section className="section">
          <PaymentMethodsListExample />
        </section>

        <section className="section">
          <InvoicesListExample />
        </section>

        <section className="section danger-zone">
          <h3>Danger Zone</h3>
          <p>Once you cancel your subscription, all access will be removed.</p>
          <CancelSubscriptionExample />
        </section>
      </div>
    </div>
  );
}


// ============================================
// 11. STYLING EXAMPLE
// ============================================

const styles = `
  .billing-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }

  .billing-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .section {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background: white;
  }

  .plan-card {
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    transition: border-color 0.3s;
  }

  .plan-card:hover {
    border-color: #0066cc;
  }

  .price {
    font-size: 24px;
    font-weight: bold;
    color: #0066cc;
    margin: 10px 0;
  }

  .features {
    list-style: none;
    padding: 0;
    margin: 15px 0;
  }

  .features li {
    padding: 5px 0;
    border-bottom: 1px solid #eee;
  }

  .features li:last-child {
    border-bottom: none;
  }

  .btn-primary {
    background: #0066cc;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-danger {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  .badge {
    display: inline-block;
    background: #28a745;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-left: 10px;
  }

  .danger-zone {
    border-color: #dc3545;
    background: #fff5f5;
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .error-message {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    padding: 15px;
    border-radius: 4px;
  }
`;

export default BillingPageComplete;
