import { propertyResolvers } from './property.resolvers';
import { userResolvers } from './user.resolvers';
import { vendorResolvers } from './vendor.resolvers';
import { roleTitleResolvers } from './roleTitle.resolvers';
import { leadResolvers } from './lead.resolvers';
import { dealResolvers } from './deal.resolvers';
import { auditLogResolvers } from './auditLog.resolvers';
import { analyticsResolvers } from './analytics.resolvers';
import { organizationResolvers } from './organization.resolvers';
import { billingResolvers } from './billing.resolvers';
import { notificationResolvers } from './notification.resolvers';
import { subscriptionResolvers } from './subscription.resolvers';

/**
 * Root resolver combining all feature resolvers
 * This is the main entry point for GraphQL queries and mutations
 */
export const rootValue = {
  // Health check
  health: () => 'OK',

  // Property resolvers
  ...propertyResolvers,

  // User resolvers
  ...userResolvers,

  // Vendor resolvers
  ...vendorResolvers,

  // Role Title resolvers
  ...roleTitleResolvers,

  // Organization resolvers
  ...organizationResolvers,

  // Billing resolvers
  ...billingResolvers,

  // Lead & Deal resolvers
  ...leadResolvers,
  ...dealResolvers,

  // Audit Log resolvers
  ...auditLogResolvers,

  // Analytics resolvers
  ...analyticsResolvers,

  // Notification resolvers
  ...notificationResolvers.Query,
  ...notificationResolvers.Mutation,

  // Subscription resolvers
  ...subscriptionResolvers.Query,
  ...subscriptionResolvers.Mutation
};
