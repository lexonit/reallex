
import React, { useState, useEffect } from 'react';
import { DEFAULT_PIPELINE } from '../constants';
import { Lead, CurrentUser } from '../types';
import { Button } from '../components/Button';
import { Plus, UserPlus, Check, User, Search, Filter, Bot, Sparkles, LayoutGrid, List as ListIcon, Calendar, Clock, DollarSign, CheckCircle, Tag } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/Card';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { LeadDetail } from './leads/LeadDetail';
import { graphqlRequest } from '../lib/graphql';
import { useProperties } from '../hooks/useProperties';
import { GET_LEADS_QUERY } from '../graphql/queries/lead.queries';
import { CREATE_LEAD_MUTATION, UPDATE_LEAD_MUTATION } from '../graphql/mutations/lead.mutations';
import { CREATE_DEAL_MUTATION } from '../graphql/mutations/deal.mutations';
import { GET_USERS_QUERY } from '../graphql/queries/user.queries';

/**
 * =====================================================
 * LEAD LIST COMPONENT - SCHEDULE VIEWING FEATURE
 * =====================================================
 * 
 * ROLE-BASED LEAD VISIBILITY:
 * - ADMIN/VENDOR: See all leads in their vendor
 * - AGENT: See only leads assigned to them (assignedAgentId filter)
 *   - Filter applied at GraphQL query level
 *   - Backend filters by assignedAgentId = user.id
 *   - Frontend passes user.id in filter
 * 
 * FEATURES IMPLEMENTED:
 * 
 * 1. SCHEDULE VIEWING BADGE (Lines 506-513)
 *    - Purple badge displays when scheduledViewingDate exists
 *    - Shows formatted date/time: "Dec 24, 3:43 PM"
 *    - Clickable to edit existing schedule
 *    - Hover effect for visual feedback
 * 
 * 2. SCHEDULE ICON HIGHLIGHTING (Lines 535-545)
 *    - GREEN icon: When a viewing is scheduled (scheduledViewingDate exists)
 *    - BLUE icon: When no viewing is scheduled
 *    - Tooltip shows contextual text: "Edit Scheduled Viewing" or "Schedule Viewing"
 *    - Hover effect with color transition
 * 
 * 3. SCHEDULE MODAL (Lines 869-907)
 *    - Dynamic title: "Edit Scheduled Viewing" if data exists, "Schedule Viewing" if new
 *    - Button text: "Update Schedule" for edits, "Confirm Schedule" for new
 *    - Three input fields:
 *      a) Date input - ISO format (YYYY-MM-DD)
 *      b) Time input - 24-hour format (HH:MM)
 *      c) Notes textarea - Includes lead value and custom notes
 * 
 * 4. DATA PRE-POPULATION (Lines 287-306)
 *    - openScheduleModal() function checks if lead has scheduledViewingDate
 *    - If exists: Converts ISO date to local date/time and populates form
 *    - If not: Clears form for new schedule entry
 *    - Includes scheduledViewingNotes in notes field
 * 
 * 5. DATA PERSISTENCE (Lines 307-334)
 *    - handleScheduleViewing() sends UPDATE_LEAD_MUTATION with:
 *      - scheduledViewingDate: ISO datetime string
 *      - scheduledViewingNotes: String including lead value + custom notes
 *    - Optimistic UI update before API call
 *    - Success toast notification on save
 * 
 * 6. BACKEND INTEGRATION
 *    - Lead model: scheduledViewingDate (Date), scheduledViewingNotes (String)
 *    - GraphQL types: LeadUpdateInput accepts both fields
 *    - Resolvers: All queries/mutations return scheduled viewing fields
 *    - Database: Fields persist in Mongoose schema
 * 
 * WORKFLOW:
 * User sees lead card → Clicks calendar icon (blue/green) → 
 * Modal opens with pre-filled data (if exists) → Edits date/time/notes → 
 * Clicks "Confirm/Update" → Data saves to DB → Badge appears on card
 * 
 * =====================================================
 */

