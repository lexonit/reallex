import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Property, { PropertyStatus } from '../models/Property';
import Notification, { NotificationType } from '../models/Notification';
import User, { UserRole } from '../models/User';
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

/**
 * Notify admins and managers about new property approval request
 */
const notifyApprovers = async (vendorId: any, propertyId: any, agentId: any, agentName: string) => {
  try {
    // Find all VENDOR_ADMIN and MANAGER users for this vendor
    const approvers = await User.find({
      vendorId,
      role: { $in: [UserRole.VENDOR_ADMIN, UserRole.MANAGER] },
      isActive: true
    });

    const notifications = approvers.map(approver => ({
      vendorId,
      userId: approver._id,
      type: NotificationType.PROPERTY_APPROVAL,
      title: 'New Property Approval Required',
      message: `Agent ${agentName} has submitted a new property for approval. Please review and approve/reject.`,
      relatedPropertyId: propertyId,
      relatedAgentId: agentId,
      actionUrl: `/properties/${propertyId}/review`,
      isRead: false
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Failed to create approval notifications:', error);
  }
};

/**
 * Notify agent about property approval
 */
const notifyAgentApproved = async (vendorId: any, agentId: any, propertyId: any) => {
  try {
    await Notification.create({
      vendorId,
      userId: agentId,
      type: NotificationType.PROPERTY_APPROVED,
      title: 'Property Approved',
      message: 'Your submitted property has been approved and is now live!',
      relatedPropertyId: propertyId,
      actionUrl: `/properties/${propertyId}`,
      isRead: false
    });
  } catch (error) {
    console.error('Failed to create approval notification:', error);
  }
};

/**
 * Notify agent about property rejection
 */
const notifyAgentRejected = async (vendorId: any, agentId: any, propertyId: any, reason: string) => {
  try {
    await Notification.create({
      vendorId,
      userId: agentId,
      type: NotificationType.PROPERTY_REJECTED,
      title: 'Property Rejected',
      message: `Your submitted property was rejected. Reason: ${reason}`,
      relatedPropertyId: propertyId,
      actionUrl: `/properties/${propertyId}/edit`,
      isRead: false
    });
  } catch (error) {
    console.error('Failed to create rejection notification:', error);
  }
};

/**
 * Approve a property for listing
 */
export const approvePropertyForListing = async (req: any, res: Response) => {
  try {
    const isSuperAdmin = req.user?.role === UserRole.SUPER_ADMIN;
    const isApprover = req.user?.role === UserRole.VENDOR_ADMIN || req.user?.role === UserRole.MANAGER;

    if (!isSuperAdmin && !isApprover) {
      return (res as any).status(403).json({ message: 'Only admins and managers can approve properties' });
    }

    const criteria: any = { _id: req.params.id };
    if (!isSuperAdmin) criteria.vendorId = req.vendorId;

    const property = await Property.findOne(criteria).populate('assignedAgentId', 'firstName lastName email');
    if (!property) {
      return (res as any).status(404).json({ message: 'Property not found' });
    }

    if (property.approvalStatus !== 'PENDING') {
      return (res as any).status(400).json({ message: 'Only pending properties can be approved' });
    }

    // Update property approval
    property.approvalStatus = 'APPROVED';
    property.approvedBy = req.user.userId;
    property.approvalDate = new Date();
    property.status = PropertyStatus.PUBLISHED; // Make it publicly visible
    await property.save();

    // Notify agent about approval
    if (property.assignedAgentId) {
      await notifyAgentApproved(req.vendorId, property.assignedAgentId._id, property._id);
    }

    await logAction(req.user, 'APPROVE_PROPERTY_FOR_LISTING', property._id, {
      approvedBy: req.user.userId,
      agentId: property.assignedAgentId?._id
    });

    (res as any).json(property);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

/**
 * Reject a property with reason
 */
export const rejectPropertySubmission = async (req: any, res: Response) => {
  try {
    const isSuperAdmin = req.user?.role === UserRole.SUPER_ADMIN;
    const isApprover = req.user?.role === UserRole.VENDOR_ADMIN || req.user?.role === UserRole.MANAGER;

    if (!isSuperAdmin && !isApprover) {
      return (res as any).status(403).json({ message: 'Only admins and managers can reject properties' });
    }

    const { reason } = req.body;
    if (!reason) {
      return (res as any).status(400).json({ message: 'Rejection reason is required' });
    }

    const criteria: any = { _id: req.params.id };
    if (!isSuperAdmin) criteria.vendorId = req.vendorId;

    const property = await Property.findOne(criteria).populate('assignedAgentId', 'firstName lastName email');
    if (!property) {
      return (res as any).status(404).json({ message: 'Property not found' });
    }

    if (property.approvalStatus !== 'PENDING') {
      return (res as any).status(400).json({ message: 'Only pending properties can be rejected' });
    }

    // Update property rejection
    property.approvalStatus = 'REJECTED';
    property.rejectionReason = reason;
    property.status = PropertyStatus.DRAFT; // Revert to draft
    await property.save();

    // Notify agent about rejection
    if (property.assignedAgentId) {
      await notifyAgentRejected(req.vendorId, property.assignedAgentId._id, property._id, reason);
    }

    await logAction(req.user, 'REJECT_PROPERTY_SUBMISSION', property._id, {
      rejectedBy: req.user.userId,
      reason,
      agentId: property.assignedAgentId?._id
    });

    (res as any).json(property);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

/**
 * Get notifications for current user
 */
export const getNotifications = async (req: any, res: Response) => {
  try {
    const isSuperAdmin = req.user?.role === UserRole.SUPER_ADMIN;
    const query: any = { userId: req.user.userId };
    
    if (!isSuperAdmin) {
      query.vendorId = req.vendorId;
    } else if (req.query.vendorId) {
      query.vendorId = req.query.vendorId;
    }

    const unreadOnly = req.query.unreadOnly === 'true';
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('relatedPropertyId', 'address price')
      .populate('relatedAgentId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(50);

    (res as any).json(notifications);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (req: any, res: Response) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!notification) {
      return (res as any).status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    (res as any).json(notification);
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

/**
 * Get approval status of a property
 */
export const getPropertyApprovalStatus = async (req: any, res: Response) => {
  try {
    const isSuperAdmin = req.user?.role === UserRole.SUPER_ADMIN;
    const criteria: any = { _id: req.params.id };
    if (!isSuperAdmin) criteria.vendorId = req.vendorId;

    const property = await Property.findOne(criteria).populate('approvedBy', 'firstName lastName email');
    if (!property) {
      return (res as any).status(404).json({ message: 'Property not found' });
    }

    (res as any).json({
      propertyId: property._id,
      approvalStatus: property.approvalStatus,
      approvedBy: property.approvedBy,
      approvalDate: property.approvalDate,
      rejectionReason: property.rejectionReason
    });
  } catch (error: any) {
    (res as any).status(500).json({ message: error.message });
  }
};

export { notifyApprovers };
