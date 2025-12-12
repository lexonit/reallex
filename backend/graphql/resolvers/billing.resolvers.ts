import { PaymentMethod } from '../../models/PaymentMethod';
import { Invoice } from '../../models/Invoice';
import { Plan } from '../../models/Plan';
import SubscriptionPlan from '../../models/SubscriptionPlan';
import mongoose from 'mongoose';
import VendorSubscription from '../../models/VendorSubscription';

console.log('Plan model loaded:', Plan.modelName);

// Helper function to check auth
const requireAuth = (context: any) => {
  if (!context.user || !context.user.id) {
    throw new Error('Authentication required');
  }
  return context.user;
};

// Helper to calculate next billing period
const calculateNextBillingPeriod = (billingCycle: 'MONTHLY' | 'YEARLY') => {
  const now = new Date();
  let endDate = new Date(now);

  if (billingCycle === 'MONTHLY') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  return { startDate: now, endDate };
};

// Helper to generate invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
};

export const billingResolvers = {
  Query: {
    getSubscription: async (_: any, __: any, context: any) => {
      const user = requireAuth(context);

      try {
        const subscription = await VendorSubscription.findOne({
          vendorId: user.vendorId
        });

        return subscription;
      } catch (error) {
        throw new Error(`Failed to fetch subscription: ${error}`);
      }
    },

    getInvoices: async (
      _: any,
      { limit = 10, offset = 0 }: { limit?: number; offset?: number },
      context: any
    ) => {
      const user = requireAuth(context);

      try {
        const invoices = await Invoice.find({
          vendorId: user.vendorId
        })
          .sort({ billDate: -1 })
          .limit(limit)
          .skip(offset);

        return invoices;
      } catch (error) {
        throw new Error(`Failed to fetch invoices: ${error}`);
      }
    },

    getPaymentMethods: async (_: any, __: any, context: any) => {
      const user = requireAuth(context);

      try {
        const paymentMethods = await PaymentMethod.find({
          vendorId: user.vendorId,
          isActive: true
        });

        return paymentMethods;
      } catch (error) {
        throw new Error(`Failed to fetch payment methods: ${error}`);
      }
    },

    getPlans: async (_: any, __: any, context: any) => {
      // Allow unauthenticated access for registration page
      // Authenticated users can also view plans
      try {
        console.log('🔍 Fetching plans from database...');
        const plans = await Plan.find({ isActive: true }).sort({
          monthlyPrice: 1
        });
        
        console.log('📊 Plans found:', plans.length);
        console.log('📋 Plans data:', JSON.stringify(plans, null, 2));

        if (!plans || plans.length === 0) {
          console.warn('⚠️ No active plans found in database');
          return [];
        }

        return plans;
      } catch (error) {
        console.error('❌ Failed to fetch plans:', error);
        // Return empty array on error to satisfy non-nullable schema
        return [];
      }
    },

    availablePlans: async (_: any, __: any, context: any) => {
      // Public API for registration - uses SubscriptionPlan model
      try {
        console.log('🔍 Fetching available subscription plans...');
        const plans = await VendorSubscription.find({ isActive: true }).sort({
          displayOrder: 1
        });
        
        console.log('📊 Available plans found:', plans.length);
        
        if (!plans || plans.length === 0) {
          console.warn('⚠️ No active subscription plans found');
          return [];
        }

        return plans;
      } catch (error) {
        console.error('❌ Failed to fetch available plans:', error);
        return [];
      }
    }
  },

  Mutation: {
    subscribe: async (
      _: any,
      { input }: any,
      context: any
    ) => {
      const user = requireAuth(context);

      try {
        // Get the plan to verify it exists
        const plan = await Plan.findOne({ name: input.plan });
        if (!plan) {
          throw new Error('Plan not found');
        }

        // Get payment method if provided
        if (input.paymentMethodId) {
          const paymentMethod = await PaymentMethod.findOne({
            _id: input.paymentMethodId,
            vendorId: user.vendorId
          });

          if (!paymentMethod) {
            throw new Error('Payment method not found');
          }
        }

        // Calculate billing period
        const { startDate, endDate } = calculateNextBillingPeriod(input.billingCycle);

        // Determine amount
        const amount =
          input.billingCycle === 'YEARLY'
            ? plan.yearlyPrice
            : plan.monthlyPrice;

        // Create or update subscription
        let subscription = await VendorSubscription.findOne({
          vendorId: user.vendorId
        });

        if (subscription) {
          subscription.plan = input.plan;
          subscription.billingCycle = input.billingCycle;
          subscription.amount = amount;
          subscription.currentPeriodStart = startDate;
          subscription.currentPeriodEnd = endDate;
          subscription.status = 'ACTIVE';
          subscription.autoRenew = true;
          subscription.cancelledAt = null;

          if (input.paymentMethodId) {
            subscription.paymentMethodId = input.paymentMethodId;
          }
        } else {
          subscription = new VendorSubscription({
            vendorId: user.vendorId,
            plan: input.plan,
            status: 'ACTIVE',
            currentPeriodStart: startDate,
            currentPeriodEnd: endDate,
            amount,
            billingCycle: input.billingCycle,
            paymentMethodId: input.paymentMethodId,
            autoRenew: true
          });
        }

        await subscription.save();

        // Create invoice for the subscription
        const invoice = new Invoice({
          vendorId: user.vendorId,
          subscriptionId: subscription._id,
          invoiceNumber: generateInvoiceNumber(),
          amount,
          currency: 'USD',
          status: 'SENT',
          billDate: startDate,
          dueDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
          description: `${plan.displayName} - ${input.billingCycle.toLowerCase()} subscription`,
          lineItems: [
            {
              description: `${plan.displayName} (${input.billingCycle.toLowerCase()})`,
              quantity: 1,
              unitPrice: amount,
              amount
            }
          ],
          subtotal: amount,
          tax: 0,
          total: amount
        });

        await invoice.save();

        return subscription;
      } catch (error) {
        throw new Error(`Failed to create subscription: ${error}`);
      }
    },

    updatePaymentMethod: async (
      _: any,
      { paymentMethodId, input }: any,
      context: any
    ) => {
      const user = requireAuth(context);

      try {
        const paymentMethod = await PaymentMethod.findOne({
          _id: paymentMethodId,
          vendorId: user.vendorId
        });

        if (!paymentMethod) {
          throw new Error('Payment method not found');
        }

        paymentMethod.type = input.type || paymentMethod.type;
        paymentMethod.cardLast4 = input.cardLast4 || paymentMethod.cardLast4;
        paymentMethod.cardBrand = input.cardBrand || paymentMethod.cardBrand;
        paymentMethod.expiryMonth = input.expiryMonth || paymentMethod.expiryMonth;
        paymentMethod.expiryYear = input.expiryYear || paymentMethod.expiryYear;

        if (input.isDefault) {
          // Set others to not default
          await PaymentMethod.updateMany(
            { vendorId: user.vendorId, _id: { $ne: paymentMethodId } },
            { isDefault: false }
          );
          paymentMethod.isDefault = true;
        }

        await paymentMethod.save();
        return paymentMethod;
      } catch (error) {
        throw new Error(`Failed to update payment method: ${error}`);
      }
    },

    addPaymentMethod: async (
      _: any,
      { input }: any,
      context: any
    ) => {
      const user = requireAuth(context);

      try {
        // If marking as default, unset other defaults
        if (input.isDefault) {
          await PaymentMethod.updateMany(
            { vendorId: user.vendorId },
            { isDefault: false }
          );
        }

        const paymentMethod = new PaymentMethod({
          vendorId: user.vendorId,
          type: input.type,
          cardLast4: input.cardLast4,
          cardBrand: input.cardBrand,
          expiryMonth: input.expiryMonth,
          expiryYear: input.expiryYear,
          isDefault: input.isDefault || false,
          isActive: true
        });

        await paymentMethod.save();
        return paymentMethod;
      } catch (error) {
        throw new Error(`Failed to add payment method: ${error}`);
      }
    },

    removePaymentMethod: async (
      _: any,
      { paymentMethodId }: any,
      context: any
    ) => {
      const user = requireAuth(context);

      try {
        const result = await PaymentMethod.findOneAndUpdate(
          {
            _id: paymentMethodId,
            vendorId: user.vendorId
          },
          { isActive: false },
          { new: true }
        );

        return !!result;
      } catch (error) {
        throw new Error(`Failed to remove payment method: ${error}`);
      }
    },

    cancelSubscription: async (
      _: any,
      { reason }: any,
      context: any
    ) => {
      const user = requireAuth(context);

      try {
        const subscription = await VendorSubscription.findOne({
          vendorId: user.vendorId
        });

        if (!subscription) {
          throw new Error('Subscription not found');
        }

        subscription.status = 'CANCELLED';
        subscription.cancelledAt = new Date();
        subscription.autoRenew = false;

        await subscription.save();

        return subscription;
      } catch (error) {
        throw new Error(`Failed to cancel subscription: ${error}`);
      }
    },

    updateSubscription: async (
      _: any,
      { plan, billingCycle }: any,
      context: any
    ) => {
      const user = requireAuth(context);

      try {
        const planData = await Plan.findOne({ name: plan });
        if (!planData) {
          throw new Error('Plan not found');
        }

        const subscription = await VendorSubscription.findOne({
          vendorId: user.vendorId
        });

        if (!subscription) {
          throw new Error('Subscription not found');
        }

        const { startDate, endDate } = calculateNextBillingPeriod(billingCycle);
        const amount =
          billingCycle === 'YEARLY'
            ? planData.yearlyPrice
            : planData.monthlyPrice;

        subscription.plan = plan;
        subscription.billingCycle = billingCycle;
        subscription.amount = amount;
        subscription.currentPeriodStart = startDate;
        subscription.currentPeriodEnd = endDate;

        await subscription.save();

        return subscription;
      } catch (error) {
        throw new Error(`Failed to update subscription: ${error}`);
      }
    }
  }
};
