import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Vendor from '../models/Vendor';
import User, { UserRole } from '../models/User';
import Property, { PropertyStatus } from '../models/Property';
import AuditLog from '../models/AuditLog';
import { Plan } from '../models/Plan';
import SubscriptionPlan from '../models/SubscriptionPlan';
import { seedSubscriptionPlans } from './subscriptionPlans';

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lexonitservices_db_user:rK8FdwQHpTadfXlg@reallex.q5nxaar.mongodb.net/';

const seed = async () => {
  console.log('🌱 Starting Database Seed...');
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');

    // 1. Clean Database
    await Promise.all([
      Vendor.deleteMany({}),
      User.deleteMany({}),
      Property.deleteMany({}),
      AuditLog.deleteMany({}),
      Plan.deleteMany({}),
      SubscriptionPlan.deleteMany({})
    ]);
    console.log('🧹 Database cleared');

    // 1.5 Seed Subscription Plans
    await seedSubscriptionPlans();

    // 2. Create Subscription Plans
    const plans = await Plan.insertMany([
      {
        name: 'FREE',
        displayName: 'Starter',
        description: 'Perfect for individuals and small teams',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
          'Up to 5 team members',
          'Up to 10 properties',
          'Basic reporting',
          'Email support'
        ],
        maxUsers: 5,
        maxProperties: 10,
        maxTemplates: 1,
        supportLevel: 'EMAIL',
        isActive: true
      },
      {
        name: 'STARTER',
        displayName: 'Professional',
        description: 'For growing real estate teams',
        monthlyPrice: 99,
        yearlyPrice: 990,
        features: [
          'Up to 15 team members',
          'Up to 50 properties',
          'Advanced reporting',
          'Custom templates',
          'Priority email support',
          'API access'
        ],
        maxUsers: 15,
        maxProperties: 50,
        maxTemplates: 5,
        supportLevel: 'PRIORITY',
        isActive: true
      },
      {
        name: 'PROFESSIONAL',
        displayName: 'Enterprise',
        description: 'For large real estate companies',
        monthlyPrice: 299,
        yearlyPrice: 2990,
        features: [
          'Up to 50 team members',
          'Unlimited properties',
          'Custom branding',
          'White label solutions',
          'Custom templates',
          'Priority support',
          'Advanced API',
          'Custom integrations',
          'Dedicated account manager'
        ],
        maxUsers: 50,
        maxProperties: 1000,
        maxTemplates: 20,
        supportLevel: 'DEDICATED',
        isActive: true
      },
      {
        name: 'ENTERPRISE',
        displayName: 'Custom',
        description: 'Customized solutions for large enterprises',
        monthlyPrice: 999,
        yearlyPrice: 9990,
        features: [
          'Unlimited team members',
          'Unlimited properties',
          'Full white label',
          'Custom development',
          'Dedicated infrastructure',
          '24/7 phone support',
          'Custom integrations',
          'On-premise deployment option'
        ],
        maxUsers: 999,
        maxProperties: 99999,
        maxTemplates: 999,
        supportLevel: 'DEDICATED',
        isActive: true
      }
    ]);
    console.log('💳 4 Subscription plans created');

    // 2. Create Demo Admin User
    const demoAdminHash = await bcrypt.hash('admin@123', 10);
    const demoAdmin = await User.create({
      email: 'admin@demo.com',
      passwordHash: demoAdminHash,
      firstName: 'Demo',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true
    });
    console.log('👤 Demo Admin (admin@demo.com / admin@123) created');

    // 3. Create Super Admin (System Owner)
    const defaultHash = await bcrypt.hash('password', 10);
    const superAdmin = await User.create({
      email: 'admin@ultrareal.com',
      passwordHash: defaultHash,
      firstName: 'System',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true
    });
    console.log('👤 Super Admin created');

    // 4. Create Vendor (Tenant)
    const vendor = await Vendor.create({
      name: 'Prestige Estates',
      slug: 'prestige',
      logoUrl: 'https://via.placeholder.com/150',
      theme: { primaryColor: '#7c3aed' }, // Matches standard purple theme
      contactEmail: 'contact@prestige.com'
    });
    console.log(`🏢 Vendor "${vendor.name}" created`);

    // 5. Create Vendor Users
    const vendorAdmin = await User.create({
      email: 'admin@prestige.com',
      passwordHash: defaultHash,
      firstName: 'Sarah',
      lastName: 'Connor',
      role: UserRole.VENDOR_ADMIN,
      vendorId: vendor._id
    });

    const manager = await User.create({
      email: 'manager@prestige.com',
      passwordHash: defaultHash,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.MANAGER,
      vendorId: vendor._id
    });

    const salesRep = await User.create({
      email: 'agent@prestige.com',
      passwordHash: defaultHash,
      firstName: 'Emily',
      lastName: 'Rose',
      role: UserRole.SALES_REP,
      vendorId: vendor._id
    });
    console.log('👥 Vendor users created');

    // 6. Create Properties
    const propertiesData = [
      {
        address: '123 Beverly Park Dr, Beverly Hills, CA',
        price: 12500000,
        specs: { beds: 6, baths: 7, sqft: 8500 },
        status: PropertyStatus.PUBLISHED, // Was ACTIVE
        location: { type: 'Point', coordinates: [-118.4004, 34.0736] }, // Beverly Hills
        images: ['https://picsum.photos/800/600?random=1']
      },
      {
        address: '456 Ocean Ave, Santa Monica, CA',
        price: 4500000,
        specs: { beds: 3, baths: 2, sqft: 2200 },
        status: PropertyStatus.PENDING,
        location: { type: 'Point', coordinates: [-118.4912, 34.0195] }, // Santa Monica
        images: ['https://picsum.photos/800/600?random=2']
      },
      {
        address: '789 Downtown Loft, Los Angeles, CA',
        price: 850000,
        specs: { beds: 1, baths: 1.5, sqft: 1100 },
        status: PropertyStatus.PUBLISHED, // Was ACTIVE
        location: { type: 'Point', coordinates: [-118.2437, 34.0522] }, // Downtown LA
        images: ['https://picsum.photos/800/600?random=3']
      },
      {
        address: '321 Silver Lake Blvd, Los Angeles, CA',
        price: 1650000,
        specs: { beds: 3, baths: 2, sqft: 1800 },
        status: PropertyStatus.SOLD,
        location: { type: 'Point', coordinates: [-118.2694, 34.0867] }, // Silver Lake
        images: ['https://picsum.photos/800/600?random=4']
      },
      {
        address: '999 Hollywood Hills, Los Angeles, CA',
        price: 3200000,
        specs: { beds: 4, baths: 3, sqft: 3200 },
        status: PropertyStatus.PUBLISHED, // Was ACTIVE
        location: { type: 'Point', coordinates: [-118.3287, 34.1177] }, // Hollywood Hills
        images: ['https://picsum.photos/800/600?random=5']
      }
    ];

    await Property.insertMany(propertiesData.map(p => ({
      ...p,
      vendorId: vendor._id,
      assignedAgentId: salesRep._id
    })));
    console.log(`🏠 ${propertiesData.length} Properties created`);

    // 7. Create Audit Log Entry
    await AuditLog.create({
      userId: vendorAdmin._id,
      action: 'SYSTEM_INIT',
      targetModel: 'Vendor',
      targetId: vendor._id,
      details: { message: 'Initial seed completed' }
    });
    console.log('📝 Audit log created');

    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    (process as any).exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected');
  }
};

seed();