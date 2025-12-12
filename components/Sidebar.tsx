
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building, PieChart, Settings, CheckSquare, UserCog, Briefcase, FileText, Star, Calendar, ListTodo, Contact, FolderOpen, Palette, Package } from 'lucide-react';
import { NavigationTab, UserRole } from '../types';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, userRole }) => {
  const { companyName } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define available menu items with their routes
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT'], superAdminOnly: false },
    { icon: Star, label: 'My Portal', path: '/client-portal', roles: ['CLIENT'], superAdminOnly: false },
    { icon: ListTodo, label: 'Tasks', path: '/tasks', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT', 'CLIENT'], superAdminOnly: false },
    { icon: Calendar, label: 'Calendar', path: '/calendar', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT', 'CLIENT'], superAdminOnly: false },
    { icon: Users, label: 'Leads', path: '/leads', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT'], superAdminOnly: false },
    { icon: Briefcase, label: 'Deals', path: '/deals', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT'], superAdminOnly: false },
    { icon: Contact, label: 'Contacts', path: '/contacts', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT'], superAdminOnly: false },
    { icon: Building, label: 'Properties', path: '/properties', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT'], superAdminOnly: false },
    { icon: FolderOpen, label: 'Documents', path: '/documents', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT'], superAdminOnly: false },
    { icon: CheckSquare, label: 'Approvals', path: '/approvals', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN'], superAdminOnly: false },
    { icon: Palette, label: 'Templates', path: '/templates', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN'], superAdminOnly: false },
    { icon: PieChart, label: 'Analytics', path: '/analytics', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN'], superAdminOnly: false },
    { icon: UserCog, label: 'Users', path: '/users', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN'], superAdminOnly: false },
    { icon: Package, label: 'Pricing Plans', path: '/admin/pricing', roles: ['SUPER_ADMIN'], superAdminOnly: true },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'ADMIN', 'MANAGER', 'SALES_REP', 'AGENT'], superAdminOnly: false },
  ];

  // Filter based on user role (superAdminOnly items are excluded unless explicitly SUPER_ADMIN)
  const menuItems = allMenuItems.filter(item => {
    if (item.superAdminOnly && userRole !== 'SUPER_ADMIN') {
      return false;
    }
    return !userRole || item.roles.includes(userRole);
  });

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none",
      isOpen ? 'translate-x-0' : '-translate-x-full',
      "lg:translate-x-0 lg:static lg:inset-auto lg:block"
    )}>
      <div className="flex h-16 items-center border-b border-border px-6 bg-card">
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
            <span className="text-lg font-bold tracking-tight truncate leading-none text-foreground">{companyName}</span>
            <a href="https://lexonit.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground font-medium hover:text-primary transition-colors">Powered by Lexonit</a>
        </div>
      </div>
      <div className="space-y-1 p-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
              location.pathname === item.path 
                ? 'bg-primary/10 text-primary shadow-sm dark:bg-primary/20 dark:text-primary' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm dark:hover:bg-accent/50'
            )}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>
      
      {userRole !== 'CLIENT' && (
        <div className="absolute bottom-4 left-0 w-full px-4">
          <div className="rounded-xl bg-gradient-to-br from-primary to-purple-700 p-4 text-primary-foreground shadow-md">
            <p className="font-semibold text-sm">Upgrade to Pro</p>
            <p className="text-xs opacity-90 mt-1 mb-3">Unlock AI analytics and unlimited leads.</p>
            <button className="w-full rounded-md bg-white/20 py-1.5 text-xs font-medium hover:bg-white/30 transition-all duration-200 hover:shadow-sm backdrop-blur-sm">
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
      
      {userRole === 'CLIENT' && (
          <div className="absolute bottom-4 left-0 w-full px-4">
             <div className="p-4 bg-accent/50 border border-border rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                 <p className="text-xs text-muted-foreground">Need help?</p>
                 <p className="text-sm font-medium text-primary cursor-pointer hover:underline transition-colors">Contact Support</p>
             </div>
          </div>
      )}
    </aside>
  );
};
