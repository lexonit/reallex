import mongoose from 'mongoose';
import SubscriptionPlan from '../models/SubscriptionPlan';

const defaultPlans = [
  {
    name: 'Solo Agent',
    slug: 'solo-agent',
    description: 'Perfect for individual real estate agents starting their business',
    price: 49.99,
    billingCycle: 'monthly',
    features: {
      maxUsers: 1,
      maxProperties: 50,
      maxLeads: 100,
      maxDeals: 25,
      maxStorage: 5,
      customBranding: false,
      apiAccess: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customIntegrations: false
    },
    isActive: true,
    displayOrder: 1
  },
  {
    name: 'Brokerage',
    slug: 'brokerage',
    description: 'Designed for small to medium-sized real estate brokerages',
    price: 199.99,
    billingCycle: 'monthly',
    features: {
      maxUsers: 10,
      maxProperties: 500,
      maxLeads: 1000,
      maxDeals: 200,
      maxStorage: 50,
      customBranding: true,
      apiAccess: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customIntegrations: false
    },
    isActive: true,
    displayOrder: 2
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Unlimited power for large real estate organizations',
    price: 499.99,
    billingCycle: 'monthly',
    features: {
      maxUsers: 100,
      maxProperties: 10000,
      maxLeads: 50000,
      maxDeals: 5000,
      maxStorage: 500,
      customBranding: true,
      apiAccess: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customIntegrations: true
    },
    isActive: true,
    displayOrder: 3
  }
];

export const seedSubscriptionPlans = async () => {
  try {
    // Check if plans already exist
    const existingPlans = await SubscriptionPlan.countDocuments();
    
    if (existingPlans > 0) {
      console.log('✓ Subscription plans already exist, skipping seed...');
      return;
    }

    // Insert default plans
    await SubscriptionPlan.insertMany(defaultPlans);
    console.log('✓ Successfully seeded subscription plans');
    console.log('  - Solo Agent ($49.99/month)');
    console.log('  - Brokerage ($199.99/month)');
    console.log('  - Enterprise ($499.99/month)');
  } catch (error) {
    console.error('✗ Failed to seed subscription plans:', error);
    throw error;
  }
};

// Run if called directly (ES modules compatible)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reallex';
  
  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      await seedSubscriptionPlans();
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      process.exit(1);
    });
}
