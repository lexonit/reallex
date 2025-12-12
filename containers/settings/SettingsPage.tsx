
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/Card';
import { Button } from '../../components/Button';
import { Toast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { SubscriptionSettings } from './SubscriptionSettings';
import { ColorPicker } from '../../components/ui/ColorPicker';
import { 
  User, Building2, Users, Shield, Sliders, Mail, Puzzle, 
  Save, Plus, Trash2, Check, CreditCard, Bell, Lock, 
  GripVertical, Edit2, Upload, Search, FileText, Download, CheckCircle, Copy, Briefcase,
  Moon, Sun, Palette, RefreshCw, Package
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';
import { Integration, PipelineStage, NavigationTab } from '../../types';
import { MOCK_INTEGRATIONS, DEFAULT_PIPELINE, MOCK_AGENTS } from '../../constants';
import { Avatar } from '../../components/ui/Avatar';
import { graphqlRequest } from '../../lib/graphql';
import { INVITE_USER_MUTATION } from '../../graphql/mutations/user.mutations';
import { GET_USERS_QUERY } from '../../graphql/queries/user.queries';
import { UPDATE_VENDOR_MUTATION } from '../../graphql/mutations/vendor.mutations';
import { GET_VENDOR_QUERY } from '../../graphql/queries/vendor.queries';
import { CREATE_ROLE_TITLE_MUTATION, UPDATE_ROLE_TITLE_MUTATION, DELETE_ROLE_TITLE_MUTATION } from '../../graphql/mutations/roleTitle.mutations';
import { GET_ROLE_TITLES_QUERY } from '../../graphql/queries/roleTitle.queries';
import { GET_BILLING_DATA_QUERY } from '../../graphql/queries/billing.queries';
import { UPDATE_TEMPLATE_MUTATION as UPDATE_TEMPLATE_MUTATION_TEMPLATE, CREATE_TEMPLATE_MUTATION, DELETE_TEMPLATE_MUTATION } from '../../graphql/mutations/template.mutations';
import { UPDATE_PAYMENT_METHOD_MUTATION, SUBSCRIBE_MUTATION, ADD_PAYMENT_METHOD_MUTATION, REMOVE_PAYMENT_METHOD_MUTATION, UPDATE_SUBSCRIPTION_MUTATION, CANCEL_SUBSCRIPTION_MUTATION } from '../../graphql/mutations/billing.mutations';
import { useMe } from '../../hooks/useAuth';

type SettingsSection = 'PROFILE' | 'ORG' | 'TEAM' | 'ROLES' | 'ROLE_TITLES' | 'PIPELINES' | 'TEMPLATES' | 'INTEGRATIONS' | 'BILLING' | 'SUBSCRIPTION';

// Initial Permissions Data
const INITIAL_PERMISSIONS = [
  { id: 'view_leads', name: 'View All Leads', admin: true, manager: true, agent: false },
  { id: 'edit_leads', name: 'Edit Leads', admin: true, manager: true, agent: true },
  { id: 'delete_prop', name: 'Delete Properties', admin: true, manager: true, agent: false },
  { id: 'export_data', name: 'Export Data', admin: true, manager: false, agent: false },
  { id: 'manage_users', name: 'Manage Users', admin: true, manager: false, agent: false },
  { id: 'analytics', name: 'View Analytics', admin: true, manager: true, agent: false },
];

interface SettingsPageProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { 
    companyName, 
    setCompanyName, 
    primaryColor, 
    setPrimaryColor, 
    isDarkMode,
    setIsDarkMode,
    saveTheme, 
    resetTheme,
    getColorPalette,
    previewColor,
    applyPreview,
    cancelPreview
  } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('PROFILE');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // --- Profile State using useMe hook ---
  const { data: meData, loading: isLoadingProfile, error: profileError } = useMe();
  
  const profile = meData?.me ? {
    id: meData.me._id,
    firstName: meData.me.firstName || '',
    lastName: meData.me.lastName || '',
    name: `${meData.me.firstName} ${meData.me.lastName}`.trim() || meData.me.email,
    email: meData.me.email,
    phone: '',
    bio: '',
    role: meData.me.role,
    vendorId: meData.me.vendorId || '',
    isActive: meData.me.isActive,
    lastLogin: meData.me.lastLogin || '',
    createdAt: meData.me.createdAt || '',
    updatedAt: meData.me.updatedAt || ''
  } : {
    id: '',
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    phone: '',
    bio: '',
    role: '',
    vendorId: '',
    isActive: true,
    lastLogin: '',
    createdAt: '',
    updatedAt: ''
  };

  // --- Org State ---
  const [localName, setLocalName] = useState(companyName);
  const [localColor, setLocalColor] = useState(primaryColor);
  const [localWebsite, setLocalWebsite] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  
  // --- Team State ---
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteFirstName, setInviteFirstName] = useState('');
    const [inviteLastName, setInviteLastName] = useState('');
    const [inviteRole, setInviteRole] = useState<'VENDOR_ADMIN' | 'MANAGER' | 'SALES_REP' | 'CLIENT'>('SALES_REP');
    const [isInviting, setIsInviting] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [isInviteLinkModalOpen, setIsInviteLinkModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

  // --- Pipeline State ---
  const [pipeline, setPipeline] = useState<PipelineStage[]>(DEFAULT_PIPELINE);
  const [newStageName, setNewStageName] = useState('');

  // --- Roles State ---
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);

  // --- Role Titles State ---
    const [roleTitles, setRoleTitles] = useState<Array<{ id: string; title: string; systemRole: string; description: string }>>([]);
    const [isLoadingRoleTitles, setIsLoadingRoleTitles] = useState(false);
    const [isSavingRoleTitle, setIsSavingRoleTitle] = useState(false);
  const [isRoleTitleModalOpen, setIsRoleTitleModalOpen] = useState(false);
  const [editingRoleTitle, setEditingRoleTitle] = useState<any>(null);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleSystemRole, setNewRoleSystemRole] = useState('SALES_REP');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  // --- Templates State ---
  const [templates, setTemplates] = useState<any[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  // --- Integrations ---
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);

  // --- Billing State ---
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

  // --- Fetch Team Members ---
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!profile.vendorId) return;
      
      setIsLoadingTeam(true);
      try {
        const data = await graphqlRequest(GET_USERS_QUERY, {
          filter: { vendorId: profile.vendorId }
        });
        
        let members = (data?.users || []).map((u: any) => ({
          id: u._id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email,
          role: u.role || 'SALES_REP',
          status: u.isActive ? 'Active' : 'Inactive'
        }));
        
        // Filter out admin roles unless current user is admin
        if (!canAccessRestrictedSettings) {
          members = members.filter((m: any) => !['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(m.role));
        }
        
        setTeamMembers(members);
      } catch (err) {
        console.error('Failed to load team members', err);
      } finally {
        setIsLoadingTeam(false);
      }
    };
    
    fetchTeamMembers();
  }, [profile.vendorId]);

  // --- Fetch Vendor Data ---
  useEffect(() => {
    const fetchVendorData = async () => {
      if (!profile.vendorId) return;
      
      try {
        const data = await graphqlRequest(GET_VENDOR_QUERY, { id: profile.vendorId });
        if (data.vendor) {
          setLocalName(data.vendor.name || '');
          setCompanyName(data.vendor.name || '');
          setLocalColor(data.vendor.theme?.primaryColor || primaryColor);
          setPrimaryColor(data.vendor.theme?.primaryColor || primaryColor);
          setLocalWebsite(data.vendor.contactEmail || '');
          setLocalAddress(data.vendor.address || '');
          saveTheme();
        }
      } catch (err) {
        console.error('Failed to load vendor data', err);
      }
    };
    
        fetchVendorData();
    }, [profile.vendorId]);

    // --- Fetch Role Titles ---
    useEffect(() => {
        const fetchRoleTitles = async () => {
            if (!profile.vendorId) return;

            setIsLoadingRoleTitles(true);
            try {
                const data = await graphqlRequest(GET_ROLE_TITLES_QUERY, {
                    filter: { vendorId: profile.vendorId, isActive: true }
                });

                const titles = (data?.roleTitles || [])
                    .filter((rt: any) => !['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(rt.systemRole))
                    .map((rt: any) => ({
                        id: rt._id,
                        title: rt.title,
                        systemRole: rt.systemRole,
                        description: rt.description || ''
                    }));

                setRoleTitles(titles);
            } catch (err) {
                console.error('Failed to load role titles', err);
            } finally {
                setIsLoadingRoleTitles(false);
            }
        };

        fetchRoleTitles();
    }, [profile.vendorId]);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            // Try to fetch billing data, but don't fail if it's not available
            try {
                const data = await graphqlRequest(GET_BILLING_DATA_QUERY);
                if (data.emailTemplates) {
                    setTemplates(data.emailTemplates);
                }
                if (data.currentSubscription) setSubscription(data.currentSubscription);
                if (data.invoices) setInvoices(data.invoices);
                if (data.availablePlans) setPlans(data.availablePlans);
            } catch (billingErr) {
                console.warn('Billing data not available:', billingErr);
                // Set default empty values
                setSubscription(null);
                setInvoices([]);
                setPlans([]);
            }

        } catch (err) {
            console.error('Failed to load settings', err);
        }
    };
    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleSaveProfile = () => {
      showToast('Profile updated successfully');
  };

  const handleSaveOrg = async () => {
      if (!profile.vendorId) {
          showToast('Vendor ID not found', 'error');
          return;
      }
      
      try {
          await graphqlRequest(UPDATE_VENDOR_MUTATION, {
              id: profile.vendorId,
              input: {
                  name: localName,
                  contactEmail: localWebsite,
                  theme: {
                      primaryColor: localColor
                  }
              }
          });
          
          // Update theme context with enhanced system
          setCompanyName(localName);
          setPrimaryColor(localColor);
          
          // Use the enhanced theme save function
          saveTheme();
          
          showToast('Organization settings saved successfully');
      } catch (err: any) {
          showToast(err.message || 'Failed to save settings', 'error');
      }
  };

  const togglePermission = (permId: string, role: 'manager' | 'agent') => {
    setPermissions(prev => prev.map(p => 
        p.id === permId ? { ...p, [role]: !p[role] } : p
    ));
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          if (editingTemplate.id) {
              const res = await graphqlRequest(UPDATE_TEMPLATE_MUTATION_TEMPLATE, {
                  id: editingTemplate.id,
                  name: editingTemplate.name,
                  subject: editingTemplate.subject,
                  body: editingTemplate.body
              });
              setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? res.updateEmailTemplate : t));
          } else {
              const res = await graphqlRequest(CREATE_TEMPLATE_MUTATION, {
                  name: editingTemplate.name,
                  subject: editingTemplate.subject,
                  body: editingTemplate.body
              });
              setTemplates(prev => [...prev, res.createEmailTemplate]);
          }
          setIsTemplateModalOpen(false);
          showToast('Email template saved');
      } catch (err) {
          showToast('Failed to save template', 'error');
      }
  };

  const handleDeleteTemplate = async (id: string) => {
      try {
          await graphqlRequest(DELETE_TEMPLATE_MUTATION, { id });
          setTemplates(prev => prev.filter(t => t.id !== id));
          showToast('Template deleted');
      } catch (err) {
          showToast('Failed to delete template', 'error');
      }
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === pipeline.length - 1) return;

    const newPipeline = [...pipeline];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPipeline[index], newPipeline[targetIndex]] = [newPipeline[targetIndex], newPipeline[index]];
    setPipeline(newPipeline);
  };

  // --- Role Title Handlers ---
    const handleSaveRoleTitle = async () => {
        if (isSavingRoleTitle) return;

        if (!profile.vendorId) {
            showToast('Vendor not found for current user', 'error');
            return;
        }

        if (!newRoleTitle.trim()) {
            showToast('Role title is required', 'error');
            return;
        }

        if (['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(newRoleSystemRole)) {
            showToast('Admin roles are not editable here', 'error');
            return;
        }

        setIsSavingRoleTitle(true);
        try {
            if (editingRoleTitle) {
                const res = await graphqlRequest(UPDATE_ROLE_TITLE_MUTATION, {
                    id: editingRoleTitle.id,
                    input: {
                        title: newRoleTitle,
                        systemRole: newRoleSystemRole,
                        description: newRoleDescription
                    }
                });

                const updated = res?.updateRoleTitle;
                if (updated) {
                    setRoleTitles(prev => prev.map(r => r.id === editingRoleTitle.id ? {
                        id: updated._id,
                        title: updated.title,
                        systemRole: updated.systemRole,
                        description: updated.description || ''
                    } : r));
                    showToast('Role title updated');
                }
            } else {
                const res = await graphqlRequest(CREATE_ROLE_TITLE_MUTATION, {
                    input: {
                        title: newRoleTitle,
                        systemRole: newRoleSystemRole,
                        description: newRoleDescription,
                        vendorId: profile.vendorId
                    }
                });

                const created = res?.createRoleTitle;
                if (created && !['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(created.systemRole)) {
                    setRoleTitles(prev => [...prev, {
                        id: created._id,
                        title: created.title,
                        systemRole: created.systemRole,
                        description: created.description || ''
                    }]);
                    showToast('Role title created');
                }
            }

            setIsRoleTitleModalOpen(false);
            setEditingRoleTitle(null);
            setNewRoleTitle('');
            setNewRoleSystemRole('SALES_REP');
            setNewRoleDescription('');
        } catch (err) {
            console.error('Failed to save role title', err);
            showToast('Failed to save role title', 'error');
        } finally {
            setIsSavingRoleTitle(false);
        }
    };

  const handleEditRoleTitle = (role: any) => {
    setEditingRoleTitle(role);
    setNewRoleTitle(role.title);
    setNewRoleSystemRole(role.systemRole);
    setNewRoleDescription(role.description);
    setIsRoleTitleModalOpen(true);
  };

    const handleDeleteRoleTitle = async (id: string) => {
        setIsSavingRoleTitle(true);
        try {
            await graphqlRequest(DELETE_ROLE_TITLE_MUTATION, { id });
            setRoleTitles(prev => prev.filter(r => r.id !== id));
            showToast('Role title deleted');
        } catch (err) {
            console.error('Failed to delete role title', err);
            showToast('Failed to delete role title', 'error');
        } finally {
            setIsSavingRoleTitle(false);
        }
    };

  // --- Billing Handlers ---
  const handleUpdateCard = async () => {
      if (cardData.number.length < 16) {
          showToast('Invalid card number', 'error');
          return;
      }
      try {
          const expiryParts = cardData.expiry.split('/');
          const input = {
              type: 'CREDIT_CARD',
              cardLast4: cardData.number.slice(-4),
              cardBrand: 'VISA', // Could detect from card number
              expiryMonth: parseInt(expiryParts[0]),
              expiryYear: parseInt(expiryParts[1]) + 2000,
          };
          const res = await graphqlRequest(UPDATE_PAYMENT_METHOD_MUTATION, { 
              paymentMethodId: subscription.paymentMethodId,
              input 
          });
          // Refresh billing data
          const billData = await graphqlRequest(GET_BILLING_DATA_QUERY);
          setSubscription(billData.getSubscription);
          if (billData.getPaymentMethods) {
              const defaultMethod = billData.getPaymentMethods.find(m => m.isDefault);
              if (defaultMethod) {
                  setCardData({ 
                      number: '****' + defaultMethod.cardLast4, 
                      expiry: `${defaultMethod.expiryMonth}/${defaultMethod.expiryYear % 100}`, 
                      cvc: '***' 
                  });
              }
          }
          setIsPaymentModalOpen(false);
          showToast('Payment method updated');
      } catch (err) {
          console.error('Failed to update card:', err);
          showToast('Failed to update card', 'error');
      }
  };

  const handleAddPaymentMethod = async () => {
      if (cardData.number.length < 16) {
          showToast('Invalid card number', 'error');
          return;
      }
      try {
          const expiryParts = cardData.expiry.split('/');
          const input = {
              type: 'CREDIT_CARD',
              cardLast4: cardData.number.slice(-4),
              cardBrand: 'VISA',
              expiryMonth: parseInt(expiryParts[0]),
              expiryYear: parseInt(expiryParts[1]) + 2000,
          };
          await graphqlRequest(ADD_PAYMENT_METHOD_MUTATION, { input });
          // Refresh billing data
          const billData = await graphqlRequest(GET_BILLING_DATA_QUERY);
          if (billData.getPaymentMethods) {
              setCardData({ number: '', expiry: '', cvc: '' });
          }
          setIsPaymentModalOpen(false);
          showToast('Payment method added');
      } catch (err) {
          console.error('Failed to add payment method:', err);
          showToast('Failed to add payment method', 'error');
      }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
      try {
          await graphqlRequest(REMOVE_PAYMENT_METHOD_MUTATION, { paymentMethodId });
          // Refresh billing data
          const billData = await graphqlRequest(GET_BILLING_DATA_QUERY);
          setCardData({ number: '', expiry: '', cvc: '' });
          showToast('Payment method removed');
      } catch (err) {
          console.error('Failed to remove payment method:', err);
          showToast('Failed to remove payment method', 'error');
      }
  };

  const handleSubscribe = async (planName: string) => {
      try {
          const input = {
              plan: planName,
              billingCycle: 'MONTHLY',
              paymentMethodId: subscription.paymentMethodId || '',
          };
          const res = await graphqlRequest(SUBSCRIBE_MUTATION, { input });
          setSubscription(res.subscribe);
          
          // Refresh invoices if paid plan
          const billData = await graphqlRequest(GET_BILLING_DATA_QUERY);
          if (billData.getInvoices) setInvoices(billData.getInvoices);

          showToast(`Subscribed to ${planName} plan`);
      } catch (err) {
          console.error('Failed to subscribe:', err);
          showToast('Subscription failed', 'error');
      }
  };

  const handleUpdateSubscription = async (subscriptionId: string, billingCycle: string) => {
      try {
          const input = { billingCycle };
          await graphqlRequest(UPDATE_SUBSCRIPTION_MUTATION, { subscriptionId, input });
          // Refresh billing data
          const billData = await graphqlRequest(GET_BILLING_DATA_QUERY);
          setSubscription(billData.getSubscription);
          showToast('Subscription updated');
      } catch (err) {
          console.error('Failed to update subscription:', err);
          showToast('Failed to update subscription', 'error');
      }
  };

  const handleCancelSubscription = async () => {
      if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
      try {
          await graphqlRequest(CANCEL_SUBSCRIPTION_MUTATION, { 
              subscriptionId: subscription.id,
              immediate: false 
          });
          // Refresh billing data
          const billData = await graphqlRequest(GET_BILLING_DATA_QUERY);
          setSubscription(billData.getSubscription);
          showToast('Subscription cancelled');
      } catch (err) {
          console.error('Failed to cancel subscription:', err);
          showToast('Failed to cancel subscription', 'error');
      }
  };

  // Define which roles can access restricted sections
  const canAccessRestrictedSettings = ['SUPER_ADMIN', 'VENDOR_ADMIN', 'MANAGER'].includes(profile.role);
  const canManageRoleTitles = ['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(profile.role);

  const allMenuItems = [
      { id: 'PROFILE', label: 'My Profile', icon: User, restricted: false, adminOnly: false },
      { id: 'ORG', label: 'Organization', icon: Building2, restricted: true, adminOnly: false },
      { id: 'TEAM', label: 'Team Members', icon: Users, restricted: false, adminOnly: false },
      { id: 'ROLES', label: 'Roles & Permissions', icon: Shield, restricted: true, adminOnly: false },
      { id: 'ROLE_TITLES', label: 'Role Titles', icon: Briefcase, restricted: true, adminOnly: true },
      { id: 'PIPELINES', label: 'Pipelines', icon: Sliders, restricted: true, adminOnly: false },
      { id: 'TEMPLATES', label: 'Email Templates', icon: Mail, restricted: true, adminOnly: false },
      { id: 'INTEGRATIONS', label: 'Integrations', icon: Puzzle, restricted: true, adminOnly: false },
      { id: 'SUBSCRIPTION', label: 'Subscription & Billing', icon: Package, restricted: false, adminOnly: false },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    if (item.adminOnly && !canManageRoleTitles) return false;
    if (item.restricted && !canAccessRestrictedSettings) return false;
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <Card className="w-full md:w-64 h-fit shrink-0 overflow-hidden">
          <div className="p-4 bg-muted/30 border-b">
              <h2 className="font-semibold">Settings</h2>
          </div>
          <div className="p-2 space-y-1">
              {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as SettingsSection)}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        activeSection === item.id 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                  </button>
              ))}
          </div>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
          
          {/* PROFILE */}
          {activeSection === 'PROFILE' && (
              <div className="space-y-6">
                  {isLoadingProfile ? (
                      <Card>
                          <CardContent className="p-12">
                              <div className="flex flex-col items-center justify-center gap-3">
                                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                  <p className="text-sm text-muted-foreground">Loading profile...</p>
                              </div>
                          </CardContent>
                      </Card>
                  ) : (
                      <Card>
                          <CardHeader>
                              <div className="flex items-center justify-between">
                                  <div>
                                      <CardTitle>User Profile</CardTitle>
                                      <CardDescription>View and manage your account information.</CardDescription>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <span className={cn(
                                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                                          profile.isActive 
                                              ? "bg-green-500/10 text-green-500" 
                                              : "bg-red-500/10 text-red-500"
                                      )}>
                                          {profile.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                  </div>
                              </div>
                          </CardHeader>
                          <CardContent className="space-y-8">
                              <div className="flex items-start gap-6 pb-6 border-b">
                                  <Avatar name={profile.name} className="h-24 w-24 text-2xl" />
                                  <div className="flex-1 space-y-3">
                                      <div>
                                          <h3 className="text-2xl font-semibold">{profile.name || 'User'}</h3>
                                          <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary">
                                              {profile.role.replace(/_/g, ' ')}
                                          </span>
                                          {profile.vendorId && (
                                              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-500">
                                                  Vendor Member
                                              </span>
                                          )}
                                      </div>
                                  </div>
                              </div>

                              <div className="space-y-6">
                                  <div>
                                      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                          <User className="h-4 w-4" />
                                          Personal Information
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                              <input 
                                                  className="w-full p-2.5 rounded-md border bg-background" 
                                                  value={profile.firstName} 
                                                  onChange={(e) => setProfile({...profile, firstName: e.target.value})} 
                                              />
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                              <input 
                                                  className="w-full p-2.5 rounded-md border bg-background" 
                                                  value={profile.lastName} 
                                                  onChange={(e) => setProfile({...profile, lastName: e.target.value})} 
                                              />
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                              <input 
                                                  className="w-full p-2.5 rounded-md border bg-muted/30" 
                                                  value={profile.email} 
                                                  disabled 
                                              />
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                              <input 
                                                  className="w-full p-2.5 rounded-md border bg-background" 
                                                  value={profile.phone} 
                                                  onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                                                  placeholder="Enter phone number"
                                              />
                                          </div>
                                      </div>
                                      <div className="space-y-2 mt-4">
                                          <label className="text-sm font-medium text-muted-foreground">Bio</label>
                                          <textarea 
                                              className="w-full p-2.5 rounded-md border bg-background h-24 resize-none" 
                                              value={profile.bio} 
                                              onChange={(e) => setProfile({...profile, bio: e.target.value})} 
                                              placeholder="Tell us about yourself..."
                                          />
                                      </div>
                                  </div>

                                  <div className="border-t pt-6">
                                      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                          <Shield className="h-4 w-4" />
                                          Account Details
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                              <div className="p-3 rounded-md border bg-muted/30">
                                                  <p className="text-sm font-mono break-all">{profile.id}</p>
                                              </div>
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">Role</label>
                                              <div className="p-3 rounded-md border bg-muted/30">
                                                  <p className="text-sm">{profile.role.replace(/_/g, ' ')}</p>
                                              </div>
                                          </div>
                                          {profile.vendorId && (
                                              <div className="space-y-2">
                                                  <label className="text-sm font-medium text-muted-foreground">Vendor ID</label>
                                                  <div className="p-3 rounded-md border bg-muted/30">
                                                      <p className="text-sm font-mono break-all">{profile.vendorId}</p>
                                                  </div>
                                              </div>
                                          )}
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                                              <div className="p-3 rounded-md border bg-muted/30">
                                                  <p className="text-sm">{profile.isActive ? 'Active' : 'Inactive'}</p>
                                              </div>
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                                              <div className="p-3 rounded-md border bg-muted/30">
                                                  <p className="text-sm">{profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'}</p>
                                              </div>
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                              <div className="p-3 rounded-md border bg-muted/30">
                                                  <p className="text-sm">{profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'N/A'}</p>
                                              </div>
                                          </div>
                                          {profile.lastLogin && (
                                              <div className="space-y-2">
                                                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                                                  <div className="p-3 rounded-md border bg-muted/30">
                                                      <p className="text-sm">{new Date(profile.lastLogin).toLocaleString()}</p>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  </div>

                                  <div className="flex justify-end pt-4 border-t">
                                      <Button onClick={handleSaveProfile}>
                                          <Save className="mr-2 h-4 w-4" />
                                          Save Changes
                                      </Button>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  )}

                  <Card>
                      <CardHeader>
                          <CardTitle>Security</CardTitle>
                          <CardDescription>Update your password and security preferences.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                  <Lock className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                      <p className="font-medium text-sm">Password</p>
                                      <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                                  </div>
                              </div>
                              <Button variant="outline" size="sm">Update</Button>
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                  <Bell className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                      <p className="font-medium text-sm">2-Factor Authentication</p>
                                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                                  </div>
                              </div>
                              <Button variant="outline" size="sm">Enable</Button>
                          </div>
                      </CardContent>
                  </Card>
              </div>
          )}

          {/* ORGANIZATION */}
          {activeSection === 'ORG' && canAccessRestrictedSettings && (
              <Card>
                  <CardHeader>
                      <CardTitle>Organization Settings</CardTitle>
                      <CardDescription>Configure your company details and branding.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 md:space-y-8">
                      {/* General Info Section */}
                      <div className="space-y-4">
                          <h3 className="text-sm font-bold uppercase text-muted-foreground">General Info</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-sm font-medium block">Company Name</label>
                                  <input 
                                      className="w-full p-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors" 
                                      value={localName} 
                                      onChange={(e) => setLocalName(e.target.value)}
                                      placeholder="Your Company Name" 
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium block">Contact Email</label>
                                  <input 
                                      type="email" 
                                      className="w-full p-2.5 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors" 
                                      placeholder="contact@company.com" 
                                      value={localWebsite} 
                                      onChange={(e) => setLocalWebsite(e.target.value)} 
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Theme & Branding Section */}
                      <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <h3 className="text-sm font-bold uppercase text-muted-foreground">Theme & Branding</h3>
                              <div className="flex flex-wrap items-center gap-2">
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setIsDarkMode(!isDarkMode)}
                                      className="flex items-center gap-2"
                                  >
                                      {isDarkMode ? (
                                          <><Sun className="h-3 w-3" /> <span className="hidden xs:inline">Light Mode</span></>
                                      ) : (
                                          <><Moon className="h-3 w-3" /> <span className="hidden xs:inline">Dark Mode</span></>
                                      )}
                                  </Button>
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={resetTheme}
                                      className="flex items-center gap-2"
                                  >
                                      <RefreshCw className="h-3 w-3" />
                                      <span className="hidden xs:inline">Reset</span>
                                  </Button>
                              </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Color Picker */}
                              <div className="space-y-4 min-w-0">
                                  <ColorPicker
                                      value={localColor}
                                      onChange={(color) => {
                                          setLocalColor(color);
                                          previewColor(color);
                                      }}
                                      onPreview={previewColor}
                                      label="Primary Color"
                                      showPalette={true}
                                      className="w-full"
                                  />
                                  
                                  {/* Preview Actions */}
                                  <div className="flex gap-2">
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={applyPreview}
                                          className="flex-1"
                                      >
                                          <Check className="h-3 w-3 mr-1" />
                                          <span className="hidden xs:inline">Apply Preview</span>
                                          <span className="inline xs:hidden">Apply</span>
                                      </Button>
                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={cancelPreview}
                                          className="flex-1"
                                      >
                                          Cancel
                                      </Button>
                                  </div>
                              </div>

                              {/* Logo Upload & Preview */}
                              <div className="space-y-4 min-w-0">
                                  <div>
                                      <label className="text-sm font-medium block mb-2">Company Logo</label>
                                      <div className="h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/20 cursor-pointer transition-colors group">
                                          <Upload className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                                          <span className="text-xs text-center px-2">Click to upload logo<br />PNG, JPG up to 2MB</span>
                                      </div>
                                  </div>
                                  
                                  {/* Theme Preview */}
                                  <div className="space-y-2">
                                      <label className="text-sm font-medium block">Theme Preview</label>
                                      <div className="p-4 rounded-lg border bg-card space-y-3">
                                          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                                              <Button size="sm" className="flex-1">Primary</Button>
                                              <Button variant="secondary" size="sm" className="flex-1">Secondary</Button>
                                          </div>
                                          <div className="text-xs text-muted-foreground text-center">
                                              Live preview of your theme
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Save Button */}
                      <div className="pt-4 border-t flex flex-col sm:flex-row justify-end gap-2">
                          <Button onClick={handleSaveOrg} className="w-full sm:w-auto">
                              <Save className="mr-2 h-4 w-4" /> Save Changes
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* TEAM */}
          {activeSection === 'TEAM' && (
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                          <CardTitle>Team Management</CardTitle>
                          <CardDescription>Manage users and invitations.</CardDescription>
                      </div>
                      {canAccessRestrictedSettings && (
                        <Button onClick={() => setIsInviteModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Invite User
                        </Button>
                      )}
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {teamMembers.map(member => (
                              <div key={member.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/10 transition-colors">
                                  <div className="flex items-center gap-4">
                                      <Avatar name={member.name} className="h-10 w-10" />
                                      <div>
                                          <p className="font-medium text-sm">{member.name}</p>
                                          <p className="text-xs text-muted-foreground">{member.email}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <span className={cn(
                                          "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                          member.status === 'Active' ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                      )}>
                                          {member.status}
                                      </span>
                                      <span className="text-sm text-muted-foreground w-32 text-right">{member.role}</span>
                                      <Button variant="ghost" size="icon">
                                          <Edit2 className="h-4 w-4" />
                                      </Button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* ROLES */}
          {activeSection === 'ROLES' && canAccessRestrictedSettings && (
              <Card>
                  <CardHeader>
                      <CardTitle>Roles & Permissions</CardTitle>
                      <CardDescription>Control access levels for your team.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="border rounded-xl overflow-hidden">
                          <table className="w-full text-sm">
                              <thead className="bg-muted/40">
                                  <tr>
                                      <th className="text-left py-3 px-6 font-medium text-muted-foreground">Permission</th>
                                      <th className="text-center py-3 px-4 font-medium">Admin</th>
                                      <th className="text-center py-3 px-4 font-medium">Manager</th>
                                      <th className="text-center py-3 px-4 font-medium">Agent</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y">
                                  {permissions.map(perm => (
                                      <tr key={perm.id} className="hover:bg-muted/5 transition-colors">
                                          <td className="py-3 px-6 font-medium">{perm.name}</td>
                                          <td className="text-center">
                                              <div className="flex justify-center"><Check className="h-5 w-5 text-primary fill-primary/10" /></div>
                                          </td>
                                          <td className="text-center cursor-pointer" onClick={() => togglePermission(perm.id, 'manager')}>
                                              <div className="flex justify-center transition-all hover:scale-110">
                                                  {perm.manager 
                                                      ? <Check className="h-5 w-5 text-primary fill-primary/10" /> 
                                                      : <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />}
                                              </div>
                                          </td>
                                          <td className="text-center cursor-pointer" onClick={() => togglePermission(perm.id, 'agent')}>
                                              <div className="flex justify-center transition-all hover:scale-110">
                                                  {perm.agent 
                                                      ? <Check className="h-5 w-5 text-primary fill-primary/10" /> 
                                                      : <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />}
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* ROLE TITLES */}
          {activeSection === 'ROLE_TITLES' && canManageRoleTitles && (
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                          <CardTitle>Role Titles & Hierarchy</CardTitle>
                          <CardDescription>Create custom role titles mapped to system roles for your organization.</CardDescription>
                      </div>
                      <Button onClick={() => {
                        setEditingRoleTitle(null);
                        setNewRoleTitle('');
                        setNewRoleSystemRole('SALES_REP');
                        setNewRoleDescription('');
                        setIsRoleTitleModalOpen(true);
                      }}>
                          <Plus className="mr-2 h-4 w-4" /> Add Role Title
                      </Button>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-3">
                          {isLoadingRoleTitles && (
                            <div className="text-sm text-muted-foreground">Loading role titles...</div>
                          )}
                          {roleTitles.map(role => (
                              <div 
                                  key={role.id} 
                                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/10 transition-colors"
                              >
                                  <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                          <Briefcase className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                          <h4 className="font-medium">{role.title}</h4>
                                          <div className="flex items-center gap-2 mt-1">
                                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                  {role.systemRole.replace('_', ' ')}
                                              </span>
                                              {role.description && (
                                                  <span className="text-sm text-muted-foreground">• {role.description}</span>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <Button 
                                          variant="outline" 
                                          size="sm"
                                          disabled={isSavingRoleTitle}
                                          onClick={() => handleEditRoleTitle(role)}
                                      >
                                          <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                          variant="outline" 
                                          size="sm"
                                          disabled={isSavingRoleTitle}
                                          onClick={() => handleDeleteRoleTitle(role.id)}
                                      >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                  </div>
                              </div>
                          ))}
                          {roleTitles.length === 0 && (
                              <div className="text-center py-12 text-muted-foreground">
                                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                  <p>No custom role titles yet. Create one to get started.</p>
                              </div>
                          )}
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* PIPELINES */}
          {activeSection === 'PIPELINES' && canAccessRestrictedSettings && (
              <Card>
                  <CardHeader>
                      <CardTitle>Deal Pipelines</CardTitle>
                      <CardDescription>Customize your sales stages.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="space-y-2">
                          {pipeline.map((stage, idx) => (
                              <div key={stage.id} className="flex items-center gap-3 p-3 bg-card border rounded-lg group hover:shadow-md transition-all">
                                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                                  <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white", stage.color)}>
                                      {idx + 1}
                                  </div>
                                  <span className="flex-1 font-medium text-sm">{stage.name}</span>
                                  
                                  <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveStage(idx, 'up')} disabled={idx === 0}>
                                          <div className="rotate-180">▼</div>
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveStage(idx, 'down')} disabled={idx === pipeline.length - 1}>
                                          <div>▼</div>
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 text-red-500">
                                          <Trash2 className="h-4 w-4" />
                                      </Button>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="flex gap-2">
                          <input 
                              className="flex-1 p-2 rounded-md border bg-background" 
                              placeholder="New Stage Name" 
                              value={newStageName}
                              onChange={(e) => setNewStageName(e.target.value)}
                          />
                          <Button onClick={() => {
                              if(newStageName) {
                                  setPipeline([...pipeline, { id: Math.random().toString(), name: newStageName, color: 'bg-gray-500', order: pipeline.length + 1 }]);
                                  setNewStageName('');
                              }
                          }}>
                              <Plus className="mr-2 h-4 w-4" /> Add Stage
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* TEMPLATES */}
          {activeSection === 'TEMPLATES' && canAccessRestrictedSettings && (
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                          <CardTitle>Email Templates</CardTitle>
                          <CardDescription>Standardize your communications.</CardDescription>
                      </div>
                      <Button onClick={() => { setEditingTemplate({}); setIsTemplateModalOpen(true); }}>
                          <Plus className="mr-2 h-4 w-4" /> New Template
                      </Button>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {templates.map(tpl => (
                              <div key={tpl.id} className="border rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer group" onClick={() => { setEditingTemplate(tpl); setIsTemplateModalOpen(true); }}>
                                  <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-primary" />
                                          <h3 className="font-semibold text-sm">{tpl.name}</h3>
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(tpl.id); }}>
                                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                                      </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/30 p-2 rounded">
                                      {tpl.body}
                                  </p>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* INTEGRATIONS */}
          {activeSection === 'INTEGRATIONS' && canAccessRestrictedSettings && (
              <Card>
                  <CardHeader>
                      <CardTitle>Integrations</CardTitle>
                      <CardDescription>Connect external tools and services.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {integrations.map(integration => (
                              <div key={integration.id} className="flex items-center justify-between p-4 border rounded-xl">
                                  <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                                          <Puzzle className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div>
                                          <h3 className="font-medium text-sm">{integration.name}</h3>
                                          <p className="text-xs text-muted-foreground">{integration.description}</p>
                                      </div>
                                  </div>
                                  <Button 
                                      variant={integration.status === 'CONNECTED' ? 'outline' : 'primary'}
                                      size="sm"
                                      onClick={() => {
                                          setIntegrations(prev => prev.map(i => i.id === integration.id ? {...i, status: i.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED'} : i));
                                          showToast(`${integration.name} updated`);
                                      }}
                                  >
                                      {integration.status === 'CONNECTED' ? 'Disconnect' : 'Connect'}
                                  </Button>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          )}

          {/* SUBSCRIPTION */}
          {activeSection === 'SUBSCRIPTION' && (
              <SubscriptionSettings />
          )}

          {/* BILLING */}
          {activeSection === 'BILLING' && canAccessRestrictedSettings && (
            subscription ? (
              <div className="space-y-6">
                  {/* Current Subscription & Payment Method Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                          <CardHeader>
                              <CardTitle>Current Plan</CardTitle>
                              <CardDescription>Manage your subscription details.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl border border-primary/20">
                                  <div>
                                      <h3 className="text-lg font-bold text-primary">{subscription.plan} Plan</h3>
                                      <p className="text-sm text-muted-foreground">
                                          {subscription.amount > 0 ? `$${subscription.amount}/${subscription.billingCycle.toLowerCase()}` : 'Free Tier'}
                                      </p>
                                  </div>
                                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                      {subscription.status}
                                  </span>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground px-1">
                                  <span>Next billing date</span>
                                  <span>{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</span>
                              </div>
                              <Button variant="outline" size="sm" onClick={handleCancelSubscription}>Cancel Subscription</Button>
                          </CardContent>
                      </Card>

                      <Card>
                          <CardHeader>
                              <CardTitle>Payment Method</CardTitle>
                              <CardDescription>Update your billing information.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              {cardData.number && cardData.number !== '' ? (
                                  <div className="flex items-center gap-4 p-4 border rounded-xl">
                                      <div className="h-10 w-14 bg-neutral-100 rounded flex items-center justify-center">
                                          <CreditCard className="h-6 w-6 text-neutral-600" />
                                      </div>
                                      <div>
                                          <p className="font-medium text-sm">Card ending in {cardData.number.slice(-4)}</p>
                                          <p className="text-xs text-muted-foreground">Expires {cardData.expiry}</p>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="p-4 border border-dashed rounded-xl text-center">
                                      <p className="text-sm text-muted-foreground">No payment method added</p>
                                  </div>
                              )}
                              <Button variant="outline" className="w-full" onClick={() => setIsPaymentModalOpen(true)}>
                                  {cardData.number ? 'Update Card' : 'Add Payment Method'}
                              </Button>
                          </CardContent>
                      </Card>
                  </div>

                  {/* Available Plans */}
                  <Card>
                      <CardHeader>
                          <CardTitle>Available Plans</CardTitle>
                          <CardDescription>Upgrade or downgrade your workspace plan.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {plans.map((plan: any) => (
                                  <div key={plan.id} className={cn(
                                      "border rounded-xl p-6 flex flex-col transition-all",
                                      subscription.plan === plan.name ? "border-primary ring-1 ring-primary bg-primary/5" : "hover:border-primary/50"
                                  )}>
                                      <h3 className="font-bold text-lg">{plan.name}</h3>
                                      <div className="text-2xl font-bold mt-2 mb-4">${plan.monthlyPrice}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                                      <ul className="space-y-2 mb-6 flex-1">
                                          {plan.features && Array.isArray(plan.features) ? plan.features.map((feat: string, i: number) => (
                                              <li key={i} className="text-sm flex items-center gap-2 text-muted-foreground">
                                                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> {feat}
                                              </li>
                                          )) : (
                                              <li className="text-sm text-muted-foreground">Max {plan.maxUsers} users, {plan.maxProperties} properties</li>
                                          )}
                                      </ul>
                                      <Button 
                                          variant={subscription.plan === plan.name ? "outline" : "primary"}
                                          disabled={subscription.plan === plan.name}
                                          onClick={() => handleSubscribe(plan.name)}
                                      >
                                          {subscription.plan === plan.name ? 'Current Plan' : 'Switch Plan'}
                                      </Button>
                                  </div>
                              ))}
                          </div>
                      </CardContent>
                  </Card>

                  {/* Invoice History */}
                  <Card>
                      <CardHeader>
                          <CardTitle>Invoice History</CardTitle>
                          <CardDescription>View and download past invoices.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="rounded-xl border overflow-hidden">
                              <table className="w-full text-sm">
                                  <thead className="bg-muted/40 text-muted-foreground border-b uppercase text-xs font-semibold">
                                      <tr>
                                          <th className="px-6 py-3 text-left">Invoice Number</th>
                                          <th className="px-6 py-3 text-left">Bill Date</th>
                                          <th className="px-6 py-3 text-left">Due Date</th>
                                          <th className="px-6 py-3 text-left">Amount</th>
                                          <th className="px-6 py-3 text-left">Status</th>
                                          <th className="px-6 py-3 text-right">Download</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                      {invoices && invoices.length > 0 ? invoices.map((inv: any) => (
                                          <tr key={inv.id} className="hover:bg-muted/5">
                                              <td className="px-6 py-3 font-medium">{inv.invoiceNumber || inv.id}</td>
                                              <td className="px-6 py-3">{inv.billDate ? new Date(inv.billDate).toLocaleDateString() : 'N/A'}</td>
                                              <td className="px-6 py-3">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'}</td>
                                              <td className="px-6 py-3">${inv.total || inv.amount ? (inv.total || inv.amount).toFixed(2) : '0.00'}</td>
                                              <td className="px-6 py-3">
                                                  <span className={cn(
                                                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                                      inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                                                      inv.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                      'bg-gray-100 text-gray-700'
                                                  )}>
                                                      {inv.status}
                                                  </span>
                                              </td>
                                              <td className="px-6 py-3 text-right">
                                                  {inv.pdfUrl && (
                                                      <Button 
                                                          variant="ghost" 
                                                          size="sm" 
                                                          className="h-8 w-8 p-0"
                                                          onClick={() => window.open(inv.pdfUrl, '_blank')}
                                                      >
                                                          <Download className="h-4 w-4" />
                                                      </Button>
                                                  )}
                                              </td>
                                          </tr>
                                      )) : (
                                          <tr>
                                              <td colSpan={6} className="p-8 text-center text-muted-foreground">No invoices found.</td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </CardContent>
                  </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Not Available</CardTitle>
                  <CardDescription>Billing information is currently not available. Please check your subscription in the Subscription Plans tab.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No billing data found. You may be using the new subscription system.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveSection('SUBSCRIPTION')}
                    >
                      View Subscription Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
      </div>

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Team Member">
          <div className="space-y-4 py-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <input className="w-full p-2.5 rounded-md border bg-background" placeholder="Jane" value={inviteFirstName} onChange={(e) => setInviteFirstName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <input className="w-full p-2.5 rounded-md border bg-background" placeholder="Doe" value={inviteLastName} onChange={(e) => setInviteLastName(e.target.value)} />
                                    </div>
                            </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input className="w-full p-2.5 rounded-md border bg-background" placeholder="email@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                                    <select className="w-full p-2.5 rounded-md border bg-background" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as any)}>
                                            <option value="SALES_REP">Sales Rep</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="VENDOR_ADMIN">Vendor Admin</option>
                                            <option value="CLIENT">Client</option>
                  </select>
              </div>
                            <Button 
                                className="w-full" 
                                disabled={isInviting || !inviteEmail || !inviteFirstName || !inviteLastName}
                                onClick={async () => {
                                    setIsInviting(true);
                                    try {
                                        const response = await graphqlRequest(INVITE_USER_MUTATION, {
                                            input: {
                                                email: inviteEmail,
                                                firstName: inviteFirstName,
                                                lastName: inviteLastName,
                                                role: inviteRole,
                                                vendorId: profile.vendorId || undefined
                                            }
                                        });
                                        const token = response?.inviteUser?.inviteToken;
                                        if (token && canAccessRestrictedSettings) {
                                            const fullUrl = `${window.location.origin}/accept-invite?token=${token}`;
                                            setInviteLink(fullUrl);
                                            setIsInviteLinkModalOpen(true);
                                        }
                                        showToast(`Invitation sent to ${inviteEmail}`);
                                        setIsInviteModalOpen(false);
                                        setInviteEmail('');
                                        setInviteFirstName('');
                                        setInviteLastName('');
                                        setInviteRole('SALES_REP');
                                    } catch (err: any) {
                                        showToast(err.message || 'Failed to send invite', 'error');
                                    } finally {
                                        setIsInviting(false);
                                    }
                                }}
                            >
                                {isInviting ? 'Sending...' : 'Send Invitation'}
                            </Button>
          </div>
      </Modal>

      {/* Template Modal */}
      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title={editingTemplate?.id ? 'Edit Template' : 'New Template'}>
          <form onSubmit={handleSaveTemplate} className="space-y-4 py-2">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Template Name</label>
                  <input className="w-full p-2.5 rounded-md border bg-background" required value={editingTemplate?.name || ''} onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <input className="w-full p-2.5 rounded-md border bg-background" required value={editingTemplate?.subject || ''} onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Email Body</label>
                  <textarea className="w-full p-2.5 rounded-md border bg-background h-32 resize-none" required value={editingTemplate?.body || ''} onChange={(e) => setEditingTemplate({...editingTemplate, body: e.target.value})} />
                  <p className="text-xs text-muted-foreground">Available variables: {'{LeadName}'}, {'{CompanyName}'}, {'{AgentName}'}</p>
              </div>
              <Button type="submit" className="w-full">Save Template</Button>
          </form>
      </Modal>

      {/* Payment Method Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title={cardData.number ? "Update Payment Method" : "Add Payment Method"}>
          <div className="space-y-4 py-2">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input 
                          className="w-full pl-9 p-2.5 rounded-md border bg-background" 
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={cardData.number} 
                          onChange={(e) => setCardData({...cardData, number: e.target.value})} 
                      />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry (MM/YY)</label>
                      <input 
                          className="w-full p-2.5 rounded-md border bg-background" 
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardData.expiry} 
                          onChange={(e) => setCardData({...cardData, expiry: e.target.value})} 
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">CVC</label>
                      <input 
                          className="w-full p-2.5 rounded-md border bg-background" 
                          placeholder="123"
                          maxLength={4}
                          type="password"
                          value={cardData.cvc} 
                          onChange={(e) => setCardData({...cardData, cvc: e.target.value})} 
                      />
                  </div>
              </div>
              <div className="flex gap-2">
                  <Button className="flex-1" onClick={cardData.number && subscription.paymentMethodId ? handleUpdateCard : handleAddPaymentMethod}>
                      {cardData.number && subscription.paymentMethodId ? 'Update Card' : 'Add Card'}
                  </Button>
                  {subscription?.paymentMethodId && (
                      <Button variant="outline" className="flex-1" onClick={() => handleRemovePaymentMethod(subscription.paymentMethodId)}>
                          Remove
                      </Button>
                  )}
              </div>
          </div>
      </Modal>

      {/* Invite Link Modal */}
      <Modal 
        isOpen={isInviteLinkModalOpen} 
        onClose={() => {
          setIsInviteLinkModalOpen(false);
          setIsCopied(false);
        }} 
        title="Invitation Sent Successfully"
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Copy this link and send it to the invited user. They'll be able to accept the invitation and set up their account.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Invitation Link</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 p-2.5 rounded-md border bg-background font-mono text-xs"
                value={inviteLink}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button 
                onClick={handleCopyLink}
                className="px-4"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              This invitation link will expire in 7 days.
            </p>
          </div>
        </div>
      </Modal>

      {/* Role Title Modal */}
      <Modal
        isOpen={isRoleTitleModalOpen}
        onClose={() => {
          setIsRoleTitleModalOpen(false);
          setEditingRoleTitle(null);
          setNewRoleTitle('');
          setNewRoleSystemRole('SALES_REP');
          setNewRoleDescription('');
        }}
        title={editingRoleTitle ? 'Edit Role Title' : 'Create Role Title'}
      >
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Role Title *</label>
            <input
              className="w-full p-2.5 rounded-md border bg-background"
              placeholder="e.g., Senior Sales Representative"
              value={newRoleTitle}
              onChange={(e) => setNewRoleTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">System Role *</label>
            <select
              className="w-full p-2.5 rounded-md border bg-background"
              value={newRoleSystemRole}
              onChange={(e) => setNewRoleSystemRole(e.target.value)}
            >
              <option value="SALES_REP">Sales Representative</option>
              <option value="MANAGER">Manager</option>
                            <option value="CLIENT">Client</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Maps this title to a system role that determines permissions
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full p-2.5 rounded-md border bg-background resize-none"
              placeholder="Brief description of this role..."
              rows={3}
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsRoleTitleModalOpen(false);
                setEditingRoleTitle(null);
                setNewRoleTitle('');
                setNewRoleSystemRole('SALES_REP');
                setNewRoleDescription('');
              }}
            >
              Cancel
            </Button>
                        <Button
                            className="flex-1"
                            onClick={handleSaveRoleTitle}
                            disabled={isSavingRoleTitle}
                        >
                            {isSavingRoleTitle
                                ? 'Saving...'
                                : editingRoleTitle ? 'Update' : 'Create'} Role
                        </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};