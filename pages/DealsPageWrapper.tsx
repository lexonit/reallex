import React from 'react';
import { DealsPage } from '../components/DealsPage';
import { CurrentUser } from '../types';

interface DealsPageWrapperProps {
  user: CurrentUser | null;
}

export const DealsPageWrapper: React.FC<DealsPageWrapperProps> = ({ user }) => {
  return <DealsPage user={user} />;
};
