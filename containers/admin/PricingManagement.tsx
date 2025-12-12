import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';
import { DataTable } from '../../components/ui/DataTable';
import { Plus, Edit, Trash2, Loader2, DollarSign, Package } from 'lucide-react';
import { graphqlRequest } from '../../lib/graphql';
import { GET_SUBSCRIPTION_PLANS_QUERY } from '../../graphql/queries/subscription.queries';
import {
  CREATE_SUBSCRIPTION_PLAN_MUTATION,
  UPDATE_SUBSCRIPTION_PLAN_MUTATION,
  DELETE_SUBSCRIPTION_PLAN_MUTATION
} from '../../graphql/mutations/subscription.mutations';
import { AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SubscriptionPlan {
  _id: string;
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

export const PricingManagement: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    billingCycle: 'monthly',
    maxUsers: 1,
    maxProperties: 50,
    maxLeads: 100,
    maxDeals: 25,
    maxStorage: 5,
    customBranding: false,
    apiAccess: false,
    advancedAnalytics: false,
    prioritySupport: false,
    customIntegrations: false,
    isActive: true,
    displayOrder: 0
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await graphqlRequest(GET_SUBSCRIPTION_PLANS_QUERY, { activeOnly: false });
      setPlans(data?.subscriptionPlans || []);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to load plans', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        slug: plan.slug,
        description: plan.description,
        price: plan.price,
        billingCycle: plan.billingCycle,
        maxUsers: plan.features.maxUsers,
        maxProperties: plan.features.maxProperties,
        maxLeads: plan.features.maxLeads,
        maxDeals: plan.features.maxDeals,
        maxStorage: plan.features.maxStorage,
        customBranding: plan.features.customBranding,
        apiAccess: plan.features.apiAccess,
        advancedAnalytics: plan.features.advancedAnalytics,
        prioritySupport: plan.features.prioritySupport,
        customIntegrations: plan.features.customIntegrations,
        isActive: plan.isActive,
        displayOrder: plan.displayOrder
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: 0,
        billingCycle: 'monthly',
        maxUsers: 1,
        maxProperties: 50,
        maxLeads: 100,
        maxDeals: 25,
        maxStorage: 5,
        customBranding: false,
        apiAccess: false,
        advancedAnalytics: false,
        prioritySupport: false,
        customIntegrations: false,
        isActive: true,
        displayOrder: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const input = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price.toString()),
        billingCycle: formData.billingCycle,
        features: {
          maxUsers: parseInt(formData.maxUsers.toString()),
          maxProperties: parseInt(formData.maxProperties.toString()),
          maxLeads: parseInt(formData.maxLeads.toString()),
          maxDeals: parseInt(formData.maxDeals.toString()),
          maxStorage: parseInt(formData.maxStorage.toString()),
          customBranding: formData.customBranding,
          apiAccess: formData.apiAccess,
          advancedAnalytics: formData.advancedAnalytics,
          prioritySupport: formData.prioritySupport,
          customIntegrations: formData.customIntegrations
        },
        isActive: formData.isActive,
        displayOrder: parseInt(formData.displayOrder.toString())
      };

      if (editingPlan) {
        await graphqlRequest(UPDATE_SUBSCRIPTION_PLAN_MUTATION, {
          id: editingPlan._id,
          input
        });
        setToast({ message: 'Successfully updated plan', type: 'success' });
      } else {
        await graphqlRequest(CREATE_SUBSCRIPTION_PLAN_MUTATION, { input });
        setToast({ message: 'Successfully created plan', type: 'success' });
      }

      setIsModalOpen(false);
      await loadPlans();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save plan', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    try {
      await graphqlRequest(DELETE_SUBSCRIPTION_PLAN_MUTATION, { id });
      setToast({ message: 'Successfully deleted plan', type: 'success' });
      await loadPlans();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete plan', type: 'error' });
    }
  };

  const columns = [
    {
      header: 'Plan',
      accessorKey: 'name' as any,
      cell: (plan: SubscriptionPlan) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{plan.name}</div>
            <div className="text-xs text-muted-foreground">{plan.slug}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Price',
      accessorKey: 'price' as any,
      cell: (plan: SubscriptionPlan) => (
        <span className="font-semibold">${plan.price}/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
      )
    },
    {
      header: 'Limits',
      accessorKey: 'features' as any,
      cell: (plan: SubscriptionPlan) => (
        <div className="text-xs space-y-0.5">
          <div>{plan.features.maxUsers} users</div>
          <div className="text-muted-foreground">{plan.features.maxProperties} properties</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'isActive' as any,
      cell: (plan: SubscriptionPlan) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          plan.isActive 
            ? "bg-green-500/10 text-green-600 border border-green-500/20"
            : "bg-gray-500/10 text-gray-600 border border-gray-500/20"
        )}>
          {plan.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (plan: SubscriptionPlan) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(plan)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(plan._id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscription Plans</h2>
          <p className="text-muted-foreground">Manage pricing and features for subscription tiers</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Add Plan
        </Button>
      </div>

      {!loading && plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Subscription Plans</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by creating your first subscription plan. Define pricing tiers and features for your users.
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="mr-2 h-4 w-4" /> Create First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <DataTable
            data={plans.map(p => ({ ...p, id: p._id }))}
            columns={columns}
            isLoading={loading}
            onRowClick={(plan: any) => handleOpenModal(plans.find(p => p._id === plan.id)!)}
          />
        </Card>
      )}

      {/* Plan Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPlan ? 'Update' : 'Create'} Plan
            </Button>
          </div>
        }
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Basic Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name</label>
                <input
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Solo Agent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <input
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="solo-agent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full p-2 rounded-md border bg-background resize-none"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the plan"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Billing Cycle</label>
                <select
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.billingCycle}
                  onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Display Order</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-sm">Resource Limits</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Users</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.maxUsers}
                  onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Properties</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.maxProperties}
                  onChange={(e) => setFormData({ ...formData, maxProperties: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Leads</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.maxLeads}
                  onChange={(e) => setFormData({ ...formData, maxLeads: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Deals</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.maxDeals}
                  onChange={(e) => setFormData({ ...formData, maxDeals: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Storage (GB)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.maxStorage}
                  onChange={(e) => setFormData({ ...formData, maxStorage: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-sm">Features</h4>
            
            <div className="space-y-2">
              {[
                { key: 'customBranding', label: 'Custom Branding' },
                { key: 'apiAccess', label: 'API Access' },
                { key: 'advancedAnalytics', label: 'Advanced Analytics' },
                { key: 'prioritySupport', label: 'Priority Support' },
                { key: 'customIntegrations', label: 'Custom Integrations' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}

              <label className="flex items-center gap-2 cursor-pointer pt-2 border-t">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Plan Active</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
