



/**
 * ⚠️ LEGACY MOCK DATA - KEPT FOR REFERENCE ONLY
 * 
 * This file contains the original mock data structure.
 * The application now uses real MongoDB data via dbStore.ts
 * 
 * This file is kept for:
 * - Reference of data structure
 * - Testing purposes
 * - Fallback if needed
 * 
 * Active implementation: backend/db/dbStore.ts
 */

import { Lead, Property, Deal, DealStage, PipelineStage } from '../../types';// Initial Mock Data (Simulating a populated DB)
let leads: any[] = [
  { 
    id: '1', 
    name: 'Alice', 
    email: 'alice@example.com', 
    mobile: '+1 (555) 123-4567', 
    status: 'New Lead', 
    value: 450000, 
    lastContact: '2023-10-25', 
    source: 'Website', 
    assignedAgent: 'Unassigned', 
    owner_id: null,
    tags: ['First-time Buyer'],
    timeline: [
      { id: 't1', type: 'creation', text: 'Lead captured from Website', date: '2023-10-25T10:00:00Z' }
    ]
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    email: 'bob.smith@corp.com', 
    mobile: '+1 (555) 234-5678', 
    status: 'Contacted', 
    value: 1200000, 
    lastContact: '2023-10-24', 
    source: 'Referral', 
    assignedAgent: 'Sarah Connor', 
    owner_id: '1',
    tags: [],
    timeline: [
      { id: 't1', type: 'creation', text: 'Lead manually created', date: '2023-10-24T09:00:00Z' },
      { id: 't2', type: 'assignment', text: 'Assigned to Sarah Connor', date: '2023-10-24T09:05:00Z' }
    ]
  },
  { 
    id: '3', 
    name: 'Charlie Brown', 
    email: 'charlie@gmail.com', 
    mobile: '+1 (555) 345-6789', 
    status: 'Qualified', 
    value: 350000, 
    lastContact: '2023-10-22', 
    source: 'Zillow', 
    assignedAgent: 'John Doe', 
    owner_id: '5',
    tags: ['Pre-approved'],
    timeline: []
  },
];

let properties: any[] = [
  { 
    id: '1', 
    address: '123 Maple Dr, Beverly Hills', 
    price: 2500000, 
    status: 'Active', 
    beds: 4, 
    baths: 3.5, 
    sqft: 3200, 
    type: 'Single Family', 
    image: 'https://picsum.photos/400/300?random=1',
    images: ['https://picsum.photos/800/600?random=1'],
    documents: [],
    openHouses: []
  },
  { 
    id: '2', 
    address: '456 Oak Ln, Santa Monica', 
    price: 1800000, 
    status: 'Pending', 
    beds: 3, 
    baths: 2, 
    sqft: 1800, 
    type: 'Condo', 
    image: 'https://picsum.photos/400/300?random=2',
    images: ['https://picsum.photos/800/600?random=2'],
    documents: [],
    openHouses: []
  },
];

let deals: Deal[] = [
  { 
    id: '101', 
    name: 'Beverly Hills Purchase',
    leadId: '2', 
    leadName: 'Bob Smith',
    propertyId: '1', 
    propertyAddress: '123 Maple Dr, Beverly Hills',
    agentName: 'Sarah Connor',
    stage: DealStage.NEGOTIATION, 
    value: 2500000, 
    closeDate: '2023-12-15',
    probability: 75,
    createdAt: new Date().toISOString() 
  },
  { 
    id: '102', 
    name: 'Santa Monica Condo',
    leadId: '3', 
    leadName: 'Charlie Brown',
    propertyId: '2', 
    propertyAddress: '456 Oak Ln, Santa Monica',
    agentName: 'John Doe',
    stage: DealStage.PROPOSAL, 
    value: 1800000, 
    closeDate: '2024-01-20',
    probability: 40,
    createdAt: new Date().toISOString() 
  }
];

let pipelineStages: PipelineStage[] = [
  { id: 'qual', name: 'Qualification', color: 'bg-blue-500', order: 1 },
  { id: 'prop', name: 'Proposal', color: 'bg-purple-500', order: 2 },
  { id: 'neg', name: 'Negotiation', color: 'bg-orange-500', order: 3 },
  { id: 'contract', name: 'Under Contract', color: 'bg-yellow-500', order: 4 },
  { id: 'won', name: 'Closed Won', color: 'bg-emerald-600', order: 5 },
  { id: 'lost', name: 'Closed Lost', color: 'bg-red-500', order: 6 },
];

