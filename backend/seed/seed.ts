import mongoose from 'mongoose';
import Vendor from '../models/Vendor';
import User, { UserRole } from '../models/User';
import Property, { PropertyStatus } from '../models/Property';
import AuditLog from '../models/AuditLog';

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ultrareal_crm';

// Mock Hash (In real app, use bcrypt.hashSync('password', 10))
const MOCK_HASH = '$2a$10$X7V.7/8.9.10.11.12.13.14.15'; // "password"

const seed = async () => {
  console.log('🌱 Starting Database Seed...');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Clean Database
    await Promise.all([
      Vendor.deleteMany({}),
      User.deleteMany({}),
      Property.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    console.log('🧹 Database cleared');

    // 2. Create Super Admin (System Owner)
    const superAdmin = await User.create({
      email: 'admin@ultrareal.com',
      passwordHash: MOCK_HASH,
      firstName: 'System',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true
    });
    console.log('👤 Super Admin created');

    // 3. Create Vendor (Tenant)
    const vendor = await Vendor.create({
      name: 'Prestige Estates',
      slug: 'prestige',
      logoUrl: 'https://via.placeholder.com/150',
      theme: { primaryColor: '#7c3aed' }, // Matches standard purple theme
      contactEmail: 'contact@prestige.com'
    });
    console.log(`🏢 Vendor "${vendor.name}" created`);

    // 4. Create Vendor Users
    const vendorAdmin = await User.create({
      email: 'admin@prestige.com',
      passwordHash: MOCK_HASH,
      firstName: 'Sarah',
      lastName: 'Connor',
      role: UserRole.VENDOR_ADMIN,
      vendorId: vendor._id
    });

    const manager = await User.create({
      email: 'manager@prestige.com',
      passwordHash: MOCK_HASH,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.MANAGER,
      vendorId: vendor._id
    });

    const salesRep = await User.create({
      email: 'agent@prestige.com',
      passwordHash: MOCK_HASH,
      firstName: 'Emily',
      lastName: 'Rose',
      role: UserRole.SALES_REP,
      vendorId: vendor._id
    });
    console.log('👥 Vendor users created');

    // 5. Create Properties
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

    // 6. Create Audit Log Entry
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