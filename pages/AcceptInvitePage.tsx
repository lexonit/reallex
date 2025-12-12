import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { Button } from '../components/Button';
import { Toast } from '../components/ui/Toast';
import { AlertTriangle, CheckCircle2, Lock, Mail, UserCircle } from 'lucide-react';
import { graphqlRequest } from '../lib/graphql';
import { ACCEPT_INVITE_MUTATION } from '../graphql/mutations/user.mutations';
import { VERIFY_INVITE_TOKEN_QUERY } from '../graphql/queries/user.queries';

export const AcceptInvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      fetchInviteDetails(urlToken);
    }
  }, [searchParams]);

  const fetchInviteDetails = async (inviteToken: string) => {
    setIsLoading(true);
    try {
      const res = await graphqlRequest(VERIFY_INVITE_TOKEN_QUERY, {
        token: inviteToken
      });
      
      if (res?.verifyInviteToken) {
        const details = res.verifyInviteToken;
        setEmail(details.email);
        setRole(details.role);
        setFirstName(details.firstName || '');
        setLastName(details.lastName || '');
        setIsValidToken(details.isValid);
        
        if (!details.isValid) {
          showToast('This invitation token has expired', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Invalid invite token', 'error');
      setIsValidToken(false);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast('Invite token is required', 'error');
      return;
    }
    if (!email) {
      showToast('Email is required', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await graphqlRequest(ACCEPT_INVITE_MUTATION, {
        input: {
          token: token.trim(),
          password,
          firstName: firstName || undefined,
          lastName: lastName || undefined
        }
      });

      if (res?.acceptInvite?.token) {
        setSuccess(true);
        showToast('Invite accepted. You can now log in.', 'success');
        setTimeout(() => navigate('/login'), 1200);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to accept invite', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <Card className="w-full max-w-lg border-border/60 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>Set your password and activate your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 rounded-lg bg-muted/40 text-sm text-muted-foreground flex items-start gap-2">
            <Lock className="h-4 w-4 mt-0.5" />
            <p>Review your invitation details, set your password, and optionally update your information.</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Invite Token</label>
                <input
                  className="w-full p-2.5 rounded-md border bg-muted text-muted-foreground cursor-not-allowed"
                  value={token}
                  disabled
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  className="w-full p-2.5 rounded-md border bg-muted text-muted-foreground cursor-not-allowed"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  disabled
                  readOnly
                />
              </div>

              {role && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Role
                  </label>
                  <input
                    className="w-full p-2.5 rounded-md border bg-muted text-muted-foreground cursor-not-allowed"
                    value={role.replace('_', ' ')}
                    disabled
                    readOnly
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    className="w-full p-2.5 rounded-md border bg-muted text-muted-foreground cursor-not-allowed"
                    placeholder="Jane"
                    value={firstName}
                    disabled
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    className="w-full p-2.5 rounded-md border bg-muted text-muted-foreground cursor-not-allowed"
                    placeholder="Doe"
                    value={lastName}
                    disabled
                    readOnly
                  />
                </div>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full p-2.5 rounded-md border bg-background"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-2.5 rounded-md border bg-background"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || !isValidToken}>
                {isSubmitting ? 'Activating...' : 'Accept Invite'}
              </Button>
            </form>
          )}

          {success && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-500/20 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Invitation accepted. Redirecting to login...
            </div>
          )}

          {!success && !isLoading && isValidToken && (
            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-500/20 text-sm flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Set your password to activate your account.
            </div>
          )}

          {!success && !isLoading && !isValidToken && token && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-500/20 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              This invitation token has expired. Please request a new invitation from your admin.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
