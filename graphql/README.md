# GraphQL Hooks and Queries

This folder contains organized GraphQL queries, mutations, and custom React hooks for data fetching using **TanStack Query v5** (React Query).

## Folder Structure

```
graphql/
├── index.ts                    # Central export file
├── queries/                    # All GraphQL queries
│   ├── auth.queries.ts
│   ├── property.queries.ts
│   ├── lead.queries.ts
│   ├── deal.queries.ts
│   ├── user.queries.ts
│   ├── vendor.queries.ts
│   ├── analytics.queries.ts
│   └── auditLog.queries.ts
└── mutations/                  # All GraphQL mutations
    ├── auth.mutations.ts
    ├── property.mutations.ts
    ├── lead.mutations.ts
    ├── deal.mutations.ts
    ├── user.mutations.ts
    ├── vendor.mutations.ts
    └── auditLog.mutations.ts

hooks/
├── index.ts                    # Central export file
├── useQuery.ts                 # Base query hook
├── useMutation.ts              # Base mutation hook
├── useAuth.ts                  # Auth hooks
├── useProperties.ts            # Property hooks
├── useLeads.ts                 # Lead hooks
├── useDeals.ts                 # Deal hooks
└── useUsers.ts                 # User hooks
```

## Usage Examples

### 1. Using Query Hooks

```typescript
import { useProperties, useLeads, useMe } from '../hooks';

function MyComponent() {
  // Fetch all properties
  const { data, loading, error, refetch } = useProperties();
  
  // Fetch with filter
  const { data: filteredData } = useProperties({ status: 'PUBLISHED' });
  
  // Access data
  const properties = data?.properties || [];
  
  // Refetch when needed
  const handleRefresh = () => {
    refetch();
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render properties */}</div>;
}
```

### 2. Using Mutation Hooks

```typescript
import { useCreateProperty, useUpdateProperty } from '../hooks';

function PropertyForm() {
  const { mutate: createProperty, loading, error } = useCreateProperty();
  
  const handleSubmit = async (formData) => {
    try {
      const result = await createProperty({
        input: {
          address: formData.address,
          price: formData.price,
          specs: {
            beds: formData.beds,
            baths: formData.baths,
            sqft: formData.sqft
          },
          status: 'DRAFT'
        }
      });
      
      console.log('Created property:', result);
      // Optionally refetch properties list
    } catch (err) {
      console.error('Failed to create:', err);
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### 3. Using Auth Hooks

```typescript
import { useMe, useLogin } from '../hooks/useAuth';

function Profile() {
  // Fetch current user
  const { data, loading } = useMe();
  const user = data?.me;
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user?.firstName} {user?.lastName}</h1>
      <p>{user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}

function LoginForm() {
  const { mutate: login, loading, error } = useLogin();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({
        input: { email, password }
      });
      
      const { token, user } = result.login;
      // Save token and user
      localStorage.setItem('token', token);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  return <form>{/* Login form */}</form>;
}
```

### 4. Using Lead Hooks

```typescript
import { useLeads, useCreateLead, useConvertLeadToDeal } from '../hooks';

function LeadsPage() {
  const { data, loading, refetch } = useLeads();
  const { mutate: createLead } = useCreateLead();
  const { mutate: convertToDeal } = useConvertLeadToDeal();
  
  const handleCreateLead = async (leadData) => {
    await createLead({
      input: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        status: 'NEW',
        source: 'WEBSITE'
      }
    });
    refetch(); // Refresh the list
  };
  
  const handleConvert = async (leadId: string) => {
    try {
      const result = await convertToDeal({ leadId });
      console.log('Created deal:', result.convertLeadToDeal);
      refetch();
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  };
  
  const leads = data?.leads || [];
  
  return <div>{/* Render leads */}</div>;
}
```

### 5. Using Deal Hooks

```typescript
import { useDeals, useUpdateDeal } from '../hooks';

function DealsPage() {
  const { data, loading, refetch } = useDeals();
  const { mutate: updateDeal } = useUpdateDeal();
  
  const handleUpdateStage = async (dealId: string, newStage: string) => {
    try {
      await updateDeal({
        id: dealId,
        input: { stage: newStage }
      });
      refetch(); // Refresh the list
    } catch (err) {
      console.error('Update failed:', err);
    }
  };
  
  const deals = data?.deals || [];
  
  return <div>{/* Render deals */}</div>;
}
```

### 6. TanStack Query Options

```typescript
// Skip query on mount (disabled)
const { data } = useProperties(undefined, { enabled: false });

// With stale time (5 minutes)
const { data } = useProperties(undefined, { 
  staleTime: 5 * 60 * 1000 
});

