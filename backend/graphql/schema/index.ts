import { buildSchema } from 'graphql';
import { propertyTypes, propertyQueries, propertyMutations } from '../types/property.types';
import { userTypes, userQueries, userMutations } from '../types/user.types';
import { vendorTypes, vendorQueries, vendorMutations } from '../types/vendor.types';
import { roleTitleTypes, roleTitleQueries, roleTitleMutations } from '../types/roleTitle.types';
import { leadTypes, leadQueries, leadMutations } from '../types/lead.types';
import { dealTypes, dealQueries, dealMutations } from '../types/deal.types';
import { auditLogTypes, auditLogQueries, auditLogMutations } from '../types/auditLog.types';
import { analyticsTypes, analyticsQueries, analyticsMutations } from '../types/analytics.types';
import { billingTypes, billingQueries, billingMutations } from '../types/billing.types';
import { notificationTypes, notificationQueries, notificationMutations } from '../types/notification.types';
import { subscriptionTypes, subscriptionQueries, subscriptionMutations } from '../types/subscription.types';

/**
 * Modular GraphQL Schema
 * Each feature has its own type definitions, queries, and mutations
 * This makes the schema maintainable and scalable
 */
const schema = buildSchema(`
  # ============================================
  # TYPE DEFINITIONS
  # ============================================
  
  ${propertyTypes}
  ${userTypes}
  ${vendorTypes}
    ${roleTitleTypes}
  ${billingTypes}
  ${leadTypes}
  ${dealTypes}
  ${auditLogTypes}
  ${analyticsTypes}
  ${notificationTypes}
  ${subscriptionTypes}

  # ============================================
  # ROOT QUERY TYPE
  # ============================================
  
  type Query {
    # Health check
    health: String!
    
    # Property Queries
    ${propertyQueries}
    
    # User Queries
    ${userQueries}
    
    # Vendor Queries
    ${vendorQueries}
    
      # Role Title Queries
      ${roleTitleQueries}
    
    # Billing Queries
    ${billingQueries}
    
    # Lead Queries
    ${leadQueries}
    
    # Deal Queries
    ${dealQueries}
    
    # Audit Log Queries
    ${auditLogQueries}
    
    # Analytics Queries
    ${analyticsQueries}
    
    # Notification Queries
    ${notificationQueries}
    
    # Subscription Queries
    ${subscriptionQueries}
  }

  # ============================================
  # ROOT MUTATION TYPE
  # ============================================
  
  type Mutation {
    # Property Mutations
    ${propertyMutations}
    
    # User Mutations
    ${userMutations}
    
    # Vendor Mutations
    ${vendorMutations}
    
      # Role Title Mutations
      ${roleTitleMutations}
    
    # Billing Mutations
    ${billingMutations}
    
    # Lead Mutations
    ${leadMutations}
    
    # Deal Mutations
    ${dealMutations}
    
    # Audit Log Mutations
    ${auditLogMutations}
    
    # Analytics Mutations
    ${analyticsMutations}
    
    # Notification Mutations
    ${notificationMutations}
    
    # Subscription Mutations
    ${subscriptionMutations}
  }
`);

export default schema;
