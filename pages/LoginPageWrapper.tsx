import React from 'react';
import { LoginPage } from '../containers/auth/LoginPage';
import { CurrentUser } from '../types';

interface LoginPageWrapperProps {
  onLogin: (auth: { token: string; user: CurrentUser }) => void;
  onRegisterClick: () => void;
}

export const LoginPageWrapper: React.FC<LoginPageWrapperProps> = ({ onLogin, onRegisterClick }) => {
  // The LoginPage component handles login via Redux internally
  // It will automatically handle redirects and state management
  return <LoginPage onLogin={onLogin} onRegisterClick={onRegisterClick} />;
};
