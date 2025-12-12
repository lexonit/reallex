import mongoose, { Schema, Document } from 'mongoose';

export enum LeadStatusEnum {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}

export interface ILead extends Document {
  vendorId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  assignedAgentId?: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  value?: number;
  source?: string;
  status: LeadStatusEnum;
  notes?: string;
  scheduledViewingDate?: Date;
  scheduledViewingNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedAgentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  value: { type: Number, default: 0 },
  source: { type: String },
  status: { type: String, enum: Object.values(LeadStatusEnum), default: LeadStatusEnum.NEW, index: true },
  notes: { type: String },
  scheduledViewingDate: { type: Date },
  scheduledViewingNotes: { type: String }
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
