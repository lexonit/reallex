
import React from 'react';
import { Button } from '../Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface RegisterPageProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onRegisterSuccess }) => {
  const { companyName } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      <div className="w-full max-w-lg p-4 relative z-10">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Button>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <svg 
                className="h-6 w-6 text-primary fill-primary/20" 
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
                  <span className="text-xl font-bold leading-none">{companyName}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Powered by Lexonit</span>
              </div>
            </div>
            <CardTitle>Register New Vendor</CardTitle>
            <p className="text-sm text-muted-foreground">Start your 14-day free trial. No credit card required.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); onRegisterSuccess(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input className="w-full p-2.5 rounded-md border bg-background" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input className="w-full p-2.5 rounded-md border bg-background" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <input className="w-full p-2.5 rounded-md border bg-background" placeholder="Acme Realty" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Email</label>
                <input type="email" className="w-full p-2.5 rounded-md border bg-background" placeholder="john@acme.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input type="password" className="w-full p-2.5 rounded-md border bg-background" placeholder="••••••••" required />
              </div>
              <Button className="w-full" size="lg">Create Account</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
