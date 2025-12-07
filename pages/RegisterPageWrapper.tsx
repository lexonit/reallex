import React from 'react';
import { RegisterPage } from '../components/auth/RegisterPage';

interface RegisterPageWrapperProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPageWrapper: React.FC<RegisterPageWrapperProps> = ({ onBack, onRegisterSuccess }) => {
  return <RegisterPage onBack={onBack} onRegisterSuccess={onRegisterSuccess} />;
};
