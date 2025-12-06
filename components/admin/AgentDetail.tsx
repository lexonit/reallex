import React, { useState } from 'react';
import { Agent, Property, ClosedDeal } from '../../types';
import { Button } from '../Button';
import { Avatar } from '../ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { ArrowLeft, Mail, Phone, MapPin, Award, Star, Globe, Linkedin, Instagram, LayoutGrid, List, Users, Calendar, Home, TrendingUp, CheckCircle } from 'lucide-react';
import { MOCK_PROPERTIES, MOCK_CLOSED_DEALS } from '../../constants';
import { PropertyCard } from '../properties/PropertyCard';
import { DataTable } from '../ui/DataTable';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface AgentDetailProps {
  agent: Agent;
  onBack: () => void;
}

export const AgentDetail: React.FC<AgentDetailProps> = ({ agent, onBack }) => {
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'HISTORY' | 'REVIEWS'>('INVENTORY');

  // Filter properties (In real app, filter by assignedAgentId)
  // For mock, we'll just take a slice or random for demo purposes if name matches
  // Since MOCK_PROPERTIES doesn't have agent name, we'll simulate it by assigning some based on ID mod
  const activeListings = MOCK_PROPERTIES.filter((_, i) => i % 2 === 0); 
  
  const closedDeals = MOCK_CLOSED_DEALS.filter(d => d.agent.name === agent.name);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-10">
      {/* Navigation */}
      <Button variant="ghost" onClick={onBack} className="gap-2 pl-0 hover:pl-2 transition-all w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Team
      </Button>

      {/* Hero Profile Header */}
      <div className="relative rounded-2xl overflow-hidden bg-card border shadow-sm">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-neutral-800 to-neutral-900 relative">
            <div className="absolute inset-0 bg-grid-white/[0.05]" />
            <div className="absolute bottom-4 right-4 flex gap-2">
                {agent.social?.website && (
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white border-none">
                        <Globe className="h-4 w-4" />
                    </Button>
                )}
                {agent.social?.linkedin && (
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white border-none">
                        <Linkedin className="h-4 w-4" />
                    </Button>
                )}
                {agent.social?.instagram && (
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white border-none">
                        <Instagram className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
        
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="-mt-16 relative">
                <Avatar name={agent.name} src={agent.image} className="h-32 w-32 border-4 border-card shadow-xl text-3xl" />
                <div className={cn(
                    "absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-card",
                    agent.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                )} />
            </div>

            {/* Info */}
            <div className="flex-1 pt-2 md:pt-4 space-y-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {agent.name}
                            <Award className="h-5 w-5 text-blue-500 fill-blue-500/20" />
                        </h1>
                        <p className="text-muted-foreground font-medium">{agent.role} • {agent.licenseNumber}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none">
                            <Phone className="mr-2 h-4 w-4" /> Call
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none">
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </Button>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {agent.specialties.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                            {tag}
                        </span>
                    ))}
                    {agent.languages.map(lang => (
                        <span key={lang} className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border">
                            {lang}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Stats & Bio */}
          <div className="space-y-6">
              {/* Operational KPIs */}
              <div className="grid grid-cols-2 gap-3">
                  <Card className="p-4 flex flex-col items-start justify-between bg-card hover:bg-muted/20 transition-colors border-l-4 border-l-blue-500 shadow-sm">
                      <div className="p-2 bg-blue-500/10 rounded-lg mb-3">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-foreground">{agent.stats.newLeads}</span>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">New Leads</p>
                      </div>
                  </Card>
                  
                  <Card className="p-4 flex flex-col items-start justify-between bg-card hover:bg-muted/20 transition-colors border-l-4 border-l-purple-500 shadow-sm">
                      <div className="p-2 bg-purple-500/10 rounded-lg mb-3">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-foreground">{agent.stats.appointments}</span>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Appts Today</p>
                      </div>
                  </Card>

                  <Card className="p-4 flex flex-col items-start justify-between bg-card hover:bg-muted/20 transition-colors border-l-4 border-l-orange-500 shadow-sm">
                      <div className="p-2 bg-orange-500/10 rounded-lg mb-3">
                        <Home className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-foreground">{activeListings.length}</span>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Properties Active</p>
                      </div>
                  </Card>

                   <Card className="p-4 flex flex-col items-start justify-between bg-card hover:bg-muted/20 transition-colors border-l-4 border-l-emerald-500 shadow-sm">
                      <div className="p-2 bg-emerald-500/10 rounded-lg mb-3">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-foreground">{agent.stats.dealsThisMonth}</span>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Deals (Month)</p>
                      </div>
                  </Card>
              </div>

               {/* Lifetime Stats Row */}
              <div className="flex gap-4 p-4 bg-muted/20 rounded-xl border border-dashed">
                 <div className="flex-1 text-center border-r border-border/50">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Volume</p>
                    <p className="text-lg font-bold text-green-600">${(agent.stats.revenue / 1000000).toFixed(1)}M</p>
                 </div>
                 <div className="flex-1 text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Rating</p>
                     <div className="flex items-center justify-center gap-1 text-yellow-500">
                        <span className="text-lg font-bold text-foreground">{agent.stats.rating}</span>
                        <Star className="h-4 w-4 fill-current" />
                     </div>
                 </div>
              </div>

              {/* Bio Card */}
              <Card>
                  <CardHeader>
                      <CardTitle className="text-base">About {agent.name.split(' ')[0]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                          {agent.bio}
                      </p>
                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                          <span>Joined {new Date(agent.joinedDate).getFullYear()}</span>
                          <span>Prestige Estates</span>
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Right Column: Tabs (Inventory/History) */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center border-b">
                  <button 
                    onClick={() => setActiveTab('INVENTORY')}
                    className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'INVENTORY' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Active Inventory ({activeListings.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('HISTORY')}
                    className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'HISTORY' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sold History ({closedDeals.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('REVIEWS')}
                    className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'REVIEWS' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Reviews (24)
                  </button>
              </div>

              <div className="min-h-[400px]">
                  {activeTab === 'INVENTORY' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {activeListings.map(property => (
                              <PropertyCard key={property.id} property={property} onViewDetails={() => {}} />
                          ))}
                          {activeListings.length === 0 && (
                              <div className="col-span-full py-12 text-center text-muted-foreground">
                                  No active listings assigned.
                              </div>
                          )}
                      </div>
                  )}

                  {activeTab === 'HISTORY' && (
                      <Card className="border-none shadow-none bg-transparent">
                          <DataTable 
                              data={closedDeals}
                              columns={[
                                  { header: 'Address', accessorKey: 'propertyAddress', className: 'font-medium' },
                                  { header: 'Price', accessorKey: 'salePrice', cell: (d) => `$${d.salePrice.toLocaleString()}` },
                                  { header: 'Sold Date', accessorKey: 'soldDate' },
                                  { header: 'DOM', accessorKey: 'daysOnMarket', cell: (d) => `${d.daysOnMarket} days` },
                              ]}
                              className="bg-card"
                          />
                           {closedDeals.length === 0 && (
                              <div className="py-12 text-center text-muted-foreground border rounded-xl mt-4 border-dashed">
                                  No sales history recorded.
                              </div>
                          )}
                      </Card>
                  )}

                  {activeTab === 'REVIEWS' && (
                       <div className="space-y-4">
                          {[1, 2, 3].map(i => (
                              <Card key={i} className="p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                      <div className="flex text-yellow-500">
                                          {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                                      </div>
                                      <span className="text-sm font-bold">Excellent Service</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                      "{agent.name.split(' ')[0]} was incredible to work with. Highly professional, responsive, and got us more than asking price!"
                                  </p>
                                  <div className="text-xs text-muted-foreground">
                                      - Verified Client • Sold in Beverly Hills
                                  </div>
                              </Card>
                          ))}
                       </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};