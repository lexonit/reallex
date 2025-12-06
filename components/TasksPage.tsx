
import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Task, TaskPriority, TaskCategory, TaskRecurring, CurrentUser } from '../types';
import { Plus, CheckCircle2, Calendar, Bell, Repeat, AlertCircle, Clock, Filter, Trash2, Tag } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Toast } from './ui/Toast';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { graphqlRequest } from '../lib/graphql';

interface TasksPageProps {
  user: CurrentUser | null;
}

export const TasksPage: React.FC<TasksPageProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'MEDIUM',
    category: 'CALL',
    recurring: 'NONE',
    reminder: true,
  });

  const fetchTasks = async () => {
    const query = `
      query GetTasks {
        tasks {
          id
          title
          description
          dueDate
          isCompleted
          priority
          category
          recurring
          reminder
          relatedTo {
            type
            id
            name
          }
        }
      }
    `;
    try {
      const data = await graphqlRequest(query);
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleCreateTask = async () => {
    if (!newTask.title) {
        setToast({ message: 'Title is required', type: 'error' });
        return;
    }

    const mutation = `
      mutation CreateTask($input: TaskInput) {
        createTask(input: $input) {
          id
          title
          description
          dueDate
          isCompleted
          priority
          category
          recurring
          reminder
          relatedTo {
            type
            id
            name
          }
        }
      }
    `;

    try {
      const result = await graphqlRequest(mutation, {
        input: {
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate,
          priority: newTask.priority,
          category: newTask.category,
          recurring: newTask.recurring,
          reminder: newTask.reminder
        }
      });

      setTasks([result.createTask, ...tasks]);
      setIsModalOpen(false);
      setToast({ message: 'Task created successfully', type: 'success' });
      
      // Reset Form
      setNewTask({
          title: '',
          description: '',
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'MEDIUM',
          category: 'CALL',
          recurring: 'NONE',
          reminder: true,
      });
    } catch (error) {
      setToast({ message: 'Error creating task', type: 'error' });
    }
  };

  const toggleComplete = async (id: string) => {
    // Optimistic
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));

    const mutation = `
      mutation ToggleTask($id: ID!) {
        toggleTaskCompletion(id: $id) {
          id
          isCompleted
        }
      }
    `;
    try {
      await graphqlRequest(mutation, { id });
    } catch (err) {
      console.error("Failed to toggle task");
    }
  };

  const deleteTask = async (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
      const mutation = `
        mutation DeleteTask($id: ID!) {
          deleteTask(id: $id) { id }
        }
      `;
      try {
        await graphqlRequest(mutation, { id });
        setToast({ message: 'Task deleted', type: 'success' });
      } catch (err) {
        setToast({ message: 'Error deleting task', type: 'error' });
      }
  };

  // Helper: Grouping Logic
  const today = new Date().toISOString().split('T')[0];
  
  const getFilteredTasks = () => {
      let filtered = tasks;
      if (filter === 'COMPLETED') return tasks.filter(t => t.isCompleted);
      
      // For active lists, hide completed
      filtered = filtered.filter(t => !t.isCompleted);

      if (filter === 'TODAY') return filtered.filter(t => t.dueDate === today);
      if (filter === 'UPCOMING') return filtered.filter(t => t.dueDate > today);
      
      return filtered; // ALL includes overdue, today, upcoming
  };

  // Robust sort that handles missing due dates
  const activeTasks = getFilteredTasks().sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  // Stats
  const overdueCount = tasks.filter(t => !t.isCompleted && t.dueDate && t.dueDate < today).length;
  const todayCount = tasks.filter(t => !t.isCompleted && t.dueDate === today).length;
  const completedCount = tasks.filter(t => t.isCompleted).length;

  const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
      const colors = {
          HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
          MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
          LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      };
      return (
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase", colors[priority] || colors.MEDIUM)}>
              {priority}
          </span>
      );
  };

  const CategoryIcon = ({ category }: { category: TaskCategory }) => {
      switch(category) {
          case 'CALL': return <Clock className="h-3 w-3" />;
          case 'EMAIL': return <Tag className="h-3 w-3" />;
          case 'MEETING': return <Calendar className="h-3 w-3" />;
          default: return <CheckCircle2 className="h-3 w-3" />;
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 h-full flex flex-col">
       <AnimatePresence>
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
       </AnimatePresence>

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
              <h2 className="text-2xl font-bold tracking-tight">Tasks & Activities</h2>
              <p className="text-muted-foreground">Manage your daily todo list, recurring activities and follow-ups.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-primary/20">
             <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
           <Card className="p-4 flex items-center gap-3 bg-red-500/5 border-red-500/20">
               <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                   <AlertCircle className="h-5 w-5" />
               </div>
               <div>
                   <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueCount}</p>
                   <p className="text-xs font-medium text-red-600/70 dark:text-red-400/70 uppercase">Overdue</p>
               </div>
           </Card>
           <Card className="p-4 flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                   <Calendar className="h-5 w-5" />
               </div>
               <div>
                   <p className="text-2xl font-bold">{todayCount}</p>
                   <p className="text-xs font-medium text-muted-foreground uppercase">Due Today</p>
               </div>
           </Card>
           <Card className="p-4 flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                   <CheckCircle2 className="h-5 w-5" />
               </div>
               <div>
                   <p className="text-2xl font-bold">{completedCount}</p>
                   <p className="text-xs font-medium text-muted-foreground uppercase">Completed</p>
               </div>
           </Card>
           <Card className="p-4 flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                   <Repeat className="h-5 w-5" />
               </div>
               <div>
                   <p className="text-2xl font-bold">{tasks.filter(t => t.recurring !== 'NONE').length}</p>
                   <p className="text-xs font-medium text-muted-foreground uppercase">Recurring</p>
               </div>
           </Card>
       </div>

       <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
           {/* Sidebar Filters */}
           <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
               <Button 
                 variant={filter === 'ALL' ? 'secondary' : 'ghost'} 
                 className="justify-start" 
                 onClick={() => setFilter('ALL')}
               >
                 <Filter className="mr-2 h-4 w-4" /> All Tasks
               </Button>
               <Button 
                 variant={filter === 'TODAY' ? 'secondary' : 'ghost'} 
                 className="justify-start" 
                 onClick={() => setFilter('TODAY')}
               >
                 <Calendar className="mr-2 h-4 w-4" /> Due Today
               </Button>
               <Button 
                 variant={filter === 'UPCOMING' ? 'secondary' : 'ghost'} 
                 className="justify-start" 
                 onClick={() => setFilter('UPCOMING')}
               >
                 <Clock className="mr-2 h-4 w-4" /> Upcoming
               </Button>
               <div className="my-2 border-b" />
               <Button 
                 variant={filter === 'COMPLETED' ? 'secondary' : 'ghost'} 
                 className="justify-start" 
                 onClick={() => setFilter('COMPLETED')}
               >
                 <CheckCircle2 className="mr-2 h-4 w-4" /> Completed
               </Button>
           </div>

           {/* Task List */}
           <Card className="flex-1 overflow-hidden flex flex-col border bg-card/50 backdrop-blur-sm">
                <div className="p-4 border-b bg-muted/20 font-medium text-sm flex justify-between items-center">
                    <span>{filter === 'ALL' ? 'Active Tasks' : filter} ({activeTasks.length})</span>
                    <span className="text-xs text-muted-foreground">Sorted by Due Date</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {activeTasks.length > 0 ? (
                        activeTasks.map(task => (
                            <motion.div 
                                key={task.id}
                                layout
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "group flex items-center gap-3 p-3 rounded-lg border hover:shadow-md transition-all bg-card",
                                    task.dueDate && task.dueDate < today && !task.isCompleted ? "border-red-500/30 bg-red-500/5" : "border-border/50"
                                )}
                            >
                                <button 
                                    onClick={() => toggleComplete(task.id)}
                                    className={cn(
                                        "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                                        task.isCompleted ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground/30 hover:border-primary"
                                    )}
                                >
                                    {task.isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={cn("font-medium truncate", task.isCompleted && "line-through text-muted-foreground")}>{task.title}</span>
                                        {task.recurring !== 'NONE' && <Repeat className="h-3 w-3 text-purple-500" />}
                                        {task.reminder && <Bell className="h-3 w-3 text-orange-500" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className={cn("flex items-center gap-1", task.dueDate && task.dueDate < today && !task.isCompleted ? "text-red-500 font-semibold" : "")}>
                                            <Calendar className="h-3 w-3" /> {task.dueDate ? (task.dueDate === today ? 'Today' : new Date(task.dueDate).toLocaleDateString()) : 'No Date'}
                                        </span>
                                        {task.relatedTo && task.relatedTo.name && (
                                            <span className="flex items-center gap-1 bg-muted px-1.5 rounded">
                                                <Tag className="h-3 w-3" /> {task.relatedTo.name}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 capitalize">
                                            <CategoryIcon category={task.category || 'OTHER'} /> {(task.category || 'OTHER').toLowerCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <PriorityBadge priority={task.priority} />
                                    <button 
                                        onClick={() => deleteTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-muted-foreground hover:text-red-500 rounded transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>No tasks found in this view.</p>
                        </div>
                    )}
                </div>
           </Card>
       </div>

       {/* Create Task Modal */}
       <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Task"
          footer={
             <Button onClick={handleCreateTask} className="w-full">Create Task</Button>
          }
       >
          <div className="space-y-4 py-2">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <input 
                     className="w-full p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                     placeholder="e.g. Call client about contract"
                     value={newTask.title}
                     onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Due Date</label>
                      <input 
                          type="date"
                          className="w-full p-2.5 rounded-md border bg-background"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                  </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <select 
                          className="w-full p-2.5 rounded-md border bg-background"
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value as TaskPriority})}
                      >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                      </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select 
                          className="w-full p-2.5 rounded-md border bg-background"
                          value={newTask.category}
                          onChange={(e) => setNewTask({...newTask, category: e.target.value as TaskCategory})}
                      >
                          <option value="CALL">Call</option>
                          <option value="EMAIL">Email</option>
                          <option value="MEETING">Meeting</option>
                          <option value="PAPERWORK">Paperwork</option>
                          <option value="OTHER">Other</option>
                      </select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Recurring?</label>
                      <select 
                          className="w-full p-2.5 rounded-md border bg-background"
                          value={newTask.recurring}
                          onChange={(e) => setNewTask({...newTask, recurring: e.target.value as TaskRecurring})}
                      >
                          <option value="NONE">No, One-time</option>
                          <option value="DAILY">Daily</option>
                          <option value="WEEKLY">Weekly</option>
                          <option value="MONTHLY">Monthly</option>
                      </select>
                  </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="reminder" 
                    checked={newTask.reminder} 
                    onChange={(e) => setNewTask({...newTask, reminder: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="reminder" className="text-sm font-medium flex items-center gap-2">
                      <Bell className="h-3 w-3" /> Auto-Reminder (Email/Push)
                  </label>
              </div>

              <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                     className="w-full p-2.5 rounded-md border bg-background h-20 resize-none"
                     placeholder="Additional details..."
                     value={newTask.description}
                     onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
              </div>
          </div>
       </Modal>
    </div>
  );
};
