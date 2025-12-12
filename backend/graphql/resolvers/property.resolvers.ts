import Property, { IProperty } from '../../models/Property';
import DeletedProperty from '../../models/DeletedProperty';
import User from '../../models/User';
import { UserRole } from '../../models/User';

const requireAuth = (context: any) => {
  if (!context?.user) throw new Error('Unauthorized');
  return context.user;
};

export const propertyResolvers = {
  // Field resolvers
  'Property.assignedAgent': async ({ assignedAgentId, vendorId }: any, _args: any, context: any) => {
    const user = requireAuth(context);
    console.log('🔍 Resolving assignedAgent for property', { assignedAgentId, vendorId, userRole: user.role });
    if (!assignedAgentId) return null;
    // Fetch agent details
    const agent = await User.findById(assignedAgentId);
    if (!agent) return null;
    // Enforce tenant boundary using the property's vendorId (parent), not agent record
    if (user.role !== UserRole.SUPER_ADMIN && vendorId && vendorId.toString() !== user.vendorId) {
      return null;
    }
    return {
      _id: agent._id?.toString(),
      email: agent.email,
      firstName: (agent as any).firstName,
      lastName: (agent as any).lastName,
      role: (agent as any).role,
      vendorId: agent.vendorId?.toString(),
      isActive: (agent as any).isActive,
      createdAt: agent.createdAt?.toISOString?.(),
      updatedAt: agent.updatedAt?.toISOString?.()
    };
  },
  // Queries
  properties: async ({ filter }: any, context: any) => {
    const user = requireAuth(context);
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const query: any = {};
    
    if (filter) {
      if (filter.status) query.status = filter.status;
      if (filter.minPrice) query.price = { ...query.price, $gte: filter.minPrice };
      if (filter.maxPrice) query.price = { ...query.price, $lte: filter.maxPrice };
      if (filter.minBeds) query['specs.beds'] = { ...query['specs.beds'], $gte: filter.minBeds };
      if (filter.maxBeds) query['specs.beds'] = { ...query['specs.beds'], $lte: filter.maxBeds };
      if (filter.assignedAgentId) query.assignedAgentId = filter.assignedAgentId;
      if (isSuperAdmin && filter.vendorId) query.vendorId = filter.vendorId;
    }

    if (!isSuperAdmin) {
      query.vendorId = user.vendorId;
    }

    const properties = await Property.find(query)
      .populate('assignedAgentId', 'firstName lastName email vendorId')
      .sort({ createdAt: -1 });

    return properties.map((p: any) => ({
      ...p.toObject(),
      _id: p._id?.toString(),
      vendorId: p.vendorId?.toString(),
      assignedAgentId: p.assignedAgentId?._id?.toString?.() ?? p.assignedAgentId?.toString?.(),
      assignedAgent: p.assignedAgentId
        ? {
            _id: p.assignedAgentId._id?.toString?.() ?? p.assignedAgentId.toString?.(),
            email: p.assignedAgentId.email,
            firstName: (p.assignedAgentId as any).firstName,
            lastName: (p.assignedAgentId as any).lastName
          }
        : null,
      createdAt: p.createdAt?.toISOString?.(),
      updatedAt: p.updatedAt?.toISOString?.()
    }));
  },

  property: async ({ id }: any, context: any) => {
    const user = requireAuth(context);
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const property = await Property.findById(id)
      .populate('assignedAgentId', 'firstName lastName email vendorId');
    if (!property) return null;

    if (!isSuperAdmin && property.vendorId?.toString() !== user.vendorId) {
      throw new Error('Forbidden');
    }

    return {
      ...property.toObject(),
      _id: property._id?.toString(),
      vendorId: property.vendorId?.toString(),
      assignedAgentId: property.assignedAgentId?._id?.toString?.() ?? property.assignedAgentId?.toString?.(),
      assignedAgent: (property as any).assignedAgentId
        ? {
            _id: (property as any).assignedAgentId._id?.toString?.() ?? (property as any).assignedAgentId.toString?.(),
            email: (property as any).assignedAgentId.email,
            firstName: (property as any).assignedAgentId.firstName,
            lastName: (property as any).assignedAgentId.lastName
          }
        : null,
      createdAt: property.createdAt?.toISOString?.(),
      updatedAt: property.updatedAt?.toISOString?.()
    };
  },

  // Mutations
  createProperty: async ({ input }: any, context: any) => {
    const user = requireAuth(context);
    const payload = input || {};
    const { location, status, specs = {} } = payload;

    const normalizedSpecs = {
      beds: Number(specs.beds) || 0,
      baths: Number(specs.baths) || 0,
      sqft: Number(specs.sqft) || 0,
      lotSize: specs.lotSize ? Number(specs.lotSize) : undefined
    };

    const normalizedLocation = location?.coordinates?.length === 2
      ? { type: 'Point', coordinates: location.coordinates }
      : { type: 'Point', coordinates: [0, 0] };

    // Use vendorId from user context; super admins may explicitly set vendorId
    const vendorId = user.role === UserRole.SUPER_ADMIN
      ? (payload.vendorId || user.vendorId)
      : user.vendorId;

    if (!vendorId) {
      throw new Error('Tenant context missing for property creation');
    }
    
    const created = await Property.create({
      ...payload,
      specs: normalizedSpecs,
      status: status || 'DRAFT',
      location: normalizedLocation,
      vendorId,
      assignedAgentId: user?.userId || payload.assignedAgentId
    } as any);
    const property = (Array.isArray(created) ? created[0] : created) as IProperty | undefined;
    if (!property) throw new Error('Failed to create property');
    return {
      _id: property._id.toString(),
      address: property.address,
      price: property.price,
      specs: property.specs,
      yearBuilt: property.yearBuilt,
      garage: property.garage,
      taxes: property.taxes,
      hoaFees: property.hoaFees,
      amenities: property.amenities,
      documents: property.documents,
      status: property.status,
      approvalStatus: (property as any).approvalStatus,
      description: property.description,
      images: property.images,
      location: property.location,
      vendorId: property.vendorId?.toString(),
      assignedAgentId: property.assignedAgentId?.toString(),
      createdAt: property.createdAt?.toISOString(),
      updatedAt: property.updatedAt?.toISOString()
    };
  },

  updateProperty: async ({ id, input }: any, context: any) => {
    const user = requireAuth(context);
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const updates: any = { ...input };
    if (input?.specs) {
      updates.specs = {
        beds: input.specs.beds,
        baths: input.specs.baths,
        sqft: input.specs.sqft,
        lotSize: input.specs.lotSize
      };
    }
    if (input?.location) {
      updates.location = input.location.coordinates?.length === 2
        ? { type: 'Point', coordinates: input.location.coordinates }
        : undefined;
    }
    const existing = await Property.findById(id);
    if (!existing) throw new Error('Property not found');

    if (!isSuperAdmin && existing.vendorId?.toString() !== user.vendorId) {
      throw new Error('Forbidden');
    }

    const property = await Property.findByIdAndUpdate(id, updates, { new: true }) as IProperty | null;
    if (!property) throw new Error('Property not found');

    return {
      _id: property._id.toString(),
      address: property.address,
      price: property.price,
      specs: property.specs,
      status: property.status,
      description: property.description,
      images: property.images,
      location: property.location,
      vendorId: property.vendorId?.toString(),
      assignedAgentId: property.assignedAgentId?.toString(),
      createdAt: property.createdAt?.toISOString(),
      updatedAt: property.updatedAt?.toISOString()
    };
  },

  deleteProperty: async ({ id, reason }: any, context: any) => {
    const user = requireAuth(context);
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const property = await Property.findById(id);
    if (!property) return false;

    if (!isSuperAdmin && property.vendorId?.toString() !== user.vendorId) {
      throw new Error('Forbidden');
    }

    // Archive into DeletedProperty collection before removal
    try {
      await DeletedProperty.create({
        originalId: property._id,
        vendorId: property.vendorId,
        assignedAgentId: property.assignedAgentId,
        address: property.address,
        price: property.price,
        specs: property.specs as any,
        status: property.status,
        approvalStatus: (property as any).approvalStatus,
        description: property.description,
        images: property.images,
        yearBuilt: property.yearBuilt,
        garage: property.garage,
        taxes: property.taxes,
        hoaFees: property.hoaFees,
        amenities: property.amenities,
        documents: property.documents as any,
        location: property.location as any,
        deletedBy: user.userId,
        reason: reason || 'Admin initiated deletion'
      } as any);
    } catch (e) {
      // If archiving fails, still proceed to delete to avoid orphaned records
      console.error('Failed to archive deleted property:', e);
    }

    const result = await Property.findByIdAndDelete(id);
    return !!result;
  }
};
