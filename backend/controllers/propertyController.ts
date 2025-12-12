import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Property, { PropertyStatus } from '../models/Property';
import AuditLog from '../models/AuditLog';
import User, { UserRole } from '../models/User';
import { notifyApprovers } from './approvalController';

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
    const payload = req.body?.input || req.body;
    const {
      address,
      price,
      specs = {},
      description = '',
      images = [],
      yearBuilt,
      garage,
      taxes,
      hoaFees,
      amenities = [],
      documents = [],
      status,
      location
    } = payload || {};

    if (!address || !price) {
      return (res as any).status(400).json({ message: 'address and price are required' });
    }

    // Normalize and validate specs coming from UI
    const normalizedSpecs = {
      beds: Number(specs.beds) || 0,
      baths: Number(specs.baths) || 0,
      sqft: Number(specs.sqft) || 0,
      lotSize: specs.lotSize ? Number(specs.lotSize) : undefined
    };

    const numericOrUndefined = (val: any) => (val !== undefined && val !== null && val !== '' ? Number(val) : undefined);

    // Map UI status to backend enum, default to DRAFT
    const allowedStatuses = new Set(Object.values(PropertyStatus));
    const normalizedStatus = allowedStatuses.has(status) ? status : PropertyStatus.DRAFT;

    // Location is required by schema; default to 0,0 if UI doesn't send it yet
    const normalizedLocation = location?.coordinates?.length === 2
      ? { type: 'Point', coordinates: location.coordinates }
      : { type: 'Point', coordinates: [0, 0] };

    // Check if agent is creating property (not admin)
    const isAgent = req.user?.role === UserRole.SALES_REP || req.user?.role === 'AGENT';

    const property = await Property.create({
      vendorId: req.vendorId,
      assignedAgentId: req.user?.userId,
      address,
      price,
      specs: normalizedSpecs,
      description,
      images,
      yearBuilt: numericOrUndefined(yearBuilt),
      garage: numericOrUndefined(garage),
      taxes: numericOrUndefined(taxes),
      hoaFees: numericOrUndefined(hoaFees),
      amenities: Array.isArray(amenities) ? amenities : [],
      documents: Array.isArray(documents) ? documents : [],
      status: normalizedStatus,
      location: normalizedLocation,
      // If agent created it, set to PENDING approval
      approvalStatus: isAgent ? 'PENDING' : 'APPROVED'
    }) as any;

    // If agent created property, notify admins/managers
    if (isAgent && req.user?.firstName && req.user?.lastName) {
      const agentName = `${req.user.firstName} ${req.user.lastName}`;
      await notifyApprovers(req.vendorId, property._id, req.user.userId, agentName);
    }

    await logAction(req.user, 'CREATE_PROPERTY', property._id, {
      initialStatus: normalizedStatus,
      approvalStatus: isAgent ? 'PENDING' : 'APPROVED'
    });
    (res as any).status(201).json(property);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const getProperties = async (req: any, res: Response) => {
  try {
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const isApprover = req.user?.role === UserRole.VENDOR_ADMIN || req.user?.role === UserRole.MANAGER;
    const query: any = {};

    if (!isSuperAdmin) {
      if (!req.vendorId) {
        return (res as any).status(400).json({ message: 'Tenant context required' });
      }
      query.vendorId = req.vendorId;
    } else if (req.query.vendorId) {
      query.vendorId = req.query.vendorId;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    // For non-admins/managers, only show approved/published properties
    // For admins/managers, show all properties in their vendor
    // For agents, show only their own properties + approved ones
    if (!isApprover && !isSuperAdmin) {
      // Regular user or agent - show only approved/published properties or their own drafts
      const isAgent = req.user?.role === UserRole.SALES_REP || req.user?.role === 'AGENT';
      if (isAgent) {
        query.$or = [
          { approvalStatus: 'APPROVED', status: PropertyStatus.PUBLISHED },
          { assignedAgentId: req.user.userId } // Their own properties
        ];
      } else {
        // Client viewing - only published approved properties
        query.approvalStatus = 'APPROVED';
        query.status = PropertyStatus.PUBLISHED;
      }
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    (res as any).json(properties);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export const submitProperty = async (req: any, res: Response) => {
  try {
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const criteria: any = { _id: req.params.id };
    if (!isSuperAdmin) criteria.vendorId = req.vendorId;

    const property = await Property.findOne(criteria);
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
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const criteria: any = { _id: req.params.id };
    if (!isSuperAdmin) criteria.vendorId = req.vendorId;

    const property = await Property.findOne(criteria);
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
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const criteria: any = { _id: req.params.id };
    if (!isSuperAdmin) criteria.vendorId = req.vendorId;

    const property = await Property.findOne(criteria);
    if (!property) return (res as any).status(404).json({ message: 'Property not found' });

    property.status = PropertyStatus.REJECTED;
    await property.save();

    await logAction(req.user, 'REJECT_PROPERTY', property._id, { rejectedBy: req.user.userId });
    (res as any).json(property);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};