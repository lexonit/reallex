import React from 'react';
import { Dashboard } from '../containers/Dashboard';
import { CurrentUser, NavigationTab } from '../types';

interface DashboardPageProps {
  user: CurrentUser | null;
  onNavigate: (tab: NavigationTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onNavigate }) => {
  return <Dashboard onNavigate={onNavigate} user={user} />;
};
