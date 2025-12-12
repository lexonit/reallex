/**
 * Billing API Type Definitions
 * Use these types in your React components when working with the billing API
 */

// ============================================
// ENUMS
// ============================================

export enum PlanType {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export enum BillingCycleType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum SupportLevel {
  EMAIL = 'EMAIL',
  PRIORITY = 'PRIORITY',
  DEDICATED = 'DEDICATED'
}

// ============================================
// TYPES
// ============================================

export interface Plan {
  id: string;
  name: PlanType;
  displayName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  maxUsers: number;
  maxProperties: number;
  maxTemplates: number;
  supportLevel: SupportLevel;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  vendorId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  billingCycle: BillingCycleType;
  paymentMethodId?: string;
  autoRenew: boolean;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  vendorId: string;
  type: PaymentMethodType;
  cardLast4: string;
  cardBrand: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  vendorId: string;
  subscriptionId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  billDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingData {
  currentSubscription: Subscription | null;
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  availablePlans: Plan[];
}

// ============================================
// INPUT TYPES (for mutations)
// ============================================

export interface SubscriptionInput {
  plan: PlanType;
  billingCycle: BillingCycleType;
  paymentMethodId?: string;
}

export interface PaymentMethodInput {
  type: PaymentMethodType;
  cardLast4: string;
  cardBrand: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface BillingPageProps {
  vendorId: string;
}

export interface SubscriptionCardProps {
  subscription: Subscription | null;
  plans: Plan[];
  onUpgrade: (plan: Plan) => void;
  onCancel: () => void;
}

export interface PricingCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  onSelect: (plan: Plan) => void;
}

export interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (paymentMethod: PaymentMethod) => void;
}

export interface InvoiceListProps {
  invoices: Invoice[];
  isLoading: boolean;
  onDownload: (invoice: Invoice) => void;
}

export interface BillingFormProps {
  initialValues?: Partial<PaymentMethodInput>;
  onSubmit: (values: PaymentMethodInput) => void;
  isSubmitting: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface GetPlansResponse {
  getPlans: Plan[];
}

export interface GetSubscriptionResponse {
  getSubscription: Subscription | null;
}

export interface GetPaymentMethodsResponse {
  getPaymentMethods: PaymentMethod[];
}

export interface GetInvoicesResponse {
  getInvoices: Invoice[];
}

export interface GetBillingDataResponse {
  getPlans: Plan[];
  getSubscription: Subscription | null;
  getPaymentMethods: PaymentMethod[];
  getInvoices: Invoice[];
}

export interface SubscribeResponse {
  subscribe: Subscription;
}

export interface UpdatePaymentMethodResponse {
  updatePaymentMethod: PaymentMethod;
}

export interface AddPaymentMethodResponse {
  addPaymentMethod: PaymentMethod;
}

export interface RemovePaymentMethodResponse {
  removePaymentMethod: boolean;
}

export interface CancelSubscriptionResponse {
  cancelSubscription: Subscription;
}

export interface UpdateSubscriptionResponse {
  updateSubscription: Subscription;
}

// ============================================
// HELPER TYPES
// ============================================

export interface BillingState {
  plans: Plan[];
  subscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
}

export interface BillingActions {
  fetchPlans: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  fetchInvoices: (limit?: number, offset?: number) => Promise<void>;
  subscribe: (input: SubscriptionInput) => Promise<Subscription>;
  addPaymentMethod: (input: PaymentMethodInput) => Promise<PaymentMethod>;
  updatePaymentMethod: (id: string, input: PaymentMethodInput) => Promise<PaymentMethod>;
  removePaymentMethod: (id: string) => Promise<boolean>;
  cancelSubscription: (reason?: string) => Promise<Subscription>;
  updateSubscription: (plan: PlanType, billingCycle: BillingCycleType) => Promise<Subscription>;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format a price with currency symbol
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  });
  return formatter.format(price);
}

/**
 * Get price for selected billing cycle
 */
export function getPriceForCycle(
  plan: Plan,
  billingCycle: BillingCycleType
): number {
  return billingCycle === BillingCycleType.YEARLY
    ? plan.yearlyPrice
    : plan.monthlyPrice;
}

/**
 * Calculate monthly equivalent for yearly pricing
 */
