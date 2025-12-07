import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CurrentUser, NavigationTab, UserRole } from '../types';
import {
  DashboardPage,
  LeadsPage,
  PropertiesPage,
  DealsPageWrapper,
  DocumentsPageWrapper,
  CalendarPageWrapper,
  TasksPageWrapper,
  ContactsPageWrapper,
  ApprovalsPage,
  UsersPage,
  TemplatesPage,
  AnalyticsPage,
  ClientPortalPage,
  SettingsPageWrapper,
  LoginPageWrapper,
  RegisterPageWrapper,
  LandingPageWrapper,
} from '../pages';

interface AppRoutesProps {
  currentUser: CurrentUser | null;
  authView: 'LOGIN' | 'REGISTER' | 'APP';
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  handleLogin: (role: UserRole) => void;
  handleLogout: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  currentUser: CurrentUser | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate default page based on role
    const defaultPath = currentUser.role === 'CLIENT' ? '/client-portal' : '/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC<AppRoutesProps> = ({
  currentUser,
  authView,
  isDarkMode,
  toggleDarkMode,
  handleLogin,
  onNavigate,
}) => {
  const navigate = useNavigate();

  // If user is not logged in, show auth routes
  if (!currentUser) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPageWrapper
              onLogin={handleLogin}
              onRegisterClick={() => navigate('/register')}
            />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterPageWrapper
              onBack={() => navigate('/login')}
              onRegisterSuccess={() => navigate('/login')}
            />
          }
        />
        <Route
          path="/"
          element={
            <LandingPageWrapper
              onLogin={() => navigate('/login')}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Routes for authenticated users
  return (
    <Routes>
      {/* Dashboard - Available to ADMIN and AGENT */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentUser={currentUser}>
            <DashboardPage user={currentUser} onNavigate={onNavigate} />
          </ProtectedRoute>
        }
      />

      {/* Leads - Available to ADMIN and AGENT */}
      <Route
        path="/leads"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentUser={currentUser}>
            <LeadsPage user={currentUser} />
          </ProtectedRoute>
        }
      />

      {/* Properties - Available to ADMIN and AGENT */}
      <Route
        path="/properties"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentUser={currentUser}>
            <PropertiesPage user={currentUser} />
          </ProtectedRoute>
        }
      />

      {/* Deals - Available to ADMIN and AGENT */}
      <Route
        path="/deals"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentUser={currentUser}>
            <DealsPageWrapper user={currentUser} />
          </ProtectedRoute>
        }
      />

      {/* Documents - Available to ADMIN and AGENT */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentUser={currentUser}>
            <DocumentsPageWrapper user={currentUser} />
          </ProtectedRoute>
        }
      />

      {/* Calendar - Available to all roles */}
      <Route
        path="/calendar"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT', 'CLIENT']} currentUser={currentUser}>
            <CalendarPageWrapper user={currentUser} />
          </ProtectedRoute>
        }
      />

      {/* Tasks - Available to all roles */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT', 'CLIENT']} currentUser={currentUser}>
            <TasksPageWrapper user={currentUser} />
          </ProtectedRoute>
        }
      />

      {/* Contacts - Available to ADMIN and AGENT */}
      <Route
        path="/contacts"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentUser={currentUser}>
            <ContactsPageWrapper user={currentUser} />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes - Only for ADMIN */}
      <Route
        path="/approvals"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} currentUser={currentUser}>
            <ApprovalsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} currentUser={currentUser}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/templates"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} currentUser={currentUser}>
            <TemplatesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']} currentUser={currentUser}>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* Client Portal - Only for CLIENT */}
      <Route
        path="/client-portal"
        element={
          <ProtectedRoute allowedRoles={['CLIENT']} currentUser={currentUser}>
            <ClientPortalPage user={currentUser} />
          </ProtectedRoute>
        }
      />

      {/* Settings - Available to ADMIN and AGENT */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']} currentUser={currentUser}>
            <SettingsPageWrapper onNavigate={onNavigate} />
          </ProtectedRoute>
        }
      />

      {/* Default redirects based on user role */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              currentUser.role === 'CLIENT' 
                ? '/client-portal' 
                : '/dashboard'
            }
            replace
          />
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};