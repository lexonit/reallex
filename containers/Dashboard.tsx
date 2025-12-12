
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, BarChart, Bar, XAxis, Cell } from 'recharts';
import { Users, Building, Activity, AlertCircle, TrendingUp, ArrowUpRight, Clock, CheckCircle2, ChevronRight, DollarSign, Calendar, CheckSquare, Plus, Briefcase, FileText } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { MOCK_CHART_DATA, DEFAULT_PIPELINE } from '../constants';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';
import { NavigationTab, CurrentUser } from '../types';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { fetchLeads } from '../store/slices/leadsSlice';

interface DashboardProps {
  onNavigate: (tab: NavigationTab) => void;
  user: CurrentUser | null;
}

interface TaskItem {
    id: string;
    title: string;
    due: string;
    done: boolean;
    priority?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const dispatch = useDispatch();
  const { leads, isLoading: leadsLoading } = useSelector((state: any) => state.leads);
  const [isLoading, setIsLoading] = useState(true);
  const isAgent = user?.role === 'AGENT';
  
  // Quick Add State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'LEAD' | 'LISTING' | 'TASK'>('LEAD');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Task State
  const [tasks, setTasks] = useState<TaskItem[]>([
      { id: '1', title: "Follow up with Mike", due: "Today", done: false },
      { id: '2', title: "Send contract for Sign", due: "Today", done: false },
      { id: '3', title: "Update listing photos", due: "Tomorrow", done: true },
  ]);

  // Task Form State
  const [newTaskData, setNewTaskData] = useState({
      title: '',
      dueDate: '',
      priority: 'Medium',
      details: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch leads on mount and set up polling for real-time updates
  useEffect(() => {
    const fetchLeadsData = () => {
      dispatch(fetchLeads({
        filter: {},
        userId: user?.id,
        userRole: user?.role
      }) as any);
    };

    // Initial fetch
    fetchLeadsData();

    // Set up polling interval (10 seconds)
    const interval = setInterval(fetchLeadsData, 10000);

    return () => clearInterval(interval);
  }, [user?.id, user?.role, dispatch]);

  const handleQuickAdd = (type: 'LEAD' | 'LISTING' | 'TASK') => {
      setQuickAddType(type);
      setNewTaskData({ title: '', dueDate: '', priority: 'Medium', details: '' }); // Reset form
      setIsQuickAddOpen(true);
  };

  const submitQuickAdd = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (quickAddType === 'TASK') {
          if (!newTaskData.title) {
             setToast({ message: 'Task title is required', type: 'error' });
             return;
          }

          const newTask: TaskItem = {
              id: Math.random().toString(36).substr(2, 9),
              title: newTaskData.title,
              due: newTaskData.dueDate ? new Date(newTaskData.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Today",
              done: false,
              priority: newTaskData.priority
          };
          
          setTasks([newTask, ...tasks]);
      }

      setIsQuickAddOpen(false);
      setToast({ message: `${quickAddType === 'LEAD' ? 'Lead' : quickAddType === 'LISTING' ? 'Listing' : 'Task'} created successfully!`, type: 'success' });
      setTimeout(() => setToast(null), 3000);
  };

  const toggleTask = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Helper function to calculate lead metrics
  const getLeadMetrics = () => {
    const totalLeads = leads.length;
    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const formattedValue = totalValue >= 1000000 
      ? `$${(totalValue / 1000000).toFixed(1)}M`
      : totalValue >= 1000
      ? `$${(totalValue / 1000).toFixed(0)}K`
      : `$${totalValue}`;
    
    return {
      totalLeads,
      totalValue: formattedValue,
      newLeads: leads.filter(l => l.status === 'New').length,
      qualifiedLeads: leads.filter(l => l.status === 'Qualified').length
    };
  };

  const leadMetrics = getLeadMetrics();

  // 1. Rich Revenue Chart Widget
  const RevenueChart = () => {
    if (isLoading) return <Skeleton className="w-full h-full min-h-[300px] rounded-xl" />;
    
    // Simulate lower numbers for agent
    const chartData = isAgent 
        ? MOCK_CHART_DATA.map(d => ({ ...d, revenue: d.revenue * 0.15 })) 
        : MOCK_CHART_DATA;

    const totalRev = isAgent ? "$185,400" : "$1,240,500";
    const title = isAgent ? "My Revenue" : "Total Revenue";

    return (
      <div className="relative w-full h-full flex flex-col bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-h-[300px]">
        <div className="p-4 md:p-6 flex justify-between items-start z-10 relative">
          <div>
             <h3 className="text-sm font-medium text-zinc-400 mb-1">{title}</h3>
             <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">{totalRev}</span>
                <span className="text-xs md:text-sm font-medium text-emerald-400 flex items-center bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12.5%
                </span>
             </div>
          </div>
          <select className="bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded-md px-2 py-1 outline-none">
             <option>This Year</option>
             <option>Last Year</option>
          </select>
        </div>
        
        <div className="flex-1 w-full min-h-[200px] relative">
           {/* Gradient Overlay for depth */}
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10 pointer-events-none" />
           
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <Tooltip 
                     cursor={{ stroke: '#52525b', strokeWidth: 1 }}
                     contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 2. Rich Stat Card Widget
  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, delay }: any) => {
     if (isLoading) return <Skeleton className="w-full h-full min-h-[140px] rounded-xl" />;

     return (
       <div className={cn(
          "flex flex-col justify-between w-full h-full min-h-[140px] p-4 md:p-6 bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-500",
          delay
       )}>
          <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.05] transition-transform group-hover:scale-150 duration-700", color.replace('text-', 'bg-'))} />
          
          <div className="flex justify-between items-start z-10">
             <div className={cn("p-2 rounded-lg bg-opacity-[0.08] backdrop-blur-sm", color.replace('text-', 'bg-'), color)}>
                <Icon className="h-4 w-4" />
             </div>
             {trend && (
               <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border",
                  trend === 'up' 
                   ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" 
                   : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
               )}>
                  {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                  {trendValue}
               </span>
             )}
          </div>
          
          <div className="z-10 mt-4">
             <h3 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">{value}</h3>
             <p className="text-xs text-neutral-500 dark:text-zinc-400 font-medium mt-1 uppercase tracking-wide">{title}</p>
          </div>
       </div>
    );
  };

