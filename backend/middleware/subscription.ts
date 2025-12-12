import { Request, Response, NextFunction } from 'express';
import VendorSubscription from '../models/VendorSubscription';
import SubscriptionPlan from '../models/SubscriptionPlan';

export interface SubscriptionCheckRequest extends Request {
  subscriptionStatus?: {
    isValid: boolean;
    canAddUser: boolean;
    canAddProperty: boolean;
    canAddLead: boolean;
    canAddDeal: boolean;
    plan?: any;
  };
}

/**
 * Middleware to check if vendor's subscription is valid and has capacity
 */
export const checkSubscriptionLimits = (resourceType: 'user' | 'property' | 'lead' | 'deal' | 'all' = 'all') => {
  return async (req: SubscriptionCheckRequest, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      
      // Skip check for SUPER_ADMIN
      if (user?.role === 'SUPER_ADMIN') {
        return next();
      }

      const vendorId = user?.vendorId;
      if (!vendorId) {
        return res.status(403).json({ error: 'No vendor associated with user' });
      }

      // Get subscription
      const subscription = await VendorSubscription.findOne({ vendorId }).populate('planId');
      
      if (!subscription) {
        return res.status(403).json({ 
          error: 'No active subscription', 
          message: 'Please contact your administrator to set up a subscription plan.' 
        });
      }

      const plan = subscription.planId as any;
      const now = new Date();
      
      // Check if subscription is expired
      if (subscription.endDate < now) {
        return res.status(403).json({ 
          error: 'Subscription expired', 
          message: 'Your subscription has expired. Please renew to continue using the service.' 
        });
      }

      // Check if subscription is valid
      if (subscription.status !== 'active' && subscription.status !== 'trial') {
        return res.status(403).json({ 
          error: 'Subscription inactive', 
          message: `Your subscription is ${subscription.status}. Please contact support.` 
        });
      }

      // Check specific resource limits
      const canAddUser = subscription.currentUsage.activeUsers < plan.features.maxUsers;
      const canAddProperty = subscription.currentUsage.totalProperties < plan.features.maxProperties;
      const canAddLead = subscription.currentUsage.totalLeads < plan.features.maxLeads;
      const canAddDeal = subscription.currentUsage.totalDeals < plan.features.maxDeals;

      // Attach subscription status to request for later use
      req.subscriptionStatus = {
        isValid: true,
        canAddUser,
        canAddProperty,
        canAddLead,
        canAddDeal,
        plan
      };

      // Check specific resource type if specified
      if (resourceType !== 'all') {
        switch (resourceType) {
          case 'user':
            if (!canAddUser) {
              return res.status(403).json({ 
                error: 'User limit reached', 
                message: `You have reached the maximum number of users (${plan.features.maxUsers}) allowed in your ${plan.name} plan. Please upgrade to add more users.`,
                currentUsage: subscription.currentUsage.activeUsers,
                maxAllowed: plan.features.maxUsers
              });
            }
            break;
          case 'property':
            if (!canAddProperty) {
              return res.status(403).json({ 
                error: 'Property limit reached', 
                message: `You have reached the maximum number of properties (${plan.features.maxProperties}) allowed in your ${plan.name} plan. Please upgrade to add more properties.`,
                currentUsage: subscription.currentUsage.totalProperties,
                maxAllowed: plan.features.maxProperties
              });
            }
            break;
          case 'lead':
            if (!canAddLead) {
              return res.status(403).json({ 
                error: 'Lead limit reached', 
                message: `You have reached the maximum number of leads (${plan.features.maxLeads}) allowed in your ${plan.name} plan. Please upgrade to add more leads.`,
                currentUsage: subscription.currentUsage.totalLeads,
                maxAllowed: plan.features.maxLeads
              });
            }
            break;
          case 'deal':
            if (!canAddDeal) {
              return res.status(403).json({ 
                error: 'Deal limit reached', 
                message: `You have reached the maximum number of deals (${plan.features.maxDeals}) allowed in your ${plan.name} plan. Please upgrade to add more deals.`,
                currentUsage: subscription.currentUsage.totalDeals,
                maxAllowed: plan.features.maxDeals
              });
            }
            break;
        }
      }

      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      return res.status(500).json({ error: 'Failed to check subscription status' });
    }
  };
};

/**
 * GraphQL context middleware to add subscription info
 */
export const addSubscriptionToContext = async (context: any) => {
  if (!context.user?.vendorId || context.user?.role === 'SUPER_ADMIN') {
    return context;
  }

  try {
    const subscription = await VendorSubscription.findOne({ 
      vendorId: context.user.vendorId 
    }).populate('planId');

    if (subscription) {
      const plan = subscription.planId as any;
      const now = new Date();
      const isExpired = subscription.endDate < now;
      const isValid = !isExpired && (subscription.status === 'active' || subscription.status === 'trial');

      context.subscription = {
        ...subscription.toObject(),
        isValid,
        isExpired,
        canAddUser: subscription.currentUsage.activeUsers < plan.features.maxUsers,
        canAddProperty: subscription.currentUsage.totalProperties < plan.features.maxProperties,
        canAddLead: subscription.currentUsage.totalLeads < plan.features.maxLeads,
        canAddDeal: subscription.currentUsage.totalDeals < plan.features.maxDeals
      };
    }
  } catch (error) {
    console.error('Failed to add subscription to context:', error);
  }

  return context;
};

/**
 * Check subscription in GraphQL resolvers
 */
export const checkGraphQLSubscriptionLimit = (context: any, resourceType: 'user' | 'property' | 'lead' | 'deal') => {
  // Skip check for SUPER_ADMIN
  if (context.user?.role === 'SUPER_ADMIN') {
    return;
  }

  if (!context.subscription) {
    throw new Error('No active subscription found. Please contact your administrator.');
  }

  if (!context.subscription.isValid) {
    if (context.subscription.isExpired) {
      throw new Error('Your subscription has expired. Please renew to continue using the service.');
    }
    throw new Error(`Your subscription is ${context.subscription.status}. Please contact support.`);
  }

  const { plan } = context.subscription;

  switch (resourceType) {
    case 'user':
      if (!context.subscription.canAddUser) {
        throw new Error(
          `User limit reached. You have reached the maximum number of users (${plan.features.maxUsers}) ` +
          `allowed in your ${plan.name} plan. Please upgrade to add more users.`
        );
      }
      break;
    case 'property':
      if (!context.subscription.canAddProperty) {
        throw new Error(
          `Property limit reached. You have reached the maximum number of properties (${plan.features.maxProperties}) ` +
          `allowed in your ${plan.name} plan. Please upgrade to add more properties.`
        );
      }
      break;
    case 'lead':
      if (!context.subscription.canAddLead) {
        throw new Error(
          `Lead limit reached. You have reached the maximum number of leads (${plan.features.maxLeads}) ` +
          `allowed in your ${plan.name} plan. Please upgrade to add more leads.`
        );
      }
      break;
    case 'deal':
      if (!context.subscription.canAddDeal) {
        throw new Error(
          `Deal limit reached. You have reached the maximum number of deals (${plan.features.maxDeals}) ` +
          `allowed in your ${plan.name} plan. Please upgrade to add more deals.`
        );
      }
      break;
  }
};
