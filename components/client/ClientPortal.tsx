
import React, { useState } from 'react';
import { Card, CardContent } from '../Card';
import { Button } from '../Button';
import { MOCK_PROPERTIES } from '../../constants';
import { CurrentUser } from '../../types';
import { MapPin, BedDouble, Bath, Square, Heart, MessageSquare, FileText, CheckCircle, UploadCloud, PenTool, User, Send, Star, Search, Filter, Building, ArrowRight, Calendar, DollarSign, Clock } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from '../ui/Toast';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';

interface ClientPortalProps {
  user: CurrentUser;
}

type TabType = 'ALL_PROJECTS' | 'SHORTLIST' | 'DOCUMENTS';

export const ClientPortal: React.FC<ClientPortalProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('ALL_PROJECTS');
  // Initialize with one property to show the feature
  const [favorites, setFavorites] = useState<string[]>(['1']); 
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Action State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  
  // Schedule Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', notes: '' });

  // Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerData, setOfferData] = useState({ price: '', notes: '' });

  // Mock Agent Data
  const agent = { name: 'Sarah Connor', avatar: undefined, email: 'sarah@prestige.com' };

  // Filter properties for the views
  const allProjects = MOCK_PROPERTIES.filter(p => 
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const shortlist = MOCK_PROPERTIES.filter(p => favorites.includes(p.id)).map(p => ({
    ...p,
    agentNote: p.id === '1' ? "This matches your criteria for a pool and view. Highly recommend a viewing!" : 
               p.id === '2' ? "Great price per sqft, but might need some kitchen updates." :
               "I think this one has great potential based on your feedback."
  }));

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const isAdding = !favorites.includes(id);
    
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
    
    if (isAdding) {
        setToast({ message: 'Added to your shortlist', type: 'success' });
        setTimeout(() => setToast(null), 2000);
    } else {
        setToast({ message: 'Removed from shortlist', type: 'success' }); 
        setTimeout(() => setToast(null), 2000);
    }
  };

  const handlePostComment = (id: string) => {
    if (!commentInput[id]) return;
    setComments(prev => ({ ...prev, [id]: commentInput[id] }));
    setCommentInput(prev => ({ ...prev, [id]: '' }));
    setToast({ message: 'Comment sent to agent', type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  const handleUpload = (docId: string) => {
    setUploadingDoc(docId);
    // Simulate upload
    setTimeout(() => {
        setUploadingDoc(null);
        setUploadedDocs(prev => [...prev, docId]);
        setToast({ message: 'Document uploaded successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    }, 2000);
  };

  // --- Schedule Handlers ---
  const openScheduleModal = (id: string) => {
    setSelectedPropertyId(id);
    setScheduleData({ date: '', time: '', notes: '' });
    setIsScheduleModalOpen(true);
  };

  const submitSchedule = () => {
    if (!scheduleData.date || !scheduleData.time) {
        setToast({ message: 'Please select a date and time', type: 'error' });
        return;
    }
    setIsScheduleModalOpen(false);
    setToast({ message: 'Viewing request sent to Sarah!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Offer Handlers ---
  const openOfferModal = (id: string) => {
    setSelectedPropertyId(id);
    setOfferData({ price: '', notes: '' });
    setIsOfferModalOpen(true);
  };

  const submitOffer = () => {
    if (!offerData.price) {
        setToast({ message: 'Please enter an offer amount', type: 'error' });
        return;
    }
    setIsOfferModalOpen(false);
    setToast({ message: `Offer of $${Number(offerData.price).toLocaleString()} submitted successfully!`, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const PropertyCardInner = ({ property, isShortlist }: { property: any, isShortlist: boolean }) => (
    <Card className={cn("overflow-hidden flex flex-col group border-border/50 transition-all duration-300", isShortlist ? "hover:shadow-lg" : "hover:border-primary/30")}>
        <div className="relative h-64 overflow-hidden">
            <img 
            src={property.image} 
            alt={property.address} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute top-3 right-3 flex gap-2">
            <button 
                onClick={(e) => handleLike(property.id, e)}
                className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-sm",
                    favorites.includes(property.id) ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-white"
                )}
                title={favorites.includes(property.id) ? "Remove from Shortlist" : "Add to Shortlist"}
            >
                <Heart className={cn("h-5 w-5", favorites.includes(property.id) && "fill-current")} />
            </button>
            </div>
            <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                {property.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-black text-xs font-semibold">
                {property.type}
                </span>
            </div>
        </div>
        
        <CardContent className="p-5 flex-1 flex flex-col">
            <div className="mb-4">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold truncate pr-4">{property.address}</h3>
                <span className="text-lg font-bold text-primary">${(property.price / 1000000).toFixed(2)}M</span>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> Beverly Hills, CA
            </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border/50 mb-4">
            <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{property.beds} Beds</span>
            </div>
            <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{property.baths} Baths</span>
            </div>
            <div className="flex items-center gap-2">
                <Square className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{property.sqft} sqft</span>
            </div>
            </div>

            {isShortlist ? (
                // Shortlist View - Enhanced Actions
                <>
                     {/* Agent Note */}
                     <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 mb-4 relative">
                        <div className="absolute -left-1 -top-1">
                           <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                              <User className="h-2 w-2 text-white" />
                           </div>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300 italic pl-2">
                           "{property.agentNote || "Let me know if you'd like to see this one."}"
                        </p>
                     </div>

                     {/* Comments Section */}
                     <div className="mt-auto space-y-3">
                        {comments[property.id] && (
                            <div className="flex items-start gap-2 text-sm bg-muted/30 p-2 rounded-lg">
                                <Avatar name={user.name} className="h-6 w-6 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-xs block">{user.name}</span>
                                    <p className="text-muted-foreground">{comments[property.id]}</p>
                                </div>
                            </div>
                        )}
                        
                        {!comments[property.id] && (
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 bg-muted/20 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Add a comment for Sarah..."
                                    value={commentInput[property.id] || ''}
                                    onChange={(e) => setCommentInput({...commentInput, [property.id]: e.target.value})}
                                />
                                <Button size="icon" variant="secondary" onClick={() => handlePostComment(property.id)}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <Button className="flex-1" variant="outline" onClick={() => openScheduleModal(property.id)}>
                                <Calendar className="mr-2 h-4 w-4" /> Schedule
                            </Button>
                            <Button className="flex-1" onClick={() => openOfferModal(property.id)}>
                                <DollarSign className="mr-2 h-4 w-4" /> Make Offer
                            </Button>
                        </div>
                     </div>
                </>
            ) : (
                // Marketplace View - Simple Actions
                <div className="mt-auto">
                     <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                        {property.description}
                     </p>
                     <Button 
                        variant={favorites.includes(property.id) ? "outline" : "primary"} 
                        className="w-full"
                        onClick={() => handleLike(property.id)}
                    >
                        {favorites.includes(property.id) ? (
                            <>View in Shortlist <ArrowRight className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>Add to Shortlist <Heart className="ml-2 h-4 w-4" /></>
                        )}
                     </Button>
                </div>
            )}
        </CardContent>
    </Card>
  );

  const selectedProperty = MOCK_PROPERTIES.find(p => p.id === selectedPropertyId);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <AnimatePresence>
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Avatar name={user.name} className="h-12 w-12 border-2 border-primary" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Client Portal • <span className="text-green-600 font-medium">Active Search</span></p>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-4 bg-card p-2 rounded-xl border shadow-sm">
           <div className="flex items-center gap-3 px-3 border-r">
               <Avatar name={agent.name} className="h-10 w-10" />
               <div className="hidden sm:block">
                   <p className="text-xs text-muted-foreground">Your Agent</p>
                   <p className="text-sm font-semibold">{agent.name}</p>
               </div>
           </div>
           <Button variant="ghost" size="sm" className="gap-2">
               <MessageSquare className="h-4 w-4" /> Message
           </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b overflow-x-auto no-scrollbar">
         <button 
           onClick={() => setActiveTab('ALL_PROJECTS')}
           className={cn(
             "px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap",
             activeTab === 'ALL_PROJECTS' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
           )}
         >
           <Building className="h-4 w-4" /> All Projects
         </button>
         <button 
           onClick={() => setActiveTab('SHORTLIST')}
           className={cn(
             "px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap",
             activeTab === 'SHORTLIST' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
           )}
         >
           <Star className="h-4 w-4" /> My Shortlist <span className="bg-primary/10 text-primary px-2 rounded-full text-xs">{favorites.length}</span>
         </button>
         <button 
           onClick={() => setActiveTab('DOCUMENTS')}
           className={cn(
             "px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap",
             activeTab === 'DOCUMENTS' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
           )}
         >
           <FileText className="h-4 w-4" /> Documents & Signing
         </button>
      </div>

      {/* Content Area */}
      {activeTab === 'ALL_PROJECTS' && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border">
                 <Search className="h-5 w-5 text-muted-foreground" />
                 <input 
                    placeholder="Search by address or property type..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <Filter className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {allProjects.map(property => (
                    <PropertyCardInner key={property.id} property={property} isShortlist={false} />
                ))}
            </div>
            
            {allProjects.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No properties found matching your search.</p>
                </div>
            )}
         </motion.div>
      )}

      {activeTab === 'SHORTLIST' && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {shortlist.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {shortlist.map(property => (
                       <PropertyCardInner key={property.id} property={property} isShortlist={true} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-semibold mb-2">Your shortlist is empty</h3>
                    <p className="text-muted-foreground mb-6">Browse available projects and click the heart icon to save them here.</p>
                    <Button onClick={() => setActiveTab('ALL_PROJECTS')}>
                        Browse All Projects
                    </Button>
                </div>
            )}
         </motion.div>
      )}

      {activeTab === 'DOCUMENTS' && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* E-Sign Section */}
            <div>
               <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                   <PenTool className="h-5 w-5 text-primary" /> Signatures Required
               </h2>
               <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                   {[
                       { name: 'Purchase Agreement - 123 Beverly Park', status: 'Pending', date: 'Oct 28, 2023', urgent: true },
                       { name: 'Agency Disclosure', status: 'Signed', date: 'Oct 25, 2023', urgent: false }
                   ].map((doc, idx) => (
                       <div key={idx} className="p-4 flex items-center justify-between border-b last:border-0 hover:bg-muted/10 transition-colors">
                           <div className="flex items-center gap-4">
                               <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", doc.status === 'Signed' ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400")}>
                                   <FileText className="h-5 w-5" />
                               </div>
                               <div>
                                   <p className="font-medium text-sm md:text-base">{doc.name}</p>
                                   <p className="text-xs text-muted-foreground">{doc.date} • {doc.status}</p>
                               </div>
                           </div>
                           
                           {doc.status === 'Pending' ? (
                               <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" onClick={() => setToast({message: 'Opening DocuSign secure portal...', type: 'success'})}>
                                   Sign Now <PenTool className="ml-2 h-3 w-3" />
                               </Button>
                           ) : (
                               <Button variant="ghost" size="sm" className="text-muted-foreground">
                                   <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Completed
                               </Button>
                           )}
                       </div>
                   ))}
               </div>
            </div>

            {/* Upload Section */}
            <div>
               <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                   <UploadCloud className="h-5 w-5 text-primary" /> Requested Documents
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                       { id: 'id_scan', title: 'Government ID', desc: 'Passport or Driver\'s License' },
                       { id: 'proof_funds', title: 'Proof of Funds', desc: 'Bank statement from last 30 days' },
                       { id: 'pre_approval', title: 'Pre-Approval Letter', desc: 'Lender letter for mortgage' }
                   ].map((req) => (
                       <Card key={req.id} className="border-dashed border-2 hover:border-primary/50 transition-colors">
                           <CardContent className="p-6 flex flex-col items-center text-center">
                               {uploadedDocs.includes(req.id) ? (
                                   <>
                                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                                          <CheckCircle className="h-6 w-6" />
                                      </div>
                                      <h3 className="font-semibold">{req.title}</h3>
                                      <p className="text-xs text-muted-foreground mt-1">Uploaded successfully</p>
                                      <Button variant="ghost" size="sm" className="mt-3 h-8 text-xs">View File</Button>
                                   </>
                               ) : (
                                   <>
                                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                                          <UploadCloud className="h-6 w-6" />
                                      </div>
                                      <h3 className="font-semibold">{req.title}</h3>
                                      <p className="text-xs text-muted-foreground mt-1 mb-4">{req.desc}</p>
                                      
                                      {uploadingDoc === req.id ? (
                                          <div className="w-full h-9 flex items-center justify-center bg-muted/30 rounded-md">
                                              <span className="text-xs animate-pulse">Uploading...</span>
                                          </div>
                                      ) : (
                                          <Button variant="outline" size="sm" className="w-full" onClick={() => handleUpload(req.id)}>
                                              Select File
                                          </Button>
                                      )}
                                   </>
                               )}
                           </CardContent>
                       </Card>
                   ))}
               </div>
            </div>

         </motion.div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule a Viewing"
        footer={
            <Button onClick={submitSchedule} className="w-full sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" /> Request Appointment
            </Button>
        }
      >
        <div className="space-y-4 py-2">
            <div className="bg-muted/20 p-3 rounded-lg flex items-center gap-3">
                {selectedProperty && <img src={selectedProperty.image} alt="prop" className="h-12 w-12 rounded-md object-cover" />}
                <div>
                    <p className="font-semibold text-sm">{selectedProperty?.address}</p>
                    <p className="text-xs text-muted-foreground">Beverly Hills, CA</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Date</label>
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
                <label className="text-sm font-medium">Notes for Sarah</label>
                <textarea 
                    className="w-full p-2.5 rounded-md border bg-background h-24 resize-none focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="I'm available all afternoon. Please send gate code."
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
                />
            </div>
        </div>
      </Modal>

      {/* Offer Modal */}
      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title="Make an Offer"
        footer={
            <Button onClick={submitOffer} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                <Send className="mr-2 h-4 w-4" /> Submit Offer
            </Button>
        }
      >
        <div className="space-y-4 py-2">
            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600 p-1.5 bg-white/50 rounded-full" />
                <div>
                    <p className="font-semibold text-sm text-green-800 dark:text-green-300">Prepare your offer</p>
                    <p className="text-xs text-green-700/80 dark:text-green-400/80">Agent will review and present to seller.</p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Property</label>
                <input 
                    disabled 
                    className="w-full p-2.5 rounded-md border bg-muted/50 text-muted-foreground"
                    value={selectedProperty?.address || ''}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Offer Amount ($)</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <input 
                        type="number" 
                        className="w-full pl-7 p-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none font-bold text-lg"
                        placeholder="0.00"
                        value={offerData.price}
                        onChange={(e) => setOfferData({...offerData, price: e.target.value})}
                    />
                </div>
                <p className="text-xs text-muted-foreground text-right">Listing Price: ${(selectedProperty?.price || 0).toLocaleString()}</p>
            </div>

             <div className="space-y-2">
                <label className="text-sm font-medium">Contingencies / Terms</label>
                <textarea 
                    className="w-full p-2.5 rounded-md border bg-background h-24 resize-none focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="e.g. 30 day close, inspection contingency..."
                    value={offerData.notes}
                    onChange={(e) => setOfferData({...offerData, notes: e.target.value})}
                />
            </div>
        </div>
      </Modal>
    </div>
  );
};
