import LeadModel from '../../models/Lead';

const requireAuth = (context: any) => {
  const user = context?.user;
  const userId = context?.userId || (user && (user as any).userId);
  const vendorId = context?.vendorId || (user && (user as any).vendorId);
  if (!userId || !vendorId) throw new Error('Unauthorized');
  return user;
};

export const leadResolvers = {
  // Queries
  leads: async ({ filter }: any, context: any) => {
    const user = requireAuth(context);
    const isSuperAdmin = (user as any)?.role === 'SUPER_ADMIN';
    const query: any = {};
    if (filter?.status) query.status = filter.status;
    if (filter?.assignedAgentId) query.assignedAgentId = filter.assignedAgentId;
    if (filter?.source) query.source = filter.source;
    if (!isSuperAdmin) {
      query.vendorId = (user as any).vendorId;
    } else if (filter?.vendorId) {
      query.vendorId = filter.vendorId;
    }
    const docs = await LeadModel.find(query).sort({ updatedAt: -1 });
    return docs.map(l => ({
      _id: l._id.toString(),
      name: l.name,
      email: l.email || '',
      mobile: (l as any).mobile || l.phone || null,
      status: (l as any).status || 'NEW',
      value: Number((l as any).value ?? 0),
      source: l.source || null,
      assignedAgentId: l.assignedAgentId?.toString() || null,
      vendorId: l.vendorId.toString(),
      lastContact: null,
      tags: (l as any).tags || [],
      notes: l.notes || null,
      scheduledViewingDate: (l as any).scheduledViewingDate ? (l as any).scheduledViewingDate.toISOString() : null,
      scheduledViewingNotes: (l as any).scheduledViewingNotes || null,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString()
    }));
  },

  lead: async ({ id }: any, context: any) => {
    const user = requireAuth(context);
    const isSuperAdmin = (user as any)?.role === 'SUPER_ADMIN';
    const l = await LeadModel.findById(id);
    if (!l) return null;
    if (!isSuperAdmin && l.vendorId?.toString() !== (user as any).vendorId) {
      throw new Error('Forbidden');
    }
    return {
      _id: l._id.toString(),
      name: l.name,
      email: l.email || '',
      mobile: (l as any).mobile || l.phone || null,
      status: (l as any).status || 'NEW',
      value: Number((l as any).value ?? 0),
      source: l.source || null,
      assignedAgentId: l.assignedAgentId?.toString() || null,
      vendorId: l.vendorId.toString(),
      lastContact: null,
      tags: (l as any).tags || [],
      notes: l.notes || null,
      scheduledViewingDate: (l as any).scheduledViewingDate ? (l as any).scheduledViewingDate.toISOString() : null,
      scheduledViewingNotes: (l as any).scheduledViewingNotes || null,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString()
    };
  },

  // Mutations
  createLead: async ({ input }: any, context: any) => {
    const user = requireAuth(context);
    
    // Check subscription limits
    const { checkGraphQLSubscriptionLimit } = await import('../../middleware/subscription');
    await checkGraphQLSubscriptionLimit(context, 'lead');
    
    const isSuperAdmin = (user as any)?.role === 'SUPER_ADMIN';
    const doc = await LeadModel.create({
      vendorId: isSuperAdmin ? (input.vendorId || (user as any).vendorId) : (user as any).vendorId,
      ownerId: (user as any).userId,
      assignedAgentId: input.assignedAgentId,
      name: input.name,
      email: input.email,
      phone: input.mobile,
      value: Number(input.value ?? 0),
      source: input.source,
      status: input.status || 'NEW',
      notes: input.notes
    });
    return {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email || '',
      mobile: (doc as any).mobile || doc.phone || null,
      status: (doc as any).status || 'NEW',
      value: Number((doc as any).value ?? 0),
      source: doc.source || null,
      assignedAgentId: doc.assignedAgentId?.toString() || null,
      vendorId: doc.vendorId.toString(),
      lastContact: null,
      tags: (doc as any).tags || [],
      notes: doc.notes || null,
      scheduledViewingDate: (doc as any).scheduledViewingDate ? (doc as any).scheduledViewingDate.toISOString() : null,
      scheduledViewingNotes: (doc as any).scheduledViewingNotes || null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    };
  },

  updateLead: async ({ id, input }: any, context: any) => {
    const user = requireAuth(context);
    const isSuperAdmin = (user as any)?.role === 'SUPER_ADMIN';
    const updates: any = {};
    if (input.assignedAgentId !== undefined) updates.assignedAgentId = input.assignedAgentId;
    if (input.name !== undefined) updates.name = input.name;
    if (input.email !== undefined) updates.email = input.email;
    if (input.mobile !== undefined) updates.phone = input.mobile;
    // Only update value if provided; keep existing value otherwise
    if (input.value !== undefined) {
      const num = Number(input.value);
      if (!Number.isNaN(num)) updates.value = num;
    }
    if (input.source !== undefined) updates.source = input.source;
    if (input.status !== undefined) updates.status = input.status;
    if (input.notes !== undefined) updates.notes = input.notes;
    if (input.scheduledViewingDate !== undefined) updates.scheduledViewingDate = input.scheduledViewingDate;
    if (input.scheduledViewingNotes !== undefined) updates.scheduledViewingNotes = input.scheduledViewingNotes;
    const existing = await LeadModel.findById(id);
    if (!existing) throw new Error('Lead not found');
    if (!isSuperAdmin && existing.vendorId?.toString() !== (user as any).vendorId) {
      throw new Error('Forbidden');
    }
    const doc = await LeadModel.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) throw new Error('Lead not found');
    return {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email || '',
      mobile: (doc as any).mobile || doc.phone || null,
      status: (doc as any).status || 'NEW',
      value: Number((doc as any).value ?? 0),
      source: doc.source || null,
      assignedAgentId: doc.assignedAgentId?.toString() || null,
      vendorId: doc.vendorId.toString(),
      lastContact: null,
      tags: (doc as any).tags || [],
      notes: doc.notes || null,
      scheduledViewingDate: (doc as any).scheduledViewingDate ? (doc as any).scheduledViewingDate.toISOString() : null,
      scheduledViewingNotes: (doc as any).scheduledViewingNotes || null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    };
  },

  deleteLead: async ({ id }: any, context: any) => {
    requireAuth(context);
    const res = await LeadModel.findByIdAndDelete(id);
    return !!res;
  }
};

// Deal resolvers moved to deal.resolvers.ts
