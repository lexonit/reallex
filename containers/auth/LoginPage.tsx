
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Shield, User, Smile } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CurrentUser, UserRole } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { login as loginAction } from '../../store/slices/authSlice';

interface LoginPageProps {
  onLogin: (auth: { token: string; user: CurrentUser }) => void;
  onRegisterClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegisterClick }) => {
  const { companyName } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error: authError } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      const targetRoute = user.role === 'CLIENT' ? '/client-portal' : '/dashboard';
      navigate(targetRoute, { replace: true });
    }
  }, [user, navigate]);

  // Update local error from Redux
  useEffect(() => {
    setError(authError);
  }, [authError]);

  const handleLogin = async () => {
    setError(null);

    try {
      await dispatch(loginAction({ email, password })).unwrap();
      // App.tsx will handle redirect via auth state changes
    } catch (err: any) {
      setError(err || 'Login failed');
    }
  };

  const handleAutofill = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError(null);
    // Auto-submit after a brief delay to ensure state updates
    setTimeout(() => {
      dispatch(loginAction({ email, password }));
    }, 100);
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
            <p className="text-center text-sm text-muted-foreground">Sign in to your account</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2.5 rounded-md border bg-background" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full p-2.5 rounded-md border bg-background" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <div className="grid grid-cols-1 gap-3">
              <div className="text-center text-xs uppercase text-muted-foreground">Quick demo roles</div>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                    size="lg" 
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => handleAutofill('admin@demo.com', 'admin@123')}
                    className="h-14 flex items-center justify-start gap-3 px-4 hover:border-primary/50 group"
                >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">Fill Admin Demo</div>
                        <div className="text-xs text-muted-foreground">admin@demo.com / admin@123</div>
                    </div>
                </Button>

                <Button 
                    size="lg" 
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => handleAutofill('agent@prestige.com', 'password')}
                    className="h-14 flex items-center justify-start gap-3 px-4 hover:border-primary/50 group"
                >
                     <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">Fill Agent Demo</div>
                        <div className="text-xs text-muted-foreground">agent@prestige.com / password</div>
                    </div>
                </Button>

                <Button 
                    size="lg" 
                    disabled={isLoading}
                    onClick={() => handleAutofill('admin@prestige.com', 'password')}
                    className="h-14 flex items-center justify-start gap-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white group shadow-lg shadow-emerald-500/20 border-none"
                >
                     <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center transition-colors">
                        <Smile className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">Fill Vendor Admin</div>
                        <div className="text-xs text-white/80">admin@prestige.com / password</div>
                    </div>
                </Button>
              </div>
            </div>

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
