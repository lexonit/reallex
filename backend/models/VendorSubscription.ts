import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorSubscription extends Document {
  vendorId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: 'active' | 'trial' | 'expired' | 'cancelled' | 'suspended';
  startDate: Date;
  endDate: Date;
  trialEndDate?: Date;
  autoRenew: boolean;
  
  // Usage tracking
  currentUsage: {
    activeUsers: number;
    totalProperties: number;
    totalLeads: number;
    totalDeals: number;
    storageUsed: number; // in GB
  };
  
  // Payment info (for future integration)
  paymentMethod?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  
  // Metadata
  notes?: string;
  cancelledAt?: Date;
  cancelReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const VendorSubscriptionSchema: Schema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    status: {
      type: String,
      enum: ['active', 'trial', 'expired', 'cancelled', 'suspended'],
      default: 'trial'
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    trialEndDate: { type: Date },
    autoRenew: { type: Boolean, default: true },
    
    currentUsage: {
      activeUsers: { type: Number, default: 0 },
      totalProperties: { type: Number, default: 0 },
      totalLeads: { type: Number, default: 0 },
      totalDeals: { type: Number, default: 0 },
      storageUsed: { type: Number, default: 0 }
    },
    
    paymentMethod: { type: String },
    lastPaymentDate: { type: Date },
    nextPaymentDate: { type: Date },
    
    notes: { type: String },
    cancelledAt: { type: Date },
    cancelReason: { type: String }
  },
  {
    timestamps: true
  }
);

VendorSubscriptionSchema.index({ vendorId: 1, status: 1 });
VendorSubscriptionSchema.index({ endDate: 1 });
VendorSubscriptionSchema.index({ planId: 1 });

// Method to check if subscription is valid
VendorSubscriptionSchema.methods.isValid = function() {
  return this.status === 'active' || this.status === 'trial';
};

// Method to check if user limit is reached
VendorSubscriptionSchema.methods.canAddUser = async function() {
  const plan = await mongoose.model('SubscriptionPlan').findById(this.planId);
  return this.currentUsage.activeUsers < (plan as any)?.features?.maxUsers;
};

export default mongoose.models.VendorSubscription || mongoose.model<IVendorSubscription>('VendorSubscription', VendorSubscriptionSchema);
