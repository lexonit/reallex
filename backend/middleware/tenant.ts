import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import Vendor from '../models/Vendor';

export const resolveTenant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.vendorId) {
    req.vendorId = req.user.vendorId;
    return next();
  }

  const slug = req.headers['x-tenant-slug'] as string;
  
  if (slug) {
    const vendor = await Vendor.findOne({ slug });
    if (vendor) {
      req.vendorId = vendor._id.toString();
      return next();
    }
  }

  next();
};

export const requireTenant = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.vendorId) {
    return (res as any).status(400).json({ message: 'Tenant context required (x-tenant-slug header or auth)' });
  }
  next();
};