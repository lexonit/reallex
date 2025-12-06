
import { db } from '../db/mockStore';

export const rootValue = {
  // --- Queries ---
  leads: async ({ owner, status }: any) => {
    const result = await db.leads.find({ owner, status, limit: 100 });
    return result.data;
  },
  lead: async ({ id }: any) => {
    return await db.leads.findById(id);
  },
  properties: async ({ status, minPrice, maxPrice }: any) => {
    return await db.properties.findAll({ status, minPrice, maxPrice });
  },
  deals: async () => {
    return await db.deals.findAll({});
  },
  tasks: async ({ isCompleted, priority }: any) => {
    const filters: any = {};
    if (isCompleted !== undefined) filters.isCompleted = isCompleted;
    if (priority) filters.priority = priority;
    return await db.tasks.findAll(filters);
  },
  pipelineStages: async () => {
    return await db.pipeline.findAll();
  },
  organization: async () => {
    return await db.organization.get();
  },
  emailTemplates: async () => {
    return await db.emailTemplates.findAll();
  },
  currentSubscription: async () => {
    return await db.billing.getSubscription();
  },
  invoices: async () => {
    return await db.billing.getInvoices();
  },
  availablePlans: async () => {
    return await db.billing.getPlans();
  },

  // --- Mutations ---
  createLead: async ({ input }: any) => {
    return await db.leads.create(input);
  },
  updateLead: async ({ id, status, assignedAgent }: any) => {
    const updates: any = {};
    if (status) updates.status = status;
    if (assignedAgent) updates.assignedAgent = assignedAgent;
    return await db.leads.update(id, updates);
  },

  createDeal: async ({ input }: any) => {
    return await db.deals.create(input);
  },
  updateDealStage: async ({ id, stage }: any) => {
    return await db.deals.updateStage(id, stage);
  },

  createTask: async ({ input }: any) => {
    return await db.tasks.create(input);
  },
  toggleTaskCompletion: async ({ id }: any) => {
    const task = await db.tasks.findById(id);
    if (!task) throw new Error('Task not found');
    return await db.tasks.update(id, { isCompleted: !task.isCompleted });
  },
  deleteTask: async ({ id }: any) => {
    return await db.tasks.delete(id);
  },
  
  createProperty: async (args: any) => {
    return await db.properties.create(args);
  },

  updateOrganization: async (args: any) => {
    return await db.organization.update(args);
  },
  createEmailTemplate: async (args: any) => {
    return await db.emailTemplates.create(args);
  },
  updateEmailTemplate: async ({ id, ...updates }: any) => {
    return await db.emailTemplates.update(id, updates);
  },
  deleteEmailTemplate: async ({ id }: any) => {
    return await db.emailTemplates.delete(id);
  },

  subscribe: async ({ planId }: any) => {
    return await db.billing.subscribe(planId);
  },
  updatePaymentMethod: async ({ cardNumber }: any) => {
    const last4 = cardNumber.slice(-4);
    return await db.billing.updatePaymentMethod(last4);
  }
};