import mongoose, { Schema, Document } from 'mongoose';

export enum PropertyStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PUBLISHED = 'PUBLISHED', // Publicly visible
  PENDING = 'PENDING', // Offer accepted / Under contract
  SOLD = 'SOLD',
  ARCHIVED = 'ARCHIVED'
}

export interface IProperty extends Document {
  vendorId: mongoose.Types.ObjectId;
  assignedAgentId?: mongoose.Types.ObjectId;
  address: string;
  description?: string;
  price: number;
  specs: {
    beds: number;
    baths: number;
    sqft: number;
    lotSize?: number;
  };
  status: PropertyStatus;
  images: string[];
  location: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  assignedAgentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  address: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, index: true },
  specs: {
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    sqft: { type: Number, required: true },
    lotSize: { type: Number }
  },
  status: { 
    type: String, 
    enum: Object.values(PropertyStatus), 
    default: PropertyStatus.DRAFT,
    index: true 
  },
  images: [{ type: String }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
}, {
  timestamps: true
});

// Geospatial Index
PropertySchema.index({ location: '2dsphere' });

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);