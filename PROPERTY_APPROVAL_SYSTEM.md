# Property Approval & Notification System

## Overview
Implemented a comprehensive approval workflow system where properties created by agents require approval from vendor admins/managers before being publicly listed.

## Key Features

### 1. Approval Workflow
- **Agent Properties**: When an agent creates a property, it's automatically set to `PENDING` approval status
- **Admin/Manager Properties**: When admins or managers create properties, they're auto-approved
- **Visibility Control**: Only approved properties are visible to public/clients
- **Agents can see**: Their own properties (all statuses) + approved/published properties
- **Admins/Managers can see**: All properties in their vendor

### 2. Notification System
- **Real-time notifications** sent to admins/managers when agent submits property
- **Agent notifications** when property is approved or rejected
- **Notification types**:
  - `PROPERTY_APPROVAL` - New property awaiting approval
  - `PROPERTY_APPROVED` - Property has been approved
  - `PROPERTY_REJECTED` - Property was rejected with reason

### 3. Database Changes

#### Property Model (`backend/models/Property.ts`)
Added approval tracking fields:
```typescript
approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'  // Default: PENDING
approvedBy: ObjectId  // Reference to User who approved
approvalDate: Date
rejectionReason: String
```

#### Notification Model (`backend/models/Notification.ts`)
New model for tracking notifications:
```typescript
{
  vendorId: ObjectId
  userId: ObjectId
  type: NotificationType
  title: String
  message: String
  relatedPropertyId: ObjectId
  relatedAgentId: ObjectId
  isRead: Boolean  // Default: false
  actionUrl: String
  metadata: Object
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### REST Endpoints (`backend/routes/propertyRoutes.ts`)

#### Approval Management
- `GET /properties/approvals/pending` - Get all pending approval properties (Admin/Manager only)
- `POST /properties/:id/approvals/approve` - Approve a property for listing (Admin/Manager only)
- `POST /properties/:id/approvals/reject` - Reject a property with reason (Admin/Manager only)
  - Body: `{ reason: string }`
- `GET /properties/:id/approvals/status` - Get approval status of property

#### Notifications
- `GET /properties/notifications/list` - Get user's notifications
  - Query params: `?unreadOnly=true`
- `POST /properties/notifications/:id/read` - Mark notification as read

### GraphQL Endpoints

#### Queries
```graphql
# Get notifications for current user
getNotifications(filter: NotificationFilterInput): [Notification!]!

# Get unread notifications only
getUnreadNotifications: [Notification!]!

# Get properties pending approval (Admin/Manager only)
getPendingApprovals: [Property!]!

# Get approval status of a property
getPropertyApprovalStatus(propertyId: ID!): ApprovalStatus!
```

#### Mutations
```graphql
# Mark notification as read
markNotificationAsRead(notificationId: ID!): Notification!

# Approve property for listing (Admin/Manager only)
approvePropertyForListing(propertyId: ID!): Property!

