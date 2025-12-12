import mongoose, { Schema } from 'mongoose';

const DeletedPropertySchema = new Schema(
  {
    originalId: { type: Schema.Types.ObjectId, required: true },
    vendorId: { type: Schema.Types.ObjectId, index: true },
    assignedAgentId: { type: Schema.Types.ObjectId },
    address: String,
    price: Number,
    specs: {
      beds: Number,
      baths: Number,
      sqft: Number,
      lotSize: Number
    },
    status: String,
    approvalStatus: String,
    description: String,
    images: [String],
    yearBuilt: Number,
    garage: Number,
    taxes: Number,
    hoaFees: Number,
    amenities: [String],
    documents: [String],
    location: {
      type: { type: String },
      coordinates: [Number]
    },
    deletedAt: { type: Date, default: Date.now },
    deletedBy: { type: Schema.Types.ObjectId },
    reason: { type: String }
  },
  { timestamps: true }
);

const DeletedProperty = mongoose.models.DeletedProperty || mongoose.model('DeletedProperty', DeletedPropertySchema);
export default DeletedProperty;
