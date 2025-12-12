import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentMethod extends Document {
  vendorId: mongoose.Types.ObjectId;
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER';
  cardLast4: string;
  cardBrand: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'],
      default: 'CREDIT_CARD'
    },
    cardLast4: {
      type: String,
      required: true
    },
    cardBrand: {
      type: String,
      required: true
    },
    expiryMonth: {
      type: Number
    },
    expiryYear: {
      type: Number
    },
    isDefault: {
      type: Boolean,
      default: false
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
paymentMethodSchema.index({ vendorId: 1, isDefault: 1 });

export const PaymentMethod = mongoose.model<IPaymentMethod>('PaymentMethod', paymentMethodSchema);
