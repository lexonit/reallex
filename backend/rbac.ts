import { Response, NextFunction } from 'express';
import { AuthRequest } from './middleware/auth';
import { UserRole } from './models/User';

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return (res as any).status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return (res as any).status(403).json({ 
        message: `Forbidden: Requires one of [${allowedRoles.join(', ')}]` 
      });
    }

    next();
  };
};