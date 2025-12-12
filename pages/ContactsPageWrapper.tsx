import React from 'react';
import { ContactsPage } from '../containers/ContactsPage';
import { CurrentUser } from '../types';

interface ContactsPageWrapperProps {
  user: CurrentUser | null;
}

export const ContactsPageWrapper: React.FC<ContactsPageWrapperProps> = ({ user }) => {
  return <ContactsPage user={user} />;
};
