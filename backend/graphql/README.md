# GraphQL API - Modular Architecture

## 📁 Structure

```
backend/graphql/
├── types/              # Type definitions for each feature
│   ├── property.types.ts
│   ├── user.types.ts
│   ├── vendor.types.ts
│   ├── lead.types.ts
│   ├── deal.types.ts
│   ├── auditLog.types.ts
│   └── analytics.types.ts
├── resolvers/          # Resolver functions for each feature
│   ├── property.resolvers.ts
│   ├── user.resolvers.ts
│   ├── vendor.resolvers.ts
│   ├── lead.resolvers.ts
│   ├── auditLog.resolvers.ts
│   ├── analytics.resolvers.ts
│   └── index.ts       # Root resolver combining all resolvers
└── schema/
    └── index.ts       # Main schema combining all types
```

## 🎯 Features

### ✅ **Implemented**
- **Properties** - Full CRUD with filtering
- **Users** - Authentication, registration, user management
- **Vendors** - Multi-tenant vendor management
- **Audit Logs** - Query audit trail
- **Analytics** - Dashboard stats and time series data

### 🚧 **Planned**
- **Leads** - Lead management (stub created)
- **Deals** - Deal pipeline management (stub created)

## 🚀 Usage

### Query Properties
```graphql
query GetProperties {
  properties(filter: { status: PUBLISHED, minPrice: 100000 }) {
    _id
    address
    price
    specs {
      beds
      baths
      sqft
    }
    status
  }
}
```

### Create Property
```graphql
mutation CreateProperty {
  createProperty(input: {
    address: "123 Main St, Los Angeles, CA"
    price: 500000
    specs: { beds: 3, baths: 2, sqft: 2000 }
    status: PUBLISHED
  }) {
    _id
    address
    price
  }
}
```

### User Registration
```graphql
mutation Register {
  register(input: {
    email: "user@example.com"
    password: "securepassword"
    firstName: "John"
    lastName: "Doe"
    role: SALES_REP
  }) {
    token
    user {
      _id
      email
      role
    }
  }
}
```

### User Login
```graphql
mutation Login {
  login(input: {
    email: "agent@prestige.com"
    password: "password"
  }) {
    token
    user {
      _id
      email
      firstName
      lastName
      role
    }
  }
}
```

### Get Dashboard Stats
```graphql
query GetStats {
  dashboardStats {
    totalProperties
    totalLeads
    totalDeals
    totalRevenue
    activeUsers
  }
}
```

### Get Vendors
```graphql
query GetVendors {
  vendors {
    _id
    name
    slug
    theme {
      primaryColor
    }
  }
}
```

### Query Audit Logs
```graphql
query GetAuditLogs {
  auditLogs(
    filter: {
      action: "SYSTEM_INIT"
      startDate: "2025-01-01"
    }
    limit: 50
  ) {
    _id
    action
    targetModel
    timestamp
    details
  }
}
```

## 🔐 Authentication Context

Resolvers that require authentication (like `me` query) receive context:

```typescript
me: async ({ }, context: any) => {
  if (!context.user) throw new Error('Not authenticated');
  // ... resolver logic
}
```

To add authentication context to GraphQL, update `server.ts`:

```typescript
app.use('/graphql', graphqlHTTP((req) => ({
  schema: schema,
  rootValue: rootValue,
  graphiql: true,
  context: { user: (req as any).user } // Pass authenticated user
})) as any);
```

## 📝 Adding New Features

### 1. Create Type Definition

Create `backend/graphql/types/yourFeature.types.ts`:

```typescript
export const yourFeatureTypes = `
  type YourFeature {
    _id: ID!
    name: String!
    # ... other fields
  }

  input YourFeatureInput {
    name: String!
    # ... other fields
  }
`;

export const yourFeatureQueries = `
  yourFeatures: [YourFeature!]!
  yourFeature(id: ID!): YourFeature
`;

export const yourFeatureMutations = `
  createYourFeature(input: YourFeatureInput!): YourFeature!
`;
```

### 2. Create Resolvers

Create `backend/graphql/resolvers/yourFeature.resolvers.ts`:

```typescript
import YourFeatureModel from '../../models/YourFeature';

export const yourFeatureResolvers = {
  yourFeatures: async () => {
    return await YourFeatureModel.find();
  },

  yourFeature: async ({ id }: any) => {
    return await YourFeatureModel.findById(id);
  },

  createYourFeature: async ({ input }: any) => {
    return await YourFeatureModel.create(input);
  }
};
```

### 3. Update Main Schema

Add to `backend/graphql/schema/index.ts`:

```typescript
import { yourFeatureTypes, yourFeatureQueries, yourFeatureMutations } from '../types/yourFeature.types';

// Add to type definitions
${yourFeatureTypes}

// Add to Query type
${yourFeatureQueries}

// Add to Mutation type
${yourFeatureMutations}
```

### 4. Update Root Resolver

Add to `backend/graphql/resolvers/index.ts`:

```typescript
import { yourFeatureResolvers } from './yourFeature.resolvers';

export const rootValue = {
  // ... existing resolvers
  ...yourFeatureResolvers
};
```

## 🧪 Testing

Access GraphiQL at: `http://localhost:5000/graphql`

Use the **Docs** button to explore the schema!

## 🎨 Best Practices

1. **Separate concerns** - Each feature has its own types and resolvers
2. **Type safety** - Use TypeScript for all resolvers
3. **Error handling** - Throw descriptive errors
4. **Validation** - Validate inputs in resolvers
5. **Authentication** - Check context.user for protected operations
6. **Logging** - Log important operations to AuditLog
7. **Performance** - Use DataLoader for N+1 queries (future improvement)

## 🔧 Production Considerations

- [ ] Add DataLoader for efficient batch loading
- [ ] Implement field-level permissions
- [ ] Add query complexity analysis
- [ ] Set up query depth limiting
- [ ] Add rate limiting
- [ ] Enable query caching
- [ ] Add APM/monitoring
- [ ] Implement pagination for large datasets
- [ ] Add subscriptions for real-time updates

## 📚 Resources

- [GraphQL Official Docs](https://graphql.org/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