# Reject property with reason (Admin/Manager only)
rejectPropertySubmission(propertyId: ID!, reason: String!): Property!
```

## Controllers

### Approval Controller (`backend/controllers/approvalController.ts`)
Core functions:
- `notifyApprovers()` - Sends notifications to all admins/managers
- `notifyAgentApproved()` - Notifies agent of approval
- `notifyAgentRejected()` - Notifies agent of rejection with reason
- `getPendingApprovals()` - Returns all pending properties
- `approvePropertyForListing()` - Approves and publishes property
- `rejectPropertySubmission()` - Rejects property, reverts to DRAFT
- `getNotifications()` - Gets user's notifications
- `markNotificationAsRead()` - Marks notification as read
- `getPropertyApprovalStatus()` - Returns approval metadata

### Updated Property Controller (`backend/controllers/propertyController.ts`)
- `createProperty()` - Enhanced to:
  - Set `approvalStatus = 'PENDING'` for agent-created properties
  - Set `approvalStatus = 'APPROVED'` for admin/manager-created properties
  - Trigger notifications to admins/managers when agent creates property
  
- `getProperties()` - Enhanced with smart filtering:
  - **Admins/Managers**: See all properties in vendor
  - **Agents**: See their own properties + approved/published properties
  - **Clients**: See only approved/published properties

## Workflow

### Agent Creates Property
```
1. Agent submits property
2. Property saved with approvalStatus = 'PENDING'
3. System finds all VENDOR_ADMIN and MANAGER users
4. Creates notification for each approver
5. Property NOT visible to public until approved
```

### Admin Approves Property
```
1. Admin/Manager clicks "Approve"
2. Property approvalStatus = 'APPROVED'
3. Property status = 'PUBLISHED'
4. Approval metadata saved (approvedBy, approvalDate)
5. Agent receives approval notification
6. Property now visible to public
```

### Admin Rejects Property
```
1. Admin/Manager clicks "Reject" with reason
2. Property approvalStatus = 'REJECTED'
3. Property status reverts to 'DRAFT'
4. Rejection reason saved
5. Agent receives rejection notification with reason
6. Property remains hidden from public
7. Agent can edit and resubmit
```

## Authorization

### Role Permissions

| Action | SALES_REP/AGENT | MANAGER | VENDOR_ADMIN | SUPER_ADMIN |
|--------|----------------|---------|--------------|-------------|
| Create Property | ✅ (Pending) | ✅ (Auto-approved) | ✅ (Auto-approved) | ✅ (Auto-approved) |
| View Own Properties | ✅ | ✅ | ✅ | ✅ |
| View All Vendor Properties | ❌ | ✅ | ✅ | ✅ |
| View Pending Approvals | ❌ | ✅ | ✅ | ✅ |
| Approve Properties | ❌ | ✅ | ✅ | ✅ |
| Reject Properties | ❌ | ✅ | ✅ | ✅ |
| View Notifications | ✅ | ✅ | ✅ | ✅ |

## Frontend Integration Points

### Display Approval Status
```typescript
// Property object now includes:
property.approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
property.approvedBy: userId
property.approvalDate: ISOString
property.rejectionReason: string
```

### Notification Badge
```typescript
// Fetch unread notifications count
GET /properties/notifications/list?unreadOnly=true
// OR
query { getUnreadNotifications { _id } }
```

### Approval Dashboard (Admin/Manager)
```typescript
// Fetch pending approvals
GET /properties/approvals/pending
// OR
query { getPendingApprovals { _id address price assignedAgentId } }
```

### Approve/Reject Actions (Admin/Manager)
```typescript
// Approve
POST /properties/:id/approvals/approve
// OR
mutation { approvePropertyForListing(propertyId: "123") { _id status } }

// Reject
POST /properties/:id/approvals/reject
Body: { reason: "Incomplete listing details" }
// OR
mutation { 
  rejectPropertySubmission(
    propertyId: "123", 
    reason: "Incomplete listing details"
  ) { _id status } 
}
```

## Benefits

✅ **Quality Control**: Ensures all agent-submitted properties are reviewed before going live
✅ **Accountability**: Tracks who approved/rejected and when
✅ **Communication**: Automated notifications keep everyone informed
✅ **Transparency**: Agents know exactly why property was rejected
✅ **Role-Based Access**: Proper security with role-based permissions
✅ **Audit Trail**: All actions logged via AuditLog system

## Testing Checklist

- [ ] Agent creates property → approvalStatus = 'PENDING'
- [ ] Admin/Manager creates property → approvalStatus = 'APPROVED'
- [ ] Admins/Managers receive notification when agent creates property
- [ ] Pending properties NOT visible to public
- [ ] Agents can see their own pending properties
- [ ] Admin can view all pending approvals
- [ ] Admin approves property → status changes to PUBLISHED
- [ ] Agent receives approval notification
- [ ] Approved property visible to all users
- [ ] Admin rejects property with reason
- [ ] Agent receives rejection notification with reason
- [ ] Rejected property reverts to DRAFT status
- [ ] Notification badge shows unread count
- [ ] Mark notification as read updates isRead flag
- [ ] GraphQL queries return proper approval data
- [ ] Authorization prevents agents from approving properties
- [ ] Audit logs capture all approval actions

## Database Indexes

Optimized queries with indexes:
- `Property.approvalStatus` - Fast approval status filtering
- `Notification.vendorId + userId + isRead` - Fast notification queries
- `Notification.vendorId + userId + createdAt` - Sorted notification feeds

## Future Enhancements

- [ ] Bulk approve/reject multiple properties
- [ ] Email notifications in addition to in-app
- [ ] Approval workflow with multiple steps (e.g., Manager → Admin)
- [ ] Commenting system on pending properties
- [ ] Auto-rejection after X days of inactivity
- [ ] Property revision history
- [ ] Approval analytics dashboard
