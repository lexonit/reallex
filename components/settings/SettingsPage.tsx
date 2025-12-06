
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../Card';
import { Button } from '../Button';
import { Toast } from '../ui/Toast';
import { Modal } from '../ui/Modal';
import { 
  User, Building2, Users, Shield, Sliders, Mail, Puzzle, 
  Save, Plus, Trash2, Check, CreditCard, Bell, Lock, 
  GripVertical, Edit2, Upload, Search, FileText, Download, CheckCircle
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';
import { Integration, PipelineStage, NavigationTab } from '../../types';
import { MOCK_INTEGRATIONS, DEFAULT_PIPELINE, MOCK_AGENTS } from '../../constants';
import { Avatar } from '../ui/Avatar';
import { graphqlRequest } from '../../lib/graphql';

type SettingsSection = 'PROFILE' | 'ORG' | 'TEAM' | 'ROLES' | 'PIPELINES' | 'TEMPLATES' | 'INTEGRATIONS' | 'BILLING';

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
  const { companyName, setCompanyName, primaryColor, setPrimaryColor, saveTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('PROFILE');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // --- Profile State ---
  const [profile, setProfile] = useState({
      name: 'John Doe',
      email: 'admin@prestige.com',
      phone: '+1 (555) 000-0000',
      bio: 'Senior Broker with 15 years experience.'
  });

  // --- Org State ---
  const [localName, setLocalName] = useState(companyName);
  const [localColor, setLocalColor] = useState(primaryColor);
  const [localWebsite, setLocalWebsite] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  
  // --- Team State ---
  const [teamMembers, setTeamMembers] = useState(MOCK_AGENTS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // --- Pipeline State ---
  const [pipeline, setPipeline] = useState<PipelineStage[]>(DEFAULT_PIPELINE);
  const [newStageName, setNewStageName] = useState('');

  // --- Roles State ---
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);

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

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const query = `
                query GetData {
                    organization {
                        name
                        primaryColor
                        website
                        address
                    }
                    emailTemplates {
                        id
                        name
                        subject
                        body
                    }
                    currentSubscription {
                        plan
                        status
                        nextBillingDate
                        amount
                        paymentMethod {
                            last4
                            brand
                        }
                    }
                    invoices {
                        id
                        date
                        amount
                        status
                        pdfUrl
                    }
                    availablePlans {
                        id
                        name
                        price
                        features
                    }
                }
            `;
            const data = await graphqlRequest(query);
            if (data.organization) {
                setLocalName(data.organization.name);
                setCompanyName(data.organization.name);
                setLocalColor(data.organization.primaryColor);
                setPrimaryColor(data.organization.primaryColor);
                setLocalWebsite(data.organization.website || '');
                setLocalAddress(data.organization.address || '');
                saveTheme(); // Persist initial load
            }
            if (data.emailTemplates) {
                setTemplates(data.emailTemplates);
            }
            if (data.currentSubscription) setSubscription(data.currentSubscription);
            if (data.invoices) setInvoices(data.invoices);
            if (data.availablePlans) setPlans(data.availablePlans);

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

  const handleSaveProfile = () => {
      showToast('Profile updated successfully');
  };

  const handleSaveOrg = async () => {
      const mutation = `
        mutation UpdateOrg($name: String, $primaryColor: String, $website: String, $address: String) {
            updateOrganization(name: $name, primaryColor: $primaryColor, website: $website, address: $address) {
                name
                primaryColor
            }
        }
      `;
      try {
          await graphqlRequest(mutation, {
              name: localName,
              primaryColor: localColor,
              website: localWebsite,
              address: localAddress
          });
          setCompanyName(localName);
          setPrimaryColor(localColor);
          saveTheme();
          showToast('Organization settings saved');
      } catch (err) {
          showToast('Failed to save settings', 'error');
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
              const mutation = `
                mutation UpdateTemplate($id: ID!, $name: String, $subject: String, $body: String) {
                    updateEmailTemplate(id: $id, name: $name, subject: $subject, body: $body) {
                        id
                        name
                        subject
                        body
                    }
                }
              `;
              const res = await graphqlRequest(mutation, {
                  id: editingTemplate.id,
                  name: editingTemplate.name,
                  subject: editingTemplate.subject,
                  body: editingTemplate.body
              });
              setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? res.updateEmailTemplate : t));
          } else {
              const mutation = `
                mutation CreateTemplate($name: String!, $subject: String!, $body: String!) {
                    createEmailTemplate(name: $name, subject: $subject, body: $body) {
                        id
                        name
                        subject
                        body
                    }
                }
              `;
              const res = await graphqlRequest(mutation, {
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
          const mutation = `
            mutation DeleteTemplate($id: ID!) {
                deleteEmailTemplate(id: $id) {
                    id
                }
            }
          `;
          await graphqlRequest(mutation, { id });
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

  // --- Billing Handlers ---
  const handleUpdateCard = async () => {
      if (cardData.number.length < 16) {
          showToast('Invalid card number', 'error');
          return;
      }
      try {
          const mutation = `
            mutation UpdateCard($cardNumber: String!) {
                updatePaymentMethod(cardNumber: $cardNumber)
            }
          `;
          await graphqlRequest(mutation, { cardNumber: cardData.number });
          setSubscription({
              ...subscription,
              paymentMethod: { ...subscription.paymentMethod, last4: cardData.number.slice(-4) }
          });
          setIsPaymentModalOpen(false);
          setCardData({ number: '', expiry: '', cvc: '' });
          showToast('Payment method updated');
      } catch (err) {
          showToast('Failed to update card', 'error');
      }
  };

  const handleSubscribe = async (planId: string) => {
      try {
          const mutation = `
            mutation Subscribe($planId: String!) {
                subscribe(planId: $planId) {
                    plan
                    status
                    nextBillingDate
                    amount
                }
            }
          `;
          const res = await graphqlRequest(mutation, { planId });
          setSubscription({ ...subscription, ...res.subscribe });
          
          // Refresh invoices if paid plan
          const invQuery = `query { invoices { id date amount status } }`;
          const invData = await graphqlRequest(invQuery);
          if (invData.invoices) setInvoices(invData.invoices);

          showToast(`Subscribed to ${res.subscribe.plan} plan`);
      } catch (err) {
          showToast('Subscription failed', 'error');
      }
  };

  const menuItems = [
      { id: 'PROFILE', label: 'My Profile', icon: User },
      { id: 'ORG', label: 'Organization', icon: Building2 },
      { id: 'TEAM', label: 'Team Members', icon: Users },
      { id: 'ROLES', label: 'Roles & Permissions', icon: Shield },
      { id: 'PIPELINES', label: 'Pipelines', icon: Sliders },
      { id: 'TEMPLATES', label: 'Email Templates', icon: Mail },
      { id: 'INTEGRATIONS', label: 'Integrations', icon: Puzzle },
      { id: 'BILLING', label: 'Billing & Subscription', icon: CreditCard },
  ];

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
                  <Card>
                      <CardHeader>
                          <CardTitle>Public Profile</CardTitle>
                          <CardDescription>Manage how you appear to clients and team members.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          <div className="flex items-center gap-6">
                              <Avatar name={profile.name} className="h-24 w-24 text-2xl" />
                              <div className="space-y-2">
                                  <Button variant="outline" size="sm">
                                      <Upload className="mr-2 h-4 w-4" /> Change Avatar
                                  </Button>
                                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max 1MB.</p>
                              </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Full Name</label>
                                  <input className="w-full p-2.5 rounded-md border bg-background" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Email</label>
                                  <input className="w-full p-2.5 rounded-md border bg-background" value={profile.email} disabled />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Phone</label>
                                  <input className="w-full p-2.5 rounded-md border bg-background" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Job Title</label>
                                  <input className="w-full p-2.5 rounded-md border bg-background" defaultValue="Admin" disabled />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-medium">Bio</label>
                              <textarea className="w-full p-2.5 rounded-md border bg-background h-24 resize-none" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                          </div>
                          <div className="flex justify-end">
                              <Button onClick={handleSaveProfile}>Save Changes</Button>
                          </div>
                      </CardContent>
                  </Card>

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
          {activeSection === 'ORG' && (
              <Card>
                  <CardHeader>
                      <CardTitle>Organization Settings</CardTitle>
                      <CardDescription>Configure your company details and branding.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                              <h3 className="text-sm font-bold uppercase text-muted-foreground">General Info</h3>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Company Name</label>
                                  <input className="w-full p-2.5 rounded-md border bg-background" value={localName} onChange={(e) => setLocalName(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Website</label>
                                  <input className="w-full p-2.5 rounded-md border bg-background" placeholder="https://..." value={localWebsite} onChange={(e) => setLocalWebsite(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Address</label>
                                  <textarea className="w-full p-2.5 rounded-md border bg-background h-20 resize-none" placeholder="Headquarters address" value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} />
                              </div>
                          </div>

                          <div className="space-y-4">
                              <h3 className="text-sm font-bold uppercase text-muted-foreground">Branding</h3>
                              <div>
                                  <label className="text-sm font-medium block mb-2">Primary Color</label>
                                  <div className="flex flex-wrap gap-3">
                                      {['#7c3aed', '#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#000000'].map(c => (
                                          <button 
                                              key={c}
                                              onClick={() => setLocalColor(c)}
                                              className={cn(
                                                  "h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
                                                  localColor === c ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
                                              )}
                                              style={{ backgroundColor: c }}
                                          />
                                      ))}
                                  </div>
                              </div>
                              <div>
                                  <label className="text-sm font-medium block mb-2">Logo</label>
                                  <div className="h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/20 cursor-pointer">
                                      <Upload className="h-6 w-6 mb-2" />
                                      <span className="text-xs">Click to upload logo</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="pt-4 border-t flex justify-end">
                          <Button onClick={handleSaveOrg}>
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
                      <Button onClick={() => setIsInviteModalOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" /> Invite User
                      </Button>
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
          {activeSection === 'ROLES' && (
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

          {/* PIPELINES */}
          {activeSection === 'PIPELINES' && (
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
          {activeSection === 'TEMPLATES' && (
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
          {activeSection === 'INTEGRATIONS' && (
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

          {/* BILLING */}
          {activeSection === 'BILLING' && subscription && (
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
                                          {subscription.amount > 0 ? `$${subscription.amount}/month` : 'Free Tier'}
                                      </p>
                                  </div>
                                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                      {subscription.status}
                                  </span>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground px-1">
                                  <span>Next billing date</span>
                                  <span>{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
                              </div>
                          </CardContent>
                      </Card>

                      <Card>
                          <CardHeader>
                              <CardTitle>Payment Method</CardTitle>
                              <CardDescription>Update your billing information.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="flex items-center gap-4 p-4 border rounded-xl">
                                  <div className="h-10 w-14 bg-neutral-100 rounded flex items-center justify-center">
                                      <CreditCard className="h-6 w-6 text-neutral-600" />
                                  </div>
                                  <div>
                                      <p className="font-medium text-sm">Visa ending in {subscription.paymentMethod?.last4 || '....'}</p>
                                      <p className="text-xs text-muted-foreground">Expires 12/25</p>
                                  </div>
                              </div>
                              <Button variant="outline" className="w-full" onClick={() => setIsPaymentModalOpen(true)}>Update Card</Button>
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
                                      <div className="text-2xl font-bold mt-2 mb-4">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                                      <ul className="space-y-2 mb-6 flex-1">
                                          {plan.features.map((feat: string, i: number) => (
                                              <li key={i} className="text-sm flex items-center gap-2 text-muted-foreground">
                                                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> {feat}
                                              </li>
                                          ))}
                                      </ul>
                                      <Button 
                                          variant={subscription.plan === plan.name ? "outline" : "primary"}
                                          disabled={subscription.plan === plan.name}
                                          onClick={() => handleSubscribe(plan.id)}
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
                                          <th className="px-6 py-3 text-left">Invoice ID</th>
                                          <th className="px-6 py-3 text-left">Date</th>
                                          <th className="px-6 py-3 text-left">Amount</th>
                                          <th className="px-6 py-3 text-left">Status</th>
                                          <th className="px-6 py-3 text-right">Download</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                      {invoices.map((inv: any) => (
                                          <tr key={inv.id} className="hover:bg-muted/5">
                                              <td className="px-6 py-3 font-medium">{inv.id}</td>
                                              <td className="px-6 py-3">{new Date(inv.date).toLocaleDateString()}</td>
                                              <td className="px-6 py-3">${inv.amount.toFixed(2)}</td>
                                              <td className="px-6 py-3">
                                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                      {inv.status}
                                                  </span>
                                              </td>
                                              <td className="px-6 py-3 text-right">
                                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                      <Download className="h-4 w-4" />
                                                  </Button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                              {invoices.length === 0 && <div className="p-8 text-center text-muted-foreground">No invoices found.</div>}
                          </div>
                      </CardContent>
                  </Card>
              </div>
          )}
      </div>

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Team Member">
          <div className="space-y-4 py-2">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input className="w-full p-2.5 rounded-md border bg-background" placeholder="email@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <select className="w-full p-2.5 rounded-md border bg-background">
                      <option>Sales Associate</option>
                      <option>Manager</option>
                      <option>Admin</option>
                  </select>
              </div>
              <Button className="w-full" onClick={() => { setIsInviteModalOpen(false); showToast(`Invitation sent to ${inviteEmail}`); setInviteEmail(''); }}>Send Invitation</Button>
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
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Update Payment Method">
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
                      <label className="text-sm font-medium">Expiry</label>
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
                          value={cardData.cvc} 
                          onChange={(e) => setCardData({...cardData, cvc: e.target.value})} 
                      />
                  </div>
              </div>
              <Button className="w-full" onClick={handleUpdateCard}>Update Card</Button>
          </div>
      </Modal>
    </div>
  );
};