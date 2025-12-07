import React from 'react';
import { TasksPage } from '../components/TasksPage';
import { CurrentUser } from '../types';

interface TasksPageWrapperProps {
  user: CurrentUser | null;
}

export const TasksPageWrapper: React.FC<TasksPageWrapperProps> = ({ user }) => {
  return <TasksPage user={user} />;
};
