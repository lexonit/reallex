import React from 'react';
import { Properties } from '../containers/properties/Properties';
import { CurrentUser } from '../types';

interface PropertiesPageProps {
  user: CurrentUser | null;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ user }) => {
  return <Properties user={user} />;
};