let tasks: any[] = [
  { id: 'tsk1', title: 'Follow up call', dueDate: '2023-11-01', priority: 'HIGH', category: 'CALL', relatedTo: { type: 'LEAD', id: '2', name: 'Bob Smith' }, isCompleted: false }
];

let users: any[] = [
  { id: '1', name: 'Sarah Connor', email: 'sarah@prestige.com', role: 'AGENT', status: 'Active', phone: '+1 (555) 001-2345', created_at: '2015-03-15T00:00:00Z' },
  { id: '2', name: 'Mike Ross', email: 'mike@prestige.com', role: 'AGENT', status: 'Active', phone: '+1 (555) 002-3456', created_at: '2019-06-20T00:00:00Z' },
  { id: '5', name: 'John Doe', email: 'john@prestige.com', role: 'ADMIN', status: 'Active', phone: '+1 (555) 005-6789', created_at: '2010-02-01T00:00:00Z' }
];

let organization = {
  id: 'org_1',
  name: 'RealLex',
  primaryColor: '#F3CCF3',
  website: 'www.reallex.com',
  address: '123 Tech Blvd, Silicon Valley'
};

let emailTemplates = [
    { id: '1', name: 'New Lead Welcome', subject: 'Welcome to {CompanyName}', body: 'Hi {LeadName},\n\nThanks for your interest in our properties. When is a good time to chat?' },
    { id: '2', name: 'Viewing Follow-up', subject: 'Thoughts on the property?', body: 'Hi {LeadName},\n\nIt was great showing you the property today. What did you think?' },
    { id: '3', name: 'Contract Sent', subject: 'Contract for {PropertyAddress}', body: 'Hi {LeadName},\n\nPlease find the attached contract for review. Let me know if you have questions.' },
];

// Billing Data
let billing = {
  subscription: {
    plan: 'Pro',
    status: 'ACTIVE',
    nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    amount: 79,
    paymentMethod: { last4: '4242', brand: 'Visa' }
  },
  invoices: [
    { id: 'inv_123', date: '2023-10-01', amount: 79, status: 'PAID', pdfUrl: '#' },
    { id: 'inv_122', date: '2023-09-01', amount: 79, status: 'PAID', pdfUrl: '#' },
    { id: 'inv_121', date: '2023-08-01', amount: 79, status: 'PAID', pdfUrl: '#' },
  ]
};

const plans = [
  { id: 'starter', name: 'Starter', price: 0, features: ['Up to 500 Leads', 'Basic CRM', 'Email Support'] },
  { id: 'pro', name: 'Pro', price: 79, features: ['Unlimited Leads', 'AI Lead Scoring', 'Workflows', 'Priority Support'] },
  { id: 'agency', name: 'Agency', price: 199, features: ['Everything in Pro', 'Team Management', 'White Labeling', 'API Access'] }
];

