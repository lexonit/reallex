import mongoose, { Schema, Document } from 'mongoose';

export enum DealStageEnum {
  QUALIFICATION = 'QUALIFICATION',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSING = 'CLOSING',
  WON = 'WON',
  LOST = 'LOST'
}

export interface IDeal extends Document {
  vendorId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId; // creator/owner of the deal
  assignedAgentId?: mongoose.Types.ObjectId;
  leadId?: mongoose.Types.ObjectId;
  propertyId?: mongoose.Types.ObjectId;
  name: string;
  value: number; // amount in dollars
  stage: DealStageEnum;
  probability: number; // 0-100
  closeDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedAgentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', index: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', index: true },
  name: { type: String, required: true, index: true },
  value: { type: Number, required: true },
  stage: { type: String, enum: Object.values(DealStageEnum), default: DealStageEnum.QUALIFICATION, index: true },
  probability: { type: Number, default: 0, min: 0, max: 100 },
  closeDate: { type: Date },
  notes: { type: String }
}, {
  timestamps: true
});

export default mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);