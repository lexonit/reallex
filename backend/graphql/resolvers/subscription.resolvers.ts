import SubscriptionPlan from '../../models/SubscriptionPlan';
import VendorSubscription from '../../models/VendorSubscription';
import User from '../../models/User';
import Property from '../../models/Property';
import Lead from '../../models/Lead';
import Deal from '../../models/Deal';

export const subscriptionResolvers = {
  Query: {
    subscriptionPlans: async ({ activeOnly }: { activeOnly?: boolean }, context: any) => {
      // Allow unauthenticated access to active plans (for registration page)
      // All authenticated users can view all subscription plans
      // Only SUPER_ADMIN can view inactive plans
      
      let filter: any = {};
      
      if (activeOnly || !context?.user) {
        // Unauthenticated users or when activeOnly requested: show only active plans
        filter = { isActive: true };
      }
      
      const plans = await SubscriptionPlan.find(filter).sort({ displayOrder: 1 });
      
      // Convert Mongoose documents to plain objects with proper id field
      return plans.map(plan => ({
        ...plan.toObject(),
        id: plan._id.toString()
      }));
    },

    subscriptionPlan: async ({ id }: { id: string }, context: any) => {
      // All authenticated users can view subscription plan details
      if (!context?.user) {
        throw new Error('Unauthorized: Must be logged in');
      }
      
      const plan = await SubscriptionPlan.findById(id);
      if (!plan) return null;
      
      // Convert to plain object with proper id field
      return {
        ...plan.toObject(),
        id: plan._id.toString()
      };
    },

    allSubscriptionPlansWithDetails: async (_: any, context: any) => {
      // Public API - Allow unauthenticated access for registration page
      // Returns all active subscription plans with complete details
      try {
        console.log('📋 Fetching all subscription plans with details...');
        
        const plans = await SubscriptionPlan.find({ isActive: true })
          .sort({ displayOrder: 1 });
        
        console.log('✅ Found', plans.length, 'active subscription plans');
        
        if (!plans || plans.length === 0) {
          console.warn('⚠️ No active subscription plans found');
          return [];
        }

        // Convert Mongoose documents to plain objects with proper id field
        return plans.map(plan => ({
          ...plan.toObject(),
          id: plan._id.toString()
        }));
      } catch (error) {
        console.error('❌ Failed to fetch subscription plans:', error);
        throw new Error(`Failed to fetch subscription plans: ${error}`);
      }
    },

    vendorSubscription: async ({ vendorId }: { vendorId: string }, context: any) => {
      // Check authorization
      if (!context?.user?.role || (context.user.role !== 'SUPER_ADMIN' && context.user.vendorId?.toString() !== vendorId)) {
        throw new Error('Unauthorized');
      }
      
      const subscription = await VendorSubscription.findOne({ vendorId }).populate('planId');
      return subscription;
    },

    mySubscription: async ( __: any, context: any) => {
      if (!context.user?.vendorId) {
        throw new Error('No vendor associated with user');
      }
      
      const subscription = await VendorSubscription.findOne({ 
        vendorId: context.user.vendorId 
      }).populate('planId');
      
      if (!subscription) return null;
      
      // Fetch all active plans for comparison
      const allPlans = await SubscriptionPlan.find({ isActive: true }).sort({ displayOrder: 1 });
      
      return {
        ...subscription.toObject(),
        id: subscription._id.toString(),
        availablePlans: allPlans.map(plan => ({
          ...plan.toObject(),
          id: plan._id.toString()
        }))
      };
    },

    checkPlanSubscriptionStatus: async ({ vendorId }: { vendorId: string }, context: any) => {
      const subscription = await VendorSubscription.findOne({ vendorId }).populate('planId');
      
      if (!subscription) {
        return {
          isValid: false,
          canAddUser: false,
          canAddProperty: false,
          canAddLead: false,
          canAddDeal: false,
          limitReached: 'No active subscription',
          daysRemaining: 0
        };
      }

      const plan = subscription.planId as any;
      const now = new Date();
      const daysRemaining = Math.ceil((subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      const isValid = subscription.isValid() && daysRemaining > 0;
      const canAddUser = subscription.currentUsage.activeUsers < plan.features.maxUsers;
      const canAddProperty = subscription.currentUsage.totalProperties < plan.features.maxProperties;
      const canAddLead = subscription.currentUsage.totalLeads < plan.features.maxLeads;
      const canAddDeal = subscription.currentUsage.totalDeals < plan.features.maxDeals;

      let limitReached = null;
      if (!canAddUser) limitReached = 'User limit reached. Please upgrade your plan.';
      else if (!canAddProperty) limitReached = 'Property limit reached. Please upgrade your plan.';
      else if (!canAddLead) limitReached = 'Lead limit reached. Please upgrade your plan.';
      else if (!canAddDeal) limitReached = 'Deal limit reached. Please upgrade your plan.';

      return {
        isValid,
        canAddUser,
        canAddProperty,
        canAddLead,
        canAddDeal,
        limitReached,
        daysRemaining
      };
    }
  },

  Mutation: {
    createSubscriptionPlan: async ({ input }: any, context: any) => {
      // Only SUPER_ADMIN can create plans
      if (!context?.user?.role || context.user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized: Only super admin can create subscription plans');
      }

      const plan = new SubscriptionPlan(input);
      await plan.save();
      return plan;
    },

    updateSubscriptionPlan: async ({ id, input }: any, context: any) => {
      if (!context?.user?.role || context.user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized: Only super admin can update subscription plans');
      }

      const plan = await SubscriptionPlan.findByIdAndUpdate(id, input, { new: true });
      if (!plan) {
        throw new Error('Subscription plan not found');
      }
      return plan;
    },

    deleteSubscriptionPlan: async ({ id }: { id: string }, context: any) => {
      if (!context?.user?.role || context.user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized: Only super admin can delete subscription plans');
      }

      // Check if any vendor is using this plan
      const inUse = await VendorSubscription.findOne({ planId: id, status: { $in: ['active', 'trial'] } });
      if (inUse) {
        throw new Error('Cannot delete plan: Currently in use by vendors');
      }

      await SubscriptionPlan.findByIdAndDelete(id);
      return true;
    },

    assignSubscription: async ({ input }: any, context: any) => {
      if (!context?.user?.role || (context.user.role !== 'SUPER_ADMIN' && context.user.role !== 'VENDOR_ADMIN')) {
        throw new Error('Unauthorized');
      }

      const { vendorId, planId, startDate, endDate, trialEndDate, autoRenew } = input;

      // Check if plan exists
      const plan = await SubscriptionPlan.findById(planId);
      if (!plan) {
        throw new Error('Subscription plan not found');
      }

      // Calculate dates
      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

      // Check if subscription already exists
      let subscription = await VendorSubscription.findOne({ vendorId });

      if (subscription) {
        // Update existing subscription
        subscription.planId = planId;
        subscription.startDate = start;
        subscription.endDate = end;
        subscription.trialEndDate = trialEndDate ? new Date(trialEndDate) : undefined;
        subscription.autoRenew = autoRenew !== undefined ? autoRenew : true;
        subscription.status = 'active';
      } else {
        // Create new subscription
        subscription = new VendorSubscription({
          vendorId,
          planId,
          startDate: start,
          endDate: end,
          trialEndDate: trialEndDate ? new Date(trialEndDate) : undefined,
          autoRenew: autoRenew !== undefined ? autoRenew : true,
          status: trialEndDate ? 'trial' : 'active',
          currentUsage: {
            activeUsers: 0,
            totalProperties: 0,
            totalLeads: 0,
            totalDeals: 0,
            storageUsed: 0
          }
        });
      }

      await subscription.save();
      
      // Update usage stats
      await updateUsageStatsInternal(vendorId);
      
      return await VendorSubscription.findById(subscription._id).populate('planId');
    },

    updateVendorSubscription: async ({ vendorId, planId }: any, context: any) => {
      if (!context?.user?.role || (context.user.role !== 'SUPER_ADMIN' && context.user.vendorId?.toString() !== vendorId)) {
        throw new Error('Unauthorized');
      }

      const subscription = await VendorSubscription.findOne({ vendorId });
      if (!subscription) {
        throw new Error('No subscription found for this vendor');
      }

      const plan = await SubscriptionPlan.findById(planId);
      if (!plan) {
        throw new Error('Subscription plan not found');
      }

      subscription.planId = planId;
      await subscription.save();

      return await VendorSubscription.findById(subscription._id).populate('planId');
    },

    cancelVendorSubscription: async (_: any, { vendorId, reason }: any, context: any) => {
      if (!context?.user?.role || (context.user.role !== 'SUPER_ADMIN' && context.user.vendorId?.toString() !== vendorId)) {
        throw new Error('Unauthorized');
      }

      const subscription = await VendorSubscription.findOne({ vendorId });
      if (!subscription) {
        throw new Error('No subscription found');
      }

      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date();
      subscription.cancelReason = reason;
      subscription.autoRenew = false;

      await subscription.save();
      return await VendorSubscription.findById(subscription._id).populate('planId');
    },

    updateUsageStats: async ({ vendorId }: { vendorId: string }, context: any) => {
      if (!context?.user?.role || context.user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized');
      }

      await updateUsageStatsInternal(vendorId);
      return await VendorSubscription.findOne({ vendorId }).populate('planId');
    }
  },

  VendorSubscription: {
    plan: async (parent: any) => {
      return await SubscriptionPlan.findById(parent.planId);
    }
  }
};

// Helper function to update usage stats
async function updateUsageStatsInternal(vendorId: string) {
  const subscription = await VendorSubscription.findOne({ vendorId });
  if (!subscription) return;

  const [activeUsers, totalProperties, totalLeads, totalDeals] = await Promise.all([
    User.countDocuments({ vendorId, isActive: true }),
    Property.countDocuments({ vendorId }),
    Lead.countDocuments({ vendorId }),
    Deal.countDocuments({ vendorId })
  ]);

  subscription.currentUsage = {
    activeUsers,
    totalProperties,
    totalLeads,
    totalDeals,
    storageUsed: 0 // TODO: Calculate actual storage usage
  };

  await subscription.save();
}

export { updateUsageStatsInternal };
