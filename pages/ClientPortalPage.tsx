import React from 'react';
import { ClientPortal } from '../containers/client/ClientPortal';
import { CurrentUser } from '../types';

interface ClientPortalPageProps {
  user: CurrentUser;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({ user }) => {
  return <ClientPortal user={user} />;
};
