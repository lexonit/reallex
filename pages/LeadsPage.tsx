import React from 'react';
import { LeadList } from '../components/LeadList';
import { CurrentUser } from '../types';

interface LeadsPageProps {
  user: CurrentUser | null;
}

export const LeadsPage: React.FC<LeadsPageProps> = ({ user }) => {
  return <LeadList user={user} />;
};
