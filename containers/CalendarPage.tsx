
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { CalendarEvent, CurrentUser } from '../types';
import { MOCK_LEADS, MOCK_PROPERTIES } from '../constants';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, 
  MapPin, User, Building, Plus, RefreshCw, Check 
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { cn } from '../lib/utils';
import { Avatar } from '../components/ui/Avatar';

interface CalendarPageProps {
  user: CurrentUser | null;
}

type ViewType = 'MONTH' | 'WEEK' | 'DAY';

export const CalendarPage: React.FC<CalendarPageProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('MONTH');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    type: 'VIEWING',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    description: '',
    leadId: '',
    propertyId: ''
  });
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initial Data Load
  useEffect(() => {
    // Generate some mock events based on current date
    const today = new Date();
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Viewing: 123 Beverly Park',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
        type: 'VIEWING',
        leadId: '1',
        propertyId: '1',
        description: 'First showing for Alice.'
      },
      {
        id: '2',
        title: 'Lunch with Investor',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 30),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
        type: 'MEETING',
        leadId: '2',
        description: 'Discuss portfolio options.'
      },
      {
        id: '3',
        title: 'Closing: Ocean Ave',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 15, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 16, 30),
        type: 'CLOSING',
        propertyId: '2',
        description: 'Bring champagne!'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
        setSynced(true);
        setToast({ message: 'Synced with Google Calendar successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    }, 2000);
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
        setToast({ message: 'Please fill in required fields', type: 'error' });
        return;
    }

    const event: CalendarEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: newEvent.title!,
        start: new Date(newEvent.start!),
        end: new Date(newEvent.end!),
        type: newEvent.type as any || 'MEETING',
        description: newEvent.description,
        leadId: newEvent.leadId,
        propertyId: newEvent.propertyId,
    };

    setEvents([...events, event]);
    setIsModalOpen(false);
    setToast({ message: 'Event created', type: 'success' });
    setTimeout(() => setToast(null), 3000);
    
    // Reset form
    setNewEvent({
        title: '',
        type: 'VIEWING',
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 1)),
        description: '',
        leadId: '',
        propertyId: ''
    });
  };

  // --- Calendar Logic ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    return { daysInMonth, firstDay };
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'MONTH') newDate.setMonth(newDate.getMonth() + 1);
    else if (view === 'WEEK') newDate.setDate(newDate.getDate() + 7);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const prevPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'MONTH') newDate.setMonth(newDate.getMonth() - 1);
    else if (view === 'WEEK') newDate.setDate(newDate.getDate() - 7);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(e => 
        e.start.getDate() === date.getDate() && 
        e.start.getMonth() === date.getMonth() && 
        e.start.getFullYear() === date.getFullYear()
    );
  };

  // --- Render Views ---

  const renderMonthView = () => {
    const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
    const days = [];
    const blanks = [];

    // Fill blanks for previous month
    for (let i = 0; i < firstDay; i++) {
        blanks.push(<div key={`blank-${i}`} className="bg-muted/10 h-32 border-b border-r dark:border-white/5" />);
    }

    // Fill days
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
        const dayEvents = getEventsForDay(date);
        
        days.push(
            <div key={d} className={cn(
                "h-32 border-b border-r p-2 transition-colors hover:bg-muted/20 relative group dark:border-white/5",
                isToday(date) ? "bg-primary/5" : "bg-card"
            )}>
                <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                        isToday(date) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    )}>
                        {d}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => {
                        setNewEvent({ ...newEvent, start: date, end: new Date(date.getTime() + 3600000) });
                        setIsModalOpen(true);
                    }}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className="space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
                    {dayEvents.map(ev => (
                        <div key={ev.id} className={cn(
                            "text-xs px-2 py-1 rounded truncate border-l-2 cursor-pointer transition-all hover:scale-105",
                            ev.type === 'VIEWING' ? "bg-blue-100 text-blue-700 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300" :
                            ev.type === 'CLOSING' ? "bg-green-100 text-green-700 border-green-500 dark:bg-green-900/30 dark:text-green-300" :
                            "bg-purple-100 text-purple-700 border-purple-500 dark:bg-purple-900/30 dark:text-purple-300"
                        )}>
                            {ev.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-7 border-t border-l dark:border-white/5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-xs font-semibold uppercase text-muted-foreground border-b border-r bg-muted/20 dark:border-white/5">
                    {day}
                </div>
            ))}
            {blanks}
            {days}
        </div>
    );
  };

  const renderWeekView = () => {
    // Generate week days starting from Sunday of current week
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        weekDays.push(d);
    }
    
    // Hours 8 AM to 8 PM
    const hours = Array.from({length: 13}, (_, i) => i + 8);

    return (
        <div className="flex flex-col h-[600px] overflow-y-auto">
             <div className="grid grid-cols-8 border-b dark:border-white/5 sticky top-0 bg-background z-10">
                 <div className="p-2 border-r bg-muted/20 text-center text-xs font-semibold text-muted-foreground pt-4 dark:border-white/5">Time</div>
                 {weekDays.map((d, i) => (
                     <div key={i} className={cn(
                        "p-2 text-center border-r min-w-[100px] dark:border-white/5",
                        isToday(d) ? "bg-primary/5" : ""
                     )}>
                         <div className="text-xs uppercase text-muted-foreground">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                         <div className={cn("text-lg font-bold", isToday(d) ? "text-primary" : "")}>{d.getDate()}</div>
                     </div>
                 ))}
             </div>
             
             <div className="grid grid-cols-8 flex-1">
                 {/* Time Column */}
                 <div className="border-r bg-muted/5 dark:border-white/5">
                     {hours.map(h => (
                         <div key={h} className="h-20 border-b text-xs text-muted-foreground p-2 text-right relative dark:border-white/5">
                             <span className="-top-3 relative">{h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}</span>
                         </div>
                     ))}
                 </div>
                 
                 {/* Days Columns */}
                 {weekDays.map((day, i) => {
                     const dayEvents = getEventsForDay(day);
                     return (
                        <div key={i} className="border-r relative dark:border-white/5 group hover:bg-muted/5">
                            {/* Grid Lines */}
                            {hours.map(h => <div key={h} className="h-20 border-b dark:border-white/5" />)}
                            
                            {/* Events Overlay */}
                            {dayEvents.map(ev => {
                                const startHour = ev.start.getHours();
                                const duration = (ev.end.getTime() - ev.start.getTime()) / (1000 * 60 * 60); // hours
                                const top = (startHour - 8) * 80; // 80px per hour
                                const height = duration * 80;
                                
                                if (startHour < 8 || startHour > 20) return null; // Simple clip
                                
                                return (
                                    <div 
                                        key={ev.id}
                                        style={{ top: `${top}px`, height: `${height}px` }}
                                        className={cn(
                                            "absolute left-1 right-1 rounded p-2 text-xs border-l-4 overflow-hidden shadow-sm z-10 cursor-pointer hover:brightness-95",
                                            ev.type === 'VIEWING' ? "bg-blue-100 text-blue-700 border-blue-500 dark:bg-blue-900/50 dark:text-blue-200" :
                                            ev.type === 'CLOSING' ? "bg-green-100 text-green-700 border-green-500 dark:bg-green-900/50 dark:text-green-200" :
                                            "bg-purple-100 text-purple-700 border-purple-500 dark:bg-purple-900/50 dark:text-purple-200"
                                        )}
                                    >
                                        <div className="font-bold truncate">{ev.title}</div>
                                        <div className="truncate opacity-80">{ev.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    </div>
                                );
                            })}
                        </div>
                     );
                 })}
             </div>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 h-[calc(100vh-100px)] flex flex-col">
       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
              <div className="flex items-center gap-2 bg-card border rounded-lg p-1 shadow-sm">
                 <button onClick={() => setView('MONTH')} className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", view === 'MONTH' ? "bg-muted text-primary" : "hover:bg-muted/50")}>Month</button>
                 <button onClick={() => setView('WEEK')} className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", view === 'WEEK' ? "bg-muted text-primary" : "hover:bg-muted/50")}>Week</button>
                 <button onClick={() => setView('DAY')} className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", view === 'DAY' ? "bg-muted text-primary" : "hover:bg-muted/50")}>Day</button>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={handleSync} disabled={isSyncing || synced}>
                {isSyncing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : synced ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                {isSyncing ? 'Syncing...' : synced ? 'Synced' : 'Sync Google/Outlook'}
             </Button>
             <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Event
             </Button>
          </div>
       </div>

       <Card className="flex-1 flex flex-col overflow-hidden border bg-card">
           <div className="p-4 border-b flex items-center justify-between bg-muted/20">
               <div className="flex items-center gap-4">
                   <Button variant="ghost" size="icon" onClick={prevPeriod}><ChevronLeft className="h-5 w-5" /></Button>
                   <h3 className="text-lg font-bold w-40 text-center">
                       {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                   </h3>
                   <Button variant="ghost" size="icon" onClick={nextPeriod}><ChevronRight className="h-5 w-5" /></Button>
                   <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
               </div>
           </div>
           
           <div className="flex-1 overflow-auto bg-background">
               {view === 'MONTH' && renderMonthView()}
               {view === 'WEEK' && renderWeekView()}
               {view === 'DAY' && (
                   <div className="p-4 max-w-2xl mx-auto space-y-4">
                       <h3 className="font-bold text-muted-foreground border-b pb-2">Agenda for {currentDate.toLocaleDateString()}</h3>
                       {getEventsForDay(currentDate).length > 0 ? getEventsForDay(currentDate).map(ev => (
                           <div key={ev.id} className="flex gap-4 p-4 border rounded-xl hover:bg-muted/20 transition-colors group">
                               <div className="flex flex-col items-center min-w-[80px] text-muted-foreground border-r pr-4">
                                   <span className="text-sm font-bold">{ev.start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                   <span className="text-xs">{ev.end.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                               </div>
                               <div className="flex-1">
                                   <div className="flex justify-between items-start">
                                       <h4 className="font-bold">{ev.title}</h4>
                                       <span className={cn(
                                           "text-[10px] uppercase font-bold px-2 py-0.5 rounded",
                                            ev.type === 'VIEWING' ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                       )}>{ev.type}</span>
                                   </div>
                                   {ev.description && <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>}
                                   
                                   <div className="flex gap-4 mt-3">
                                       {ev.leadId && (
                                           <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded cursor-pointer hover:underline">
                                               <User className="h-3 w-3" />
                                               {MOCK_LEADS.find(l => l.id === ev.leadId)?.name || 'Lead'}
                                           </div>
                                       )}
                                       {ev.propertyId && (
                                           <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded cursor-pointer hover:underline">
                                               <Building className="h-3 w-3" />
                                               {MOCK_PROPERTIES.find(p => p.id === ev.propertyId)?.address.split(',')[0] || 'Property'}
                                           </div>
                                       )}
                                   </div>
                               </div>
                           </div>
                       )) : (
                           <div className="text-center py-12 text-muted-foreground">No events scheduled for today.</div>
                       )}
                   </div>
               )}
           </div>
       </Card>

       <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Add New Event"
         footer={
             <Button onClick={handleCreateEvent} className="w-full">Create Event</Button>
         }
       >
           <div className="space-y-4 py-2">
               <div className="space-y-2">
                   <label className="text-sm font-medium">Event Title</label>
                   <input 
                      className="w-full p-2.5 rounded-md border bg-background" 
                      placeholder="Meeting with client..."
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                   />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium">Type</label>
                       <select 
                          className="w-full p-2.5 rounded-md border bg-background"
                          value={newEvent.type}
                          onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                       >
                           <option value="VIEWING">Viewing</option>
                           <option value="MEETING">Meeting</option>
                           <option value="CLOSING">Closing</option>
                           <option value="FOLLOW_UP">Follow Up</option>
                       </select>
                   </div>
                   <div className="space-y-2">
                       <label className="text-sm font-medium">Date</label>
                       <input 
                           type="datetime-local" 
                           className="w-full p-2.5 rounded-md border bg-background"
                           value={newEvent.start?.toISOString().slice(0, 16)}
                           onChange={(e) => {
                               const start = new Date(e.target.value);
                               const end = new Date(start.getTime() + 3600000);
                               setNewEvent({...newEvent, start, end});
                           }}
                       />
                   </div>
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium">Link Lead (Optional)</label>
                   <div className="relative">
                       <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <select 
                          className="w-full pl-9 p-2.5 rounded-md border bg-background appearance-none"
                          value={newEvent.leadId}
                          onChange={(e) => setNewEvent({...newEvent, leadId: e.target.value})}
                       >
                           <option value="">Select a lead...</option>
                           {MOCK_LEADS.map(lead => (
                               <option key={lead.id} value={lead.id}>{lead.name} ({lead.status})</option>
                           ))}
                       </select>
                   </div>
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium">Link Property (Optional)</label>
                   <div className="relative">
                       <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <select 
                          className="w-full pl-9 p-2.5 rounded-md border bg-background appearance-none"
                          value={newEvent.propertyId}
                          onChange={(e) => setNewEvent({...newEvent, propertyId: e.target.value})}
                       >
                           <option value="">Select a property...</option>
                           {MOCK_PROPERTIES.map(prop => (
                               <option key={prop.id} value={prop.id}>{prop.address}</option>
                           ))}
                       </select>
                   </div>
               </div>

               <div className="space-y-2">
                   <label className="text-sm font-medium">Description</label>
                   <textarea 
                       className="w-full p-2.5 rounded-md border bg-background h-20 resize-none"
                       placeholder="Additional notes..."
                       value={newEvent.description}
                       onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                   />
               </div>
           </div>
       </Modal>
    </div>
  );
};
