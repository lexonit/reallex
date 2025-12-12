
import express from 'express';
import { db } from '../db/mockStore';
import { broadcastNotification } from '../server';
import { checkSubscriptionLimits } from '../middleware/subscription';

const router = express.Router();

// --- LEADS ---

// GET /api/leads?owner=&status=&page=
router.get('/leads', async (req: any, res: any) => {
  try {
    const { owner, status, page } = req.query;
    const result = await db.leads.find({ owner, status, page });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// POST /api/leads
router.post('/leads', checkSubscriptionLimits('lead') as any, async (req: any, res: any) => {
  try {
    const lead = await db.leads.create(req.body);
    
    // Notify clients via WebSocket
    broadcastNotification({
      type: 'LEAD_CREATED',
      payload: { id: lead.id, name: lead.name, agent: lead.assignedAgent }
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// GET /api/leads/:id
router.get('/leads/:id', async (req: any, res: any) => {
  try {
    const lead = await db.leads.findById(req.params.id);
    if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead details' });
  }
});

// PATCH /api/leads/:id
router.patch('/leads/:id', async (req: any, res: any) => {
  try {
    const updatedLead = await db.leads.update(req.params.id, req.body);
    if (!updatedLead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE /api/leads/:id
router.delete('/leads/:id', async (req: any, res: any) => {
  try {
    const deletedLead = await db.leads.delete(req.params.id);
    if (!deletedLead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json({ message: 'Lead deleted successfully', lead: deletedLead });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// --- LEAD SUB-ENDPOINTS ---

// POST /leads/:id/notes
router.post('/leads/:id/notes', async (req: any, res: any) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Note text is required' });
    
    const note = await db.leads.addNote(req.params.id, text);
    if (!note) return res.status(404).json({ error: 'Lead not found' });
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// GET /leads/:id/timeline
router.get('/leads/:id/timeline', async (req: any, res: any) => {
  try {
    const timeline = await db.leads.getTimeline(req.params.id);
    if (!timeline) return res.status(404).json({ error: 'Lead not found' });
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// POST /leads/:id/assign
router.post('/leads/:id/assign', async (req: any, res: any) => {
  try {
    const { agentName } = req.body;
    if (!agentName) return res.status(400).json({ error: 'Agent name is required' });

    const lead = await db.leads.assign(req.params.id, agentName);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    
    broadcastNotification({ type: 'LEAD_ASSIGNED', payload: { leadId: lead.id, agent: agentName } });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign agent' });
  }
});

// POST /leads/:id/convert
router.post('/leads/:id/convert', async (req: any, res: any) => {
  try {
    const { dealValue, dealName } = req.body;
    const lead = await db.leads.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    // Create Deal
    const deal = await db.deals.create({
        lead_id: lead.id,
        name: dealName || `${lead.name} Deal`,
        value: dealValue || lead.value,
        stage: 'Qualification'
    });

    // Update lead status to Closed/Converted
    await db.leads.update(lead.id, { status: 'Closed Won' });

    res.status(201).json({ message: 'Lead converted successfully', deal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert lead' });
  }
});

// POST /leads/:id/tags
router.post('/leads/:id/tags', async (req: any, res: any) => {
  try {
    const { tags } = req.body; // Expects array of strings
    if (!Array.isArray(tags)) return res.status(400).json({ error: 'Tags must be an array' });

    const lead = await db.leads.updateTags(req.params.id, tags);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tags' });
  }
});

// POST /leads/:id/tasks
router.post('/leads/:id/tasks', async (req: any, res: any) => {
  try {
    const { title, dueDate, priority } = req.body;
    const lead = await db.leads.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const task = await db.tasks.create({
        title,
        dueDate,
        priority,
        relatedTo: { type: 'LEAD', id: lead.id, name: lead.name }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// --- PROPERTIES ---

// GET /api/properties
router.get('/properties', async (req: any, res: any) => {
  try {
    const { status, type, minPrice, maxPrice } = req.query;
    const properties = await db.properties.findAll({ status, type, minPrice, maxPrice });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// POST /api/properties
router.post('/properties', async (req: any, res: any) => {
  try {
    const property = await db.properties.create(req.body);
    broadcastNotification({
      type: 'PROPERTY_CREATED',
      payload: { id: property.id, address: property.address }
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// GET /api/properties/:id
router.get('/properties/:id', async (req: any, res: any) => {
  try {
    const property = await db.properties.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// PATCH /api/properties/:id
router.patch('/properties/:id', async (req: any, res: any) => {
  try {
    const updatedProperty = await db.properties.update(req.params.id, req.body);
    if (!updatedProperty) return res.status(404).json({ error: 'Property not found' });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// DELETE /api/properties/:id
router.delete('/properties/:id', async (req: any, res: any) => {
  try {
    const deletedProperty = await db.properties.delete(req.params.id);
    if (!deletedProperty) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted successfully', property: deletedProperty });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// --- PROPERTY SUB-ENDPOINTS ---

// POST /properties/:id/media
router.post('/properties/:id/media', async (req: any, res: any) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Media URL is required' });

    const property = await db.properties.addMedia(req.params.id, url);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add media' });
  }
});

// DELETE /properties/:id/media/:mediaId
router.delete('/properties/:id/media/:mediaId', async (req: any, res: any) => {
  try {
    const mediaId = parseInt(req.params.mediaId);
    if (isNaN(mediaId)) return res.status(400).json({ error: 'Invalid media ID (index)' });

    const property = await db.properties.removeMedia(req.params.id, mediaId);
    if (!property) return res.status(404).json({ error: 'Property not found or invalid media index' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

// POST /properties/:id/open-house
router.post('/properties/:id/open-house', async (req: any, res: any) => {
  try {
    const { date, start, end } = req.body;
    if (!date || !start || !end) return res.status(400).json({ error: 'Date, start time, and end time are required' });

    const openHouse = await db.properties.addOpenHouse(req.params.id, req.body);
    if (!openHouse) return res.status(404).json({ error: 'Property not found' });
    res.status(201).json(openHouse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add open house' });
  }
});

// GET /properties/:id/documents
router.get('/properties/:id/documents', async (req: any, res: any) => {
  try {
    const documents = await db.properties.getDocuments(req.params.id);
    if (!documents) return res.status(404).json({ error: 'Property not found' });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST /properties/:id/assign-agent
router.post('/properties/:id/assign-agent', async (req: any, res: any) => {
  try {
    const { agentName } = req.body;
    if (!agentName) return res.status(400).json({ error: 'Agent name is required' });

    const property = await db.properties.assignAgent(req.params.id, agentName);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    broadcastNotification({ type: 'PROPERTY_ASSIGNED', payload: { propertyId: property.id, agent: agentName } });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign agent' });
  }
});

// --- DEALS ---

// GET /api/deals
router.get('/deals', async (req: any, res: any) => {
  try {
    const deals = await db.deals.findAll(req.query);
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// POST /api/deals
router.post('/deals', checkSubscriptionLimits('deal') as any, async (req: any, res: any) => {
  try {
    const deal = await db.deals.create(req.body);
    broadcastNotification({
      type: 'DEAL_CREATED',
      payload: { id: deal.id, name: deal.name }
    });
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// GET /api/deals/:id
router.get('/deals/:id', async (req: any, res: any) => {
  try {
    const deal = await db.deals.findById(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// PATCH /api/deals/:id
router.patch('/deals/:id', async (req: any, res: any) => {
  try {
    const updatedDeal = await db.deals.update(req.params.id, req.body);
    if (!updatedDeal) return res.status(404).json({ error: 'Deal not found' });
    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// DELETE /api/deals/:id
router.delete('/deals/:id', async (req: any, res: any) => {
  try {
    const deletedDeal = await db.deals.delete(req.params.id);
    if (!deletedDeal) return res.status(404).json({ error: 'Deal not found' });
    res.json({ message: 'Deal deleted successfully', deal: deletedDeal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// PATCH /api/deals/:id/move
router.patch('/deals/:id/move', async (req: any, res: any) => {
  try {
    const { stage } = req.body;
    if (!stage) return res.status(400).json({ error: 'Target stage is required' });

    const updatedDeal = await db.deals.updateStage(req.params.id, stage);
    if (!updatedDeal) return res.status(404).json({ error: 'Deal not found' });

    broadcastNotification({
      type: 'DEAL_MOVED',
      payload: { id: updatedDeal.id, newStage: stage }
    });

    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to move deal' });
  }
});

// --- PIPELINE STAGES ---

// GET /api/pipeline/stages
router.get('/pipeline/stages', async (req: any, res: any) => {
  try {
    const stages = await db.pipeline.findAll();
    res.json(stages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pipeline stages' });
  }
});

// POST /api/pipeline/stages
router.post('/pipeline/stages', async (req: any, res: any) => {
  try {
    const { name, color, order } = req.body;
    if (!name) return res.status(400).json({ error: 'Stage name is required' });
    
    const stage = await db.pipeline.create({ name, color, order });
    res.status(201).json(stage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stage' });
  }
});

// PATCH /api/pipeline/stages/:id
router.patch('/pipeline/stages/:id', async (req: any, res: any) => {
  try {
    const updatedStage = await db.pipeline.update(req.params.id, req.body);
    if (!updatedStage) return res.status(404).json({ error: 'Stage not found' });
    res.json(updatedStage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

// DELETE /api/pipeline/stages/:id
router.delete('/pipeline/stages/:id', async (req: any, res: any) => {
  try {
    const deletedStage = await db.pipeline.delete(req.params.id);
    if (!deletedStage) return res.status(404).json({ error: 'Stage not found' });
    res.json({ message: 'Stage deleted successfully', stage: deletedStage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stage' });
  }
});

// --- TASKS ---

// GET /api/tasks
router.get('/tasks', async (req: any, res: any) => {
  try {
    const tasks = await db.tasks.findAll(req.query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks
router.post('/tasks', async (req: any, res: any) => {
  try {
    const task = await db.tasks.create(req.body);
    broadcastNotification({
      type: 'TASK_CREATED',
      payload: { id: task.id, title: task.title }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// GET /api/tasks/:id
router.get('/tasks/:id', async (req: any, res: any) => {
  try {
    const task = await db.tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// PATCH /api/tasks/:id
router.patch('/tasks/:id', async (req: any, res: any) => {
  try {
    const updatedTask = await db.tasks.update(req.params.id, req.body);
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id
router.delete('/tasks/:id', async (req: any, res: any) => {
  try {
    const deletedTask = await db.tasks.delete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// --- USERS & ROLES ---

// GET /api/users
router.get('/users', async (req: any, res: any) => {
  try {
    const users = await db.users.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/users
router.post('/users', async (req: any, res: any) => {
  try {
    const newUser = await db.users.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/users/:id
router.get('/users/:id', async (req: any, res: any) => {
  try {
    const user = await db.users.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PATCH /api/users/:id
router.patch('/users/:id', async (req: any, res: any) => {
  try {
    const updatedUser = await db.users.update(req.params.id, req.body);
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id
router.delete('/users/:id', async (req: any, res: any) => {
  try {
    const deactivatedUser = await db.users.delete(req.params.id);
    if (!deactivatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deactivated successfully', user: deactivatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

export default router;
