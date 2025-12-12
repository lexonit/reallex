import { RoleTitle } from '../../models/RoleTitle';
import User from '../../models/User';

const requireAuth = (context: any) => {
  if (!context?.user) throw new Error('Unauthorized');
  return context.user;
};

const toRoleTitleResponse = (roleTitle: any) => ({
  _id: roleTitle._id.toString(),
  title: roleTitle.title,
  systemRole: roleTitle.systemRole,
  description: roleTitle.description,
  vendorId: roleTitle.vendorId.toString(),
  isActive: roleTitle.isActive,
  createdAt: roleTitle.createdAt?.toISOString(),
  updatedAt: roleTitle.updatedAt?.toISOString()
});

export const roleTitleResolvers = {
  // Queries
  roleTitles: async ({ filter }: any, context: any) => {
    const currentUser = requireAuth(context);

    const query: any = {};

    // Restrict to vendor scope unless SUPER_ADMIN
    if (currentUser.role !== 'SUPER_ADMIN') {
      query.vendorId = filter?.vendorId || currentUser.vendorId;
    } else if (filter?.vendorId) {
      query.vendorId = filter.vendorId;
    }

    if (filter) {
      if (filter.systemRole) query.systemRole = filter.systemRole;
      if (filter.isActive !== undefined) query.isActive = filter.isActive;
    }

    const roleTitles = await RoleTitle.find(query).sort({ createdAt: -1 });
    return roleTitles.map(toRoleTitleResponse);
  },

  roleTitle: async ({ id }: any, context: any) => {
    const currentUser = requireAuth(context);

    const roleTitle = await RoleTitle.findById(id);
    if (!roleTitle) throw new Error('Role title not found');

    if (currentUser.role !== 'SUPER_ADMIN' && roleTitle.vendorId.toString() !== currentUser.vendorId?.toString()) {
      throw new Error('Unauthorized');
    }

    return toRoleTitleResponse(roleTitle);
  },

  // Mutations
  createRoleTitle: async ({ input }: any, context: any) => {
    const userId = requireAuth(context)?.userId || context.user?.id;

    // Check if user has permission (SUPER_ADMIN or VENDOR_ADMIN)
    const currentUser = await User.findById(userId);

    if (!currentUser || !['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(currentUser.role)) {
      throw new Error('Unauthorized: Only admins can create role titles');
    }

    const vendorId = input.vendorId || currentUser.vendorId;
    if (!vendorId) throw new Error('vendorId is required');

    const roleTitle = new RoleTitle({
      title: input.title,
      systemRole: input.systemRole,
      description: input.description,
      vendorId,
      isActive: true
    });

    await roleTitle.save();
    return toRoleTitleResponse(roleTitle);
  },

  updateRoleTitle: async ({ id, input }: any, context: any) => {
    const userId = requireAuth(context)?.userId || context.user?.id;

    // Check if user has permission
    const currentUser = await User.findById(userId);

    if (!currentUser || !['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(currentUser.role)) {
      throw new Error('Unauthorized: Only admins can update role titles');
    }

    const roleTitle = await RoleTitle.findById(id);
    if (!roleTitle) throw new Error('Role title not found');

    if (currentUser.role !== 'SUPER_ADMIN' && roleTitle.vendorId.toString() !== currentUser.vendorId?.toString()) {
      throw new Error('Unauthorized');
    }

    if (input.title !== undefined) roleTitle.title = input.title;
    if (input.systemRole !== undefined) roleTitle.systemRole = input.systemRole;
    if (input.description !== undefined) roleTitle.description = input.description;
    if (input.isActive !== undefined) roleTitle.isActive = input.isActive;

    await roleTitle.save();
    return toRoleTitleResponse(roleTitle);
  },

  deleteRoleTitle: async ({ id }: any, context: any) => {
    const userId = requireAuth(context)?.userId || context.user?.id;

    // Check if user has permission
    const currentUser = await User.findById(userId);

    if (!currentUser || !['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(currentUser.role)) {
      throw new Error('Unauthorized: Only admins can delete role titles');
    }

    const roleTitle = await RoleTitle.findById(id);
    if (!roleTitle) return false;

    if (currentUser.role !== 'SUPER_ADMIN' && roleTitle.vendorId.toString() !== currentUser.vendorId?.toString()) {
      throw new Error('Unauthorized');
    }

    const result = await RoleTitle.findByIdAndDelete(id);
    return !!result;
  }
};
