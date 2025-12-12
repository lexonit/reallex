import React from 'react';
import { LandingPage } from '../containers/LandingPage';

interface LandingPageWrapperProps {
  onLogin: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const LandingPageWrapper: React.FC<LandingPageWrapperProps> = ({ onLogin, isDarkMode, toggleDarkMode }) => {
  return <LandingPage onLogin={onLogin} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
};
