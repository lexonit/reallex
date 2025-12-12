
import React, { useState, useEffect } from 'react';
import { Property, CurrentUser, PropertyType } from '../../types';
import { Button } from '../../components/Button';
import { LayoutGrid, List as ListIcon, Plus, Search, Filter, Map } from 'lucide-react';
import { PropertyCard, PropertyCardSkeleton } from './PropertyCard';
import { DataTable } from '../../components/ui/DataTable';
import { PropertyForm } from './PropertyForm';
import { PropertyDetail } from './PropertyDetail';
import { Toast } from '../../components/ui/Toast';
import { Card } from '../../components/Card';
import { AnimatePresence, motion } from 'framer-motion';
import { useProperties, useCreateProperty, useUpdateProperty } from '../../hooks/useProperties';
import { APPROVE_PROPERTY_FOR_LISTING_MUTATION, REJECT_PROPERTY_SUBMISSION_MUTATION } from '../../graphql/mutations/notification.mutations';
import { graphqlRequest } from '../../lib/graphql';

type ViewMode = 'GRID' | 'LIST' | 'MAP' | 'CREATE' | 'EDIT' | 'DETAIL';

interface PropertiesProps {
    user: CurrentUser | null;
}

export const Properties: React.FC<PropertiesProps> = ({ user }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isAgent = user?.role === 'AGENT';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isApprover = ['SUPER_ADMIN', 'VENDOR_ADMIN', 'MANAGER', 'ADMIN'].includes(user?.role || '');
  
  // Use hooks for data fetching and mutations
  const { data: propertiesData, loading: isLoading, refetch } = useProperties(undefined, user?.id);
  const { mutate: createProperty } = useCreateProperty();
  const { mutate: updateProperty } = useUpdateProperty();

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Map backend enum to UI status
  const toUiStatus = (backendStatus: string): string => {
    const map: Record<string, string> = {
      'DRAFT': 'Draft',
      'PENDING': 'Pending',
      'PUBLISHED': 'Active',
      'APPROVED': 'Approved',
      'REJECTED': 'Rejected',
      'SOLD': 'Sold',
      'ARCHIVED': 'Archived'
    };
    return map[backendStatus] || 'Draft';
  };

  // Map UI status to backend enum
  const toApiStatus = (uiStatus: string): string => {
    const map: Record<string, string> = {
      'Draft': 'DRAFT',
      'Pending': 'PENDING',
      'Active': 'PUBLISHED',
      'Sold': 'SOLD',
      'Archived': 'ARCHIVED'
    };
    return map[uiStatus] || 'DRAFT';
  };

  // Transform properties data from API
  const properties = React.useMemo(() => {
    if (!propertiesData?.properties) return [];
    
    let fetchedProps = propertiesData.properties.map((p: any) => ({
      id: p._id,
      address: p.address,
      price: p.price,
      beds: p.specs?.beds || 0,
      baths: p.specs?.baths || 0,
      sqft: p.specs?.sqft || 0,
      lotSize: p.specs?.lotSize || 0,
      status: toUiStatus(p.approvalStatus || p.status),
      approvalStatus: p.approvalStatus,
      vendorId: p.vendorId,
      description: p.description || '',
      images: p.images || [],
      image: p.images?.[0] || '',
      agent: p.assignedAgent ? `${p.assignedAgent.firstName} ${p.assignedAgent.lastName}` : user?.name || '',
      agentEmail: p.assignedAgent?.email,
      agentId: p.assignedAgent?._id || p.assignedAgentId,
      type: 'Single Family' as PropertyType,
      yearBuilt: p.yearBuilt || new Date().getFullYear(),
      garage: p.garage || 0,
      amenities: p.amenities || [],
      documents: p.documents || [],
      openHouses: [],
      location: { lat: 0, lng: 0 }
    }));
    
    if (isAgent && user?.id) {
      // Filter by assignedAgentId if user is an agent
      const rawProps = propertiesData.properties;
      fetchedProps = fetchedProps.filter((_: any, idx: number) => rawProps[idx].assignedAgentId === user.id);
    }
    
    return fetchedProps;
  }, [propertiesData, user, isAgent]);

  useEffect(() => {
    let result = properties;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.address && p.address.toLowerCase().includes(query)) ||
        (p.price && p.price.toString().includes(query))
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(p => p.status === statusFilter);
    }

    setFilteredProperties(result);
  }, [properties, searchQuery, statusFilter]);

  const handleCreateSubmit = async (data: Partial<Property>) => {
    try {
        await createProperty({
            input: {
                address: data.address,
                price: data.price,
                specs: {
                    beds: data.beds || 0,
                    baths: data.baths || 0,
            sqft: data.sqft || 0,
            lotSize: data.lotSize || 0
                },
                status: toApiStatus(data.status || 'Draft'),
                description: data.description || '',
          images: data.images || [],
          yearBuilt: data.yearBuilt,
          garage: data.garage,
          taxes: data.taxes,
          hoaFees: data.hoaFees,
          amenities: data.amenities || [],
          documents: (data.documents || []).map((d: any) => d.url || d)
            }
        });
        
        // Refetch properties to get updated list
        await refetch();
        
        setToast({ message: 'Property created successfully', type: 'success' });
        setViewMode('GRID');
    } catch (err) {
        setToast({ message: 'Failed to create property', type: 'error' });
    }
  };

  const handleUpdateSubmit = async (data: Partial<Property>) => {
    if (!selectedPropertyId) return;

    try {
      await updateProperty({
        id: selectedPropertyId,
        input: {
          address: data.address,
          price: data.price,
          specs: {
            beds: data.beds,
            baths: data.baths,
            sqft: data.sqft,
            lotSize: data.lotSize
          },
          status: data.status ? toApiStatus(data.status) : undefined,
          description: data.description,
          images: data.images,
          yearBuilt: data.yearBuilt,
          garage: data.garage,
          taxes: data.taxes,
          hoaFees: data.hoaFees,
          amenities: data.amenities,
          documents: (data.documents || []).map((d: any) => d.url || d)
        }
      });

      // Refetch properties to get updated list
      await refetch();
      
      setToast({ message: 'Property updated successfully', type: 'success' });
      setTimeout(() => setToast(null), 3000);
      setViewMode('DETAIL');
    } catch (err) {
      setToast({ message: 'Failed to update property', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleViewDetails = (id: string) => {
    setSelectedPropertyId(id);
    setViewMode('DETAIL');
  };

  const handleEdit = () => {
    setViewMode('EDIT');
  };

  const handleApprove = async (propertyId: string) => {
    try {
      await graphqlRequest(APPROVE_PROPERTY_FOR_LISTING_MUTATION, { propertyId });
      await refetch();
      setToast({ message: 'Property approved & published', type: 'success' });
      setTimeout(() => setToast(null), 2500);
    } catch (err: any) {
      setToast({ message: err?.message || 'Failed to approve property', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleReject = async (propertyId: string) => {
    setDeleteModal({ open: true, id: propertyId });
  };

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [deleteReason, setDeleteReason] = useState('');

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const { DELETE_PROPERTY_MUTATION } = await import('../../graphql/mutations/property.mutations');
      await graphqlRequest(DELETE_PROPERTY_MUTATION as any, { id: deleteModal.id, reason: deleteReason });
      await refetch();
      setToast({ message: 'Property deleted (archived)', type: 'success' });
    } catch (err: any) {
      setToast({ message: err?.message || 'Failed to delete property', type: 'error' });
    } finally {
      setTimeout(() => setToast(null), 2500);
      setDeleteModal({ open: false, id: null });
      setDeleteReason('');
    }
  };

  const columns = [
    { header: 'Address', accessorKey: 'address' as keyof Property, className: 'font-medium' },
    { header: 'Price', accessorKey: 'price' as keyof Property, cell: (p: Property) => `$${p.price.toLocaleString()}` },
    { header: 'Status', accessorKey: 'status' as keyof Property, cell: (p: Property) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        (p.approvalStatus || p.status) === 'PENDING' || p.status === 'Pending'
          ? 'bg-yellow-500/10 text-yellow-500'
          : p.status === 'Active'
            ? 'bg-green-500/10 text-green-500'
            : 'bg-muted text-muted-foreground'
      }`}>
        {p.approvalStatus ? p.approvalStatus : p.status}
      </span>
    )},
    ...(isSuperAdmin ? [{
      header: 'Vendor',
      accessorKey: 'vendorId' as keyof Property,
      cell: (p: Property) => (
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
          {p.vendorId || 'N/A'}
        </span>
      )
    }] : []),
    { header: 'Beds', accessorKey: 'beds' as keyof Property },
    { header: 'Baths', accessorKey: 'baths' as keyof Property },
    { header: 'Sqft', accessorKey: 'sqft' as keyof Property },
    { header: 'Actions', className: 'text-right', cell: (p: Property) => {
      const isPending = (p.approvalStatus || p.status) === 'PENDING' || p.status === 'Pending';
      const isApproved = (p.approvalStatus || p.status) === 'APPROVED' || p.status === 'Active';
      if (isApprover && isPending) {
        return (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => handleApprove(p.id)}>Approve</Button>
            <Button size="sm" variant="destructive" onClick={() => handleReject(p.id)}>Reject</Button>
          </div>
        );
      }
      if (isApprover && isApproved) {
        return (
          <div className="flex justify-end">
            <Button size="sm" variant="outline" disabled className="opacity-60 cursor-not-allowed">
              Approved & Published
            </Button>
          </div>
        );
      }
      return (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(p.id)}>View</Button>
        </div>
      );
    }}
  ];

  if (viewMode === 'CREATE') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
        <PropertyForm onSubmit={handleCreateSubmit} onCancel={() => setViewMode('GRID')} />
      </div>
    );
  }

  if (viewMode === 'EDIT' && selectedPropertyId) {
    const propertyToEdit = properties.find(p => p.id === selectedPropertyId);
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-2xl font-bold mb-6">Edit Property</h2>
        <PropertyForm 
            initialData={propertyToEdit} 
            onSubmit={handleUpdateSubmit} 
            onCancel={() => setViewMode('DETAIL')} 
        />
      </div>
    );
  }

  if (viewMode === 'DETAIL' && selectedPropertyId) {
    const property = properties.find(p => p.id === selectedPropertyId);
    if (property) {
      const isPending = (property.approvalStatus || property.status) === 'PENDING' || property.status === 'Pending';
      const isApproved = (property.approvalStatus || property.status) === 'APPROVED' || property.status === 'Active';
      return (
        <>
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
            {isApprover && isPending && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(property.id)}>
                  Approve & Publish
                </Button>
                <Button variant="destructive" onClick={() => handleReject(property.id)}>
                  Reject
                </Button>
              </div>
            )}
            {isApprover && isApproved && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Button className="bg-green-100 text-green-700 border border-green-300" disabled>
                  Approved & Published
                </Button>
              </div>
            )}
            <PropertyDetail 
                property={property} 
                onBack={() => setViewMode('GRID')} 
                onEdit={handleEdit}
                onApprove={isApprover ? handleApprove : undefined}
                onReject={isApprover ? handleReject : undefined}
            />

            {/* Delete Reason Modal */}
            {deleteModal.open && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-card border rounded-lg p-4 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-2">Delete Property</h3>
                  <p className="text-sm text-muted-foreground mb-4">Provide a reason for deletion. The property will be archived under Deleted Profiles.</p>
                  <textarea
                    className="w-full border rounded-md p-2 text-sm bg-background"
                    rows={3}
                    placeholder="Reason for deletion"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={() => { setDeleteModal({ open: false, id: null }); setDeleteReason(''); }}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                  </div>
                </div>
              </div>
            )}
        </>
      );
    }
  }

  const FilterToolbar = ({ embedded = false }) => (
    <div className={`flex flex-col sm:flex-row gap-4 justify-between items-center ${embedded ? 'p-4 border-b bg-muted/20' : 'mb-6'}`}>
       <div className="relative w-full sm:max-w-md">
           <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
           <input 
             placeholder="Search properties..." 
             className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm"
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
               <option value="Active">Active</option>
               <option value="Pending">Pending</option>
               <option value="Sold">Sold</option>
               <option value="Draft">Draft</option>
             </select>
       </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
       <AnimatePresence>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
       </AnimatePresence>

       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isAgent ? 'My Inventory' : 'Active Properties'}</h2>
          <p className="text-muted-foreground">{isAgent ? 'Manage your personal listings.' : 'Manage your listings and inventory.'}</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center bg-card border rounded-lg p-1 mr-2 shadow-sm">
              <button 
                onClick={() => setViewMode('GRID')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'GRID' ? 'bg-muted text-primary shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('LIST')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'LIST' ? 'bg-muted text-primary shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('MAP')} 
                className={`p-1.5 rounded-md transition-all ${viewMode === 'MAP' ? 'bg-muted text-primary shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                <Map className="h-4 w-4" />
              </button>
           </div>
           <Button onClick={() => setViewMode('CREATE')} disabled={isLoading}>
             <Plus className="mr-2 h-4 w-4" /> Add Property
           </Button>
        </div>
      </div>

      {viewMode === 'GRID' ? (
        <>
          <FilterToolbar />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading 
              ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onViewDetails={handleViewDetails}
                      showVendorChip={isSuperAdmin}
                    />
                  ))
                ) : (
                   <div className="col-span-full py-12 text-center text-muted-foreground border-dashed border-2 rounded-xl">
                      No properties found matching your search.
                   </div>
                )
            }
          </div>
        </>
      ) : viewMode === 'LIST' ? (
        <Card className="overflow-hidden border bg-card">
           <FilterToolbar embedded />
           <DataTable 
            data={filteredProperties} 
            columns={columns} 
            onRowClick={(p) => handleViewDetails(p.id)} 
            isLoading={isLoading}
            pageSize={5}
            className="border-0 shadow-none rounded-none"
          />
           {!isLoading && filteredProperties.length === 0 && (
             <div className="text-center py-12">
                <h3 className="text-lg font-medium">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
             </div>
           )}
        </Card>
      ) : (
        <Card className="overflow-hidden border bg-card h-[600px] relative flex flex-col">
            <FilterToolbar embedded />
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea932a23518?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-50 grayscale-[20%] contrast-110 dark:opacity-40" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-xl font-bold">Map View</p>
                    <p className="text-sm">Functionality coming soon with Google Maps integration.</p>
                </div>
            </div>
        </Card>
      )}
    </div>
  );
};
