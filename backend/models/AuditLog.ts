import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  vendorId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  action: string;
  targetModel: string;
  targetId?: mongoose.Types.ObjectId;
  details: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  action: { type: String, required: true }, // e.g., 'CREATE_LEAD', 'UPDATE_PROPERTY'
  targetModel: { type: String }, // e.g., 'Property', 'Lead'
  targetId: { type: Schema.Types.ObjectId },
  details: { type: Schema.Types.Mixed }, // Flexible JSON payload
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Expire logs after 1 year to save space (optional)
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);