import Notification from '../../models/Notification';
import Property from '../../models/Property';
import User from '../../models/User';
import { UserRole } from '../../models/User';
import { requireAuth, requireApprovalRole, extractAuthContext, shouldSeeAllRecords, isApprover } from '../utils/auth';

export const notificationResolvers = {
  Query: {
    getNotifications: async (_args: any, context: any) => {
      const { filter } = _args;
      const user = requireAuth(context);
      const { vendorId } = extractAuthContext(context);
      const seeAll = shouldSeeAllRecords(context);

      const query: any = { userId: user.userId };

      if (!seeAll) {
        query.vendorId = vendorId;
      }

      if (filter?.type) query.type = filter.type;
      if (filter?.isRead !== undefined) query.isRead = filter.isRead;
      if (filter?.unreadOnly) query.isRead = false;

      console.log('✅ getNotifications: Fetching notifications', { userId: user.userId, filters: filter });

      return Notification.find(query)
        .populate('relatedPropertyId')
        .populate('relatedAgentId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(50);
    },

    getUnreadNotifications: async (_args: any, context: any) => {
      const user = requireAuth(context);
      const { vendorId } = extractAuthContext(context);
      const seeAll = shouldSeeAllRecords(context);

      const query: any = { userId: user.userId, isRead: false };

      if (!seeAll) {
        query.vendorId = vendorId;
      }

      console.log('✅ getUnreadNotifications: Fetching unread notifications', { userId: user.userId });

      return Notification.find(query)
        .populate('relatedPropertyId')
        .populate('relatedAgentId')
        .sort({ createdAt: -1 });
    },

    getPendingApprovals: async (_args: any, context: any) => {
      const user = requireApprovalRole(context);
      const { vendorId } = extractAuthContext(context);
      const seeAll = shouldSeeAllRecords(context);

      const query: any = { approvalStatus: 'PENDING' };

      if (!seeAll) {
        query.vendorId = vendorId;
      }

      console.log('✅ getPendingApprovals: Query', { query, userRole: user.role, seeAll, vendorId });

      // Populate agent to surface details while keeping assignedAgentId as ID scalar
      const properties = await Property.find(query)
        .populate('assignedAgentId', 'firstName lastName email vendorId')
        .sort({ createdAt: -1 });

      // Normalize IDs and attach assignedAgent object for GraphQL
      return properties.map((p: any) => ({
        ...p.toObject(),
        assignedAgentId: p.assignedAgentId?._id?.toString?.() ?? p.assignedAgentId?.toString?.(),
        assignedAgent: p.assignedAgentId
          ? {
              _id: p.assignedAgentId._id?.toString?.() ?? p.assignedAgentId.toString?.(),
              email: p.assignedAgentId.email,
              firstName: (p.assignedAgentId as any).firstName,
              lastName: (p.assignedAgentId as any).lastName
            }
          : null
      }));
             
    },

    getPropertyApprovalStatus: async (_args: any, context: any) => {
      const { propertyId } = _args;
      const user = requireAuth(context);
      const { vendorId } = extractAuthContext(context);
      const seeAll = shouldSeeAllRecords(context);

      const criteria: any = { _id: propertyId };
      if (!seeAll) {
        criteria.vendorId = vendorId;
      }

      console.log('✅ getPropertyApprovalStatus: Fetching approval status', { propertyId, userRole: user.role });

      const property = await Property.findOne(criteria).populate('approvedBy', 'firstName lastName email');

      if (!property) throw new Error('Property not found');

      return {
        propertyId: property._id,
        approvalStatus: property.approvalStatus,
        approvedBy: property.approvedBy,
        approvalDate: property.approvalDate,
        rejectionReason: property.rejectionReason
      };
    }
  },

  Mutation: {
    markNotificationAsRead: async (_args: any, context: any) => {
      const { notificationId } = _args;
      const user = requireAuth(context);

      const notification = await Notification.findOne({
        _id: notificationId,
        userId: user.userId
      });

      if (!notification) throw new Error('Notification not found');

      console.log('✅ markNotificationAsRead: Marking notification as read', { notificationId });

      notification.isRead = true;
      await notification.save();

      return notification;
    },

    approvePropertyForListing: async (_args: any, context: any) => {
      const { propertyId } = _args;
      const user = requireApprovalRole(context);
      const { vendorId } = extractAuthContext(context);
      const seeAll = isApprover(context);

      const criteria: any = { _id: propertyId };
      if (!seeAll) criteria.vendorId = vendorId;

      const property = await Property.findOne(criteria);
      if (!property) throw new Error('Property not found');

      if (property.approvalStatus !== 'PENDING') {
        throw new Error('Only pending properties can be approved');
      }

      console.log('✅ approvePropertyForListing: Approving property', { propertyId, approvedBy: user.userId, userRole: user.role });

      property.approvalStatus = 'APPROVED';
      property.approvedBy = user.userId;
      property.approvalDate = new Date();
      property.status = 'PUBLISHED';

      await property.save();

      // Notify agent
      if (property.assignedAgentId) {
        await Notification.create({
          vendorId,
          userId: property.assignedAgentId,
          type: 'PROPERTY_APPROVED',
          title: 'Property Approved',
          message: 'Your submitted property has been approved and is now live!',
          relatedPropertyId: property._id,
          actionUrl: `/properties/${property._id}`,
          isRead: false
        });
      }

      return property;
    },

    rejectPropertySubmission: async (_args: any, context: any) => {
      const { propertyId, reason } = _args;
      const user = requireApprovalRole(context);
      const { vendorId } = extractAuthContext(context);
      const seeAll = shouldSeeAllRecords(context);

      if (!reason) throw new Error('Rejection reason is required');

      const criteria: any = { _id: propertyId };
      if (!seeAll) criteria.vendorId = vendorId;

      const property = await Property.findOne(criteria);
      if (!property) throw new Error('Property not found');

      if (property.approvalStatus !== 'PENDING') {
        throw new Error('Only pending properties can be rejected');
      }

      console.log('✅ rejectPropertySubmission: Rejecting property', { propertyId, rejectedBy: user.userId, userRole: user.role });

      property.approvalStatus = 'REJECTED';
      property.rejectionReason = reason;
      property.status = 'DRAFT';

      await property.save();

      // Notify agent
      if (property.assignedAgentId) {
        await Notification.create({
          vendorId,
          userId: property.assignedAgentId,
          type: 'PROPERTY_REJECTED',
          title: 'Property Rejected',
          message: `Your submitted property was rejected. Reason: ${reason}`,
          relatedPropertyId: property._id,
          actionUrl: `/properties/${property._id}/edit`,
          isRead: false
        });
      }

      return property;
    }
  }
};
