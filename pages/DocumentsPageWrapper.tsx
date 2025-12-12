import React from 'react';
import { DocumentsPage } from '../containers/DocumentsPage';
import { CurrentUser } from '../types';

interface DocumentsPageWrapperProps {
  user: CurrentUser | null;
}

export const DocumentsPageWrapper: React.FC<DocumentsPageWrapperProps> = ({ user }) => {
  return <DocumentsPage user={user} />;
};
