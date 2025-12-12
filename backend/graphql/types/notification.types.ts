export const notificationTypes = `
  type Notification {
    _id: ID!
    vendorId: ID!
    userId: ID!
    type: NotificationType!
    title: String!
    message: String!
    relatedPropertyId: ID
    relatedAgentId: ID
    isRead: Boolean!
    actionUrl: String
    metadata: String
    createdAt: String!
    updatedAt: String!
  }

  enum NotificationType {
    PROPERTY_APPROVAL
    PROPERTY_REJECTED
    PROPERTY_APPROVED
    SYSTEM
  }

  type ApprovalStatus {
    propertyId: ID!
    approvalStatus: String!
    approvedBy: User
    approvalDate: String
    rejectionReason: String
  }

  input NotificationFilterInput {
    type: NotificationType
    isRead: Boolean
    unreadOnly: Boolean
  }
`;

export const notificationQueries = `
  getNotifications(filter: NotificationFilterInput): [Notification!]!
  getUnreadNotifications: [Notification!]!
  getPendingApprovals: [Property!]!
  getPropertyApprovalStatus(propertyId: ID!): ApprovalStatus!
`;

export const notificationMutations = `
  markNotificationAsRead(notificationId: ID!): Notification!
  approvePropertyForListing(propertyId: ID!): Property!
  rejectPropertySubmission(propertyId: ID!, reason: String!): Property!
`;
