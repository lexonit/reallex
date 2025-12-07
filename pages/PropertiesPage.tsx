import React from 'react';
import { Properties } from '../components/Properties';
import { CurrentUser } from '../types';

interface PropertiesPageProps {
  user: CurrentUser | null;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ user }) => {
  return <Properties user={user} />;
};
