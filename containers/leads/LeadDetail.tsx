import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { graphqlRequest } from '../../lib/graphql';
import { GET_USERS_QUERY } from '../../graphql/queries/user.queries';
import { UPDATE_LEAD_MUTATION } from '../../graphql/mutations/lead.mutations';
import { updateLead } from '../../store/slices/leadsSlice';
import { Lead, Property, CurrentUser } from '../../types';
import { MOCK_PROPERTIES, DEFAULT_PIPELINE } from '../../constants';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { 
  ArrowLeft, Phone, Mail, Calendar, UserPlus, CheckCircle, 
  Clock, MessageSquare, Tag, MapPin, DollarSign, Send, 
   Activity, Home, Building, Check, User 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

/**
 * =====================================================
 * LEAD DETAIL COMPONENT - EDIT FEATURE
 * =====================================================
 * 
 * EDIT FUNCTIONALITY:
 * - Editable Fields: Name, Email, Phone, Source, Value
 * - "Edit Lead" button in header opens modal
 * - All changes saved to database via UPDATE_LEAD_MUTATION
 * - Modal pre-populates with current lead data
 * - "Save Changes" button submits updates
 */

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onSchedule: (id: string) => void;
  onConvert: (id: string, value: number) => void;
  onAssign: (id: string) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ 
  lead, 
  onBack, 
  onSchedule, 
  onConvert, 
  onAssign 
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'NOTES' | 'LOG'>('TIMELINE');
  const [newNote, setNewNote] = useState('');
   const [agents, setAgents] = useState<Array<{_id:string; name:string; role:string; email:string}>>([]);
   const [assignOpen, setAssignOpen] = useState(false);
   const [selectedAgentId, setSelectedAgentId] = useState<string>('');
   const [assignedAgentDisplay, setAssignedAgentDisplay] = useState<string>('');
   const [scheduleOpen, setScheduleOpen] = useState(false);
   const [scheduleData, setScheduleData] = useState({ date: '', time: '', notes: '' });
   const [editOpen, setEditOpen] = useState(false);
   const [editData, setEditData] = useState({
      name: lead.name,
      email: lead.email,
      mobile: lead.mobile || '',
      source: lead.source || '',
      value: lead.value || 0
   });
   console.log('Lead Detail - lead:', lead);
   const getAgentNameById = (id?: string) => {
      if (!id) return '';
      const found = agents.find(a => a._id === id);
      return found ? found.name : '';
   };

   useEffect(() => {
      const fetchAgents = async () => {
         try {
            const data = await graphqlRequest(GET_USERS_QUERY, { filter: {} });
            const list = (data.users || []).map((u: any) => ({
               _id: u._id,
               name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
               role: u.role,
               email: u.email
            }));
            setAgents(list);
            // Initialize selections/display when agents arrive
            const initialName = getAgentNameById(lead.assignedAgent);
            setAssignedAgentDisplay(initialName || '');
            if (!selectedAgentId) {
               const initialId = lead.assignedAgent || (list[0]?._id || '');
               setSelectedAgentId(initialId);
            }
         } catch (err) {
            // ignore for now
         }
      };
      fetchAgents();
   }, []);

   // Keep display name in sync when lead or agents change
   useEffect(() => {
      const nameFromId = getAgentNameById(lead.assignedAgent);
      setAssignedAgentDisplay(nameFromId || '');
   }, [lead.assignedAgent, agents]);

   // When opening the assign modal, preselect current agent if available
   useEffect(() => {
      if (assignOpen) {
         setSelectedAgentId(lead.assignedAgent || selectedAgentId || '');
      }
   }, [assignOpen, lead.assignedAgent]);
  const [timeline, setTimeline] = useState([
    { id: 1, type: 'status', text: 'Status updated to ' + lead.status, date: 'Today, 9:41 AM' },
    { id: 2, type: 'call', text: 'Outbound call to ' + lead.name, date: 'Yesterday, 4:20 PM' },
    { id: 3, type: 'email', text: 'Sent property brochure for 123 Beverly Dr', date: 'Oct 24, 2:15 PM' },
    { id: 4, type: 'creation', text: 'Lead captured from ' + lead.source, date: lead.lastContact },
  ]);

  const matchedProperties = MOCK_PROPERTIES.slice(0, 3);

  const handleAddNote = () => {
    if (!newNote) return;
    const note = {
      id: Date.now(),
      type: 'note',
      text: newNote,
      date: 'Just now'
    };
    setTimeline([note, ...timeline]);
    setNewNote('');
  };

   const handleAssignAgent = async () => {
      if (!selectedAgentId) return;
      try {
         await graphqlRequest(UPDATE_LEAD_MUTATION, { id: lead.id, input: { assignedAgentId: selectedAgentId } });
         const name = getAgentNameById(selectedAgentId);
         if (name) setAssignedAgentDisplay(name);
      } catch (err) {
         // ignore assignment errors for now
      }
      setAssignOpen(false);
      onAssign(lead.id);
   };

   const handleScheduleViewing = async (e: React.FormEvent) => {
      e.preventDefault();
      const appointmentDateTime = `${scheduleData.date}T${scheduleData.time}`;
      try {
         const notesWithValue = `Value: $${lead.value || 0}${scheduleData.notes ? '\n' + scheduleData.notes : ''}`;
         await graphqlRequest(UPDATE_LEAD_MUTATION, { 
            id: lead.id, 
            input: { 
               scheduledViewingDate: appointmentDateTime,
               scheduledViewingNotes: notesWithValue
            } 
         });
      } catch (err) {
         console.error('Failed to save schedule:', err);
      }
      setScheduleOpen(false);
   };

   const handleSaveEdit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await dispatch(updateLead({
            id: lead.id,
            input: {
               name: editData.name,
               email: editData.email,
               mobile: editData.mobile,
               source: editData.source,
               value: editData.value
            } as Partial<Lead>
         }) as any);
         setEditOpen(false);
      } catch (err) {
         console.error('Failed to save lead details:', err);
      }
   };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 pl-0 hover:pl-2 transition-all w-fit">
           <ArrowLeft className="h-4 w-4" /> Back to Leads
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
           <div className="flex items-center gap-4">
              <Avatar name={lead.name} className="h-16 w-16 text-xl border-2 border-primary/20" />
              <div>
                 <h1 className="text-2xl font-bold flex items-center gap-2">
                    {lead.name}
                    <span className={cn(
                        "text-xs px-2.5 py-0.5 rounded-full font-medium border",
                        DEFAULT_PIPELINE.find(p => p.name === lead.status)?.color.replace('bg-', 'bg-').replace('500', '100 text-') + '-800 border-transparent' || 'bg-gray-100 text-gray-800'
                    )}>
                        {lead.status}
                    </span>
                 </h1>
                 <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                    <Mail className="h-3.5 w-3.5" /> {lead.email} • <Phone className="h-3.5 w-3.5" /> {lead.mobile}
                 </p>
              </div>
           </div>
           
           <div className="flex flex-wrap gap-2 w-full md:w-auto">
                   <Button variant="outline" onClick={() => {
                      setEditData({
                        name: lead.name,
                        email: lead.email,
                        mobile: lead.mobile || '',
                        source: lead.source || '',
                        value: lead.value || 0
                      });
                      setEditOpen(true);
                   }}>
                    Edit Lead
                 </Button>
                   <Button variant="outline" onClick={() => setAssignOpen(true)}>
                 <UserPlus className="mr-2 h-4 w-4" /> Assign
              </Button>
              <Button variant="outline" onClick={() => {
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
                setScheduleOpen(true);
              }}>
                 <Calendar className="mr-2 h-4 w-4" /> Schedule
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onConvert(lead.id, lead.value)}>
                 <CheckCircle className="mr-2 h-4 w-4" /> Convert to Deal
              </Button>
           </div>
        </div>
      </div>

         {editOpen && (
            <Modal
              isOpen={editOpen}
              onClose={() => setEditOpen(false)}
              title="Edit Lead Details"
              footer={
                  <Button onClick={handleSaveEdit} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                      <Check className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
              }
            >
              <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <input 
                          type="text"
                          className="w-full p-2.5 rounded-md border bg-background"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input 
                          type="email"
                          className="w-full p-2.5 rounded-md border bg-background"
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <input 
                          type="tel"
                          className="w-full p-2.5 rounded-md border bg-background"
                          value={editData.mobile}
                          onChange={(e) => setEditData({...editData, mobile: e.target.value})}
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label className="text-sm font-medium">Lead Value ($)</label>
                          <input 
                              type="number"
                              className="w-full p-2.5 rounded-md border bg-background"
                              value={editData.value}
                              onChange={(e) => setEditData({...editData, value: Number(e.target.value)})}
                          />
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-medium">Source</label>
                          <input 
                              type="text"
                              className="w-full p-2.5 rounded-md border bg-background"
                              value={editData.source}
                              onChange={(e) => setEditData({...editData, source: e.target.value})}
                          />
                      </div>
                  </div>
              </form>
            </Modal>
         )}

         {assignOpen && (
            <Modal
              isOpen={assignOpen}
              onClose={() => setAssignOpen(false)}
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
                                onClick={() => setSelectedAgentId(agent._id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                   selectedAgentId === agent._id 
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
                                 
                               {selectedAgentId === agent._id && <Check className="ml-auto h-4 w-4 text-primary" />}
                             </div>
                          ))}
                       </div>
                  </div>
              </div>
            </Modal>
         )}

         {scheduleOpen && (
            <Modal
              isOpen={scheduleOpen}
              onClose={() => setScheduleOpen(false)}
              title={lead?.scheduledViewingDate ? "Edit Scheduled Viewing" : "Schedule Viewing"}
              footer={
                  <Button onClick={handleScheduleViewing} className="w-full sm:w-auto">
                      <Clock className="mr-2 h-4 w-4" /> {lead?.scheduledViewingDate ? "Update Schedule" : "Confirm Schedule"}
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
         )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column: Profile */}
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Lead Profile</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div>
                     <label className="text-xs font-medium text-muted-foreground mb-1 block">Lead Value</label>
                     <div className="text-2xl font-bold text-green-600 flex items-center">
                        <DollarSign className="h-5 w-5" /> {lead.value.toLocaleString()}
                     </div>
                  </div>
                  
                  {lead.scheduledViewingDate && (
                     <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                        <label className="text-xs font-medium text-green-700 dark:text-green-400 mb-2 block flex items-center gap-1.5">
                           <Calendar className="h-4 w-4" /> Scheduled Viewing
                        </label>
                        <div className="space-y-2">
                           <div className="font-semibold text-green-600 dark:text-green-400">
                              {new Date(lead.scheduledViewingDate).toLocaleString([], {
                                 weekday: 'long',
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric',
                                 hour: '2-digit',
                                 minute: '2-digit'
                              })}
                           </div>
                           {lead.scheduledViewingNotes && (
                              <div className="text-sm text-muted-foreground italic">
                                 {lead.scheduledViewingNotes}
                              </div>
                           )}
                        </div>
                     </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Source</label>
                        <div className="font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" /> {lead.source}
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Agent</label>
                        <div className="font-medium flex items-center gap-2">
                           <Avatar name={assignedAgentDisplay || 'U'} className="h-5 w-5 text-[9px]" />
                           {assignedAgentDisplay || 'Unassigned'}
                           
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-medium text-muted-foreground mb-2 block">Tags</label>
                     <div className="flex flex-wrap gap-2">
                        {lead.tags && lead.tags.length > 0 ? (
                           lead.tags.map(tag => (
                              <span key={tag} className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium border flex items-center gap-1">
                                 <Tag className="h-3 w-3 text-muted-foreground" /> {tag}
                              </span>
                           ))
                        ) : (
                           <span className="text-sm text-muted-foreground italic">No tags added</span>
                        )}
                        <button className="px-2.5 py-1 rounded-md border border-dashed text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                           + Add
                        </button>
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-medium text-muted-foreground mb-2 block">Next Step</label>
                     {lead.nextAppointment ? (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
                           <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                           <div>
                              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Viewing Scheduled</p>
                              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                                 {new Date(lead.nextAppointment).toLocaleString()}
                              </p>
                           </div>
                        </div>
                     ) : (
                        <div className="bg-muted/30 border rounded-lg p-3 text-sm text-muted-foreground text-center">
                           No upcoming appointments
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
               <CardContent className="p-4 flex items-center justify-between">
                  <div>
                     <p className="font-bold text-lg">Lead Score</p>
                     <p className="text-xs text-muted-foreground">AI Calculated Probability</p>
                  </div>
                  <div className="h-14 w-14 rounded-full border-4 border-primary flex items-center justify-center font-bold text-xl bg-background">
                     85
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Center Column: Activity Hub */}
         <div className="lg:col-span-2 space-y-6">
             <div className="bg-card border rounded-xl overflow-hidden shadow-sm min-h-[500px] flex flex-col">
                <div className="flex border-b">
                   <button 
                     onClick={() => setActiveTab('TIMELINE')}
                     className={cn("px-6 py-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'TIMELINE' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:bg-muted/50")}
                   >
                     Activity Timeline
                   </button>
                   <button 
                     onClick={() => setActiveTab('NOTES')}
                     className={cn("px-6 py-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'NOTES' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:bg-muted/50")}
                   >
                     Notes
                   </button>
                   <button 
                     onClick={() => setActiveTab('LOG')}
                     className={cn("px-6 py-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'LOG' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:bg-muted/50")}
                   >
                     Log Call/Email
                   </button>
                </div>

                <div className="p-6 flex-1 bg-muted/5">
                   {/* Input Area */}
                   <div className="flex gap-4 mb-8">
                      <Avatar name="Me" className="h-10 w-10" />
                      <div className="flex-1">
                         <textarea 
                           className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none resize-none text-sm"
                           placeholder="Write a note or log an activity..."
                           rows={2}
                           value={newNote}
                           onChange={(e) => setNewNote(e.target.value)}
                         />
                         <div className="flex justify-end mt-2">
                            <Button size="sm" onClick={handleAddNote}>Save Note</Button>
                         </div>
                      </div>
                   </div>

                   {/* Feed */}
                   <div className="space-y-6 relative">
                      <div className="absolute top-2 left-[19px] bottom-0 w-0.5 bg-border -z-10" />
                      
                      {timeline.map((item) => (
                         <motion.div 
                           key={item.id} 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="flex gap-4 group"
                         >
                            <div className={cn(
                               "h-10 w-10 rounded-full border-4 border-card flex items-center justify-center shrink-0 shadow-sm z-10",
                               item.type === 'note' ? "bg-yellow-100 text-yellow-600" :
                               item.type === 'call' ? "bg-green-100 text-green-600" :
                               item.type === 'email' ? "bg-blue-100 text-blue-600" :
                               "bg-gray-100 text-gray-600"
                            )}>
                               {item.type === 'note' && <MessageSquare className="h-4 w-4" />}
                               {item.type === 'call' && <Phone className="h-4 w-4" />}
                               {item.type === 'email' && <Mail className="h-4 w-4" />}
                               {item.type === 'creation' || item.type === 'status' ? <Activity className="h-4 w-4" /> : null}
                            </div>
                            <div className="flex-1 bg-card border rounded-lg p-3 shadow-sm group-hover:shadow-md transition-shadow">
                               <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-sm capitalize">{item.type}</span>
                                  <span className="text-xs text-muted-foreground">{item.date}</span>
                               </div>
                               <p className="text-sm text-foreground/90">{item.text}</p>
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Matched Properties */}
             <div>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-lg">Matched Properties</h3>
                   <Button variant="ghost" size="sm" className="text-primary">View All Matches</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {matchedProperties.map(prop => (
                      <div key={prop.id} className="bg-card border rounded-xl overflow-hidden group hover:shadow-lg transition-all">
                         <div className="h-32 relative overflow-hidden">
                            <img src={prop.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="prop" />
                            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-bold">
                               98% Match
                            </div>
                         </div>
                         <div className="p-3">
                            <div className="font-bold text-sm truncate">{prop.address}</div>
                            <div className="text-primary font-bold text-xs mb-2">${(prop.price / 1000000).toFixed(2)}M</div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                               <span className="flex items-center gap-1"><Home className="h-3 w-3" /> {prop.beds}bd</span>
                               <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {prop.sqft}sqft</span>
                            </div>
                            <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                               <Send className="mr-1.5 h-3 w-3" /> Send to Lead
                            </Button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};