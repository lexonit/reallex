import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  slug: string; // unique identifier for subdomains
  logoUrl?: string;
  theme: {
    primaryColor: string;
    secondaryColor?: string;
  };
  contactEmail: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true },
  logoUrl: { type: String },
  theme: {
    primaryColor: { type: String, default: '#7c3aed' },
    secondaryColor: { type: String, default: '#000000' }
  },
  contactEmail: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);