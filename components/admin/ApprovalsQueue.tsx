import React, { useState, useEffect } from 'react';
import { DataTable } from '../ui/DataTable';
import { Property } from '../../types';
import { Button } from '../Button';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import { Card } from '../Card';
import { Check, X, Filter, Search } from 'lucide-react';
import { MOCK_PROPERTIES } from '../../constants';
import { AnimatePresence } from 'framer-motion';

export const ApprovalsQueue: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter & Search States
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
        // In a real scenario, we might fetch 'Submitted' properties waiting for approval
        // For this demo, we load non-draft properties to show history + pending
        const data = MOCK_PROPERTIES.filter(p => p.status !== 'Draft'); 
        setProperties(data);
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle Filtering
  useEffect(() => {
    let result = properties;

    if (statusFilter !== 'All') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.address.toLowerCase().includes(query) || 
        p.price.toString().includes(query)
      );
    }

    setFilteredProperties(result);
  }, [properties, statusFilter, searchQuery]);

  const handleReview = (prop: Property) => {
    setSelectedProperty(prop);
    setIsModalOpen(true);
  };

  const handleAction = (action: 'approve' | 'reject') => {
    if (!selectedProperty) return;

    // In a real app, call API here. 
    // For demo, we update local state to reflect change (e.g. move from Pending to Active)
    const newStatus = action === 'approve' ? 'Active' : 'Rejected';

    setProperties(prev => prev.map(p => 
      p.id === selectedProperty.id ? { ...p, status: newStatus as any } : p
    ));
    
    setToast({
      message: `Property ${action === 'approve' ? 'Approved & Published' : 'Rejected'} successfully`,
      type: action === 'approve' ? 'success' : 'error'
    });

    setIsModalOpen(false);
    setTimeout(() => setToast(null), 3000);
  };

  const columns = [
    { header: 'Property Address', accessorKey: 'address' as keyof Property, className: 'font-medium' },
    { header: 'Price', accessorKey: 'price' as keyof Property, cell: (p: Property) => `$${p.price.toLocaleString()}` },
    { header: 'Agent', accessorKey: 'id' as keyof Property, cell: () => 'Sarah Connor' }, 
    { header: 'Current Status', accessorKey: 'status' as keyof Property, cell: (p: Property) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
        p.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
        p.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
        p.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
        'bg-gray-500/10 text-gray-500 border-gray-500/20'
      }`}>
        {p.status}
      </span>
    )},
    { header: 'Actions', className: 'text-right', cell: (p: Property) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => handleReview(p)} className="h-8">Review</Button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Page Header Separated from Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Approvals Queue</h2>
          <p className="text-muted-foreground">Review submitted properties before publishing.</p>
        </div>
      </div>

      <Card className="overflow-hidden border bg-card">
         {/* Toolbar: Search and Filters inside Card */}
         <div className="flex flex-col sm:flex-row gap-4 p-4 border-b items-center justify-between bg-muted/20">
            <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Search address..." 
                  className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="relative w-full sm:w-auto">
                 <div className="absolute left-3 top-2.5 pointer-events-none">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                 </div>
                 <select 
                    className="h-10 rounded-md border bg-background pl-9 pr-8 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-[180px] cursor-pointer appearance-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Active">Published</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Sold">Sold</option>
                  </select>
            </div>
         </div>

         {/* Table Content */}
         <DataTable 
            data={filteredProperties} 
            columns={columns} 
            isLoading={isLoading}
            pageSize={5}
            className="border-0 shadow-none rounded-none"
         />
         
         {!isLoading && filteredProperties.length === 0 && (
           <div className="text-center py-12">
              <div className="bg-muted/30 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                 <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
           </div>
         )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Review Property Listing"
        footer={
          <>
            <Button variant="destructive" onClick={() => handleAction('reject')}>
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('approve')}>
              <Check className="mr-2 h-4 w-4" /> Approve & Publish
            </Button>
          </>
        }
      >
        {selectedProperty && (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden border">
              <img src={selectedProperty.image} className="w-full h-full object-cover" alt="Property" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Address</span>
                <p className="font-medium text-lg">{selectedProperty.address}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Listing Price</span>
                <p className="font-medium text-lg">${selectedProperty.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm space-y-2">
              <p className="font-medium text-yellow-700 dark:text-yellow-400">Agent Note:</p>
              <p className="text-muted-foreground">
                Client is motivated to sell. Pricing is aggressive based on comps in the Beverly Hills area. Please verify lot size data.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};