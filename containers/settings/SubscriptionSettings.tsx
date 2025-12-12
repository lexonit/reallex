import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Check, X, CreditCard, Calendar, Users, Home, 
  TrendingUp, DollarSign, Package, AlertTriangle, Loader2 
} from 'lucide-react';
import { graphqlRequest } from '../../lib/graphql';
import { GET_MY_SUBSCRIPTION_QUERY } from '../../graphql/queries/subscription.queries';
import { UPDATE_VENDOR_SUBSCRIPTION_MUTATION } from '../../graphql/mutations/subscription.mutations';
import { Toast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billingCycle: string;
  features: {
    maxUsers: number;
    maxProperties: number;
    maxLeads: number;
    maxDeals: number;
    maxStorage: number;
    customBranding: boolean;
    apiAccess: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customIntegrations: boolean;
  };
  isActive: boolean;
  displayOrder: number;
}

interface VendorSubscription {
  id: string;
  vendorId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: string;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  autoRenew: boolean;
  currentUsage: {
    activeUsers: number;
    totalProperties: number;
    totalLeads: number;
    totalDeals: number;
    storageUsed: number;
  };
}

export const SubscriptionSettings: React.FC = () => {
  const [subscription, setSubscription] = useState<VendorSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const subData = await graphqlRequest(GET_MY_SUBSCRIPTION_QUERY, {});

      setSubscription(subData?.mySubscription || null);
      setPlans(subData?.mySubscription?.availablePlans || []);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to load subscription data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!subscription) return;

    try {
      setUpgrading(true);
      await graphqlRequest(UPDATE_VENDOR_SUBSCRIPTION_MUTATION, {
        vendorId: subscription.vendorId,
        planId
      });

      setToast({ message: 'Successfully updated subscription plan!', type: 'success' });
      await loadData();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update subscription', type: 'error' });
    } finally {
      setUpgrading(false);
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getDaysRemaining = () => {
    if (!subscription) return 0;
    const now = new Date();
    const end = new Date(subscription.endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentPlan = subscription?.plan;
  const daysRemaining = getDaysRemaining();
  const isExpiringSoon = daysRemaining < 7;

  return (
    <div className="space-y-6 pb-10">
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Subscription & Billing</h2>
        <p className="text-muted-foreground">Manage your subscription plan and usage</p>
      </div>

      {/* Current Subscription Overview */}
      {subscription && currentPlan && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{currentPlan.name} Plan</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ${currentPlan.price}/{currentPlan.billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </p>
                </div>
              </div>
              <Badge variant={subscription.status === 'active' ? 'success' : subscription.status === 'trial' ? 'warning' : 'destructive'}>
                {subscription.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Renewal Date</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Days Remaining</span>
                  <span className={cn("font-medium", isExpiringSoon && "text-orange-500")}>
                    {daysRemaining} days
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Auto Renew</span>
                  <span className="font-medium">
                    {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {isExpiringSoon && (
                <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-orange-700 dark:text-orange-400">Expiring Soon</p>
                    <p className="text-orange-600 dark:text-orange-400/80">Your subscription will expire in {daysRemaining} days</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Statistics */}
      {subscription && currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Users */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Users
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {subscription.currentUsage.activeUsers} / {currentPlan.features.maxUsers}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all",
                      getUsagePercentage(subscription.currentUsage.activeUsers, currentPlan.features.maxUsers) >= 90
                        ? "bg-red-500"
                        : getUsagePercentage(subscription.currentUsage.activeUsers, currentPlan.features.maxUsers) >= 75
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    )}
                    style={{ width: `${getUsagePercentage(subscription.currentUsage.activeUsers, currentPlan.features.maxUsers)}%` }}
                  />
                </div>
              </div>

              {/* Properties */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Home className="h-4 w-4 text-green-500" />
                    Properties
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {subscription.currentUsage.totalProperties} / {currentPlan.features.maxProperties}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all",
                      getUsagePercentage(subscription.currentUsage.totalProperties, currentPlan.features.maxProperties) >= 90
                        ? "bg-red-500"
                        : getUsagePercentage(subscription.currentUsage.totalProperties, currentPlan.features.maxProperties) >= 75
                        ? "bg-orange-500"
                        : "bg-green-500"
                    )}
                    style={{ width: `${getUsagePercentage(subscription.currentUsage.totalProperties, currentPlan.features.maxProperties)}%` }}
                  />
                </div>
              </div>

              {/* Leads */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    Leads
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {subscription.currentUsage.totalLeads} / {currentPlan.features.maxLeads}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all",
                      getUsagePercentage(subscription.currentUsage.totalLeads, currentPlan.features.maxLeads) >= 90
                        ? "bg-red-500"
                        : getUsagePercentage(subscription.currentUsage.totalLeads, currentPlan.features.maxLeads) >= 75
                        ? "bg-orange-500"
                        : "bg-purple-500"
                    )}
                    style={{ width: `${getUsagePercentage(subscription.currentUsage.totalLeads, currentPlan.features.maxLeads)}%` }}
                  />
                </div>
              </div>

              {/* Deals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    Deals
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {subscription.currentUsage.totalDeals} / {currentPlan.features.maxDeals}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all",
                      getUsagePercentage(subscription.currentUsage.totalDeals, currentPlan.features.maxDeals) >= 90
                        ? "bg-red-500"
                        : getUsagePercentage(subscription.currentUsage.totalDeals, currentPlan.features.maxDeals) >= 75
                        ? "bg-orange-500"
                        : "bg-amber-500"
                    )}
                    style={{ width: `${getUsagePercentage(subscription.currentUsage.totalDeals, currentPlan.features.maxDeals)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentPlan?.id === plan.id;
            const canUpgrade = currentPlan && plan.displayOrder > currentPlan.displayOrder;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "relative rounded-xl border bg-card p-6 shadow-sm transition-all",
                  isCurrent && "border-primary shadow-md ring-2 ring-primary/20"
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Current Plan</Badge>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{plan.features.maxUsers} User{plan.features.maxUsers > 1 ? 's' : ''}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{plan.features.maxProperties.toLocaleString()} Properties</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{plan.features.maxLeads.toLocaleString()} Leads</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{plan.features.maxDeals.toLocaleString()} Deals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {plan.features.customBranding ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      <span className={!plan.features.customBranding ? 'text-muted-foreground' : ''}>Custom Branding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {plan.features.advancedAnalytics ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      <span className={!plan.features.advancedAnalytics ? 'text-muted-foreground' : ''}>Advanced Analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {plan.features.prioritySupport ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      <span className={!plan.features.prioritySupport ? 'text-muted-foreground' : ''}>Priority Support</span>
                    </li>
                  </ul>

                  {!isCurrent && canUpgrade && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={upgrading}
                    >
                      {upgrading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                      Upgrade to {plan.name}
                    </Button>
                  )}

                  {isCurrent && (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
