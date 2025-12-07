# RealEstate App - Routing Structure

## Overview
The application has been refactored to use React Router for navigation instead of state-based routing. Each page now has its own component and route.

## Directory Structure

```
├── pages/                          # Page components
│   ├── index.ts                    # Export all pages
│   ├── DashboardPage.tsx           # Dashboard wrapper
│   ├── LeadsPage.tsx               # Leads management
│   ├── PropertiesPage.tsx          # Property listings
│   ├── DealsPageWrapper.tsx        # Deal management
│   ├── DocumentsPageWrapper.tsx    # Document management
│   ├── CalendarPageWrapper.tsx     # Calendar view
│   ├── TasksPageWrapper.tsx        # Task management
│   ├── ContactsPageWrapper.tsx     # Contact management
│   ├── ApprovalsPage.tsx           # Admin approvals
│   ├── UsersPage.tsx               # User management
│   ├── TemplatesPage.tsx           # Template management
│   ├── AnalyticsPage.tsx           # Analytics dashboard
│   ├── ClientPortalPage.tsx        # Client portal
│   ├── SettingsPageWrapper.tsx     # Settings page
│   ├── LoginPageWrapper.tsx        # Login page
│   ├── RegisterPageWrapper.tsx     # Registration page
│   └── LandingPageWrapper.tsx      # Landing page
├── routes/                         # Routing configuration
│   └── AppRoutes.tsx              # Main routing component with protected routes
└── components/                     # Reusable components (unchanged)
```

## Routes

### Public Routes (Unauthenticated Users)
- `/` - Landing page
- `/login` - User login
- `/register` - User registration

### Protected Routes

#### Admin Only
- `/dashboard` - Admin dashboard
- `/leads` - Lead management
- `/properties` - Property management
- `/deals` - Deal management
- `/documents` - Document management
- `/contacts` - Contact management
- `/approvals` - Approval queue
- `/users` - User management
- `/templates` - Template management
- `/analytics` - Analytics dashboard
- `/settings` - System settings

#### Agent (Staff)
- `/dashboard` - Agent dashboard
- `/leads` - Lead management
- `/properties` - Property management
- `/deals` - Deal management
- `/documents` - Document management
- `/contacts` - Contact management
- `/calendar` - Calendar view
- `/tasks` - Task management

#### Client
- `/client-portal` - Client portal home
- `/calendar` - Calendar view
- `/tasks` - Task management

## Key Features

### 1. Role-Based Access Control
- Routes are protected based on user roles (ADMIN, AGENT, CLIENT)
- Unauthorized users are redirected to appropriate default pages
- Unauthenticated users are redirected to login

### 2. Navigation
- Sidebar navigation uses React Router's `useNavigate` hook
- Current route highlighting with `useLocation`
- Automatic navigation after login based on user role

### 3. Protected Routes
- `ProtectedRoute` component handles access control
- Checks user authentication and role permissions
- Provides appropriate redirects for unauthorized access

### 4. Backward Compatibility
- Existing components remain unchanged
- Page wrapper components provide bridge between routing and components
- `NavigationTab` enum still supported through route mapping

## Usage

### Running the Application
```bash
npm run dev    # Development server
npm run build  # Production build
```

### Adding New Routes

1. Create a page component in `/pages/`:
```tsx
// pages/NewPage.tsx
import React from 'react';
import { NewComponent } from '../components/NewComponent';

export const NewPage: React.FC = () => {
  return <NewComponent />;
};
```

2. Export from `/pages/index.ts`:
```tsx
export { NewPage } from './NewPage';
```

3. Add route to `AppRoutes.tsx`:
```tsx
<Route
  path="/new-page"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']} currentUser={currentUser}>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

4. Add to sidebar navigation in `Sidebar.tsx`:
```tsx
{ icon: NewIcon, label: 'New Page', path: '/new-page', roles: ['ADMIN'] }
```

## Benefits

1. **SEO Friendly** - Proper URLs for each page
2. **Bookmarkable** - Users can bookmark specific pages
3. **Browser Navigation** - Back/forward buttons work correctly
4. **Code Splitting** - Potential for lazy loading pages
5. **Maintainable** - Clear separation of routing logic
6. **Scalable** - Easy to add new pages and routes

## Migration Notes

The refactoring maintains backward compatibility while providing a more robust routing system. All existing functionality remains intact, but the application now supports:

- Direct URL navigation
- Browser history
- Proper page refreshes
- Better development experience with hot reloading