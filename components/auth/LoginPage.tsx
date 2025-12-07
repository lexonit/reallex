
import React, { useState } from 'react';
import { Button } from '../Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Shield, User, Smile } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onRegisterClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegisterClick }) => {
  const { companyName } = useTheme();
  const [loading, setLoading] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setLoading(role);
    setTimeout(() => {
      setLoading(null);
      onLogin(role);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      <div className="w-full max-w-md p-4 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <svg 
              className="h-8 w-8 text-primary fill-primary/20" 
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
                <span className="text-2xl font-bold leading-none">{companyName}</span>
                <a href="https://lexonit.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground font-medium hover:text-primary transition-colors">Powered by Lexonit</a>
            </div>
          </div>
        </div>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <p className="text-center text-sm text-muted-foreground">Select a role to view the demo experience</p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 gap-4">
                <Button 
                    size="lg" 
                    variant="outline"
                    disabled={!!loading}
                    onClick={() => handleLogin('ADMIN')}
                    className="h-16 flex items-center justify-start gap-4 px-4 hover:border-primary/50 group"
                >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">Sign in as Admin</div>
                        <div className="text-xs text-muted-foreground">Full access to all features</div>
                    </div>
                    {loading === 'ADMIN' && <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
                </Button>

                <Button 
                    size="lg" 
                    variant="outline"
                    disabled={!!loading}
                    onClick={() => handleLogin('AGENT')}
                    className="h-16 flex items-center justify-start gap-4 px-4 hover:border-primary/50 group"
                >
                     <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">Sign in as Agent</div>
                        <div className="text-xs text-muted-foreground">Restricted view (Sarah Connor)</div>
                    </div>
                    {loading === 'AGENT' && <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
                </Button>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Received an invite?</span>
                    </div>
                </div>

                <Button 
                    size="lg" 
                    disabled={!!loading}
                    onClick={() => handleLogin('CLIENT')}
                    className="h-16 flex items-center justify-start gap-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white group shadow-lg shadow-emerald-500/20 border-none"
                >
                     <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center transition-colors">
                        <Smile className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">Client Portal Access</div>
                        <div className="text-xs text-white/80">View shortlist & sign docs</div>
                    </div>
                    {loading === 'CLIENT' && <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                </Button>
            </div>
            
            <form className="space-y-4 opacity-50 pointer-events-none pt-4 border-t border-border/50">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full p-2.5 rounded-md border bg-background" placeholder="name@company.com" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input type="password" className="w-full p-2.5 rounded-md border bg-background" placeholder="••••••••" disabled />
              </div>
              <Button className="w-full" disabled>Sign In</Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <button onClick={onRegisterClick} className="text-primary hover:underline font-medium">
                Create Vendor Account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
