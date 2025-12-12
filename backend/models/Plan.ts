import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  name: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  displayName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  maxUsers: number;
  maxProperties: number;
  maxTemplates: number;
  supportLevel: 'EMAIL' | 'PRIORITY' | 'DEDICATED';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      enum: ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
      required: true,
      unique: true,
      index: true
    },
    displayName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    monthlyPrice: {
      type: Number,
      required: true,
      default: 0
    },
    yearlyPrice: {
      type: Number,
      required: true,
      default: 0
    },
    features: [
      {
        type: String
      }
    ],
    maxUsers: {
      type: Number,
      required: true,
      default: 5
    },
    maxProperties: {
      type: Number,
      required: true,
      default: 10
    },
    maxTemplates: {
      type: Number,
      required: true,
      default: 3
    },
    supportLevel: {
      type: String,
      enum: ['EMAIL', 'PRIORITY', 'DEDICATED'],
      default: 'EMAIL'
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const Plan = mongoose.model<IPlan>('Plan', planSchema);