// Agents are loaded dynamically from the users API

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
    const [selectedAgent, setSelectedAgent] = useState<string>(''); 
    const [agents, setAgents] = useState<Array<{ _id: string; name: string; role: string; email: string; isActive?: boolean }>>([]);
  
  // Schedule/Convert States
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', notes: '' });
  const [convertData, setConvertData] = useState({ price: '', commission: '', date: '' });
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isAgent = user?.role === 'AGENT';
    // Load properties for dropdown in Convert to Deal modal
    const { data: propertiesData } = useProperties(undefined, user?.id);


  // Form State
    const [newLead, setNewLead] = useState({
        name: '',
        email: '',
        phone: '',
        value: '',
        source: 'Website',
        status: 'New Lead'
    });
    const [captureSelectedPropertyId, setCaptureSelectedPropertyId] = useState<string>('');
    const getAgentNameById = (id?: string) => {
        if (!id) return '';
        const found = agents.find(a => a._id === id);
        return found ? found.name : '';
    };

    const toUiStatus = (apiStatus: string) => {
        const map: Record<string, string> = {
            NEW: 'New Lead',
            CONTACTED: 'Contacted',
            QUALIFIED: 'Qualified',
            PROPOSAL: 'Proposal Sent',
            NEGOTIATION: 'Negotiation',
            WON: 'Closed Won',
            LOST: 'Lost'
        };
        return map[apiStatus] || apiStatus || 'New Lead';
    };

    const toApiStatus = (uiStatus: string) => {
        const map: Record<string, string> = {
            'New Lead': 'NEW',
            'Contacted': 'CONTACTED',
            'Qualified': 'QUALIFIED',
            'Proposal Sent': 'PROPOSAL',
            'Negotiation': 'NEGOTIATION',
            'Closed Won': 'WON',
            'Lost': 'LOST'
        };
        return map[uiStatus] || 'NEW';
    };

    const fetchLeads = async () => {
    setIsLoading(true);
    const query = GET_LEADS_QUERY;
    try {
      // Build filter based on user role
      let filter = {};
      if (isAgent && user?.id) {
        filter = { assignedAgentId: user.id };
      }
      
      const data = await graphqlRequest(query, { filter });
            let fetchedLeads = data.leads.map((l: any) => ({
                id: l._id,
                name: l.name,
                email: l.email,
                mobile: l.mobile,
                status: toUiStatus(l.status),
                value: Number(l.value ?? 0) || 0,
                source: l.source || 'Website',
                assignedAgent: l.assignedAgentId,
                lastContact: l.lastContact || '',
                tags: l.tags || [],
                notes: l.notes || '',
                scheduledViewingDate: l.scheduledViewingDate || null,
                scheduledViewingNotes: l.scheduledViewingNotes || ''
            }));
      setLeads(fetchedLeads);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load leads', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let pollInterval: NodeJS.Timeout | null = null;
    
    const loadLeads = async () => {
      if (mounted) {
        await fetchLeads();
      }
    };
    
    loadLeads();
    
    // Auto-refresh leads every 10 seconds
    pollInterval = setInterval(() => {
      if (mounted) {
        loadLeads();
      }
    }, 10000);
    
    return () => {
      mounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [user, isAgent]);

    // Load agents for assignment and filtering
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const data = await graphqlRequest(GET_USERS_QUERY, { filter: { } });
                const list = (data.users || []).map((u: any) => ({
                    _id: u._id,
                    name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
                    role: u.role,
                    email: u.email,
                    isActive: u.isActive
                }));
                setAgents(list);
                if (!selectedAgent && list.length) setSelectedAgent(list[0]._id);
            } catch (err) {
                // ignore
            }
        };
        fetchAgents();
    }, []);

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

    const mutation = CREATE_LEAD_MUTATION;

    try {
      const result = await graphqlRequest(mutation, {
                input: {
                    name: newLead.name,
                    email: newLead.email,
                    mobile: newLead.phone,
                    value: newLead.value ? Number(newLead.value) : 0,
                    status: toApiStatus(newLead.status),
                    source: newLead.source,
                    notes: captureSelectedPropertyId ? `Property: ${captureSelectedPropertyId}` : undefined
                }
      });
            const created = result.createLead;
            setLeads([{ 
                id: created._id,
                name: created.name,
                email: created.email,
                value: created.value || 0,
                status: toUiStatus(created.status),
                source: created.source,
                assignedAgent: created.assignedAgentId,
                lastContact: '',
                tags: [],
                notes: created.notes || '',
                scheduledViewingDate: created.scheduledViewingDate || null,
                scheduledViewingNotes: created.scheduledViewingNotes || ''
            }, ...leads]);
    setIsAddModalOpen(false);
    setNewLead({ name: '', email: '', phone: '', value: '', source: 'Website', status: 'New Lead' });
    setCaptureSelectedPropertyId('');
      setToast({ message: 'Lead captured successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Error creating lead', type: 'error' });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      
            const mutation = UPDATE_LEAD_MUTATION;
            try {
                await graphqlRequest(mutation, { id, input: { status: toApiStatus(newStatus) } });
      } catch (err) {
        console.error("Failed to update status on server");
        // Revert or show error
      }
  };

    const openAssignModal = (id: string) => {
        setSelectedLeadId(id);
        const current = leads.find(l => l.id === id);
        if (current?.assignedAgent) {
                setSelectedAgent(current.assignedAgent);
        } else if (agents[0]?._id) {
                setSelectedAgent(agents[0]._id);
        }
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

        const mutation = UPDATE_LEAD_MUTATION;
    
        await graphqlRequest(mutation, { id: selectedLeadId, input: { assignedAgentId: selectedAgent, status: toApiStatus(newStatus) } });

    setIsAssignModalOpen(false);
    setToast({ message: `${selectedAgent} assigned successfully`, type: 'success' });
  };

  // --- Schedule Viewing Logic ---
  const openScheduleModal = (id: string) => {
    const lead = leads.find(l => l.id === id);
    setSelectedLeadId(id);
    
    // Pre-populate with existing schedule if available
    if (lead?.scheduledViewingDate) {
      const dateObj = new Date(lead.scheduledViewingDate);
      const dateStr = dateObj.toISOString().split('T')[0];
      const timeStr = dateObj.toTimeString().split(':').slice(0, 2).join(':');
      setScheduleData({ 
        date: dateStr, 
        time: timeStr, 
        notes: lead.scheduledViewingNotes || '' 
      });
    } else {
      setScheduleData({ date: '', time: '', notes: '' });
    }
    
    setIsScheduleModalOpen(true);
  };

  const handleScheduleViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;
    
    const appointmentDateTime = `${scheduleData.date}T${scheduleData.time}`;
    
    // Optimistic update
    setLeads(prev => prev.map(l => 
        l.id === selectedLeadId ? { 
            ...l, 
            nextAppointment: appointmentDateTime,
            status: l.status === 'New Lead' ? 'Contacted' : l.status 
        } : l
    ));

    // Save to database
    try {
        const mutation = UPDATE_LEAD_MUTATION;
        await graphqlRequest(mutation, { 
            id: selectedLeadId, 
            input: { 
                status: toApiStatus(
                    leads.find(l => l.id === selectedLeadId)?.status === 'New Lead' ? 'Contacted' : 
                    leads.find(l => l.id === selectedLeadId)?.status || 'NEW'
                ),
                scheduledViewingDate: appointmentDateTime,
                scheduledViewingNotes: scheduleData.notes
            } 
        });
    } catch (err) {
        console.error('Failed to save schedule:', err);
        setToast({ message: 'Error saving schedule', type: 'error' });
        return;
    }

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

    const dealMutation = CREATE_DEAL_MUTATION;
    
    // Also create deal
    const lead = leads.find(l => l.id === selectedLeadId);
    if (lead) {
        await graphqlRequest(dealMutation, {
            input: {
                name: `${lead.name} Deal`,
                value: parseFloat(convertData.price),
                stage: 'WON',
                leadId: lead.id,
                closeDate: convertData.date,
                probability: 100,
                propertyId: selectedPropertyId || undefined
            }
        });
        
        // Update lead with conversion details and status
        await graphqlRequest(UPDATE_LEAD_MUTATION, { 
            id: selectedLeadId, 
            input: { 
                status: toApiStatus('Closed Won'),
                value: parseFloat(convertData.price),
                notes: `Deal closed - Commission: ${convertData.commission}, Close Date: ${convertData.date}`
            } 
        });
    }

    setIsConvertModalOpen(false);
    setToast({ message: 'Lead converted to Closed Deal! 🎉', type: 'success' });
  };

  const handleLeadClick = (id: string) => {
      setSelectedLeadId(id);
      setViewMode('DETAIL');
  };

  // Reset modal states when returning from detail view
  const handleBackFromDetail = () => {
    setViewMode('BOARD');
    setSelectedLeadId(null);
    setIsAssignModalOpen(false);
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
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 h-[calc(100vh-280px)] min-h-[500px] px-1 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
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
                                            <User className="h-3 w-3" />
                                            <span className={cn(
                                                "truncate max-w-[140px]",
                                                ''
                                            )}>
                                                {getAgentNameById(lead.assignedAgent) || 'Unassigned'}
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
                                        <div className="mb-3 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1.5 rounded flex items-center gap-1.5 cursor-pointer hover:bg-blue-500/20 transition-colors"
                                             onClick={(e) => { e.stopPropagation(); openScheduleModal(lead.id); }}>
                                            <Calendar className="h-3 w-3" />
                                            {new Date(lead.nextAppointment).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    )}
                                    
                                    {lead.scheduledViewingDate && (
                                        <div className="mb-3 text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1.5 rounded flex items-center gap-1.5 cursor-pointer hover:bg-purple-500/20 transition-colors"
                                             onClick={(e) => { e.stopPropagation(); openScheduleModal(lead.id); }}>
                                            <Calendar className="h-3 w-3" />
                                            <span className="font-medium">{new Date(lead.scheduledViewingDate).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
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
                                                className={cn(
                                                  "p-1 rounded hover:bg-muted transition-colors",
                                                  lead.scheduledViewingDate 
                                                    ? "text-green-500 hover:text-green-600" 
                                                    : "text-muted-foreground hover:text-blue-500"
                                                )}
                                                title={lead.scheduledViewingDate ? "Edit Scheduled Viewing" : "Schedule Viewing"}
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
    console.log("Rendering Lead Detail for:", selectedLead);
    if (selectedLead) {
        return (
            <>
                <AnimatePresence>
                     {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                </AnimatePresence>
                <LeadDetail 
                    lead={selectedLead} 
                    onBack={handleBackFromDetail}
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
                            {agents.map(a => <option key={a._id} value={a._id}>{a.name} ({a.role})</option>)}
                        </select>
                    </div>
                 )}
            </div>
        </div>

        <div className="flex-1 overflow-hidden p-0">
            {viewMode === 'BOARD' ? (
                <div className="h-full overflow-auto p-4">
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
                    <label className="text-sm font-medium">Phone Number</label>
                    <input 
                        type="tel"
                        className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
                        placeholder="(555) 000-0000"
                        value={newLead.phone}
                        onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Related Property (optional)</label>
                    <select
                      className="w-full p-2.5 rounded-md border bg-background"
                      value={captureSelectedPropertyId}
                      onChange={(e) => setCaptureSelectedPropertyId(e.target.value)}
                    >
                      <option value="">Select from available properties</option>
                      {(propertiesData as any)?.properties?.map((p: any) => (
                        <option key={p._id} value={p._id}>
                          {p.address} {p.price ? `- $${p.price.toLocaleString()}` : ''}
                        </option>
                      ))}
                    </select>
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
        title={leads.find(l => l.id === selectedLeadId)?.scheduledViewingDate ? "Edit Scheduled Viewing" : "Schedule Viewing"}
        footer={
            <Button onClick={handleScheduleViewing} className="w-full sm:w-auto">
                <Clock className="mr-2 h-4 w-4" /> {leads.find(l => l.id === selectedLeadId)?.scheduledViewingDate ? "Update Schedule" : "Confirm Schedule"}
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
                                    <div className="space-y-2">
                                            <label className="text-sm font-medium">Property (optional)</label>
                                            <select
                                                className="w-full p-2.5 rounded-md border bg-background"
                                                value={selectedPropertyId}
                                                onChange={(e) => setSelectedPropertyId(e.target.value)}
                                            >
                                                <option value="">Select from available properties</option>
                                                {(propertiesData as any)?.properties?.map((p: any) => (
                                                    <option key={p._id} value={p._id}>
                                                        {p.address} {p.price ? `- $${p.price.toLocaleString()}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                    </div>
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
                    {agents.map((agent) => (
                        <div 
                            key={agent._id}
                            onClick={() => setSelectedAgent(agent._id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedAgent === agent._id 
                                    ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                                    : 'border-input hover:bg-muted'
                            }`}
                        >
                           <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border">
                               <User className="h-4 w-4 text-muted-foreground" />
                           </div>
                           
                           <div className="flex-1 space-y-0.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium block">{agent.name}</span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                                  {agent.role}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground block">{agent.email}</span>
                           </div>
                           
                           {selectedAgent === agent._id && <Check className="ml-auto h-4 w-4 text-primary" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};
