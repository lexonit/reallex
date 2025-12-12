import React from 'react';
import { CalendarPage } from '../containers/CalendarPage';
import { CurrentUser } from '../types';

interface CalendarPageWrapperProps {
  user: CurrentUser | null;
}

export const CalendarPageWrapper: React.FC<CalendarPageWrapperProps> = ({ user }) => {
  return <CalendarPage user={user} />;
};
