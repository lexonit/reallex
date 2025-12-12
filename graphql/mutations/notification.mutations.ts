// Notification & Approval-related mutations
export const MARK_NOTIFICATION_AS_READ_MUTATION = `
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      _id
      isRead
      updatedAt
    }
  }
`;

export const APPROVE_PROPERTY_FOR_LISTING_MUTATION = `
  mutation ApprovePropertyForListing($propertyId: ID!) {
    approvePropertyForListing(propertyId: $propertyId) {
      _id
      address
      price
      approvalStatus
      status
      approvalDate
      approvedBy
      createdAt
      updatedAt
    }
  }
`;

export const REJECT_PROPERTY_SUBMISSION_MUTATION = `
  mutation RejectPropertySubmission($propertyId: ID!, $reason: String!) {
    rejectPropertySubmission(propertyId: $propertyId, reason: $reason) {
      _id
      address
      price
      approvalStatus
      status
      rejectionReason
      createdAt
      updatedAt
    }
  }
`;
