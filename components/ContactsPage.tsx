
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Contact, CurrentUser } from '../types';
import { 
  Users, Building, Phone, Mail, MapPin, Search, Filter, Plus, 
  MoreHorizontal, Briefcase, FileText, Wallet, MessageSquare, ExternalLink 
} from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { cn } from '../lib/utils';
import { Modal } from './ui/Modal';
import { Toast } from './ui/Toast';
import { AnimatePresence, motion } from 'framer-motion';

interface ContactsPageProps {
  user: CurrentUser | null;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PEOPLE' | 'COMPANIES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // New Contact Form State
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    type: 'PERSON',
    name: '',
    email: '',
    phone: '',
    location: 'Dubai, UAE',
    status: 'Active',
    tags: []
  });

  useEffect(() => {
    // Generate Mock Data for UAE Context
    const mockContacts: Contact[] = [
      // People
      {
        id: '1', type: 'PERSON', name: 'Ahmed Al Mansoori', title: 'Managing Director', companyName: 'Mansoori Holdings',
        email: 'ahmed@mansoori.ae', phone: '+971 50 123 4567', location: 'Jumeirah 1, Dubai', status: 'Active',
        linkedLeads: 2, linkedDeals: 1, totalValue: 4500000, lastContact: '2 days ago',
        tags: ['VIP', 'Investor'], emiratesId: '784-1980-1234567-1'
      },
      {
        id: '2', type: 'PERSON', name: 'Sarah Jenkins', title: 'CEO', companyName: 'TechFlow Middle East',
        email: 'sarah.j@techflow.me', phone: '+971 55 987 6543', location: 'Dubai Marina, Dubai', status: 'Active',
        linkedLeads: 1, linkedDeals: 0, totalValue: 0, lastContact: '1 week ago',
        tags: ['Expat', 'Tenant'], nationality: 'UK'
      },
      {
        id: '3', type: 'PERSON', name: 'Fatima Al Kaabi', title: 'Procurement Manager', companyName: 'Government Entity',
        email: 'f.alkaabi@gov.ae', phone: '+971 2 444 5555', location: 'Al Maryah Island, Abu Dhabi', status: 'Prospect',
        linkedLeads: 0, linkedDeals: 0, totalValue: 0, lastContact: '3 weeks ago',
        tags: ['Government'], emiratesId: '784-1985-7654321-2'
      },
      // Companies
      {
        id: '4', type: 'COMPANY', name: 'Emaar Properties', industry: 'Real Estate Development',
        email: 'info@emaar.com', phone: '+971 4 367 3333', location: 'Downtown Dubai', status: 'Active',
        linkedLeads: 15, linkedDeals: 8, totalValue: 25000000, lastContact: 'Yesterday',
        tags: ['Developer', 'Partner'], tradeLicense: 'CN-100456', website: 'emaar.com', size: '1000+'
      },
      {
        id: '5', type: 'COMPANY', name: 'Al Tayer Group', industry: 'Diversified Conglomerate',
        email: 'contact@altayer.com', phone: '+971 4 201 1111', location: 'Garhoud, Dubai', status: 'Active',
        linkedLeads: 3, linkedDeals: 1, totalValue: 1200000, lastContact: '5 days ago',
        tags: ['Retail', 'Automotive'], tradeLicense: 'CN-200998', website: 'altayer.com', size: '5000+'
      }
    ];

    setTimeout(() => {
      setContacts(mockContacts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'ALL') return matchesSearch;
    return matchesSearch && c.type === (activeTab === 'PEOPLE' ? 'PERSON' : 'COMPANY');
  });

  const handleCreateContact = () => {
    if (!newContact.name || !newContact.email) {
      setToast({ message: 'Please fill in required fields', type: 'error' });
      return;
    }

    const created: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      ...newContact as Contact,
      linkedLeads: 0,
      linkedDeals: 0,
      totalValue: 0,
      lastContact: 'Just now',
      tags: ['New']
    };

    setContacts([created, ...contacts]);
    setIsModalOpen(false);
    setToast({ message: 'Contact created successfully', type: 'success' });
    setTimeout(() => setToast(null), 3000);
    
    // Reset
    setNewContact({
      type: activeTab === 'COMPANIES' ? 'COMPANY' : 'PERSON',
      name: '', email: '', phone: '', location: 'Dubai, UAE', status: 'Active', tags: []
    });
  };

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <Card className="hover:shadow-md transition-shadow border-border/50 group overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 flex items-start justify-between">
          <div className="flex gap-4">
            {contact.type === 'COMPANY' ? (
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                <Building className="h-6 w-6" />
              </div>
            ) : (
              <Avatar name={contact.name} className="h-12 w-12" />
            )}
            <div>
              <h3 className="font-bold text-base text-foreground">{contact.name}</h3>
              <p className="text-sm text-muted-foreground">
                {contact.type === 'PERSON' ? contact.title : contact.industry}
                {contact.companyName && <span className="text-primary/80"> @ {contact.companyName}</span>}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {contact.location}
              </div>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 border-t border-b border-dashed divide-x bg-muted/20">
           <div className="p-2 text-center">
              <span className="block text-lg font-bold text-foreground">{contact.linkedDeals}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Deals</span>
           </div>
           <div className="p-2 text-center">
              <span className="block text-lg font-bold text-foreground">{contact.linkedLeads}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Leads</span>
           </div>
           <div className="p-2 text-center">
              <span className="block text-lg font-bold text-green-600">${(contact.totalValue / 1000).toFixed(0)}k</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Vol</span>
           </div>
        </div>

        <div className="p-4 space-y-3">
           <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
              <Mail className="h-3.5 w-3.5" /> {contact.email}
           </div>
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> {contact.phone}
           </div>
           
           {/* UAE Specific Fields */}
           {contact.type === 'PERSON' && contact.emiratesId && (
              <div className="flex items-center gap-2 text-xs bg-muted/50 px-2 py-1 rounded w-fit">
                 <FileText className="h-3 w-3" /> EID: {contact.emiratesId}
              </div>
           )}
           {contact.type === 'COMPANY' && contact.tradeLicense && (
              <div className="flex items-center gap-2 text-xs bg-muted/50 px-2 py-1 rounded w-fit">
                 <Briefcase className="h-3 w-3" /> Lic: {contact.tradeLicense}
              </div>
           )}

           <div className="flex gap-2 mt-4 pt-2">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1" onClick={() => window.open(`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`, '_blank')}>
                 <MessageSquare className="h-3 w-3" /> WhatsApp
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1">
                 <ExternalLink className="h-3 w-3" /> View
              </Button>
           </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 h-full flex flex-col">
      <AnimatePresence>
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
         <div>
            <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
            <p className="text-muted-foreground">Manage your relationships with clients and partners.</p>
         </div>
         <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Add Contact
         </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border rounded-xl p-4 shadow-sm">
         {/* Tabs */}
         <div className="flex items-center bg-muted/50 rounded-lg p-1 w-full md:w-auto">
            <button 
               onClick={() => setActiveTab('ALL')}
               className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all flex-1 md:flex-none", activeTab === 'ALL' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
               All
            </button>
            <button 
               onClick={() => setActiveTab('PEOPLE')}
               className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all flex-1 md:flex-none", activeTab === 'PEOPLE' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
               People
            </button>
            <button 
               onClick={() => setActiveTab('COMPANIES')}
               className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all flex-1 md:flex-none", activeTab === 'COMPANIES' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
               Companies
            </button>
         </div>

         {/* Search */}
         <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
               placeholder="Search contacts..." 
               className="w-full pl-9 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="h-64 rounded-xl border bg-card animate-pulse" />
                ))}
            </div>
         ) : filteredContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredContacts.map(contact => (
                  <ContactCard key={contact.id} contact={contact} />
               ))}
            </div>
         ) : (
            <div className="text-center py-20 text-muted-foreground">
               <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
               <p>No contacts found. Try adjusting your search.</p>
            </div>
         )}
      </div>

      {/* Add Contact Modal */}
      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Add New Contact"
         footer={
            <Button onClick={handleCreateContact} className="w-full">Create Contact</Button>
         }
      >
         <div className="space-y-4 py-2">
            {/* Type Selector */}
            <div className="flex gap-4 mb-4">
               <label className={cn("flex-1 cursor-pointer border rounded-lg p-3 text-center transition-all", newContact.type === 'PERSON' ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted")}>
                  <input type="radio" name="ctype" className="hidden" checked={newContact.type === 'PERSON'} onChange={() => setNewContact({...newContact, type: 'PERSON'})} />
                  <span className="font-semibold text-sm">Person</span>
               </label>
               <label className={cn("flex-1 cursor-pointer border rounded-lg p-3 text-center transition-all", newContact.type === 'COMPANY' ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted")}>
                  <input type="radio" name="ctype" className="hidden" checked={newContact.type === 'COMPANY'} onChange={() => setNewContact({...newContact, type: 'COMPANY'})} />
                  <span className="font-semibold text-sm">Company</span>
               </label>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium">{newContact.type === 'PERSON' ? 'Full Name' : 'Company Name'}</label>
               <input 
                  className="w-full p-2.5 rounded-md border bg-background"
                  placeholder={newContact.type === 'PERSON' ? "e.g. John Doe" : "e.g. Acme Corp"}
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
               />
            </div>

            {newContact.type === 'PERSON' && (
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title</label>
                      <input 
                         className="w-full p-2.5 rounded-md border bg-background"
                         placeholder="Manager"
                         value={newContact.title || ''}
                         onChange={(e) => setNewContact({...newContact, title: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <input 
                         className="w-full p-2.5 rounded-md border bg-background"
                         placeholder="Acme Inc"
                         value={newContact.companyName || ''}
                         onChange={(e) => setNewContact({...newContact, companyName: e.target.value})}
                      />
                   </div>
                </div>
            )}

            {newContact.type === 'COMPANY' && (
               <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <select 
                     className="w-full p-2.5 rounded-md border bg-background"
                     value={newContact.industry || ''}
                     onChange={(e) => setNewContact({...newContact, industry: e.target.value})}
                  >
                     <option value="">Select Industry</option>
                     <option>Real Estate</option>
                     <option>Technology</option>
                     <option>Finance</option>
                     <option>Retail</option>
                  </select>
               </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input 
                     className="w-full p-2.5 rounded-md border bg-background"
                     type="email"
                     placeholder="email@example.com"
                     value={newContact.email}
                     onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input 
                     className="w-full p-2.5 rounded-md border bg-background"
                     placeholder="+971 50..."
                     value={newContact.phone}
                     onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  />
               </div>
            </div>

            {/* UAE Local Fields */}
            <div className="p-3 bg-muted/20 rounded-lg space-y-3 border border-dashed">
                <p className="text-xs font-bold text-muted-foreground uppercase">Local Details (UAE)</p>
                {newContact.type === 'PERSON' ? (
                   <div className="space-y-2">
                      <label className="text-xs font-medium">Emirates ID</label>
                      <input 
                         className="w-full p-2 rounded-md border bg-background text-sm"
                         placeholder="784-XXXX-XXXXXXX-X"
                         value={newContact.emiratesId || ''}
                         onChange={(e) => setNewContact({...newContact, emiratesId: e.target.value})}
                      />
                   </div>
                ) : (
                   <div className="space-y-2">
                      <label className="text-xs font-medium">Trade License No.</label>
                      <input 
                         className="w-full p-2 rounded-md border bg-background text-sm"
                         placeholder="CN-XXXXXX"
                         value={newContact.tradeLicense || ''}
                         onChange={(e) => setNewContact({...newContact, tradeLicense: e.target.value})}
                      />
                   </div>
                )}
                <div className="space-y-2">
                   <label className="text-xs font-medium">Location</label>
                   <input 
                      className="w-full p-2 rounded-md border bg-background text-sm"
                      placeholder="e.g. Business Bay, Dubai"
                      value={newContact.location}
                      onChange={(e) => setNewContact({...newContact, location: e.target.value})}
                   />
                </div>
            </div>
         </div>
      </Modal>
    </div>
  );
};
