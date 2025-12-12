import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  vendorId: mongoose.Types.ObjectId;
  subscriptionId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'FAILED' | 'CANCELLED';
  billDate: Date;
  dueDate: Date;
  paidDate?: Date;
  description: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SENT', 'PAID', 'FAILED', 'CANCELLED'],
      default: 'DRAFT'
    },
    billDate: {
      type: Date,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: {
      type: Date
    },
    description: {
      type: String,
      required: true
    },
    lineItems: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        amount: Number
      }
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    tax: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    pdfUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
invoiceSchema.index({ vendorId: 1, status: 1 });
invoiceSchema.index({ vendorId: 1, billDate: -1 });

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
