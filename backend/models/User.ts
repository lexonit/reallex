import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VENDOR_ADMIN = 'VENDOR_ADMIN',
  MANAGER = 'MANAGER',
  SALES_REP = 'SALES_REP'
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  vendorId?: mongoose.Types.ObjectId; // Null for SuperAdmin
  isActive: boolean;
  lastLogin?: Date;
  inviteToken?: string;
  inviteExpires?: Date;
  invitedBy?: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  passwordHash: { type: String, required: true }, // Store bcrypt hash here
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.SALES_REP 
  },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', index: true }, 
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  inviteToken: { type: String, index: true },
  inviteExpires: { type: Date },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Compound index to ensure email is unique, but technically covered by the unique constraint above.
// Indexing vendorId allows fast lookup of "All users for Vendor X"
UserSchema.index({ vendorId: 1, role: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);