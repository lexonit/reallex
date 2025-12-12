import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  name: string;
  slug: 'solo-agent' | 'brokerage' | 'enterprise';
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: {
    maxUsers: number;
    maxProperties: number;
    maxLeads: number;
    maxDeals: number;
    maxStorage: number; // in GB
    customBranding: boolean;
    apiAccess: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customIntegrations: boolean;
  };
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      enum: ['solo-agent', 'brokerage', 'enterprise']
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    billingCycle: { 
      type: String, 
      required: true, 
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    features: {
      maxUsers: { type: Number, required: true, min: 1 },
      maxProperties: { type: Number, required: true, min: 0 },
      maxLeads: { type: Number, required: true, min: 0 },
      maxDeals: { type: Number, required: true, min: 0 },
      maxStorage: { type: Number, required: true, min: 1 },
      customBranding: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
      advancedAnalytics: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
      customIntegrations: { type: Boolean, default: false }
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

SubscriptionPlanSchema.index({ slug: 1, isActive: 1 });
SubscriptionPlanSchema.index({ displayOrder: 1 });

export default mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
