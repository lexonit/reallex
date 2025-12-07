import React from 'react';
import { LoginPage } from '../components/auth/LoginPage';
import { UserRole } from '../types';

interface LoginPageWrapperProps {
  onLogin: (role: UserRole) => void;
  onRegisterClick: () => void;
}

export const LoginPageWrapper: React.FC<LoginPageWrapperProps> = ({ onLogin, onRegisterClick }) => {
  return <LoginPage onLogin={onLogin} onRegisterClick={onRegisterClick} />;
};