// Auto-refetch every 30 seconds
const { data } = useProperties(undefined, { 
  refetchInterval: 30000 
});

// With filter and options
const { data } = useProperties({ 
  status: 'PUBLISHED',
  minPrice: 100000,
  maxPrice: 500000
}, {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: true
});

// Mutation with cache invalidation
const { mutate } = useCreateProperty({
  onCompleted: async () => {
    // Invalidate and refetch properties
    await queryClient.invalidateQueries({ queryKey: ['properties'] });
  }
});
```

### 7. Cache Invalidation

```typescript
import { queryClient } from '../lib/queryClient';

// Invalidate specific query
await queryClient.invalidateQueries({ queryKey: ['properties'] });
await queryClient.invalidateQueries({ queryKey: ['property', propertyId] });

// Invalidate multiple queries
await queryClient.invalidateQueries({ queryKey: ['leads'] });
await queryClient.invalidateQueries({ queryKey: ['deals'] });

// Refetch active queries
await queryClient.refetchQueries({ queryKey: ['properties'] });

// Remove query from cache
queryClient.removeQueries({ queryKey: ['property', oldId] });
```

## Hook API Reference

### useQuery (TanStack Query v5)

```typescript
const { data, loading, error, refetch, ...rest } = useQuery<T>(queryKey, query, options);
```

**Parameters:**
- `queryKey: string | string[]` - Unique key for the query (used for caching)
- `query: string` - GraphQL query string
- `options?: object` - TanStack Query options

**Options:**
- `variables?: Record<string, any>` - Query variables
- `enabled?: boolean` - Enable/disable query execution
- `staleTime?: number` - Time before data is considered stale
- `refetchInterval?: number` - Auto-refetch interval
- All TanStack Query options

**Returns:**
- `data: T | null` - Query result
- `loading: boolean` - Loading state (isLoading)
- `error: Error | null` - Error object
- `refetch: () => void` - Refetch function
- All TanStack Query return values (isSuccess, isFetching, etc.)

### useMutation (TanStack Query v5)

```typescript
const { mutate, mutateSync, data, loading, error, reset, ...rest } = useMutation<T>(mutation, options);
```

**Parameters:**
- `mutation: string` - GraphQL mutation string
- `options?: object` - TanStack Query mutation options

**Options:**
- `onCompleted?: (data: any) => void` - Success callback (mapped to onSuccess)
- `onError?: (error: Error) => void` - Error callback
- All TanStack Query mutation options

**Returns:**
- `mutate: (variables) => Promise<T>` - Async mutation function (mutateAsync)
- `mutateSync: (variables) => void` - Sync mutation function
- `data: T | null` - Mutation result
- `loading: boolean` - Loading state (isPending)
- `error: Error | null` - Error object
- `reset: () => void` - Reset state function
- All TanStack Query return values (isSuccess, isError, etc.)

## Available Feature Hooks

### Auth
- `useMe()` - Get current user
- `useLogin()` - Login mutation
- `useRegister()` - Register mutation

### Properties
- `useProperties(filter?)` - Get all properties
- `useProperty(id)` - Get single property
- `useCreateProperty()` - Create property
- `useUpdateProperty()` - Update property
- `useDeleteProperty()` - Delete property

### Leads
- `useLeads(filter?)` - Get all leads
- `useLead(id)` - Get single lead
- `useCreateLead()` - Create lead
- `useUpdateLead()` - Update lead
- `useDeleteLead()` - Delete lead
- `useConvertLeadToDeal()` - Convert lead to deal

### Deals
- `useDeals(filter?)` - Get all deals
- `useDeal(id)` - Get single deal
- `useCreateDeal()` - Create deal
- `useUpdateDeal()` - Update deal
- `useDeleteDeal()` - Delete deal

### Users
- `useUsers(filter?)` - Get all users
- `useUser(id)` - Get single user
- `useCreateUser()` - Create user
- `useUpdateUser()` - Update user
- `useDeleteUser()` - Delete user

## Best Practices

1. **Use feature hooks** instead of base hooks for common operations
2. **Refetch after mutations** to keep data in sync
3. **Handle loading and error states** in your components
4. **Use callbacks** for side effects (toasts, navigation, etc.)
5. **Organize queries** by feature in the graphql folder
6. **Import from central index** for cleaner imports

```typescript
// ✅ Good
import { useProperties, useCreateProperty } from '../hooks';

// ❌ Avoid
import { useProperties } from '../hooks/useProperties';
import { useCreateProperty } from '../hooks/useProperties';
```
