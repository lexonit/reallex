/**
 * Centralized authentication utility for GraphQL resolvers
 * Provides consistent authorization checking across all resolvers
 */

import { UserRole } from '../../models/User';

export interface AuthContext {
  user: any;
  userId: string | null;
  vendorId: string | null;
}

/**
 * Verify user is authenticated
 * Throws "Unauthorized" error if not
 */
export const requireAuth = (context: any): any => {
  const user = context?.user;
  const userId = context?.userId || (user && (user as any).userId);
  const vendorId = context?.vendorId || (user && (user as any).vendorId);
  
  console.log('🔐 requireAuth: Checking authentication', {
    hasContext: !!context,
    hasUser: !!user,
    userRole: user?.role,
    userId,
    vendorId,
    userObject: user ? { role: user.role, userId: user.userId, vendorId: user.vendorId } : null
  });
  
  if (!user) {
    console.error('❌ requireAuth: User not authenticated in context', { user, userId, vendorId, contextKeys: Object.keys(context || {}) });
    throw new Error('Unauthorized');
  }
  
  console.log('✅ requireAuth: User authenticated', { userId, role: user?.role, vendorId });
  return user;
};

/**
 * Verify user has admin or manager role
 * Throws error if user doesn't have required role
 */
export const requireApprovalRole = (context: any): any => {
  console.log('🔐 requireApprovalRole: Checking context', { 
    hasUser: !!context?.user, 
    hasUserId: !!context?.userId,
    hasVendorId: !!context?.vendorId,
    userRole: context?.user?.role
  });
  
  const user = requireAuth(context);
  const isApprover = user.role === UserRole.VENDOR_ADMIN || user.role === UserRole.MANAGER;
  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

  if (!isApprover && !isSuperAdmin) {
    console.error('❌ requireApprovalRole: User lacks approval permissions', { role: user.role });
    throw new Error('Only admins and managers can perform this action');
  }

  console.log('✅ requireApprovalRole: User has approval permissions', { role: user.role });
  return user;
};

/**
 * Verify user has admin role only
 * Throws error if user doesn't have admin role
 */
export const requireAdminRole = (context: any): any => {
  const user = requireAuth(context);
  const isAdmin = user.role === UserRole.VENDOR_ADMIN || user.role === UserRole.SUPER_ADMIN;

  if (!isAdmin) {
    console.error('❌ requireAdminRole: User is not an admin', { role: user.role });
    throw new Error('Only admins can perform this action');
  }

  console.log('✅ requireAdminRole: User is an admin', { role: user.role });
  return user;
};

/**
 * Verify user has super admin role only
 * Throws error if user is not a super admin
 */
export const requireSuperAdminRole = (context: any): any => {
  const user = requireAuth(context);
  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

  if (!isSuperAdmin) {
    console.error('❌ requireSuperAdminRole: User is not a super admin', { role: user.role });
    throw new Error('Only super admins can perform this action');
  }

  console.log('✅ requireSuperAdminRole: User is a super admin');
  return user;
};

/**
 * Extract auth context information
 * Safely returns user, userId, and vendorId from context
 */
export const extractAuthContext = (context: any): AuthContext => {
  const user = context?.user;
  const userId = context?.userId || (user && (user as any).userId) || null;
  const vendorId = context?.vendorId || (user && (user as any).vendorId) || null;

  return { user, userId, vendorId };
};

/**
 * Check if user is super admin
 * Returns boolean instead of throwing error
 */
export const isSuperAdmin = (context: any): boolean => {
  const role = context?.role;
  return role === UserRole.SUPER_ADMIN;
};

/**
 * Check if user is approver (admin or manager)
 * Returns boolean instead of throwing error
 */
export const isApprover = (context: any): boolean => {
  const role = context?.role;
  console.log('🔍 isApprover: Checking user role', role);
  return role === UserRole.VENDOR_ADMIN || role === UserRole.MANAGER || role === UserRole.SUPER_ADMIN;
};

/**
 * Determine if user should see all records or only vendor records
 * Returns true if user is SUPER_ADMIN (sees all)
 * Returns false if user is VENDOR_ADMIN/MANAGER (sees only own vendor)
 */
export const shouldSeeAllRecords = (context: any): boolean => {
  const role = context?.role;
  return role === UserRole.SUPER_ADMIN;
};
