import mongoose, { Document, Schema } from 'mongoose';

export interface IRoleTitle extends Document {
  title: string;
  systemRole: 'SUPER_ADMIN' | 'VENDOR_ADMIN' | 'MANAGER' | 'SALES_REP' | 'CLIENT';
  description?: string;
  vendorId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleTitleSchema = new Schema<IRoleTitle>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    systemRole: {
      type: String,
      required: true,
      enum: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'MANAGER', 'SALES_REP', 'CLIENT']
    },
    description: {
      type: String,
      trim: true
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
roleTitleSchema.index({ vendorId: 1, isActive: 1 });

export const RoleTitle = mongoose.model<IRoleTitle>('RoleTitle', roleTitleSchema);
