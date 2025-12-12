import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/Button';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';
import { Plus, Mail, Loader2, Search, LayoutGrid, List as ListIcon, TrendingUp, DollarSign, Users, Award, Star, Eye, Copy, Check } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { cn } from '../../lib/utils';
import { Agent } from '../../types';
import { AgentDetail } from './AgentDetail';
import { graphqlRequest } from '../../lib/graphql';
import { GET_USERS_QUERY } from '../../graphql/queries/user.queries';
import { GET_LEADS_QUERY } from '../../graphql/queries/lead.queries';
import { GET_DEALS_QUERY } from '../../graphql/queries/deal.queries';
import { INVITE_USER_MUTATION } from '../../graphql/mutations/user.mutations';
import { useMe } from '../../hooks/useAuth';

export const UserManagement: React.FC = () => {
  const { data: meData } = useMe();
  const currentUserRole = meData?.me?.role || '';
  const canSeeInviteLink = ['SUPER_ADMIN', 'VENDOR_ADMIN', 'MANAGER'].includes(currentUserRole);

  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteRole, setInviteRole] = useState<'VENDOR_ADMIN' | 'MANAGER' | 'SALES_REP' | 'CLIENT'>('SALES_REP');
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [inviteLink, setInviteLink] = useState('');
  const [isInviteLinkModalOpen, setIsInviteLinkModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [users, setUsers] = useState<Agent[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamStats, setTeamStats] = useState({ totalRevenue: 0, activeDeals: 0, topPerformer: '—' });

  const currentUserVendorId = (meData as any)?.me?.vendorId;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        // For SUPER_ADMIN, fetch all users without vendor filter
        const filter = currentUserRole === 'SUPER_ADMIN' ? {} : { vendorId: currentUserVendorId };
        const data = await graphqlRequest(GET_USERS_QUERY, { 
          filter
        });
        let mapped: Agent[] = (data?.users || []).map((u: any) => ({
          id: u._id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email,
          role: u.role || 'SALES_REP',
          status: u.isActive ? 'Active' : 'Inactive',
          phone: '',
          licenseNumber: '—',
          bio: '',
          languages: [],
          specialties: [],
          joinedDate: u.createdAt || new Date().toISOString(),
          stats: {
            leads: 0,
            deals: 0,
            revenue: 0,
            rating: 0,
            newLeads: 0,
            appointments: 0,
            dealsThisMonth: 0
          }
        }));
        
        // Filter out admin roles unless current user is admin
        if (!['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(currentUserRole)) {
          mapped = mapped.filter(u => !['SUPER_ADMIN', 'VENDOR_ADMIN'].includes(u.role));
        }
        // Fetch leads and deals count per user and merge into stats
        try {
          const withLeadsAndDeals = await Promise.all(mapped.map(async (agent) => {
            try {
              const [leadData, dealData] = await Promise.all([
                graphqlRequest(GET_LEADS_QUERY, { filter: { assignedAgentId: agent.id } }),
                graphqlRequest(GET_DEALS_QUERY, { filter: { assignedAgentId: agent.id } })
              ]);
              const leadsCount = Array.isArray(leadData?.leads) ? leadData.leads.length : 0;
              const deals = Array.isArray(dealData?.deals) ? dealData.deals : [];
              const closedDeals = deals.filter((d: any) => d.stage === 'Closed Won');
              const revenue = closedDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
              return {
                ...agent,
                stats: { 
                  ...agent.stats, 
                  leads: leadsCount, 
                  newLeads: leadsCount,
                  deals: closedDeals.length,
                  revenue: revenue
                },
              } as Agent;
            } catch {
              return agent;
            }
          }));
          
          // Calculate team-wide stats
          const totalRevenue = withLeadsAndDeals.reduce((sum, a) => sum + a.stats.revenue, 0);
          const activeDeals = withLeadsAndDeals.reduce((sum, a) => sum + a.stats.deals, 0);
          const topAgent = withLeadsAndDeals.reduce((top, a) => 
            a.stats.revenue > top.stats.revenue ? a : top
          , withLeadsAndDeals[0] || { stats: { revenue: 0 }, name: '—' });
          
          setTeamStats({
            totalRevenue,
            activeDeals,
            topPerformer: topAgent?.name || '—'
          });
          
          setUsers(withLeadsAndDeals);
          setFilteredUsers(withLeadsAndDeals);
        } catch {
          setUsers(mapped);
          setFilteredUsers(mapped);
        }
      } catch (err: any) {
        setToast({ message: err.message || 'Failed to load users', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [currentUserVendorId, currentUserRole]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      ));
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchQuery]);

  const handleInvite = async () => {
    if (!inviteEmail || !inviteFirstName || !inviteLastName) return;
    setIsInviting(true);
    try {
      const response = await graphqlRequest(INVITE_USER_MUTATION, {
        input: {
          email: inviteEmail,
          firstName: inviteFirstName,
          lastName: inviteLastName,
          role: inviteRole
        }
      });

      // Optimistically add pending user to list
      const pending: Agent = {
        id: `pending-${Date.now()}`,
        name: `${inviteFirstName} ${inviteLastName}`.trim(),
        email: inviteEmail,
        role: inviteRole,
        status: 'Inactive',
        phone: '',
        licenseNumber: 'Pending',
        bio: '',
        languages: [],
        specialties: [],
        joinedDate: new Date().toISOString(),
        stats: {
          leads: 0,
          deals: 0,
          revenue: 0,
          rating: 0,
          newLeads: 0,
          appointments: 0,
          dealsThisMonth: 0
        }
      };

      const updated = [...users, pending];
      setUsers(updated);
      setFilteredUsers(updated);
      setSearchQuery('');

      // Generate invite link (only for authorized roles)
      const token = response?.inviteUser?.inviteToken;
      if (token && canSeeInviteLink) {
        const link = `${window.location.origin}/accept-invite?token=${token}`;
        setInviteLink(link);
        setIsInviteLinkModalOpen(true);
      }

      setIsInviteOpen(false);
      setInviteEmail('');
      setInviteFirstName('');
      setInviteLastName('');
      setInviteRole('SALES_REP');
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to send invite', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsInviting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Agent Detail View
  if (selectedAgentId) {
    const agent = users.find(u => u.id === selectedAgentId);
    if (agent) {
        return <AgentDetail agent={agent} onBack={() => setSelectedAgentId(null)} />;
    }
  }

  const columns = [
    { header: 'Agent', accessorKey: 'name' as any, cell: (u: Agent) => (
      <div className="flex items-center gap-3">
        <Avatar name={u.name} className="h-9 w-9" />
        <div>
          <div className="font-medium text-sm">{u.name}</div>
          <div className="text-xs text-muted-foreground">{u.role}</div>
        </div>
      </div>
    )},
    { header: 'Contact', accessorKey: 'email' as any, cell: (u: Agent) => (
      <div className="flex flex-col text-xs">
         <span>{u.email}</span>
         <span className="text-muted-foreground">{u.phone}</span>
      </div>
    )},
    { header: 'Performance', accessorKey: 'stats' as any, cell: (u: Agent) => (
       <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col">
             <span className="font-semibold text-foreground">{u.stats.deals}</span>
             <span className="text-muted-foreground">Deals</span>
          </div>
          <div className="flex flex-col">
             <span className="font-semibold text-green-600">${(u.stats.revenue / 1000000).toFixed(1)}M</span>
             <span className="text-muted-foreground">Vol</span>
          </div>
       </div>
    )},
    { header: 'Status', accessorKey: 'status' as any, cell: (u: Agent) => (
      <span className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        u.status === 'Active' ? 'bg-green-500/10 text-green-500 ring-1 ring-green-500/20' : 
        u.status === 'Away' ? 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20' :
        'bg-gray-500/10 text-gray-500 ring-1 ring-gray-500/20'
      )}>
        {u.status}
      </span>
    )},
    { header: 'Actions', className: 'text-right', cell: (u: Agent) => (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setSelectedAgentId(u.id)} className="h-8 gap-1">
           <Eye className="h-3.5 w-3.5" /> View
        </Button>
      </div>
    )}
  ];

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
     <div className="bg-card border rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start mb-2">
           <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Icon className="h-4 w-4" />
           </div>
           {trend && <span className="text-xs text-green-500 font-medium bg-green-500/10 px-1.5 py-0.5 rounded-full">{trend}</span>}
        </div>
        <div>
           <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
           <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{title}</p>
        </div>
     </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sales Team</h2>
          <p className="text-muted-foreground">Manage agents, track performance, and assign territories.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:flex" disabled={isLoading}>
                Export Report
            </Button>
            {canSeeInviteLink && (
              <Button onClick={() => setIsInviteOpen(true)} disabled={isLoading}>
                  <Plus className="mr-2 h-4 w-4" /> Add Agent
              </Button>
            )}
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Agents" value={users.length} icon={Users} />
          <StatCard 
            title="Total Revenue" 
            value={`$${(teamStats.totalRevenue / 1000000).toFixed(1)}M`} 
            icon={DollarSign} 
          />
          <StatCard 
            title="Closed Deals" 
            value={teamStats.activeDeals} 
            icon={TrendingUp} 
          />
          <StatCard 
            title="Top Performer" 
            value={teamStats.topPerformer} 
            icon={Award} 
          />
      </div>

      <Card className="overflow-hidden border bg-card/50 backdrop-blur-sm">
        {/* Toolbar */}
        <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                    placeholder="Search by name, email or role..." 
                    className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="flex items-center bg-background border rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('GRID')} 
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'GRID' ? "bg-muted text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('LIST')} 
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'LIST' ? "bg-muted text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50")}
              >
                <ListIcon className="h-4 w-4" />
              </button>
           </div>
        </div>

        {viewMode === 'LIST' ? (
             <DataTable 
                data={filteredUsers} 
                columns={columns} 
                onRowClick={(u) => setSelectedAgentId(u.id)}
                isLoading={isLoading} 
                className="border-0 shadow-none rounded-none"
             />
        ) : (
            <div className="p-6">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({length: 6}).map((_, i) => (
                            <div key={i} className="h-64 rounded-xl border bg-card animate-pulse" />
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-muted/30 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No agents found</h3>
                        <p className="text-muted-foreground">Try adjusting your search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((agent) => (
                            <motion.div 
                                key={agent.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative bg-card hover:bg-muted/20 border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer"
                                onClick={() => setSelectedAgentId(agent.id)}
                            >
                                <div className="absolute top-3 right-3 z-10">
                                   <span className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md",
                                        agent.status === 'Active' ? 'bg-green-500/10 text-green-500 ring-1 ring-green-500/20' : 
                                        agent.status === 'Away' ? 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20' :
                                        'bg-gray-500/10 text-gray-500 ring-1 ring-gray-500/20'
                                    )}>
                                        {agent.status}
                                    </span>
                                </div>
                                
                                <div className="p-6 flex flex-col items-center text-center border-b border-border/50">
                                    <Avatar name={agent.name} className="h-20 w-20 mb-4 ring-4 ring-background shadow-xl" />
                                    <h3 className="font-bold text-lg">{agent.name}</h3>
                                    <p className="text-sm text-primary font-medium">{agent.role}</p>
                                    
                                    <div className="flex items-center justify-center gap-1 mt-1 text-yellow-500">
                                       <Star className="h-3 w-3 fill-current" />
                                       <span className="text-xs font-bold text-foreground">{agent.stats.rating}</span>
                                    </div>
                                    
                                    <div className="flex gap-2 mt-4 w-full">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1 text-xs h-8 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAgentId(agent.id);
                                            }}
                                        >
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-muted/20">
                                   <div className="grid grid-cols-3 gap-2 text-center divide-x divide-border/50">
                                      <div>
                                         <p className="text-lg font-bold text-foreground">{agent.stats.leads}</p>
                                         <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Leads</p>
                                      </div>
                                      <div>
                                         <p className="text-lg font-bold text-foreground">{agent.stats.deals}</p>
                                         <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Closed</p>
                                      </div>
                                      <div>
                                         <p className="text-lg font-bold text-green-600">${(agent.stats.revenue / 1000000).toFixed(1)}m</p>
                                         <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Volume</p>
                                      </div>
                                   </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </Card>

      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite New Agent"
        footer={
          <Button onClick={handleInvite} disabled={isInviting || !inviteEmail || !inviteFirstName || !inviteLastName} className="w-full sm:w-auto">
            {isInviting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />} 
            {isInviting ? 'Sending Invite...' : 'Send Invitation'}
          </Button>
        }
      >
        <div className="space-y-4 py-2">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-600 dark:text-blue-400">
             Invited agents will receive an email to set up their profile and territory preferences.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <input 
                className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
                placeholder="Jane" 
                value={inviteFirstName}
                onChange={(e) => setInviteFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <input 
                className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
                placeholder="Doe" 
                value={inviteLastName}
                onChange={(e) => setInviteLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input 
              className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
              placeholder="agent@company.com" 
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Role</label>
             <select 
               className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
               value={inviteRole}
               onChange={(e) => setInviteRole(e.target.value as any)}
             >
               <option value="SALES_REP">Sales Rep</option>
               <option value="MANAGER">Manager</option>
               <option value="VENDOR_ADMIN">Vendor Admin</option>
               <option value="CLIENT">Client</option>
             </select>
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
        title="Invitation Link Created"
      >
        <div className="space-y-4 py-2">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600">
            <p className="font-medium mb-1">✓ Invitation sent successfully!</p>
            <p className="text-xs">Copy the link below and share it with the invited user.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Invite Link</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 p-2.5 rounded-md border bg-muted text-sm font-mono" 
                value={inviteLink}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                onClick={handleCopyLink}
                variant={isCopied ? "outline" : "primary"}
                className="shrink-0"
              >
                {isCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link expires in 7 days. The user will be able to set their password and activate their account.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};