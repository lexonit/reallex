import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  PROPERTY_APPROVAL = 'PROPERTY_APPROVAL',
  PROPERTY_REJECTED = 'PROPERTY_REJECTED',
  PROPERTY_APPROVED = 'PROPERTY_APPROVED',
  SYSTEM = 'SYSTEM'
}

export interface INotification extends Document {
  vendorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedPropertyId?: mongoose.Types.ObjectId;
  relatedAgentId?: mongoose.Types.ObjectId;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    default: NotificationType.SYSTEM,
    index: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedPropertyId: { type: Schema.Types.ObjectId, ref: 'Property', index: true },
  relatedAgentId: { type: Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false, index: true },
  actionUrl: { type: String },
  metadata: { type: Schema.Types.Mixed },
}, {
  timestamps: true
});

// Compound index for fast lookups
NotificationSchema.index({ vendorId: 1, userId: 1, isRead: 1 });
NotificationSchema.index({ vendorId: 1, userId: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
