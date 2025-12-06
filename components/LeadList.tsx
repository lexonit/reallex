
import React, { useState, useEffect } from 'react';
import { DEFAULT_PIPELINE } from '../constants';
import { Lead, CurrentUser } from '../types';
import { Button } from './Button';
import { Plus, UserPlus, Check, User, Search, Filter, Bot, Sparkles, LayoutGrid, List as ListIcon, Calendar, Clock, DollarSign, CheckCircle, Tag } from 'lucide-react';
import { DataTable } from './ui/DataTable';
import { Modal } from './ui/Modal';
import { Toast } from './ui/Toast';
import { Avatar } from './ui/Avatar';
import { Card } from './Card';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { LeadDetail } from './leads/LeadDetail';
import { graphqlRequest } from '../lib/graphql';

const AVAILABLE_AGENTS = [
  'AI Auto-Pilot',
  'Sarah Connor',
  'John Doe',
  'Kyle Reese',
  'Emily Rose',
  'Mike Ross'
];

interface LeadListProps {
    user: CurrentUser | null;
}

export const LeadList: React.FC<LeadListProps> = ({ user }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'LIST' | 'BOARD' | 'DETAIL'>('BOARD'); 
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  
  // Selection States
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>(AVAILABLE_AGENTS[1]); 
  
  // Schedule/Convert States
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', notes: '' });
  const [convertData, setConvertData] = useState({ price: '', commission: '', date: '' });

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isAgent = user?.role === 'AGENT';

  // Form State
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    value: '',
    source: 'Website',
    status: 'New Lead'
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    const query = `
      query GetLeads {
        leads {
          id
          name
          email
          mobile
          status
          value
          source
          assignedAgent
          lastContact
          tags
        }
      }
    `;
    try {
      const data = await graphqlRequest(query);
      let fetchedLeads = data.leads;
      if (isAgent) {
        fetchedLeads = fetchedLeads.filter((l: Lead) => l.assignedAgent === user?.name);
      }
      setLeads(fetchedLeads);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load leads', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user, isAgent]);

  // Handle Filtering
  useEffect(() => {
    let result = leads;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(l => 
        (l.name && l.name.toLowerCase().includes(query)) || 
        (l.email && l.email.toLowerCase().includes(query)) ||
        (l.tags && l.tags.some(t => t && t.toLowerCase().includes(query)))
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(l => l.status === statusFilter);
    }
    
    if (sourceFilter !== 'All') {
        result = result.filter(l => l.source === sourceFilter);
    }

    if (agentFilter !== 'All') {
        result = result.filter(l => l.assignedAgent === agentFilter || (agentFilter === 'Unassigned' && !l.assignedAgent));
    }

    setFilteredLeads(result);
  }, [leads, searchQuery, statusFilter, sourceFilter, agentFilter]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email || !newLead.value) {
        setToast({ message: 'Please fill in all required fields', type: 'error' });
        return;
    }

    const mutation = `
      mutation CreateLead($input: LeadInput) {
        createLead(input: $input) {
          id
          name
          email
          value
          status
          source
          assignedAgent
        }
      }
    `;

    try {
      const result = await graphqlRequest(mutation, {
        input: {
          name: newLead.name,
          email: newLead.email,
          value: parseFloat(newLead.value),
          status: newLead.status,
          source: newLead.source
        }
      });
      
      setLeads([result.createLead, ...leads]);
      setIsAddModalOpen(false);
      setNewLead({ name: '', email: '', value: '', source: 'Website', status: 'New Lead' });
      setToast({ message: 'Lead captured successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Error creating lead', type: 'error' });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      
      const mutation = `
        mutation UpdateLead($id: ID!, $status: String) {
          updateLead(id: $id, status: $status) {
            id
            status
          }
        }
      `;
      try {
        await graphqlRequest(mutation, { id, status: newStatus });
      } catch (err) {
        console.error("Failed to update status on server");
        // Revert or show error
      }
  };

  const openAssignModal = (id: string) => {
    setSelectedLeadId(id);
    setIsAssignModalOpen(true);
  };

  const handleAssignAgent = async () => {
    if (!selectedLeadId) return;

    const newStatus = selectedAgent === 'AI Auto-Pilot' ? 'Contacted' : 'New Lead';
    
    // Optimistic
    setLeads(prev => prev.map(l => 
        l.id === selectedLeadId ? { 
          ...l, 
          assignedAgent: selectedAgent, 
          status: newStatus 
        } : l
    ));

    const mutation = `
      mutation UpdateLead($id: ID!, $assignedAgent: String, $status: String) {
        updateLead(id: $id, assignedAgent: $assignedAgent, status: $status) {
          id
          assignedAgent
          status
        }
      }
    `;
    
    await graphqlRequest(mutation, { id: selectedLeadId, assignedAgent: selectedAgent, status: newStatus });

    setIsAssignModalOpen(false);
    setToast({ message: `${selectedAgent} assigned successfully`, type: 'success' });
  };

  // --- Schedule Viewing Logic ---
  const openScheduleModal = (id: string) => {
    setSelectedLeadId(id);
    setScheduleData({ date: '', time: '', notes: '' });
    setIsScheduleModalOpen(true);
  };

  const handleScheduleViewing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;
    
    setLeads(prev => prev.map(l => 
        l.id === selectedLeadId ? { 
            ...l, 
            nextAppointment: `${scheduleData.date}T${scheduleData.time}`,
            status: l.status === 'New Lead' ? 'Contacted' : l.status 
        } : l
    ));

    setIsScheduleModalOpen(false);
    setToast({ message: 'Viewing scheduled successfully', type: 'success' });
  };

  // --- Convert to Deal Logic ---
  const openConvertModal = (id: string, leadValue: number) => {
    setSelectedLeadId(id);
    setConvertData({ 
        price: leadValue.toString(), 
        commission: (leadValue * 0.03).toString(), 
        date: new Date().toISOString().split('T')[0] 
    });
    setIsConvertModalOpen(true);
  };

  const handleConvertToDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;

    // Optimistic status update
    setLeads(prev => prev.map(l => 
        l.id === selectedLeadId ? { ...l, status: 'Closed Won' } : l
    ));

    const dealMutation = `
        mutation CreateDeal($input: DealInput) {
            createDeal(input: $input) {
                id
                name
            }
        }
    `;
    
    // Also create deal
    const lead = leads.find(l => l.id === selectedLeadId);
    if (lead) {
        await graphqlRequest(dealMutation, {
            input: {
                name: `${lead.name} Deal`,
                value: parseFloat(convertData.price),
                stage: 'Closed Won',
                leadId: lead.id,
                closeDate: convertData.date,
                probability: 100
            }
        });
        
        // Update lead status on server
        await graphqlRequest(`
            mutation UpdateLead($id: ID!, $status: String) {
                updateLead(id: $id, status: "Closed Won") { id }
            }
        `, { id: selectedLeadId });
    }

    setIsConvertModalOpen(false);
    setToast({ message: 'Lead converted to Closed Deal! 🎉', type: 'success' });
  };

  const handleLeadClick = (id: string) => {
      setSelectedLeadId(id);
      setViewMode('DETAIL');
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedLeadId) {
      handleStatusChange(draggedLeadId, status);
      setDraggedLeadId(null);
    }
  };

  // --- Render Helpers ---
  const renderKanbanBoard = () => {
      return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-280px)] min-h-[500px] px-1">
            {DEFAULT_PIPELINE.map(stage => {
                const stageLeads = filteredLeads.filter(l => l.status === stage.name);
                return (
                    <div 
                        key={stage.id} 
                        className={cn(
                          "min-w-[300px] w-[300px] flex flex-col h-full bg-muted/20 rounded-xl border border-border/50 transition-colors",
                          draggedLeadId ? "border-dashed border-primary/40 bg-muted/30" : ""
                        )}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage.name)}
                    >
                        <div className={cn("p-3 border-b border-border/50 flex justify-between items-center rounded-t-xl bg-muted/30")}>
                             <div className="flex items-center gap-2">
                                <div className={cn("h-3 w-3 rounded-full", stage.color.replace('bg-', 'bg-'))} />
                                <span className="font-semibold text-sm">{stage.name}</span>
                             </div>
                             <span className="text-xs bg-background border px-2 py-0.5 rounded-full text-muted-foreground">{stageLeads.length}</span>
                        </div>
                        <div className="flex-1 p-2 overflow-y-auto space-y-3">
                            {stageLeads.map(lead => (
                                <motion.div 
                                    layoutId={lead.id}
                                    key={lead.id} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e as any, lead.id)}
                                    onClick={() => handleLeadClick(lead.id)}
                                    className={cn(
                                      "bg-card border p-3 rounded-lg shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing",
                                      draggedLeadId === lead.id && "opacity-50 ring-2 ring-primary rotate-2"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar name={lead.name} className="h-6 w-6 text-[10px]" />
                                            <span className="font-medium text-sm truncate max-w-[120px]">{lead.name}</span>
                                        </div>
                                        <div className="text-xs font-bold text-green-600 dark:text-green-400">
                                            ${(lead.value / 1000).toFixed(0)}k
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 px-0.5">
                                        <div className="flex items-center gap-1.5" title="Assigned Agent">
                                            {lead.assignedAgent === 'AI Auto-Pilot' ? (
                                                <Bot className="h-3 w-3 text-purple-500" />
                                            ) : (
                                                <User className="h-3 w-3" />
                                            )}
                                            <span className={cn(
                                                "truncate max-w-[140px]",
                                                lead.assignedAgent === 'AI Auto-Pilot' && "text-purple-600 dark:text-purple-400 font-medium"
                                            )}>
                                                {lead.assignedAgent || 'Unassigned'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {lead.tags && lead.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {lead.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded flex items-center gap-0.5 text-muted-foreground">
                                                    <Tag className="h-2 w-2" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {lead.nextAppointment && (
                                        <div className="mb-3 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1.5 rounded flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(lead.nextAppointment).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-2 pt-2 border-t border-dashed border-border/50">
                                        <select 
                                            className="bg-transparent text-[10px] text-muted-foreground hover:text-foreground outline-none cursor-pointer flex-1"
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {DEFAULT_PIPELINE.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                        </select>
                                        
                                        <div className="flex gap-1">
                                            {!isAgent && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); openAssignModal(lead.id); }}
                                                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                                                    title="Assign Agent or AI"
                                                >
                                                    <UserPlus className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); openScheduleModal(lead.id); }}
                                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-blue-500 transition-colors"
                                                title="Schedule Viewing"
                                            >
                                                <Calendar className="h-3.5 w-3.5" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); openConvertModal(lead.id, lead.value); }}
                                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-green-500 transition-colors"
                                                title="Convert to Deal"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div className="h-full min-h-[50px] flex-1" />
                        </div>
                    </div>
                );
            })}
        </div>
      );
  };

  const columns = [
    { 
        header: 'Name', 
        accessorKey: 'name' as keyof Lead,
        cell: (l: Lead) => (
            <div className="flex items-center gap-3">
                <Avatar name={l.name} />
                <div className="flex flex-col">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-xs text-muted-foreground md:hidden">{l.email}</span>
                </div>
            </div>
        )
    },
    { 
        header: 'Status', 
        accessorKey: 'status' as keyof Lead, 
        cell: (l: Lead) => (
            <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
                DEFAULT_PIPELINE.find(p => p.name === l.status)?.color.replace('bg-', 'bg-').replace('500', '100 text-') + '-800' || 'bg-gray-100 text-gray-800'
            )}>
              {l.status}
            </span>
        ) 
    },
    { 
        header: 'Source',
        accessorKey: 'source' as keyof Lead,
        cell: (l: Lead) => <span className="text-xs text-muted-foreground">{l.source}</span>
    },
    { 
        header: 'Assigned To',
        accessorKey: 'assignedAgent' as keyof Lead,
        cell: (l: Lead) => (
             <div className="flex items-center gap-1.5 text-xs">
                {l.assignedAgent === 'AI Auto-Pilot' ? (
                    <div className="flex items-center gap-1 text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
                        <Sparkles className="h-3 w-3" /> AI Pilot
                    </div>
                ) : (
                    <span className="text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {l.assignedAgent || 'Unassigned'}
                    </span>
                )}
             </div>
        )
    },
    { 
        header: 'Value', 
        accessorKey: 'value' as keyof Lead, 
        cell: (l: Lead) => `$${l.value.toLocaleString()}` 
    },
    { 
        header: 'Action', 
        className: 'text-right',
        cell: (l: Lead) => (
            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                {!isAgent && (
                    <Button variant="outline" size="sm" onClick={() => openAssignModal(l.id)} className="h-7 px-2" title="Assign Agent">
                        <UserPlus className="h-3 w-3" />
                    </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => openScheduleModal(l.id)} className="h-7 px-2"><Calendar className="h-3 w-3" /></Button>
                <Button variant="outline" size="sm" onClick={() => openConvertModal(l.id, l.value)} className="h-7 px-2 text-green-600 hover:text-green-700"><Check className="h-3 w-3" /></Button>
            </div>
        )
    }
  ];

  if (viewMode === 'DETAIL' && selectedLeadId) {
    const selectedLead = leads.find(l => l.id === selectedLeadId);
    if (selectedLead) {
        return (
            <>
                <AnimatePresence>
                     {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                </AnimatePresence>
                <LeadDetail 
                    lead={selectedLead} 
                    onBack={() => setViewMode('BOARD')}
                    onAssign={openAssignModal}
                    onSchedule={openScheduleModal}
                    onConvert={openConvertModal}
                />
            </>
        );
    }
  }

  const sources = Array.from(new Set(leads.map(l => l.source)));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative h-full flex flex-col pb-10">
      <AnimatePresence>
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Lead Pipeline</h2>
           <p className="text-muted-foreground">
             {isAgent ? 'Manage your deal flow and convert leads.' : 'Track team pipeline and assign leads to agents or AI.'}
           </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center bg-card border rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('BOARD')} 
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'BOARD' ? "bg-muted text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50")}
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
           
           <Button onClick={() => setIsAddModalOpen(true)} disabled={isLoading} className="shadow-lg shadow-primary/20">
             <Plus className="mr-2 h-4 w-4" /> Capture Lead
           </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col xl:flex-row gap-4 p-4 border-b items-start xl:items-center justify-between bg-muted/20 shrink-0">
            <div className="relative flex-1 w-full xl:max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                    placeholder="Search by name, email, or tags..." 
                    className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full xl:w-auto">
                 <div className="relative">
                    <select 
                        className="h-10 w-full rounded-md border bg-background pl-3 pr-8 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        {DEFAULT_PIPELINE.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                 </div>
                 
                 <div className="relative">
                    <select 
                        className="h-10 w-full rounded-md border bg-background pl-3 pr-8 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                    >
                        <option value="All">All Sources</option>
                        {sources.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>

                 {!isAgent && (
                    <div className="relative">
                        <select 
                            className="h-10 w-full rounded-md border bg-background pl-3 pr-8 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
                            value={agentFilter}
                            onChange={(e) => setAgentFilter(e.target.value)}
                        >
                            <option value="All">All Owners</option>
                            <option value="Unassigned">Unassigned</option>
                            {AVAILABLE_AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                 )}
            </div>
        </div>

        <div className="flex-1 overflow-hidden p-0">
            {viewMode === 'BOARD' ? (
                <div className="h-full overflow-hidden p-4">
                    {renderKanbanBoard()}
                </div>
            ) : (
                <div className="h-full overflow-auto">
                    <DataTable 
                        data={filteredLeads} 
                        columns={columns} 
                        isLoading={isLoading}
                        onRowClick={(l) => handleLeadClick(l.id)}
                        className="border-0 shadow-none rounded-none"
                    />
                </div>
            )}
        </div>
        
        {!isLoading && filteredLeads.length === 0 && (
           <div className="text-center py-12 absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="bg-muted/30 rounded-full h-12 w-12 flex items-center justify-center mb-3">
                 <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No leads found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
           </div>
        )}
      </Card>

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Capture New Lead"
      >
        <form onSubmit={handleAddLead} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input 
                    required
                    className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
                    placeholder="Jane Doe"
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input 
                    required
                    type="email"
                    className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
                    placeholder="jane@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Est. Value ($)</label>
                    <input 
                        required
                        type="number"
                        className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
                        placeholder="500000"
                        value={newLead.value}
                        onChange={(e) => setNewLead({...newLead, value: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Pipeline Stage</label>
                    <select 
                        className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                        value={newLead.status}
                        onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                    >
                        {DEFAULT_PIPELINE.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <select 
                    className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                    value={newLead.source}
                    onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                >
                    <option>Website</option>
                    <option>Zillow</option>
                    <option>Referral</option>
                    <option>Open House</option>
                </select>
            </div>
            <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Lead</Button>
            </div>
        </form>
      </Modal>

      {/* Schedule Viewing Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Viewing"
        footer={
            <Button onClick={handleScheduleViewing} className="w-full sm:w-auto">
                <Clock className="mr-2 h-4 w-4" /> Confirm Schedule
            </Button>
        }
      >
        <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input 
                        type="date"
                        className="w-full p-2.5 rounded-md border bg-background"
                        value={scheduleData.date}
                        onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <input 
                        type="time"
                        className="w-full p-2.5 rounded-md border bg-background"
                        value={scheduleData.time}
                        onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea 
                    className="w-full p-2.5 rounded-md border bg-background h-24 resize-none"
                    placeholder="Lockbox code, client preferences..."
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
                />
            </div>
        </div>
      </Modal>

      {/* Convert to Deal Modal */}
      <Modal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        title="Convert to Deal"
        footer={
            <Button onClick={handleConvertToDeal} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="mr-2 h-4 w-4" /> Close Deal
            </Button>
        }
      >
         <div className="space-y-4 py-2">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-green-600" />
                <div className="text-sm">
                    <p className="font-semibold text-green-700">Congratulations!</p>
                    <p className="text-green-600/80">Moving this lead to closed won status.</p>
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium">Final Sale Price</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="number"
                        className="w-full pl-9 p-2.5 rounded-md border bg-background"
                        value={convertData.price}
                        onChange={(e) => setConvertData({...convertData, price: e.target.value})}
                    />
                </div>
            </div>

             <div className="space-y-2">
                <label className="text-sm font-medium">Commission (3%)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="number"
                        className="w-full pl-9 p-2.5 rounded-md border bg-background"
                        value={convertData.commission}
                        onChange={(e) => setConvertData({...convertData, commission: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Closing Date</label>
                <input 
                    type="date"
                    className="w-full p-2.5 rounded-md border bg-background"
                    value={convertData.date}
                    onChange={(e) => setConvertData({...convertData, date: e.target.value})}
                />
            </div>
         </div>
      </Modal>

      {/* Assign Agent Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Lead"
        footer={
            <Button onClick={handleAssignAgent} className="w-full sm:w-auto">
                <Check className="mr-2 h-4 w-4" /> Confirm Assignment
            </Button>
        }
      >
        <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
                Select a representative to handle this lead.
            </p>
            <div className="space-y-2">
                <label className="text-sm font-medium">Available Agents</label>
                <div className="grid gap-2">
                    {AVAILABLE_AGENTS.map((agent) => (
                        <div 
                            key={agent}
                            onClick={() => setSelectedAgent(agent)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedAgent === agent 
                                    ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                                    : 'border-input hover:bg-muted'
                            }`}
                        >
                            {agent === 'AI Auto-Pilot' ? (
                               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center border text-white shadow-sm">
                                  <Sparkles className="h-4 w-4" />
                               </div>
                            ) : (
                               <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border">
                                   <User className="h-4 w-4 text-muted-foreground" />
                               </div>
                            )}
                            
                            <div className="flex-1">
                               <span className="font-medium block">{agent}</span>
                               {agent === 'AI Auto-Pilot' && <span className="text-xs text-purple-500 font-medium">Instant Engagement 24/7</span>}
                            </div>
                            
                            {selectedAgent === agent && <Check className="ml-auto h-4 w-4 text-primary" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};
