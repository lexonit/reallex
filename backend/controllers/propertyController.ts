import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Property, { PropertyStatus } from '../models/Property';
import AuditLog from '../models/AuditLog';

const logAction = async (user: any, action: string, targetId: any, details: any) => {
  await AuditLog.create({
    vendorId: user.vendorId,
    userId: user.userId,
    action,
    targetModel: 'Property',
    targetId,
    details
  });
};

export const createProperty = async (req: any, res: Response) => {
  try {
    const property = await Property.create({
      ...req.body,
      vendorId: req.vendorId,
      assignedAgentId: req.user.userId,
      status: PropertyStatus.DRAFT
    }) as any;

    await logAction(req.user, 'CREATE_PROPERTY', property._id, { initialStatus: 'DRAFT' });
    (res as any).status(201).json(property);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const getProperties = async (req: any, res: Response) => {
  try {
    const query: any = { vendorId: req.vendorId };
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    (res as any).json(properties);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const submitProperty = async (req: any, res: Response) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, vendorId: req.vendorId });
    if (!property) return (res as any).status(404).json({ message: 'Property not found' });

    if (property.status !== PropertyStatus.DRAFT) {
      return (res as any).status(400).json({ message: 'Only drafts can be submitted' });
    }

    property.status = PropertyStatus.SUBMITTED;
    await property.save();
    
    await logAction(req.user, 'SUBMIT_PROPERTY', property._id, { from: 'DRAFT', to: 'SUBMITTED' });
    (res as any).json(property);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const approveProperty = async (req: any, res: Response) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, vendorId: req.vendorId });
    if (!property) return (res as any).status(404).json({ message: 'Property not found' });

    property.status = PropertyStatus.APPROVED;
    await property.save();

    await logAction(req.user, 'APPROVE_PROPERTY', property._id, { approvedBy: req.user.userId });
    (res as any).json(property);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const rejectProperty = async (req: any, res: Response) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, vendorId: req.vendorId });
    if (!property) return (res as any).status(404).json({ message: 'Property not found' });

    property.status = PropertyStatus.REJECTED;
    await property.save();

    await logAction(req.user, 'REJECT_PROPERTY', property._id, { rejectedBy: req.user.userId });
    (res as any).json(property);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};