import Vendor from '../../models/Vendor';
import SubscriptionPlan from '../../models/SubscriptionPlan';
import VendorSubscription from '../../models/VendorSubscription';

const requireAuth = (context: any) => {
  if (!context?.user) throw new Error('Unauthorized');
  return context.user;
};

export const vendorResolvers = {
  // Queries
  vendors: async (_args: any, context: any) => {
    requireAuth(context);
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    return vendors.map(v => ({
      _id: v._id.toString(),
      name: v.name,
      slug: v.slug,
      logoUrl: v.logoUrl,
      theme: v.theme,
      contactEmail: v.contactEmail,
      isActive: v.isActive,
      createdAt: v.createdAt?.toISOString(),
      updatedAt: v.updatedAt?.toISOString()
    }));
  },

  vendor: async ({ id }: any, context: any) => {
    requireAuth(context);
    const vendor = await Vendor.findById(id);
    if (!vendor) return null;

    return {
      _id: vendor._id.toString(),
      name: vendor.name,
      slug: vendor.slug,
      logoUrl: vendor.logoUrl,
      theme: vendor.theme,
      contactEmail: vendor.contactEmail,
      isActive: vendor.isActive,
      createdAt: vendor.createdAt?.toISOString(),
      updatedAt: vendor.updatedAt?.toISOString()
    };
  },

  vendorBySlug: async ({ slug }: any, context: any) => {
    requireAuth(context);
    const vendor = await Vendor.findOne({ slug });
    if (!vendor) return null;

    return {
      _id: vendor._id.toString(),
      name: vendor.name,
      slug: vendor.slug,
      logoUrl: vendor.logoUrl,
      theme: vendor.theme,
      contactEmail: vendor.contactEmail,
      isActive: vendor.isActive,
      createdAt: vendor.createdAt?.toISOString(),
      updatedAt: vendor.updatedAt?.toISOString()
    };
  },

  // Mutations
  createVendor: async ({ input }: any, context: any) => {
    const existingVendor = await Vendor.findOne({ slug: input.slug });
    if (existingVendor) {
      throw new Error('Vendor with this slug already exists');
    }

    const vendor = await Vendor.create({ ...input, isActive: true });

    // If a plan is selected, create subscription
    let subscription = null;
    if (input.planId) {
      const plan = await SubscriptionPlan.findById(input.planId);
      if (!plan) {
        throw new Error('Subscription plan not found');
      }

      // Create subscription
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default trial

      subscription = await VendorSubscription.create({
        vendorId: vendor._id,
        planId: plan._id,
        startDate,
        endDate,
        status: 'trial',
        autoRenew: true,
        currentUsage: {
          activeUsers: 0,
          totalProperties: 0,
          totalLeads: 0,
          totalDeals: 0,
          storageUsed: 0
        }
      });

      subscription = await subscription.populate('planId');
    }

    const vendorObj = {
      _id: vendor._id.toString(),
      name: vendor.name,
      slug: vendor.slug,
      logoUrl: vendor.logoUrl,
      theme: vendor.theme,
      contactEmail: vendor.contactEmail,
      isActive: vendor.isActive,
      createdAt: vendor.createdAt?.toISOString(),
      updatedAt: vendor.updatedAt?.toISOString()
    };

    if (subscription) {
      return {
        ...vendorObj,
        subscription: {
          _id: subscription._id.toString(),
          status: subscription.status,
          planName: {
            name: (subscription.planId as any).name,
            price: (subscription.planId as any).price
          }
        }
      };
    }

    return vendorObj;
  },

  updateVendor: async ({ id, input }: any, context: any) => {
    requireAuth(context);
    const vendor = await Vendor.findByIdAndUpdate(id, input, { new: true });
    if (!vendor) throw new Error('Vendor not found');

    return {
      _id: vendor._id.toString(),
      name: vendor.name,
      slug: vendor.slug,
      logoUrl: vendor.logoUrl,
      theme: vendor.theme,
      contactEmail: vendor.contactEmail,
      isActive: vendor.isActive,
      createdAt: vendor.createdAt?.toISOString(),
      updatedAt: vendor.updatedAt?.toISOString()
    };
  },

  deleteVendor: async ({ id }: any, context: any) => {
    requireAuth(context);
    const result = await Vendor.findByIdAndDelete(id);
    return !!result;
  }
};
