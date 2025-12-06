
import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Deal, DealStage, CurrentUser } from '../types';
import { 
  Plus, Search, Filter, MoreHorizontal,
  TrendingUp, Building, Calendar, DollarSign
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { Toast } from './ui/Toast';
import { Avatar } from './ui/Avatar';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ClosedDeals } from './admin/ClosedDeals'; 
import { graphqlRequest } from '../lib/graphql';

interface DealsPageProps {
  user: CurrentUser | null;
}

export const DealsPage: React.FC<DealsPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'HISTORY'>('PIPELINE');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({
    name: '',
    value: 0,
    stage: DealStage.QUALIFICATION,
    closeDate: new Date().toISOString().split('T')[0],
    probability: 20
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const fetchDeals = async () => {
    setIsLoading(true);
    const query = `
        query GetDeals {
            deals {
                id
                name
                value
                stage
                closeDate
                probability
                leadName
                propertyAddress
                agentName
            }
        }
    `;
    try {
        const data = await graphqlRequest(query);
        setDeals(data.deals);
        setFilteredDeals(data.deals);
    } catch (err) {
        console.error(err);
        setToast({ message: 'Failed to load deals', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    let result = deals;
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(d => 
            (d.name && d.name.toLowerCase().includes(q)) || 
            (d.propertyAddress && d.propertyAddress.toLowerCase().includes(q)) ||
            (d.leadName && d.leadName.toLowerCase().includes(q))
        );
    }
    setFilteredDeals(result);
  }, [deals, searchQuery]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedDealId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (draggedDealId) {
      // Optimistic update
      const updatedDeals = deals.map(d => d.id === draggedDealId ? { ...d, stage } : d);
      setDeals(updatedDeals);
      setDraggedDealId(null);

      const mutation = `
        mutation UpdateDealStage($id: ID!, $stage: String!) {
            updateDealStage(id: $id, stage: $stage) {
                id
                stage
            }
        }
      `;
      try {
          await graphqlRequest(mutation, { id: draggedDealId, stage });
      } catch (err) {
          console.error("Failed to update stage");
      }
    }
  };

  const handleCreateDeal = async () => {
      if (!newDeal.name || !newDeal.value) {
          setToast({ message: 'Name and Value are required', type: 'error' });
          return;
      }

      const mutation = `
        mutation CreateDeal($input: DealInput) {
            createDeal(input: $input) {
                id
                name
                value
                stage
                closeDate
                probability
                agentName
            }
        }
      `;

      try {
          const result = await graphqlRequest(mutation, {
              input: {
                  name: newDeal.name,
                  value: Number(newDeal.value),
                  stage: newDeal.stage,
                  closeDate: newDeal.closeDate,
                  probability: Number(newDeal.probability)
              }
          });
          
          setDeals([...deals, { ...result.createDeal, agentName: user?.name }]);
          setIsCreateModalOpen(false);
          setToast({ message: 'Deal created successfully', type: 'success' });
          
          // Reset
          setNewDeal({
            name: '',
            value: 0,
            stage: DealStage.QUALIFICATION,
            closeDate: new Date().toISOString().split('T')[0],
            probability: 20
          });
      } catch (err) {
          setToast({ message: 'Error creating deal', type: 'error' });
      }
  };

  // Pipeline Stats
  const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);
  const totalDeals = filteredDeals.length;

  const renderKanbanColumn = (stage: DealStage) => {
      const stageDeals = filteredDeals.filter(d => d.stage === stage);
      const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

      return (
          <div 
            className={cn(
                "min-w-[280px] w-[280px] flex flex-col h-full rounded-xl border border-transparent transition-colors",
                draggedDealId ? "bg-muted/30 border-dashed border-primary/20" : "bg-muted/10"
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
              <div className="p-3 pb-2">
                  <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-sm">{stage}</h3>
                      <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border">{stageDeals.length}</span>
                  </div>
                  <div className="h-1 w-full bg-border rounded-full overflow-hidden mb-2">
                      <div className={cn("h-full bg-primary", stage === DealStage.QUALIFICATION ? "w-1/5" : stage === DealStage.PROPOSAL ? "w-2/5" : stage === DealStage.NEGOTIATION ? "w-3/5" : "w-4/5")} />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">${stageValue.toLocaleString()}</p>
              </div>

              <div className="flex-1 p-2 space-y-3 overflow-y-auto">
                  {stageDeals.map(deal => (
                      <motion.div
                          layoutId={deal.id}
                          key={deal.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e as any, deal.id)}
                          className={cn(
                              "bg-card p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative",
                              draggedDealId === deal.id && "opacity-50 rotate-2 ring-2 ring-primary"
                          )}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-sm truncate pr-2" title={deal.name}>{deal.name}</h4>
                              <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-4 w-4" />
                              </button>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                              <span className="text-green-600 font-bold text-sm">${(deal.value / 1000).toFixed(0)}k</span>
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{deal.probability}% Prob.</span>
                          </div>

                          <div className="space-y-1.5">
                              {deal.propertyAddress && (
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                                      <Building className="h-3 w-3" /> {deal.propertyAddress}
                                  </div>
                              )}
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" /> Close: {new Date(deal.closeDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                              </div>
                              {deal.agentName && (
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-dashed mt-2">
                                      <Avatar name={deal.agentName} className="h-4 w-4 text-[8px]" /> {deal.agentName}
                                  </div>
                              )}
                          </div>
                      </motion.div>
                  ))}
                  <div className="h-10 w-full" />
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 h-full flex flex-col">
        <AnimatePresence>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Deals Pipeline</h2>
                <p className="text-muted-foreground">Manage your active opportunities and forecast revenue.</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex bg-muted p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('PIPELINE')}
                        className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'PIPELINE' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
                    >
                        Active Pipeline
                    </button>
                    <button 
                        onClick={() => setActiveTab('HISTORY')}
                        className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'HISTORY' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
                    >
                        Closed History
                    </button>
                </div>
                {activeTab === 'PIPELINE' && (
                    <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> Add Deal
                    </Button>
                )}
            </div>
        </div>

        {activeTab === 'PIPELINE' ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                    <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Pipeline Value</p>
                                <h3 className="text-2xl font-bold text-primary mt-1">${(totalValue / 1000000).toFixed(2)}M</h3>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-full text-primary"><DollarSign className="h-5 w-5" /></div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                                <h3 className="text-2xl font-bold mt-1">{totalDeals}</h3>
                            </div>
                            {/* Icon placeholder */}
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg. Probability</p>
                                <h3 className="text-2xl font-bold mt-1">45%</h3>
                            </div>
                            <div className="p-2 bg-green-500/10 rounded-full text-green-500"><TrendingUp className="h-5 w-5" /></div>
                        </div>
                    </Card>
                </div>

                <div className="flex-1 flex flex-col min-h-0 bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b bg-muted/20 flex gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input 
                                placeholder="Search active deals..." 
                                className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                            <select className="pl-9 pr-4 py-2 rounded-md border bg-background text-sm outline-none cursor-pointer">
                                <option>All Agents</option>
                                <option>Me</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
                        <div className="flex h-full gap-4 min-w-max">
                            {[DealStage.QUALIFICATION, DealStage.PROPOSAL, DealStage.NEGOTIATION, DealStage.UNDER_CONTRACT, DealStage.CLOSED_WON].map(stage => renderKanbanColumn(stage))}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <ClosedDeals user={user} />
        )}

        <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title="Create New Deal"
            footer={
                <Button onClick={handleCreateDeal} className="w-full">Create Opportunity</Button>
            }
        >
            <div className="space-y-4 py-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Deal Name</label>
                    <input 
                        className="w-full p-2.5 rounded-md border bg-background"
                        placeholder="e.g. Smith Residence Purchase"
                        value={newDeal.name}
                        onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Est. Value ($)</label>
                        <input 
                            type="number"
                            className="w-full p-2.5 rounded-md border bg-background"
                            placeholder="0"
                            value={newDeal.value}
                            onChange={(e) => setNewDeal({...newDeal, value: Number(e.target.value)})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Est. Close Date</label>
                        <input 
                            type="date"
                            className="w-full p-2.5 rounded-md border bg-background"
                            value={newDeal.closeDate}
                            onChange={(e) => setNewDeal({...newDeal, closeDate: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Stage</label>
                        <select 
                            className="w-full p-2.5 rounded-md border bg-background"
                            value={newDeal.stage}
                            onChange={(e) => setNewDeal({...newDeal, stage: e.target.value as DealStage})}
                        >
                            {Object.values(DealStage).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Probability (%)</label>
                        <input 
                            type="number"
                            className="w-full p-2.5 rounded-md border bg-background"
                            value={newDeal.probability}
                            onChange={(e) => setNewDeal({...newDeal, probability: Number(e.target.value)})}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    </div>
  );
};
