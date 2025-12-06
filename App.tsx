
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LeadList } from './components/LeadList';
import { Properties } from './components/Properties';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ApprovalsQueue } from './components/admin/ApprovalsQueue';
import { UserManagement } from './components/admin/UserManagement';
import { SettingsPage } from './components/settings/SettingsPage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard'; 
import { DealsPage } from './components/DealsPage'; // Updated Import
import { ClientPortal } from './components/client/ClientPortal';
import { CalendarPage } from './components/CalendarPage';
import { TasksPage } from './components/TasksPage';
import { ContactsPage } from './components/ContactsPage';
import { DocumentsPage } from './components/DocumentsPage';
import { NavigationTab, CurrentUser, UserRole } from './types';
import { Bell, Search, Menu, Moon, Sun, UserCircle, LogOut, Settings } from 'lucide-react';
import { Button } from './components/Button';
import { ThemeProvider } from './contexts/ThemeContext';
import { Avatar } from './components/ui/Avatar';
import { AnimatePresence, motion } from 'framer-motion';

const AppContent: React.FC = () => {
  const [authView, setAuthView] = useState<'LOGIN' | 'REGISTER' | 'APP'>('APP'); 
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to false for Pastel Light theme
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = (role: UserRole) => {
    if (role === 'ADMIN') {
        setCurrentUser({
            id: 'admin-1',
            name: 'John Doe',
            email: 'admin@prestige.com',
            role: 'ADMIN'
        });
        setActiveTab(NavigationTab.DASHBOARD);
    } else if (role === 'AGENT') {
        setCurrentUser({
            id: 'agent-1',
            name: 'Sarah Connor',
            email: 'sarah@prestige.com',
            role: 'AGENT',
            avatar: undefined
        });
        setActiveTab(NavigationTab.DASHBOARD);
    } else if (role === 'CLIENT') {
        setCurrentUser({
            id: 'client-1',
            name: 'Alex Client',
            email: 'alex@client.com',
            role: 'CLIENT',
            avatar: undefined
        });
        setActiveTab(NavigationTab.CLIENT_PORTAL);
    }
    setAuthView('APP');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('LOGIN');
    setActiveTab(NavigationTab.DASHBOARD);
  };

  const renderContent = () => {
    // Safety check for client role - Allow Portal, Tasks, and Calendar
    if (currentUser?.role === 'CLIENT') {
        if (![NavigationTab.CLIENT_PORTAL, NavigationTab.TASKS, NavigationTab.CALENDAR].includes(activeTab)) {
             return <ClientPortal user={currentUser} />;
        }
    }

    switch (activeTab) {
      case NavigationTab.DASHBOARD:
        return <Dashboard onNavigate={setActiveTab} user={currentUser} />;
      case NavigationTab.LEADS:
        return <LeadList user={currentUser} />;
      case NavigationTab.PROPERTIES:
        return <Properties user={currentUser} />;
      case NavigationTab.DEALS:
        return <DealsPage user={currentUser} />;
      case NavigationTab.DOCUMENTS:
        return <DocumentsPage user={currentUser} />;
      case NavigationTab.APPROVALS:
        return <ApprovalsQueue />;
      case NavigationTab.USERS:
        return <UserManagement />;
      case NavigationTab.ANALYTICS:
        return <AnalyticsDashboard />;
      case NavigationTab.SETTINGS:
        return <SettingsPage onNavigate={setActiveTab} />;
      case NavigationTab.CLIENT_PORTAL:
        return currentUser ? <ClientPortal user={currentUser} /> : null;
      case NavigationTab.CALENDAR:
        return <CalendarPage user={currentUser} />;
      case NavigationTab.TASKS:
        return <TasksPage user={currentUser} />;
      case NavigationTab.CONTACTS:
        return <ContactsPage user={currentUser} />;
      default:
        return <Dashboard onNavigate={setActiveTab} user={currentUser} />;
    }
  };

  if (!currentUser) {
    if (authView === 'REGISTER') {
      return <RegisterPage onBack={() => setAuthView('LOGIN')} onRegisterSuccess={() => setAuthView('LOGIN')} />;
    }
    if (authView === 'LOGIN') {
      return <LoginPage onLogin={handleLogin} onRegisterClick={() => setAuthView('REGISTER')} />;
    }
    return <LandingPage onLogin={() => setAuthView('LOGIN')} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        onNavigate={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }} 
        isOpen={sidebarOpen}
        userRole={currentUser.role}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative transition-colors duration-300">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </Button>
            
            {/* User Profile Dropdown */}
            <div className="relative ml-4 border-l pl-4">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 focus:outline-none group"
              >
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                        {currentUser.role === 'ADMIN' ? 'Administrator' : 
                         currentUser.role === 'CLIENT' ? 'Client Account' : 'Sales Representative'}
                    </p>
                 </div>
                 <Avatar name={currentUser.name} src={currentUser.avatar} className="h-9 w-9 ring-2 ring-transparent group-hover:ring-primary/20 transition-all" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-64 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                       <div className="p-4 border-b border-border/50 bg-muted/30">
                          <div className="flex items-center gap-3 mb-2">
                             <Avatar name={currentUser.name} src={currentUser.avatar} className="h-10 w-10" />
                             <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                             </div>
                          </div>
                       </div>
                       
                       {currentUser.role !== 'CLIENT' && (
                           <div className="p-2 space-y-1">
                              <button 
                                 onClick={() => { setActiveTab(NavigationTab.SETTINGS); setIsProfileOpen(false); }}
                                 className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors text-left"
                              >
                                 <Settings className="h-4 w-4 text-muted-foreground" /> Account Settings
                              </button>
                           </div>
                       )}
                       
                       <div className="h-px bg-border/50 mx-2 my-1" />
                       
                       <div className="p-2">
                          <button 
                            onClick={() => {
                                setIsProfileOpen(false);
                                handleLogout();
                            }} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors font-medium text-left"
                          >
                             <LogOut className="h-4 w-4" /> Sign out
                          </button>
                       </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;