// Mock DB Client
export const db = {
  organization: {
    get: async () => organization,
    update: async (updates: any) => {
      organization = { ...organization, ...updates };
      return organization;
    }
  },
  billing: {
    getSubscription: async () => billing.subscription,
    getInvoices: async () => billing.invoices,
    getPlans: async () => plans,
    subscribe: async (planId: string) => {
      const plan = plans.find(p => p.id === planId.toLowerCase() || p.name.toLowerCase() === planId.toLowerCase());
      if (!plan) throw new Error('Plan not found');
      
      billing.subscription = {
        ...billing.subscription,
        plan: plan.name,
        amount: plan.price,
        status: 'ACTIVE'
      };
      
      // Generate a new invoice for the subscription if paid
      if (plan.price > 0) {
          billing.invoices.unshift({
              id: `inv_${Math.floor(Math.random() * 10000)}`,
              date: new Date().toISOString().split('T')[0],
              amount: plan.price,
              status: 'PAID',
              pdfUrl: '#'
          });
      }
      
      return billing.subscription;
    },
    updatePaymentMethod: async (last4: string) => {
      billing.subscription.paymentMethod = { ...billing.subscription.paymentMethod, last4 };
      return true;
    }
  },
  emailTemplates: {
    findAll: async () => emailTemplates,
    create: async (data: any) => {
      const newTpl = { id: Math.random().toString(36).substr(2, 9), ...data };
      emailTemplates.push(newTpl);
      return newTpl;
    },
    update: async (id: string, updates: any) => {
      const idx = emailTemplates.findIndex(t => t.id === id);
      if (idx === -1) return null;
      emailTemplates[idx] = { ...emailTemplates[idx], ...updates };
      return emailTemplates[idx];
    },
    delete: async (id: string) => {
      const idx = emailTemplates.findIndex(t => t.id === id);
      if (idx === -1) return null;
      const deleted = emailTemplates.splice(idx, 1);
      return deleted[0];
    }
  },
  leads: {
    find: async ({ owner, status, page = 1, limit = 10 }: any) => {
      let result = [...leads];

      // WHERE clauses
      if (owner) {
        result = result.filter(l => l.assignedAgent === owner || l.owner_id === owner);
      }
      if (status && status !== 'All') {
        result = result.filter(l => l.status === status);
      }

      // Pagination (OFFSET/LIMIT)
      const total = result.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = result.slice(start, end);

      return { data, meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
    },
    
    findById: async (id: string) => {
      return leads.find(l => l.id === id) || null;
    },

    create: async (data: any) => {
      const newLead = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: data.status || 'New Lead',
        tags: data.tags || [],
        timeline: [{
            id: Math.random().toString(36).substr(2, 9),
            type: 'creation',
            text: 'Lead created',
            date: new Date().toISOString()
        }],
        created_at: new Date().toISOString()
      };
      leads.unshift(newLead);
      return newLead;
    },

    update: async (id: string, updates: any) => {
      const idx = leads.findIndex(l => l.id === id);
      if (idx === -1) return null;
      leads[idx] = { ...leads[idx], ...updates };
      return leads[idx];
    },

    delete: async (id: string) => {
      const idx = leads.findIndex(l => l.id === id);
      if (idx === -1) return null;
      const deleted = leads.splice(idx, 1);
      return deleted[0];
    },

    // Sub-resources
    addNote: async (id: string, text: string) => {
      const lead = leads.find(l => l.id === id);
      if (!lead) return null;
      if (!lead.timeline) lead.timeline = [];
      const note = { 
          id: Math.random().toString(36).substr(2, 9), 
          type: 'note', 
          text, 
          date: new Date().toISOString() 
      };
      lead.timeline.unshift(note);
      return note;
    },

    getTimeline: async (id: string) => {
      const lead = leads.find(l => l.id === id);
      return lead ? lead.timeline || [] : null;
    },

    assign: async (id: string, agentName: string) => {
      const idx = leads.findIndex(l => l.id === id);
      if (idx === -1) return null;
      
      const oldAgent = leads[idx].assignedAgent;
      leads[idx].assignedAgent = agentName;
      
      // Add timeline event
      if (!leads[idx].timeline) leads[idx].timeline = [];
      leads[idx].timeline.unshift({
          id: Math.random().toString(36).substr(2, 9),
          type: 'assignment',
          text: `Reassigned from ${oldAgent || 'Unassigned'} to ${agentName}`,
          date: new Date().toISOString()
      });
      return leads[idx];
    },

    updateTags: async (id: string, tags: string[]) => {
      const idx = leads.findIndex(l => l.id === id);
      if (idx === -1) return null;
      leads[idx].tags = tags;
      return leads[idx];
    }
  },

  properties: {
    findAll: async ({ status, type, minPrice, maxPrice }: any) => {
      let result = [...properties];
      if (status && status !== 'All') result = result.filter(p => p.status === status);
      if (type && type !== 'All') result = result.filter(p => p.type === type);
      if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
      if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
      return result;
    },
    
    findById: async (id: string) => {
      return properties.find(p => p.id === id) || null;
    },

    create: async (data: any) => {
      const newProperty = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: data.status || 'Draft',
        created_at: new Date().toISOString(),
        images: data.images || [],
        openHouses: [],
        documents: []
      };
      properties.unshift(newProperty);
      return newProperty;
    },

    update: async (id: string, updates: any) => {
      const idx = properties.findIndex(p => p.id === id);
      if (idx === -1) return null;
      properties[idx] = { ...properties[idx], ...updates, updated_at: new Date().toISOString() };
      return properties[idx];
    },

    delete: async (id: string) => {
      const idx = properties.findIndex(p => p.id === id);
      if (idx === -1) return null;
      const deleted = properties.splice(idx, 1);
      return deleted[0];
    },

    // Sub-resources
    addMedia: async (id: string, url: string) => {
        const idx = properties.findIndex(p => p.id === id);
        if (idx === -1) return null;
        if (!properties[idx].images) properties[idx].images = [];
        properties[idx].images.push(url);
        return properties[idx];
    },

    removeMedia: async (id: string, mediaIndex: number) => {
        const idx = properties.findIndex(p => p.id === id);
        if (idx === -1) return null;
        if (!properties[idx].images) return properties[idx];
        
        // Ensure index is valid
        if (mediaIndex >= 0 && mediaIndex < properties[idx].images.length) {
            properties[idx].images.splice(mediaIndex, 1);
        }
        return properties[idx];
    },

    addOpenHouse: async (id: string, data: any) => {
        const idx = properties.findIndex(p => p.id === id);
        if (idx === -1) return null;
        if (!properties[idx].openHouses) properties[idx].openHouses = [];
        
        const newOH = {
            id: Math.random().toString(36).substr(2, 9),
            ...data
        };
        properties[idx].openHouses.push(newOH);
        return newOH;
    },

    getDocuments: async (id: string) => {
        const prop = properties.find(p => p.id === id);
        return prop ? prop.documents || [] : null;
    },

    assignAgent: async (id: string, agentName: string) => {
        const idx = properties.findIndex(p => p.id === id);
        if (idx === -1) return null;
        properties[idx].agent = agentName;
        return properties[idx];
    }
  },

  deals: {
    findAll: async (filters: any) => {
      let result = [...deals];
      // Basic filtering can be added here
      return result;
    },

    findById: async (id: string) => {
      return deals.find(d => d.id === id);
    },
    
    create: async (data: any) => {
      const newDeal: Deal = {
          id: Math.random().toString(36).substr(2, 9),
          ...data,
          stage: (data.stage as DealStage) || DealStage.QUALIFICATION,
          probability: data.probability || 10,
          createdAt: new Date().toISOString()
      };
      deals.push(newDeal);
      return newDeal;
    },

    update: async (id: string, updates: any) => {
      const idx = deals.findIndex(d => d.id === id);
      if (idx === -1) return null;
      deals[idx] = { ...deals[idx], ...updates };
      return deals[idx];
    },

    updateStage: async (id: string, stage: string) => {
      const idx = deals.findIndex(d => d.id === id);
      if (idx === -1) return null;
      deals[idx] = { ...deals[idx], stage: stage as DealStage };
      return deals[idx];
    },

    delete: async (id: string) => {
      const idx = deals.findIndex(d => d.id === id);
      if (idx === -1) return null;
      const deleted = deals.splice(idx, 1);
      return deleted[0];
    }
  },

  pipeline: {
    findAll: async () => {
      return pipelineStages.sort((a, b) => a.order - b.order);
    },
    create: async (data: any) => {
      const newStage: PipelineStage = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        color: data.color || 'bg-gray-500',
        order: data.order || pipelineStages.length + 1
      };
      pipelineStages.push(newStage);
      return newStage;
    },
    update: async (id: string, updates: Partial<PipelineStage>) => {
      const idx = pipelineStages.findIndex(s => s.id === id);
      if (idx === -1) return null;
      pipelineStages[idx] = { ...pipelineStages[idx], ...updates };
      return pipelineStages[idx];
    },
    delete: async (id: string) => {
      const idx = pipelineStages.findIndex(s => s.id === id);
      if (idx === -1) return null;
      const deleted = pipelineStages.splice(idx, 1);
      return deleted[0];
    }
  },

  tasks: {
    findAll: async (filters: any) => {
       let result = [...tasks];
       if (filters.isCompleted !== undefined) {
           const isComplete = filters.isCompleted === 'true';
           result = result.filter(t => t.isCompleted === isComplete);
       }
       if (filters.priority) {
           result = result.filter(t => t.priority === filters.priority);
       }
       return result;
    },
    findById: async (id: string) => {
       return tasks.find(t => t.id === id);
    },
    create: async (data: any) => {
      const newTask = {
          id: Math.random().toString(36).substr(2, 9),
          ...data,
          isCompleted: false,
          created_at: new Date().toISOString()
      };
      tasks.unshift(newTask);
      return newTask;
    },
    update: async (id: string, updates: any) => {
        const idx = tasks.findIndex(t => t.id === id);
        if (idx === -1) return null;
        tasks[idx] = { ...tasks[idx], ...updates };
        return tasks[idx];
    },
    delete: async (id: string) => {
        const idx = tasks.findIndex(t => t.id === id);
        if (idx === -1) return null;
        const deleted = tasks.splice(idx, 1);
        return deleted[0];
    },
    findByLeadId: async (leadId: string) => {
      return tasks.filter(t => t.relatedTo?.id === leadId && t.relatedTo?.type === 'LEAD');
    }
  },

  users: {
    findAll: async () => {
      return users;
    },
    findById: async (id: string) => {
      return users.find(u => u.id === id) || null;
    },
    create: async (data: any) => {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: data.status || 'Active',
        created_at: new Date().toISOString()
      };
      users.push(newUser);
      return newUser;
    },
    update: async (id: string, updates: any) => {
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
      return users[idx];
    },
    delete: async (id: string) => {
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], status: 'Inactive', updated_at: new Date().toISOString() };
      return users[idx];
    }
  }
};
