
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/ui/DataTable';
import { ClosedDeal, CurrentUser } from '../../types';
import { MOCK_CLOSED_DEALS } from '../../constants';
import { Avatar } from '../../components/ui/Avatar';
import { Search, Filter, Calendar, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface ClosedDealsProps {
    user: CurrentUser | null;
}

export const ClosedDeals: React.FC<ClosedDealsProps> = ({ user }) => {
  const [deals, setDeals] = useState<ClosedDeal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<ClosedDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState('All');

  const isAgent = user?.role === 'AGENT';

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      let initialData = MOCK_CLOSED_DEALS;
      if (isAgent) {
          initialData = MOCK_CLOSED_DEALS.filter(d => d.agent.name === user.name);
      }
      setDeals(initialData);
      setFilteredDeals(initialData);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [user, isAgent]);

  useEffect(() => {
    let result = deals;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.propertyAddress.toLowerCase().includes(query) ||
        d.agent.name.toLowerCase().includes(query) ||
        d.buyerName.toLowerCase().includes(query)
      );
    }

    if (agentFilter !== 'All') {
      result = result.filter(d => d.agent.name === agentFilter);
    }

    setFilteredDeals(result);
  }, [deals, searchQuery, agentFilter]);

  const columns = [
    { 
      header: 'Property', 
      accessorKey: 'propertyAddress' as keyof ClosedDeal,
      cell: (d: ClosedDeal) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-16 rounded-md overflow-hidden bg-muted">
             <img src={d.propertyImage} alt="Property" className="h-full w-full object-cover" />
          </div>
          <div>
             <div className="font-medium">{d.propertyAddress}</div>
             <div className="text-xs text-muted-foreground">Buyer: {d.buyerName}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Sold Date', 
      accessorKey: 'soldDate' as keyof ClosedDeal,
      cell: (d: ClosedDeal) => (
        <div className="flex items-center gap-2 text-sm">
           <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
           <span>{new Date(d.soldDate).toLocaleDateString()}</span>
        </div>
      )
    },
    // Only show "Closed By" column if Admin
    ...(!isAgent ? [{ 
      header: 'Closed By', 
      accessorKey: 'agent' as keyof ClosedDeal,
      cell: (d: ClosedDeal) => (
        <div className="flex items-center gap-2">
           <Avatar name={d.agent.name} className="h-6 w-6" />
           <span className="text-sm">{d.agent.name}</span>
        </div>
      )
    }] : []),
    { 
      header: 'Time Taken', 
      accessorKey: 'daysOnMarket' as keyof ClosedDeal,
      cell: (d: ClosedDeal) => (
         <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-medium">{d.daysOnMarket} Days</span>
         </div>
      )
    },
    { 
      header: 'Sale Price', 
      accessorKey: 'salePrice' as keyof ClosedDeal,
      className: 'text-right',
      cell: (d: ClosedDeal) => (
         <div className="text-right font-medium">
            ${d.salePrice.toLocaleString()}
         </div>
      )
    },
    { 
      header: 'Commission', 
      accessorKey: 'commission' as keyof ClosedDeal,
      className: 'text-right',
      cell: (d: ClosedDeal) => (
         <div className="text-right text-green-600 dark:text-green-400 font-medium text-xs bg-green-500/10 px-2 py-1 rounded-full inline-block">
            +${d.commission.toLocaleString()}
         </div>
      )
    }
  ];

  // Get unique agents for filter
  const agents = Array.from(new Set(deals.map(d => d.agent.name)));

  const totalRevenue = filteredDeals.reduce((acc, curr) => acc + curr.salePrice, 0);
  const totalCommission = filteredDeals.reduce((acc, curr) => acc + curr.commission, 0);
  const avgDays = filteredDeals.length > 0 ? Math.round(filteredDeals.reduce((acc, curr) => acc + curr.daysOnMarket, 0) / filteredDeals.length) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{isAgent ? 'My Closed Deals' : 'Closed Deals'}</h2>
        <p className="text-muted-foreground">
            {isAgent ? 'Track your sales history and commissions.' : 'Track sales history, commissions, and agent performance.'}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="p-4 flex items-center gap-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
               <DollarSign className="h-5 w-5" />
            </div>
            <div>
               <p className="text-sm text-muted-foreground font-medium">Total Sales Volume</p>
               <h3 className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(1)}M</h3>
            </div>
         </Card>
         <Card className="p-4 flex items-center gap-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
               <TrendingUp className="h-5 w-5" />
            </div>
            <div>
               <p className="text-sm text-muted-foreground font-medium">Total Commission</p>
               <h3 className="text-2xl font-bold">${totalCommission.toLocaleString()}</h3>
            </div>
         </Card>
         <Card className="p-4 flex items-center gap-4 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
            <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
               <Clock className="h-5 w-5" />
            </div>
            <div>
               <p className="text-sm text-muted-foreground font-medium">Avg. Time to Close</p>
               <h3 className="text-2xl font-bold">{avgDays} Days</h3>
            </div>
         </Card>
      </div>

      <Card className="overflow-hidden border bg-card">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 border-b items-center justify-between bg-muted/20">
            <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                    placeholder="Search property or buyer..." 
                    className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {!isAgent && (
                <div className="relative w-full sm:w-auto">
                     <div className="absolute left-3 top-2.5 pointer-events-none">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <select 
                        className="h-10 rounded-md border bg-background pl-9 pr-8 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-[180px] cursor-pointer appearance-none"
                        value={agentFilter}
                        onChange={(e) => setAgentFilter(e.target.value)}
                      >
                        <option value="All">All Agents</option>
                        {agents.map(agent => <option key={agent} value={agent}>{agent}</option>)}
                      </select>
                </div>
            )}
        </div>

        <DataTable 
            data={filteredDeals} 
            columns={columns} 
            isLoading={isLoading}
            className="border-0 shadow-none rounded-none"
        />
        
        {!isLoading && filteredDeals.length === 0 && (
           <div className="text-center py-12">
              <div className="bg-muted/30 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                 <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No closed deals found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
           </div>
        )}
      </Card>
    </div>
  );
};
