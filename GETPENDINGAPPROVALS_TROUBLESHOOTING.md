# getPendingApprovals Troubleshooting Guide

## Issue
Getting `Unauthorized` error when calling `getPendingApprovals` GraphQL query, but other APIs work fine.

## Root Causes & Solutions

### 1. Token Not Being Sent
**Symptom**: Server logs show "No authorization header or user found"

**Check**:
- Open browser DevTools → Console
- Look for: `📡 graphqlRequest: Sending request`
- Verify: `hasToken: true` and check `tokenLength`

**Solution**:
```typescript
// In frontend console, check if token exists:
console.log('Token from cookie:', Cookies.get('auth_token'));
console.log('Token from localStorage:', localStorage.getItem('token'));
```

If both are empty:
- Re-login to get new token
- Check if auth flow is setting token correctly

### 2. Invalid or Expired Token
**Symptom**: Server logs show "Failed to verify token"

**Check**:
- Look at server logs: `❌ GraphQL context: Failed to verify token`
- The error message will show the JWT verification error

**Solution**:
- Token may be expired → Re-login
- Token may be corrupted → Clear cookies/localStorage and login again
- Token format issue → Check if it's a valid JWT

### 3. User Not Authenticated in Context
**Symptom**: Server logs show "User not authenticated in context"

**Check**:
- Look for: `🔐 requireAuth: Checking authentication`
- Verify these logs exist:
  - `✅ GraphQL context: User authenticated from Bearer token`
  - `✅ requireAuth: User authenticated`

**Solution**:
- If logs don't appear, token verification is failing
- Check JWT secret is the same on frontend and backend
- Verify token structure is correct

### 4. User Lacks Approval Role
**Symptom**: Error message "Only admins and managers can perform this action"

**Check**:
- Look at server logs: `🔐 requireApprovalRole: Checking context`
- Verify user role is one of:
  - `VENDOR_ADMIN`
  - `MANAGER`
  - `SUPER_ADMIN`

**Solution**:
- Login with a different user account that has one of these roles
- Check user's role in the database

### 5. Vendor ID Mismatch
**Symptom**: Returns empty array even when properties exist

**Check**:
- Look at logs: `✅ getPendingApprovals: Query`
- Verify the vendorId in the query matches your vendor

**Solution**:
- If you're a SUPER_ADMIN, you should see all pending properties
- If you're VENDOR_ADMIN/MANAGER, you only see your vendor's properties
- Check if the property's vendorId matches your login vendorId

## Debugging Steps

### Step 1: Check Frontend Token
```typescript
// In browser console:
import Cookies from 'js-cookie';
console.log(Cookies.get('auth_token') || localStorage.getItem('token'));
```

### Step 2: Check Server Logs
```
✅ GraphQL context: User authenticated from Bearer token
🔐 requireAuth: Checking authentication
🔐 requireApprovalRole: Checking context
✅ getPendingApprovals: Query
```

Look for these exact log patterns. If any are missing, that's where the issue is.

### Step 3: Test with GraphiQL
1. Go to: `http://localhost:5000/graphql`
2. In GraphiQL header, add:
   ```json
   {
     "Authorization": "Bearer YOUR_TOKEN_HERE"
   }
   ```
3. Run query:
   ```graphql
   query {
     getPendingApprovals {
       _id
       address
       approvalStatus
     }
   }
   ```

### Step 4: Check User Role
```typescript
// In GraphQL context logs, look for:
{ userId: "...", role: "VENDOR_ADMIN" }  // ✅ Good
{ userId: "...", role: "SALES_REP" }     // ❌ Bad - needs to be admin/manager
```

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Unauthorized` | User not authenticated | Re-login, check token |
| `Only admins and managers can...` | User is not VENDOR_ADMIN/MANAGER | Login with admin user |
| `Property not found` | Wrong property ID or vendorId mismatch | Verify property belongs to your vendor |
| `Only pending properties can be approved` | Property already approved/rejected | Refresh pending list |

## Key Logging Points

### Frontend (`lib/graphql.ts`)
```
📡 graphqlRequest: Sending request
```

### Backend Server (`server.ts`)
```
✅ GraphQL context: User authenticated from Bearer token
```

### Backend Resolver (`notification.resolvers.ts`)
```
🔐 requireAuth: Checking authentication
🔐 requireApprovalRole: Checking context
✅ getPendingApprovals: Query
```

## Quick Fix Checklist

- [ ] Token exists in cookies or localStorage
- [ ] Token is not expired
- [ ] User role is VENDOR_ADMIN, MANAGER, or SUPER_ADMIN
- [ ] Server logs show "User authenticated"
- [ ] Server logs show "User has approval permissions"
- [ ] GraphQL query is correctly formatted
- [ ] Browser console shows successful response

## Token Storage

The application uses token storage priority:
1. **First**: Check `auth_token` cookie (from Redux)
2. **Second**: Fall back to `token` in localStorage
3. **If neither exists**: No authorization header sent

This is set in `lib/graphql.ts`'s `graphqlRequest` function.

## Testing Workflow

1. **Login as VENDOR_ADMIN**
   - Frontend should set token in cookies
   - Check: `Cookies.get('auth_token')`

2. **Navigate to Approvals Page**
   - Should call `getPendingApprovals` GraphQL query
   - Check browser console for `📡 graphqlRequest` log

3. **Check Server Logs**
   - Should see `✅ GraphQL context: User authenticated`
   - Should see `✅ getPendingApprovals: Query`

4. **Verify Properties Display**
   - Table should show pending properties
   - If empty, check vendor ID mismatch

## Support

If issue persists after checking all above:
1. Capture full server logs (include all debug output)
2. Capture browser console logs
3. Check if `requireAuth` or `requireApprovalRole` functions are throwing errors
4. Verify `notification.resolvers.ts` imports are correct