export function getMonthlyEquivalent(yearlyPrice: number): number {
  return Math.round((yearlyPrice / 12) * 100) / 100;
}

/**
 * Check if a subscription is active
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  return subscription?.status === SubscriptionStatus.ACTIVE;
}

/**
 * Check if trial period is ending soon (within 7 days)
 */
export function isTrialEndingSoon(subscription: Subscription | null): boolean {
  if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
    return false;
  }

  const endDate = new Date(subscription.currentPeriodEnd);
  const now = new Date();
  const daysUntilEnd = Math.floor(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysUntilEnd <= 7 && daysUntilEnd > 0;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Get subscription badge color based on status
 */
export function getStatusBadgeColor(status: SubscriptionStatus): string {
  const colors: Record<SubscriptionStatus, string> = {
    [SubscriptionStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [SubscriptionStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
    [SubscriptionStatus.EXPIRED]: 'bg-red-100 text-red-800',
    [SubscriptionStatus.PAUSED]: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get plan name for comparison
 */
export function getPlanDisplayName(planType: PlanType): string {
  const names: Record<PlanType, string> = {
    [PlanType.FREE]: 'Starter',
    [PlanType.STARTER]: 'Professional',
    [PlanType.PROFESSIONAL]: 'Enterprise',
    [PlanType.ENTERPRISE]: 'Custom'
  };
  return names[planType] || planType;
}

/**
 * Check if plan can be downgraded
 */
export function canDowngrade(currentPlan: PlanType): boolean {
  return currentPlan !== PlanType.FREE;
}

/**
 * Check if plan can be upgraded
 */
export function canUpgrade(currentPlan: PlanType): boolean {
  return currentPlan !== PlanType.ENTERPRISE;
}

/**
 * Get available upgrade paths
 */
export function getAvailableUpgrades(currentPlan: PlanType): PlanType[] {
  const upgrades: Record<PlanType, PlanType[]> = {
    [PlanType.FREE]: [PlanType.STARTER, PlanType.PROFESSIONAL, PlanType.ENTERPRISE],
    [PlanType.STARTER]: [PlanType.PROFESSIONAL, PlanType.ENTERPRISE],
    [PlanType.PROFESSIONAL]: [PlanType.ENTERPRISE],
    [PlanType.ENTERPRISE]: []
  };
  return upgrades[currentPlan] || [];
}

/**
 * Get available downgrade paths
 */
export function getAvailableDowngrades(currentPlan: PlanType): PlanType[] {
  const downgrades: Record<PlanType, PlanType[]> = {
    [PlanType.FREE]: [],
    [PlanType.STARTER]: [PlanType.FREE],
    [PlanType.PROFESSIONAL]: [PlanType.STARTER, PlanType.FREE],
    [PlanType.ENTERPRISE]: [PlanType.PROFESSIONAL, PlanType.STARTER, PlanType.FREE]
  };
  return downgrades[currentPlan] || [];
}

/**
 * Calculate remaining days in current billing period
 */
export function getRemainingDays(subscription: Subscription | null): number {
  if (!subscription) return 0;

  const endDate = new Date(subscription.currentPeriodEnd);
  const now = new Date();
  return Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Format payment method for display
 */
export function formatPaymentMethod(paymentMethod: PaymentMethod): string {
  if (paymentMethod.type === PaymentMethodType.CREDIT_CARD) {
    return `${paymentMethod.cardBrand} ending in ${paymentMethod.cardLast4}`;
  } else if (paymentMethod.type === PaymentMethodType.DEBIT_CARD) {
    return `Debit card ending in ${paymentMethod.cardLast4}`;
  } else {
    return 'Bank Transfer';
  }
}

export default {
  // Enums
  PlanType,
  BillingCycleType,
  SubscriptionStatus,
  InvoiceStatus,
  PaymentMethodType,
  SupportLevel,

  // Utility functions
  formatPrice,
  getPriceForCycle,
  getMonthlyEquivalent,
  isSubscriptionActive,
  isTrialEndingSoon,
  formatDate,
  getStatusBadgeColor,
  getPlanDisplayName,
  canDowngrade,
  canUpgrade,
  getAvailableUpgrades,
  getAvailableDowngrades,
  getRemainingDays,
  formatPaymentMethod
};
