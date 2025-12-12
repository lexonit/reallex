# GraphQL API Reference - getPendingApprovals

## Overview
The GraphQL API for `getPendingApprovals` is fully implemented and operational in the backend.

## Query: getPendingApprovals

### Location
- **Type Definition**: `backend/graphql/types/notification.types.ts` (line 43)
- **Resolver**: `backend/graphql/resolvers/notification.resolvers.ts` (lines 48-67)
- **Schema Integration**: `backend/graphql/schema/index.ts` (line 70)

### GraphQL Query
```graphql
query GetPendingApprovals {
  getPendingApprovals {
    _id
    address
    price
    specs {
      beds
      baths
      sqft
      lotSize
    }
    status
    description
    images
    yearBuilt
    garage
    taxes
    hoaFees
    amenities
    documents
    assignedAgentId
    vendorId
    approvalStatus
    createdAt
    updatedAt
  }
}
```

### Frontend Query Definition
**File**: `graphql/queries/property.queries.ts` (lines 67-101)

```typescript
export const GET_PENDING_APPROVALS_QUERY = `
  query GetPendingApprovals {
    getPendingApprovals {
      _id
      address
      price
      specs {
        beds
        baths
        sqft
        lotSize
      }
      status
      description
      images
      yearBuilt
      garage
      taxes
      hoaFees
      amenities
      documents
      assignedAgentId
      vendorId
      approvalStatus
      createdAt
      updatedAt
    }
  }
`;
```

## Backend Resolver Implementation

### Function: getPendingApprovals
**File**: `backend/graphql/resolvers/notification.resolvers.ts` (lines 48-67)

```typescript
getPendingApprovals: async (_: any, __: any, context: any) => {
  const { user, vendorId } = context;

  if (!user) throw new Error('Unauthorized');

  const isApprover = user.role === UserRole.VENDOR_ADMIN || user.role === UserRole.MANAGER;
  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

  if (!isApprover && !isSuperAdmin) {
    throw new Error('Only admins and managers can view pending approvals');
  }

  const query: any = { approvalStatus: 'PENDING' };

  if (!isSuperAdmin) {
    query.vendorId = vendorId;
  }

  return Property.find(query)
    .populate('assignedAgentId', 'firstName lastName email')
    .sort({ createdAt: -1 });
}
```

## Features

### Authorization
- ✅ **Role-Based Access Control**: Only `VENDOR_ADMIN` and `MANAGER` users can view pending approvals
- ✅ **Vendor Isolation**: Non-super-admin users only see their own vendor's properties
- ✅ **Super Admin Access**: Super admins can view all pending approvals across vendors

### Data Population
- ✅ **Agent Details**: Returns populated `assignedAgentId` with agent name and email
- ✅ **Sorting**: Results sorted by creation date (newest first)
- ✅ **Approval Status**: Includes `approvalStatus: 'PENDING'` field

### Data Returned
The query returns an array of `Property` objects with:
- Property ID (`_id`)
- Address and pricing information
- Property specs (beds, baths, sqft)
- Status and description
- Images and documents
- Agent information
- Vendor information
- Approval tracking fields
- Timestamps (createdAt, updatedAt)

## How to Use

### From Frontend (React)
```typescript
import { GET_PENDING_APPROVALS_QUERY } from '../../graphql/queries/property.queries';
import { graphqlRequest } from '../../lib/graphql';

const fetchPendingApprovals = async () => {
  try {
    const data = await graphqlRequest(GET_PENDING_APPROVALS_QUERY, {});
    const properties = data.getPendingApprovals;
    // Use properties data...
  } catch (error) {
    console.error('Failed to fetch pending approvals:', error);
  }
};
```

### From GraphiQL UI
1. Navigate to: `http://localhost:5000/graphql`
2. Paste the query:
```graphql
query GetPendingApprovals {
  getPendingApprovals {
    _id
    address
    price
    assignedAgentId
    approvalStatus
    createdAt
  }
}
```
3. Click "Play" to execute

### Using cURL
```bash
curl -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "query { getPendingApprovals { _id address price approvalStatus } }"
  }'
```

## Integration Points

### Frontend Component
**File**: `containers/admin/ApprovalsQueue.tsx`
- Uses: `GET_PENDING_APPROVALS_QUERY`
- Calls: `graphqlRequest(GET_PENDING_APPROVALS_QUERY, {})`
- Displays: Pending properties in approval queue table

### Backend Model
**File**: `backend/models/Property.ts`
- Field: `approvalStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }`
- Query: Filters by `{ approvalStatus: 'PENDING' }`

## Error Handling

| Error | Cause | Resolution |
|-------|-------|-----------|
| `Unauthorized` | User not authenticated | Provide valid Bearer token |
| `Only admins and managers can view pending approvals` | User lacks required role | Use VENDOR_ADMIN or MANAGER account |
| `Property not found` | Invalid property ID | Verify property exists with correct approval status |

## Related APIs

### Other Approval-Related Queries
- `getPropertyApprovalStatus(propertyId: ID!)` - Get approval status for specific property
- `getNotifications(filter: NotificationFilterInput)` - Get notifications for user

### Related Mutations
- `approvePropertyForListing(propertyId: ID!)` - Approve a property
- `rejectPropertySubmission(propertyId: ID!, reason: String!)` - Reject a property
- `markNotificationAsRead(notificationId: ID!)` - Mark notification as read

## Testing Checklist

- [ ] GraphQL query returns properties with `approvalStatus: 'PENDING'`
- [ ] Only VENDOR_ADMIN and MANAGER roles can access
- [ ] Non-super-admins only see their vendor's properties
- [ ] Results are sorted by creation date (newest first)
- [ ] Agent details are properly populated
- [ ] Authorization errors are returned correctly
- [ ] Frontend component displays results in table

## Performance Notes

- ✅ Uses MongoDB indexes on `approvalStatus` field
- ✅ Populates only necessary agent fields (firstName, lastName, email)
- ✅ Sorts by indexed `createdAt` field
- ✅ No pagination limit (consider adding for large datasets)

## Future Enhancements

- [ ] Add pagination support
- [ ] Add filtering by agent, price range, etc.
- [ ] Add sorting options
- [ ] Cache results for better performance
- [ ] Add WebSocket subscriptions for real-time updates
