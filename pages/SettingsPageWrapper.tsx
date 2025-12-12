import React from 'react';
import { SettingsPage } from '../containers/settings/SettingsPage';
import { NavigationTab } from '../types';

interface SettingsPageWrapperProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const SettingsPageWrapper: React.FC<SettingsPageWrapperProps> = ({ onNavigate }) => {
  return <SettingsPage onNavigate={onNavigate} />;
};
