import React from 'react';

export enum NavigationTab {
  DASHBOARD = 'DASHBOARD',
  LEADS = 'LEADS',
  CONTACTS = 'CONTACTS',
  PROPERTIES = 'PROPERTIES',
  DOCUMENTS = 'DOCUMENTS',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  APPROVALS = 'APPROVALS',
  USERS = 'USERS',
  DEALS = 'DEALS',
  CLIENT_PORTAL = 'CLIENT_PORTAL',
  CALENDAR = 'CALENDAR',
  TASKS = 'TASKS',
}

export enum PropertyStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PUBLISHED = 'Active',
  PENDING = 'Pending',
  SOLD = 'Sold',
  ARCHIVED = 'Archived'
}

export enum DealStage {
  QUALIFICATION = 'Qualification',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  UNDER_CONTRACT = 'Under Contract',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export type PropertyType = 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Land' | 'Commercial';
export type UserRole = 'ADMIN' | 'AGENT' | 'CLIENT';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Contact {
  id: string;
  type: 'PERSON' | 'COMPANY';
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  
  // Person specific
  title?: string;
  companyName?: string;
  emiratesId?: string;
  nationality?: string;
  
  // Company specific
  industry?: string;
  tradeLicense?: string;
  website?: string;
  size?: string;
  
  // Relationships
  linkedLeads: number;
  linkedDeals: number;
  totalValue: number;
  lastContact: string;
  tags: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  status: string;
  value: number;
  lastContact: string;
  source: string;
  assignedAgent?: string;
  nextAppointment?: string; // ISO date string for scheduled viewings
  notes?: string;
  tags?: string[];
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: DealStage;
  closeDate: string; // ISO Date
  probability: number; // 0-100
  
  // Relationships
  leadId?: string;
  leadName?: string;
  propertyId?: string;
  propertyAddress?: string;
  agentId?: string;
  agentName?: string;
  
  notes?: string;
  createdAt: string;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskRecurring = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type TaskCategory = 'CALL' | 'EMAIL' | 'MEETING' | 'PAPERWORK' | 'OTHER';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO Date string
  isCompleted: boolean;
  priority: TaskPriority;
  recurring: TaskRecurring;
  reminder: boolean; // Auto-reminder enabled
  category: TaskCategory;
  relatedTo?: {
    type: 'LEAD' | 'PROPERTY';
    id: string;
    name: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'VIEWING' | 'MEETING' | 'CLOSING' | 'FOLLOW_UP';
  description?: string;
  leadId?: string;
  propertyId?: string;
  location?: string;
}

export interface ClosedDeal {
  id: string;
  propertyAddress: string;
  propertyImage: string;
  salePrice: number;
  commission: number;
  agent: {
    name: string;
    image?: string;
  };
  listedDate: string;
  soldDate: string;
  daysOnMarket: number;
  buyerName: string;
}

export interface ChartData {
  name: string;
  value: number;
  revenue: number;
}

export interface PropertyDocument {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'JPG';
  size: string;
  url: string;
}

export interface DocumentVersion {
  id: string;
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  size: string;
  comment?: string;
}

export interface OrgDocument {
  id: string;
  name: string;
  type: 'PDF' | 'IMAGE' | 'DOC' | 'SPREADSHEET';
  size: string;
  updatedAt: string;
  owner: string;
  category: 'CONTRACTS' | 'MARKETING' | 'LEGAL' | 'OTHER';
  versions: DocumentVersion[];
  tags: string[];
}

export interface OpenHouse {
  id: string;
  date: string;
  start: string;
  end: string;
  host?: string;
}

export interface Property {
  id: string;
  address: string;
  price: number;
  status: 'Draft' | 'Submitted' | 'Active' | 'Pending' | 'Sold' | 'Rejected';
  beds: number;
  baths: number;
  sqft: number;
  image: string; // Cover image
  images: string[]; // Gallery
  agent?: string; // Assigned Agent Name
  
  // Extended Details
  type: PropertyType;
  yearBuilt: number;
  lotSize: number; // in sqft
  garage: number;
  description: string;
  
  // Financials
  hoaFees?: number; // Monthly
  taxes?: number; // Annual
  
  // Features
  amenities: string[];
  
  // New Fields
  documents: PropertyDocument[];
  openHouses: OpenHouse[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

export interface AuditLog {
  id: string;
  action: string;
  targetModel: string;
  details: any;
  timestamp: string;
  userId?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface TimeSeriesData {
  date: string;
  count: number;
}

export interface AgentStats {
  leads: number; // Total lifetime leads
  deals: number; // Total lifetime deals
  revenue: number; // Total lifetime revenue
  rating: number;
  
  // Operational KPIs
  newLeads: number; // Leads assigned this week/month needing action
  appointments: number; // Appointments scheduled for today
  dealsThisMonth: number; // Deals closed in current month
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Away' | 'Inactive';
  phone: string;
  image?: string;
  licenseNumber: string;
  bio: string;
  languages: string[];
  specialties: string[];
  joinedDate: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  stats: AgentStats;
}

export interface Integration {
  id: string;
  name: string;
  icon: string; // Identifier for icon component
  status: 'CONNECTED' | 'DISCONNECTED';
  description: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}