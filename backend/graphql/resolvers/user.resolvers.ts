import User from '../../models/User';
import Vendor from '../../models/Vendor';
import SubscriptionPlan from '../../models/SubscriptionPlan';
import VendorSubscription from '../../models/VendorSubscription';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signAccessToken } from '../../utils/jwt';

const requireAuth = (context: any) => {
  if (!context?.user) throw new Error('Unauthorized');
  return context.user;
};

const toUserResponse = (user: any) => ({
  _id: user._id.toString(),
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  vendorId: user.vendorId?.toString(),
  isActive: user.isActive,
  createdAt: user.createdAt?.toISOString(),
  updatedAt: user.updatedAt?.toISOString()
});

export const userResolvers = {
  // Queries
  users: async ({ filter }: any, context: any) => {
    const requester = requireAuth(context);
    const query: any = {};

    // Role-based scoping: SUPER_ADMIN can see all; others restricted to their vendor
    const isSuperAdmin = requester?.role === 'SUPER_ADMIN';
    const requesterVendorId = requester?.vendorId || requester?.vendorId?.toString?.();

    if (!isSuperAdmin) {
      // Force vendor scoping to requester's vendor
      if (requesterVendorId) {
        query.vendorId = requesterVendorId;
      } else {
        // If no vendorId on requester, return empty result for safety
        return [];
      }
    }

    // Apply optional filters on top of role-based scoping
    if (filter) {
      if (filter.role) query.role = filter.role;
      if (filter.isActive !== undefined) query.isActive = filter.isActive;
      // Allow vendor filter only for SUPER_ADMIN; otherwise ignore to prevent cross-tenant access
      if (isSuperAdmin && filter.vendorId) query.vendorId = filter.vendorId;
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    return users.map(u => ({
      _id: u._id.toString(),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      vendorId: u.vendorId?.toString(),
      isActive: u.isActive,
      createdAt: u.createdAt?.toISOString(),
      updatedAt: u.updatedAt?.toISOString()
    }));
  },

  inviteUser: async ({ input }: any, context: any) => {
    const requester = requireAuth(context);

    // Check subscription limits before inviting user
    const { checkGraphQLSubscriptionLimit } = await import('../../middleware/subscription');
    checkGraphQLSubscriptionLimit(context, 'user');

    const inviteToken = crypto.randomBytes(20).toString('hex');
    const inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const vendorId = input.vendorId || requester?.vendorId || null;

    let user = await User.findOne({ email: input.email });

    if (user && user.isActive) {
      throw new Error('User with this email already exists');
    }

    const tempPassword = crypto.randomBytes(12).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    if (!user) {
      user = await User.create({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
        vendorId,
        passwordHash,
        isActive: false,
        inviteToken,
        inviteExpires,
        invitedBy: requester?.userId || requester?.id || requester?._id
      });
    } else {
      user.firstName = input.firstName;
      user.lastName = input.lastName;
      user.role = input.role;
      user.vendorId = vendorId;
      user.passwordHash = passwordHash;
      user.isActive = false;
      user.inviteToken = inviteToken;
      user.inviteExpires = inviteExpires;
      user.invitedBy = requester?.userId || requester?.id || requester?._id;
      await user.save();
    }

    return {
      inviteToken,
      email: input.email,
      expiresAt: inviteExpires.toISOString()
    };
  },

  acceptInvite: async ({ input }: any) => {
    const user = await User.findOne({ inviteToken: input.token });

    if (!user || !user.inviteExpires || user.inviteExpires < new Date()) {
      throw new Error('Invalid or expired invite token');
    }

    user.passwordHash = await bcrypt.hash(input.password, 10);
    user.isActive = true;
    user.inviteToken = undefined;
    user.inviteExpires = undefined;

    if (input.firstName) user.firstName = input.firstName;
    if (input.lastName) user.lastName = input.lastName;

    await user.save();

    const token = signAccessToken(user);

    return {
      token,
      user: toUserResponse(user)
    };
  },

  user: async ({ id }: any, context: any) => {
    requireAuth(context);
    const user = await User.findById(id);
    if (!user) return null;

    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      vendorId: user.vendorId?.toString(),
      isActive: user.isActive,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    };
  },

  me: async ({ }, context: any) => {
    requireAuth(context);
    const userId = context.user?.userId || context.user?.id;

    const user = await User.findById(userId);
    if (!user) return null;

    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      vendorId: user.vendorId?.toString(),
      isActive: user.isActive,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    };
  },

  verifyInviteToken: async ({ token }: any) => {
    const user = await User.findOne({ inviteToken: token });

    if (!user) {
      throw new Error('Invalid invite token');
    }

    const isValid = user.inviteExpires && user.inviteExpires >= new Date();

    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isValid
    };
  },

  // Mutations
  register: async ({ input }: any) => {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Step 1: Create Vendor if vendor details are provided
    let vendorId = input.vendorId;
    if (input.vendorName && input.vendorSlug) {
      const existingVendor = await Vendor.findOne({ slug: input.vendorSlug });
      if (existingVendor) {
        throw new Error('Vendor with this slug already exists');
      }

      const vendor = await Vendor.create({
        name: input.vendorName,
        slug: input.vendorSlug,
        contactEmail: input.contactEmail || input.email,
        logoUrl: input.logoUrl || '',
        theme: input.theme || { primaryColor: '#3B82F6' },
        isActive: true
      });

      vendorId = vendor._id.toString();

      // Step 1.5: Create subscription if planId is provided
      if (input.planId) {
        const plan = await SubscriptionPlan.findById(input.planId);
        if (!plan) {
          throw new Error('Subscription plan not found');
        }

        // Create subscription
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days trial

        await VendorSubscription.create({
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
      }
    }

    // Step 2: Create User with vendor reference
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await User.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash,
      role: input.role || 'VENDOR_ADMIN',
      vendorId: vendorId || null,
      isActive: true
    });

    const token = signAccessToken(user);

    return {
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        vendorId: user.vendorId?.toString(),
        isActive: user.isActive,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString()
      }
    };
  },

  login: async ({ input }: any) => {
    const user = await User.findOne({ email: input.email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    const token = signAccessToken(user);

    return {
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        vendorId: user.vendorId?.toString(),
        isActive: user.isActive,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString()
      }
    };
  },

  updateUser: async ({ id, input }: any, context: any) => {
    requireAuth(context);
    const user = await User.findByIdAndUpdate(id, input, { new: true });
    if (!user) throw new Error('User not found');

    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      vendorId: user.vendorId?.toString(),
      isActive: user.isActive,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    };
  },

  deleteUser: async ({ id }: any, context: any) => {
    requireAuth(context);
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
};
