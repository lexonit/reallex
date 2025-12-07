
import React, { useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { CurrentUser, NavigationTab, UserRole } from './types';
import { Bell, Search, Menu, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { Button } from './components/Button';
import { ThemeProvider } from './contexts/ThemeContext';
import { Avatar } from './components/ui/Avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { AppRoutes } from './routes/AppRoutes';

const AppContent: React.FC = () => {
  const [authView, setAuthView] = useState<'LOGIN' | 'REGISTER' | 'APP'>('APP'); 
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } else if (role === 'AGENT') {
      setCurrentUser({
        id: 'agent-1',
        name: 'Sarah Connor',
        email: 'sarah@prestige.com',
        role: 'AGENT',
        avatar: undefined
      });
      navigate('/dashboard');
    } else if (role === 'CLIENT') {
      setCurrentUser({
        id: 'client-1',
        name: 'Alex Client',
        email: 'alex@client.com',
        role: 'CLIENT',
        avatar: undefined
      });
      navigate('/client-portal');
    }
    setAuthView('APP');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('LOGIN');
    navigate('/login');
  };

  const handleNavigate = (tab: NavigationTab) => {
    // Convert NavigationTab enum to route paths (for compatibility with existing components)
    const routeMap: Record<NavigationTab, string> = {
      [NavigationTab.DASHBOARD]: '/dashboard',
      [NavigationTab.LEADS]: '/leads',
      [NavigationTab.PROPERTIES]: '/properties',
      [NavigationTab.DEALS]: '/deals',
      [NavigationTab.DOCUMENTS]: '/documents',
      [NavigationTab.APPROVALS]: '/approvals',
      [NavigationTab.USERS]: '/users',
      [NavigationTab.TEMPLATES]: '/templates',
      [NavigationTab.ANALYTICS]: '/analytics',
      [NavigationTab.SETTINGS]: '/settings',
      [NavigationTab.CLIENT_PORTAL]: '/client-portal',
      [NavigationTab.CALENDAR]: '/calendar',
      [NavigationTab.TASKS]: '/tasks',
      [NavigationTab.CONTACTS]: '/contacts',
    };
    
    const route = routeMap[tab];
    if (route) {
      navigate(route);
    }
  };

  // If user is not logged in, show auth/landing routes
  if (!currentUser) {
    return (
      <AppRoutes
        currentUser={currentUser}
        authView={authView}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  // Layout for authenticated users
  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      <Sidebar 
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
                                 onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
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
            <AppRoutes
              currentUser={currentUser}
              authView={authView}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              onNavigate={handleNavigate}
            />
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
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;