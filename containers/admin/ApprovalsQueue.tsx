import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { Property } from '../../types';
import { Button } from '../../components/Button';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';
import { Card } from '../../components/Card';
import { Check, X, Filter, Search, Clock } from 'lucide-react';
import { MOCK_PROPERTIES } from '../../constants';
import { AnimatePresence } from 'framer-motion';
import { GET_PENDING_APPROVALS_QUERY } from '../../graphql/queries/property.queries';
import { APPROVE_PROPERTY_FOR_LISTING_MUTATION, REJECT_PROPERTY_SUBMISSION_MUTATION } from '../../graphql/mutations/notification.mutations';
import { graphqlRequest } from '../../lib/graphql';

export const ApprovalsQueue: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filter & Search States
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    setIsLoading(true);
    try {
      console.log('📡 Fetching pending approvals via GraphQL...');
      const data = await graphqlRequest(GET_PENDING_APPROVALS_QUERY, {});
      
      console.log('✅ Received pending approvals:', data);
      
      if (data && data.getPendingApprovals) {
        // Map GraphQL response to frontend Property type
        const mappedProperties: Property[] = data.getPendingApprovals.map((p: any) => ({
          id: p._id,
          address: p.address,
          price: p.price,
          status: p.approvalStatus === 'PENDING' ? 'Pending' : p.status,
          beds: p.specs?.beds || 0,
          baths: p.specs?.baths || 0,
          sqft: p.specs?.sqft || 0,
          type: 'House',
          image: p.images?.[0] || '/placeholder-property.jpg',
          agent: p.assignedAgent ? `${p.assignedAgent.firstName} ${p.assignedAgent.lastName}` : 'Unknown',
          agentId: p.assignedAgent?._id || p.assignedAgentId,
          agentEmail: p.assignedAgent?.email,
          rawData: p // Keep original data for actions
        }));
        setProperties(mappedProperties);
        console.log(`📊 Loaded ${mappedProperties.length} pending properties`);
      }
    } catch (error) {
      console.error('❌ Failed to fetch pending approvals:', error);
      setToast({ message: 'Failed to load pending approvals', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleAction = async (action: 'approve' | 'reject', rejectionReason?: string) => {
    if (!selectedProperty) return;

    try {
      let result;
      
      if (action === 'approve') {
        console.log('✅ Approving property via GraphQL:', selectedProperty.id);
        result = await graphqlRequest(APPROVE_PROPERTY_FOR_LISTING_MUTATION, {
          propertyId: selectedProperty.id
        });
        console.log('✅ Property approved:', result);
      } else {
        console.log('❌ Rejecting property via GraphQL:', selectedProperty.id);
        result = await graphqlRequest(REJECT_PROPERTY_SUBMISSION_MUTATION, {
          propertyId: selectedProperty.id,
          reason: rejectionReason || 'No reason provided'
        });
        console.log('✅ Property rejected:', result);
      }

      // Remove from list after approval/rejection
      setProperties(prev => prev.filter(p => p.id !== selectedProperty.id));
      
      setToast({
        message: `Property ${action === 'approve' ? 'approved & published' : 'rejected'} successfully`,
        type: 'success'
      });
    } catch (error) {
      console.error(`❌ Failed to ${action} property:`, error);
      setToast({
        message: `Failed to ${action} property: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    }

    setIsModalOpen(false);
    setTimeout(() => setToast(null), 3000);
  };

  const columns = [
    { header: 'Property Address', accessorKey: 'address' as keyof Property, className: 'font-medium' },
    { header: 'Price', accessorKey: 'price' as keyof Property, cell: (p: Property) => `$${p.price.toLocaleString()}` },
    { header: 'Submitted By', accessorKey: 'agent' as keyof Property, cell: (p: Property) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{p.agent || 'Unknown'}</span>
        {(p as any).agentEmail && (
          <span className="text-xs text-muted-foreground">{(p as any).agentEmail}</span>
        )}
      </div>
    )}, 
    { header: 'Approval Status', accessorKey: 'status' as keyof Property, cell: (p: Property) => (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400">
        <Clock className="h-3 w-3 mr-1.5" />
        Awaiting Approval
      </span>
    )},
    { header: 'Actions', className: 'text-right', cell: (p: Property) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => handleReview(p)} className="h-8">
          <Check className="h-3 w-3 mr-1" />
          Review
        </Button>
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
            <Button variant="destructive" onClick={() => {
              setIsModalOpen(false);
              setIsRejectModalOpen(true);
            }}>
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

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Submitted By</span>
                <p className="font-medium text-lg">{selectedProperty.agent || 'Unknown agent'}</p>
                { (selectedProperty as any).agentEmail && (
                  <p className="text-sm text-muted-foreground">{(selectedProperty as any).agentEmail}</p>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Property ID</span>
                <p className="font-mono text-sm text-muted-foreground">{selectedProperty.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Approval Status</span>
                <p className="font-medium text-sm">{selectedProperty.status || 'Pending'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Vendor</span>
                <p className="font-mono text-sm text-muted-foreground">{(selectedProperty as any).vendorId || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Specs</span>
                <p className="text-sm text-muted-foreground">
                  {selectedProperty.beds} bd · {selectedProperty.baths} ba · {selectedProperty.sqft} sqft
                </p>
                {selectedProperty.rawData?.yearBuilt && (
                  <p className="text-sm text-muted-foreground">Year Built: {selectedProperty.rawData.yearBuilt}</p>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Financials</span>
                <p className="text-sm text-muted-foreground">Taxes: ${selectedProperty.rawData?.taxes ?? 0}</p>
                <p className="text-sm text-muted-foreground">HOA: ${selectedProperty.rawData?.hoaFees ?? 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Amenities</span>
                <p className="text-sm text-muted-foreground">{selectedProperty.rawData?.amenities?.length || 0} listed</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Documents</span>
                <p className="text-sm text-muted-foreground">{selectedProperty.rawData?.documents?.length || 0} uploaded</p>
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

      {/* Rejection Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectionReason('');
        }}
        title="Reject Property"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsRejectModalOpen(false);
              setRejectionReason('');
            }}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                handleAction('reject', rejectionReason);
                setIsRejectModalOpen(false);
                setRejectionReason('');
              }}
              disabled={!rejectionReason.trim()}
            >
              <X className="mr-2 h-4 w-4" /> Reject Property
            </Button>
          </>
        }
      >
        {selectedProperty && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Property: <span className="font-semibold text-foreground">{selectedProperty.address}</span>
            </p>
            <div className="space-y-2">
              <label htmlFor="rejection-reason" className="text-sm font-medium">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejection..."
                className="w-full min-h-[100px] px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground">
                The agent will be notified with this reason via notification.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};