  // 3. Agenda Widget (Appointments & Tasks)
  const AgendaWidget = () => {
      if (isLoading) return <Skeleton className="w-full h-full min-h-[300px] rounded-xl" />;

      const appointments = [
          { title: "Viewing: 123 Beverly Dr", time: "10:00 AM", type: 'viewing' },
          { title: "Closing: Ocean Ave", time: "2:00 PM", type: 'closing' },
          { title: "Team Meeting", time: "4:30 PM", type: 'meeting' },
      ];

      return (
          <div className="w-full h-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-4 border-b border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-sm">Today's Agenda</h3>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Appointments */}
                  <div className="space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Appointments</h4>
                      {appointments.map((apt, i) => (
                          <div key={i} className="flex gap-3 items-center group">
                              <div className="w-16 text-xs font-bold text-right text-muted-foreground group-hover:text-primary transition-colors">{apt.time}</div>
                              <div className="w-1 h-8 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                              <div className="flex-1 p-2 rounded-md bg-muted/30 text-sm font-medium truncate border border-transparent group-hover:border-primary/10 group-hover:bg-primary/5 transition-all">
                                  {apt.title}
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
                          <span>Tasks ({tasks.filter(t => !t.done).length})</span>
                          <span className="text-primary cursor-pointer hover:underline" onClick={() => handleQuickAdd('TASK')}>+ Add</span>
                      </h4>
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <div key={task.id} className="flex gap-3 items-center group">
                              <div 
                                onClick={() => toggleTask(task.id)}
                                className={cn(
                                  "h-4 w-4 rounded border flex items-center justify-center cursor-pointer transition-all",
                                  task.done 
                                    ? "bg-green-500 border-green-500 text-white" 
                                    : "border-muted-foreground/30 hover:border-primary group-hover:border-primary"
                                )}>
                                  {task.done && <CheckCircle2 className="h-3 w-3" />}
                              </div>
                              <div className={cn("flex-1 text-sm truncate transition-colors", task.done ? "text-muted-foreground line-through decoration-muted-foreground" : "group-hover:text-primary")}>
                                  {task.title}
                              </div>
                              <div className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded",
                                task.done ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                              )}>
                                {task.due}
                              </div>
                          </div>
                        ))
                      ) : (
                         <div className="text-center py-4 text-xs text-muted-foreground">No tasks yet. Add one!</div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  // 4. Pipeline Snapshot Widget
  const PipelineSnapshot = () => {
      if (isLoading || leadsLoading) return <Skeleton className="w-full h-full min-h-[200px] rounded-xl" />;

      // Calculate real lead counts by status
      const stats = [
          { label: 'New', count: leads.filter(l => l.status === 'New').length, color: 'bg-blue-500' },
          { label: 'Contacted', count: leads.filter(l => l.status === 'Contacted').length, color: 'bg-yellow-500' },
          { label: 'Qualified', count: leads.filter(l => l.status === 'Qualified').length, color: 'bg-purple-500' },
          { label: 'Converted', count: leads.filter(l => l.status === 'Converted').length, color: 'bg-emerald-500' },
          { label: 'Lost', count: leads.filter(l => l.status === 'Lost').length, color: 'bg-red-500' },
      ];
      
      const max = Math.max(...stats.map(s => s.count), 1);

      return (
          <div className="w-full h-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="font-bold text-lg">Leads Pipeline</h3>
                    <p className="text-sm text-muted-foreground">Real-time lead status distribution</p>
                 </div>
                 <Button variant="ghost" size="sm" onClick={() => onNavigate(NavigationTab.LEADS)}>View All</Button>
              </div>
              
              <div className="flex-1 flex items-end gap-2 md:gap-4 justify-between min-h-[120px]">
                  {stats.map((stat, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-full relative h-[100px] bg-muted/20 rounded-t-lg overflow-hidden flex items-end">
                              <div 
                                  className={cn("w-full transition-all duration-700 ease-out opacity-80 group-hover:opacity-100", stat.color)}
                                  style={{ height: `${(stat.count / max) * 100}%` }}
                              />
                              <span className="absolute bottom-2 w-full text-center text-xs font-bold text-black/50 dark:text-white/70">{stat.count}</span>
                          </div>
                          <span className="text-[10px] md:text-xs font-medium text-center text-muted-foreground truncate w-full">{stat.label}</span>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  // 5. Recent Leads Widget
  const RecentLeads = () => {
     if (isLoading || leadsLoading) return <Skeleton className="w-full h-full min-h-[300px] rounded-xl" />;

     const recentLeadsList = leads.slice(0, 5);

     return (
       <div className="w-full h-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl p-0 overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 md:p-5 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between bg-neutral-50/50 dark:bg-zinc-900/50">
             <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">Recent Leads</h3>
             </div>
             <Button variant="ghost" size="sm" className="text-xs" onClick={() => onNavigate(NavigationTab.LEADS)}>View All</Button>
          </div>
          <div className="flex-1 overflow-y-auto">
             {recentLeadsList.length > 0 ? (
               <div className="space-y-0">
                 {recentLeadsList.map((lead, idx) => (
                   <div key={lead.id} className={cn(
                     "p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors border-b border-neutral-100 dark:border-white/5 cursor-pointer",
                     idx === recentLeadsList.length - 1 && "border-b-0"
                   )}>
                     <div className="flex-1">
                       <p className="font-medium text-sm text-neutral-900 dark:text-white">{lead.name}</p>
                       <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{lead.email}</p>
                       <div className="flex gap-2 mt-2">
                         <span className={cn(
                           "text-[10px] px-2 py-1 rounded font-medium",
                           lead.status === 'New' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                           lead.status === 'Contacted' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                           lead.status === 'Qualified' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                           lead.status === 'Converted' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                           lead.status === 'Lost' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                         )}>
                           {lead.status}
                         </span>
                         {lead.value && (
                           <span className="text-[10px] px-2 py-1 rounded font-medium bg-neutral-100 text-neutral-700 dark:bg-zinc-800 dark:text-neutral-300">
                             ${lead.value.toLocaleString()}
                           </span>
                         )}
                       </div>
                     </div>
                     <ChevronRight className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="flex items-center justify-center h-full min-h-[200px] text-center">
                 <div>
                   <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground">No leads yet</p>
                   <Button variant="link" size="sm" onClick={() => handleQuickAdd('LEAD')} className="mt-2">
                     Create your first lead
                   </Button>
                 </div>
               </div>
             )}
          </div>
       </div>
    );
  };

  // 6. Rich Activity Feed Widget (Existing)
  const ActivityFeed = () => {
     if (isLoading) return <Skeleton className="w-full h-full min-h-[400px] rounded-xl" />;

     return (
       <div className="w-full h-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl p-0 overflow-hidden flex flex-col shadow-sm min-h-[350px]">
          <div className="p-4 md:p-5 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between bg-neutral-50/50 dark:bg-zinc-900/50">
             <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">Recent Activity</h3>
             </div>
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
          </div>
          <div className="flex-1 p-4 md:p-5 space-y-6 relative overflow-y-auto max-h-[400px]">
               {/* Timeline Line */}
               <div className="absolute left-[29px] top-6 bottom-6 w-[2px] bg-neutral-100 dark:bg-zinc-800" />
               
               {[
                 { user: "Sarah Connor", action: "Logged a new lead", target: "John Smith", time: "2m ago", icon: Users, color: "text-blue-500 bg-blue-500/10" },
                 { user: "System", action: "Property Marked Sold", target: "123 Beverly Dr", time: "15m ago", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
                 { user: "Mike Ross", action: "Updated pricing", target: "Ocean View Loft", time: "1h ago", icon: DollarSign, color: "text-orange-500 bg-orange-500/10" },
                 { user: "Kyle Reese", action: "Uploaded documents", target: "Contract_v2.pdf", time: "3h ago", icon: Clock, color: "text-purple-500 bg-purple-500/10" },
               ]
               .filter(item => !isAgent || item.user === user?.name || item.user === 'System')
               .map((item, i) => (
                  <div key={i} className="flex items-start gap-3 relative z-10 group">
                     <div className={cn("h-8 w-8 rounded-full border-4 border-white dark:border-black shrink-0 flex items-center justify-center bg-white dark:bg-zinc-900 z-10", item.color)}>
                        <item.icon className="h-3.5 w-3.5" />
                     </div>
                     <div className="flex-1 -mt-1 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                           <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">{item.user}</p>
                           <span className="text-[10px] text-neutral-400 font-mono">{item.time}</span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {item.action} <span className="text-neutral-700 dark:text-neutral-300 font-medium">{item.target}</span>
                        </p>
                     </div>
                  </div>
               ))}
          </div>
       </div>
    );
  };

  const items = [
    // Row 1: Quick Stats
    {
        header: <StatCard 
            title={isAgent ? "My Leads" : "Total Leads"} 
            value={leadMetrics.totalLeads.toString()} 
            icon={Users} 
            trend="up" 
            trendValue={`+${Math.max(1, Math.floor(leadMetrics.totalLeads * 0.2))} new`} 
            color="text-blue-500" 
            delay="delay-100" 
        />,
        className: "md:col-span-1",
    },
    {
        header: <StatCard 
            title={isAgent ? "Qualified Leads" : "Total Qualified"} 
            value={leadMetrics.qualifiedLeads.toString()} 
            icon={Building} 
            trend="neutral" 
            trendValue={`${Math.floor((leadMetrics.qualifiedLeads / Math.max(1, leadMetrics.totalLeads)) * 100)}%`} 
            color="text-purple-500" 
            delay="delay-200" 
        />,
        className: "md:col-span-1",
    },
    {
        header: <StatCard 
            title={isAgent ? "Pipeline Value" : "Total Lead Value"} 
            value={leadMetrics.totalValue} 
            icon={DollarSign} 
            trend="up" 
            trendValue="8%" 
            color="text-emerald-500" 
            delay="delay-300" 
        />,
        className: "md:col-span-1",
    },
    // Row 2: Revenue (Wide) & Agenda (Side)
    {
      header: <RevenueChart />,
      className: "md:col-span-2 md:row-span-2",
    },
    {
        header: <AgendaWidget />,
        className: "md:col-span-1 md:row-span-2",
    },
    // Row 3: Pipeline, Recent Leads & Activity
    {
        header: <PipelineSnapshot />,
        className: "md:col-span-1",
    },
    {
        header: <RecentLeads />,
        className: "md:col-span-1",
    },
    {
        header: <ActivityFeed />,
        className: "md:col-span-1",
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Dashboard</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                {isAgent ? `Welcome back, ${user?.name}. Here's what's happening today.` : "Overview of your agency's performance today."}
            </p>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <Button variant="outline" className="gap-2" onClick={() => handleQuickAdd('TASK')}>
               <CheckSquare className="h-4 w-4" /> Add Task
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleQuickAdd('LISTING')}>
               <Building className="h-4 w-4" /> Add Listing
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2" onClick={() => handleQuickAdd('LEAD')}>
               <Plus className="h-4 w-4" /> Add Lead
            </Button>
         </div>
      </div>
      
      <BentoGrid className="max-w-full">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            header={item.header}
            className={item.className}
          />
        ))}
      </BentoGrid>

      {/* Quick Add Modal */}
      <Modal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title={`Create New ${quickAddType === 'LEAD' ? 'Lead' : quickAddType === 'LISTING' ? 'Listing' : 'Task'}`}
        footer={
            <Button onClick={submitQuickAdd} className="w-full sm:w-auto">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Create {quickAddType === 'LEAD' ? 'Lead' : quickAddType === 'LISTING' ? 'Listing' : 'Task'}
            </Button>
        }
      >
        <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground mb-4">
                Enter the details below to quickly add a new {quickAddType.toLowerCase()} to your workflow.
            </p>
            
            {quickAddType === 'LEAD' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">First Name</label>
                            <input className="w-full p-2 rounded-md border bg-background" placeholder="Jane" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Last Name</label>
                            <input className="w-full p-2 rounded-md border bg-background" placeholder="Doe" />
                         </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Email</label>
                        <input className="w-full p-2 rounded-md border bg-background" placeholder="jane@example.com" />
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Interest</label>
                        <select className="w-full p-2 rounded-md border bg-background">
                            <option>Buying</option>
                            <option>Selling</option>
                            <option>Renting</option>
                        </select>
                    </div>
                </div>
            )}

            {quickAddType === 'LISTING' && (
                 <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Address</label>
                        <input className="w-full p-2 rounded-md border bg-background" placeholder="123 Main St" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Price</label>
                            <input className="w-full p-2 rounded-md border bg-background" type="number" placeholder="$0.00" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Type</label>
                            <select className="w-full p-2 rounded-md border bg-background">
                                <option>Single Family</option>
                                <option>Condo</option>
                            </select>
                         </div>
                    </div>
                 </div>
            )}

            {quickAddType === 'TASK' && (
                 <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                        <input 
                          className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
                          placeholder="e.g. Call John" 
                          value={newTaskData.title}
                          onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Due Date</label>
                            <input 
                              className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
                              type="date" 
                              value={newTaskData.dueDate}
                              onChange={(e) => setNewTaskData({...newTaskData, dueDate: e.target.value})}
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Priority</label>
                            <select 
                              className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                              value={newTaskData.priority}
                              onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})}
                            >
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                         </div>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Details</label>
                        <textarea 
                          className="w-full p-2 rounded-md border bg-background h-20 resize-none focus:ring-2 focus:ring-primary/50 outline-none" 
                          placeholder="Task description..." 
                          value={newTaskData.details}
                          onChange={(e) => setNewTaskData({...newTaskData, details: e.target.value})}
                        />
                    </div>
                 </div>
            )}
        </div>
      </Modal>
    </div>
  );
};
