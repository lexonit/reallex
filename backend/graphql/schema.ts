
import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Lead {
    id: ID!
    name: String!
    email: String!
    mobile: String
    status: String
    value: Float
    source: String
    assignedAgent: String
    lastContact: String
    tags: [String]
  }

  type Property {
    id: ID!
    address: String!
    price: Float!
    status: String
    beds: Float
    baths: Float
    sqft: Float
    type: String
    image: String
    agent: String
  }

  type Deal {
    id: ID!
    name: String!
    value: Float!
    stage: String!
    closeDate: String
    probability: Float
    leadName: String
    propertyAddress: String
    agentName: String
    createdAt: String
  }

  type RelatedEntity {
    type: String
    id: ID
    name: String
  }

  type Task {
    id: ID!
    title: String!
    description: String
    dueDate: String
    isCompleted: Boolean
    priority: String
    category: String
    recurring: String
    reminder: Boolean
    relatedTo: RelatedEntity
  }

  type PipelineStage {
    id: ID!
    name: String!
    color: String
    order: Int
  }

  type Organization {
    id: ID!
    name: String
    primaryColor: String
    website: String
    address: String
  }

  type EmailTemplate {
    id: ID!
    name: String!
    subject: String!
    body: String!
  }

  type Plan {
    id: ID!
    name: String!
    price: Float!
    features: [String]
  }

  type PaymentMethod {
    last4: String
    brand: String
  }

  type Subscription {
    plan: String
    status: String
    nextBillingDate: String
    amount: Float
    paymentMethod: PaymentMethod
  }

  type Invoice {
    id: ID!
    date: String
    amount: Float
    status: String
    pdfUrl: String
  }

  type Query {
    leads(owner: String, status: String): [Lead]
    lead(id: ID!): Lead
    properties(status: String, minPrice: Float, maxPrice: Float): [Property]
    deals(stage: String): [Deal]
    tasks(isCompleted: Boolean, priority: String): [Task]
    pipelineStages: [PipelineStage]
    organization: Organization
    emailTemplates: [EmailTemplate]
    
    currentSubscription: Subscription
    invoices: [Invoice]
    availablePlans: [Plan]
  }

  input LeadInput {
    name: String!
    email: String!
    value: Float!
    status: String
    source: String
    mobile: String
  }

  input DealInput {
    name: String!
    value: Float!
    stage: String
    closeDate: String
    probability: Float
    leadId: ID
    propertyId: ID
  }

  input TaskInput {
    title: String!
    description: String
    dueDate: String
    priority: String
    category: String
    recurring: String
    reminder: Boolean
  }

  type Mutation {
    createLead(input: LeadInput): Lead
    updateLead(id: ID!, status: String, assignedAgent: String): Lead
    
    createDeal(input: DealInput): Deal
    updateDealStage(id: ID!, stage: String!): Deal
    
    createTask(input: TaskInput): Task
    toggleTaskCompletion(id: ID!): Task
    deleteTask(id: ID!): Task
    
    createProperty(address: String!, price: Float!, type: String): Property

    updateOrganization(name: String, primaryColor: String, website: String, address: String): Organization
    createEmailTemplate(name: String!, subject: String!, body: String!): EmailTemplate
    updateEmailTemplate(id: ID!, name: String, subject: String, body: String): EmailTemplate
    deleteEmailTemplate(id: ID!): EmailTemplate

    subscribe(planId: String!): Subscription
    updatePaymentMethod(cardNumber: String!): Boolean
  }
`);
