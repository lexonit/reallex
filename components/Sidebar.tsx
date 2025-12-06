
import React from 'react';
import { LayoutDashboard, Users, Building, PieChart, Settings, CheckSquare, UserCog, Briefcase, FileText, Star, Calendar, ListTodo, Contact, FolderOpen } from 'lucide-react';
import { NavigationTab, UserRole } from '../types';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  isOpen: boolean;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, isOpen, userRole }) => {
  const { companyName } = useTheme();
  
  // Define available menu items
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: NavigationTab.DASHBOARD, roles: ['ADMIN', 'AGENT'] },
    { icon: Star, label: 'My Portal', id: NavigationTab.CLIENT_PORTAL, roles: ['CLIENT'] }, // Client Portal Home
    { icon: ListTodo, label: 'Tasks', id: NavigationTab.TASKS, roles: ['ADMIN', 'AGENT', 'CLIENT'] },
    { icon: Calendar, label: 'Calendar', id: NavigationTab.CALENDAR, roles: ['ADMIN', 'AGENT', 'CLIENT'] },
    { icon: Users, label: 'Leads', id: NavigationTab.LEADS, roles: ['ADMIN', 'AGENT'] },
    { icon: Briefcase, label: 'Deals', id: NavigationTab.DEALS, roles: ['ADMIN', 'AGENT'] },
    { icon: Contact, label: 'Contacts', id: NavigationTab.CONTACTS, roles: ['ADMIN', 'AGENT'] },
    { icon: Building, label: 'Properties', id: NavigationTab.PROPERTIES, roles: ['ADMIN', 'AGENT'] },
    { icon: FolderOpen, label: 'Documents', id: NavigationTab.DOCUMENTS, roles: ['ADMIN', 'AGENT'] },
    { icon: CheckSquare, label: 'Approvals', id: NavigationTab.APPROVALS, roles: ['ADMIN'] },
    { icon: PieChart, label: 'Analytics', id: NavigationTab.ANALYTICS, roles: ['ADMIN'] },
    { icon: UserCog, label: 'Users', id: NavigationTab.USERS, roles: ['ADMIN'] },
    { icon: Settings, label: 'Settings', id: NavigationTab.SETTINGS, roles: ['ADMIN'] },
  ];

  // Filter based on user role
  const menuItems = allMenuItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r transition-transform duration-300 ease-in-out",
      isOpen ? 'translate-x-0' : '-translate-x-full',
      "lg:translate-x-0 lg:static lg:inset-auto lg:block"
    )}>
      <div className="flex h-16 items-center border-b px-6">
        <svg 
          className="h-6 w-6 text-primary mr-2 fill-primary/20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 2L9 22h6L12 2z" />
          <path d="M5 12l-2 10h4L5 12z" />
          <path d="M19 12l-2 10h4l-2-10z" />
        </svg>
        <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight truncate leading-none">{companyName}</span>
            <span className="text-[10px] text-muted-foreground font-medium">Powered by Lexonit</span>
        </div>
      </div>
      <div className="space-y-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === item.id 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>
      
      {userRole !== 'CLIENT' && (
        <div className="absolute bottom-4 left-0 w-full px-4">
          <div className="rounded-xl bg-gradient-to-br from-primary to-purple-700 p-4 text-primary-foreground">
            <p className="font-semibold text-sm">Upgrade to Pro</p>
            <p className="text-xs opacity-80 mt-1 mb-3">Unlock AI analytics and unlimited leads.</p>
            <button className="w-full rounded bg-white/20 py-1.5 text-xs font-medium hover:bg-white/30 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
      
      {userRole === 'CLIENT' && (
          <div className="absolute bottom-4 left-0 w-full px-4">
             <div className="p-4 bg-muted/50 rounded-xl text-center">
                 <p className="text-xs text-muted-foreground">Need help?</p>
                 <p className="text-sm font-medium text-primary cursor-pointer hover:underline">Contact Support</p>
             </div>
          </div>
      )}
    </aside>
  );
};