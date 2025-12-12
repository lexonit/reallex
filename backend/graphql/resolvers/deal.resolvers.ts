import DealModel, { DealStageEnum } from '../../models/Deal';
import { Types } from 'mongoose';

function toUiStage(stage: DealStageEnum | string): string {
  const map: Record<string, string> = {
    QUALIFICATION: 'QUALIFICATION',
    PROPOSAL: 'PROPOSAL',
    NEGOTIATION: 'NEGOTIATION',
    CLOSING: 'CLOSING',
    WON: 'WON',
    LOST: 'LOST'
  };
  return map[stage as string] || 'QUALIFICATION';
}

export const dealResolvers = {
  // Queries
  deals: async ({ filter }: any, context: any) => {
    const query: any = {};
    if (filter?.stage) query.stage = filter.stage;
    if (filter?.assignedAgentId) query.assignedAgentId = new Types.ObjectId(filter.assignedAgentId);
    if (filter?.vendorId) query.vendorId = new Types.ObjectId(filter.vendorId);
    if (filter?.minValue || filter?.maxValue) {
      query.value = {};
      if (filter.minValue) query.value.$gte = filter.minValue;
      if (filter.maxValue) query.value.$lte = filter.maxValue;
    }
    const docs = await DealModel.find(query).sort({ updatedAt: -1 });
    return docs.map(d => ({
      _id: d._id.toString(),
      name: d.name,
      value: d.value,
      stage: toUiStage(d.stage),
      closeDate: d.closeDate ? d.closeDate.toISOString() : null,
      probability: d.probability ?? 0,
      leadId: d.leadId?.toString() || null,
      propertyId: d.propertyId?.toString() || null,
      assignedAgentId: d.assignedAgentId?.toString() || null,
      vendorId: d.vendorId.toString(),
      notes: d.notes || null,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString()
    }));
  },
  deal: async ({ id }: any) => {
    const d = await DealModel.findById(id);
    if (!d) return null;
    return {
      _id: d._id.toString(),
      name: d.name,
      value: d.value,
      stage: toUiStage(d.stage),
      closeDate: d.closeDate ? d.closeDate.toISOString() : null,
      probability: d.probability ?? 0,
      leadId: d.leadId?.toString() || null,
      propertyId: d.propertyId?.toString() || null,
      assignedAgentId: d.assignedAgentId?.toString() || null,
      vendorId: d.vendorId.toString(),
      notes: d.notes || null,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString()
    };
  },

  // Mutations
  createDeal: async ({ input }: any, context: any) => {
    // Check subscription limits
    const { checkGraphQLSubscriptionLimit } = await import('../../middleware/subscription');
    await checkGraphQLSubscriptionLimit(context, 'deal');
    
    const doc = await DealModel.create({
      vendorId: new Types.ObjectId(context.vendorId),
      ownerId: new Types.ObjectId(context.userId),
      assignedAgentId: input.assignedAgentId ? new Types.ObjectId(input.assignedAgentId) : undefined,
      leadId: input.leadId ? new Types.ObjectId(input.leadId) : undefined,
      propertyId: input.propertyId ? new Types.ObjectId(input.propertyId) : undefined,
      name: input.name,
      value: input.value,
      stage: input.stage || DealStageEnum.QUALIFICATION,
      probability: input.probability ?? 0,
      closeDate: input.closeDate ? new Date(input.closeDate) : undefined,
      notes: input.notes
    });
    return {
      _id: doc._id.toString(),
      name: doc.name,
      value: doc.value,
      stage: toUiStage(doc.stage),
      closeDate: doc.closeDate ? doc.closeDate.toISOString() : null,
      probability: doc.probability ?? 0,
      leadId: doc.leadId?.toString() || null,
      propertyId: doc.propertyId?.toString() || null,
      assignedAgentId: doc.assignedAgentId?.toString() || null,
      vendorId: doc.vendorId.toString(),
      notes: doc.notes || null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    };
  },
  updateDeal: async ({ id, input }: any) => {
    const updates: any = { ...input };
    if (input.assignedAgentId) updates.assignedAgentId = new Types.ObjectId(input.assignedAgentId);
    if (input.leadId) updates.leadId = new Types.ObjectId(input.leadId);
    if (input.propertyId) updates.propertyId = new Types.ObjectId(input.propertyId);
    if (input.closeDate) updates.closeDate = new Date(input.closeDate);

    const doc = await DealModel.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) throw new Error('Deal not found');
    return {
      _id: doc._id.toString(),
      name: doc.name,
      value: doc.value,
      stage: toUiStage(doc.stage),
      closeDate: doc.closeDate ? doc.closeDate.toISOString() : null,
      probability: doc.probability ?? 0,
      leadId: doc.leadId?.toString() || null,
      propertyId: doc.propertyId?.toString() || null,
      assignedAgentId: doc.assignedAgentId?.toString() || null,
      vendorId: doc.vendorId.toString(),
      notes: doc.notes || null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    };
  },
  deleteDeal: async ({ id }: any) => {
    const res = await DealModel.findByIdAndDelete(id);
    return !!res;
  }
};
