
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { ArrowLeft, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { graphqlRequest } from '../../lib/graphql';
import { REGISTER_MUTATION } from '../../graphql/mutations/auth.mutations';
import { ALL_SUBSCRIPTION_PLANS_QUERY } from '../../graphql/queries/billing.queries';
import { cn } from '../../lib/utils';

interface PlanFeatures {
  maxUsers: number;
  maxProperties: number;
  maxLeads: number;
  maxDeals: number;
  maxStorage: number;
  customBranding: boolean;
  apiAccess: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  customIntegrations: boolean;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billingCycle: string;
  features: PlanFeatures;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

interface RegisterPageProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onRegisterSuccess }) => {
  const { companyName } = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: '',
    vendorName: '',
    vendorSlug: '',
    contactEmail: '',
    selectedPlanId: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [step, setStep] = useState<'plan' | 'form'>('plan');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      console.log('📋 Loading all subscription plans with details...');
      const data = await graphqlRequest(ALL_SUBSCRIPTION_PLANS_QUERY, {});
      console.log('✅ Plans loaded:', data);
      if (data?.allSubscriptionPlansWithDetails) {
        setPlans(data.allSubscriptionPlansWithDetails);
        console.log('📊 Total plans loaded:', data.allSubscriptionPlansWithDetails.length);
      } else {
        setError('No subscription plans available');
        console.error('❌ No plans in response:', data);
      }
    } catch (err: any) {
      console.error('❌ Failed to load plans:', err);
      setError(err.message || 'Failed to load subscription plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlanId: planId
    }));
  };

  const handleContinueToForm = () => {
    if (!formData.selectedPlanId) {
      setError('Please select a subscription plan to continue');
      return;
    }
    setError(null);
    setStep('form');
  };

  const selectedPlan = plans.find(p => p.id === formData.selectedPlanId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Auto-generate slug from vendor name
    if (name === 'vendorName') {
      setFormData(prev => ({
        ...prev,
        vendorSlug: value.toLowerCase().replace(/\s+/g, '-')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Single registration call that handles both user and vendor creation
      const response = await graphqlRequest(REGISTER_MUTATION, {
        input: {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: 'VENDOR_ADMIN',
          vendorName: formData.vendorName,
          vendorSlug: formData.vendorSlug,
          contactEmail: formData.contactEmail || formData.email,
          logoUrl: '',
          theme: {
            primaryColor: '#3B82F6'
          },
          planId: formData.selectedPlanId
        }
      });

      if (response?.register?.user) {
        setSuccess(true);
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      <div className="w-full max-w-4xl p-4 relative z-10">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Button>

        {/* PLAN SELECTION STEP */}
        {step === 'plan' && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <svg 
                  className="h-6 w-6 text-primary fill-primary/20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 2L9 22h6L12 2z" />
                  <path d="M5 12l-2 10h4L5 12z" />
                  <path d="M19 12l-2 10h4l-2-10z" />
                </svg>
                <div className="flex flex-col">
                    <span className="text-xl font-bold leading-none">{companyName}</span>
                    <a href="https://lexonit.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground font-medium hover:text-primary transition-colors">Powered by Lexonit</a>
                </div>
              </div>
              <CardTitle>Choose Your Plan</CardTitle>
              <p className="text-sm text-muted-foreground">Start your 14-day free trial. No credit card required.</p>
            </CardHeader>
            <CardContent>
              {loadingPlans ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setError(null);
                      loadPlans();
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No subscription plans available at this time.</p>
                  <Button 
                    variant="outline"
                    onClick={loadPlans}
                  >
                    Reload Plans
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => handlePlanSelect(plan.id)}
                        className={cn(
                          "relative rounded-xl border-2 p-6 text-left transition-all hover:border-primary/50 hover:shadow-lg",
                          formData.selectedPlanId === plan.id
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-lg'
                            : 'border-border hover:bg-muted/50'
                        )}
                      >
                        {formData.selectedPlanId === plan.id && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <div className="mb-3">
                          <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                          <p className="text-xs text-muted-foreground">Plan ID: {plan.slug}</p>
                        </div>
                        <div className="text-2xl font-bold mb-4">${plan.price}<span className="text-sm font-normal text-muted-foreground">/{plan.billingCycle}</span></div>
                        <p className="text-xs text-muted-foreground mb-4 min-h-[32px]">{plan.description}</p>
                        <div className="border-t border-border/50 pt-3 mb-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Limits & Features:</p>
                        </div>
                        <ul className="space-y-2 text-xs mb-3">
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{plan.features.maxUsers} Team Members</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{plan.features.maxProperties} Properties</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{plan.features.maxLeads} Leads</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{plan.features.maxDeals} Deals</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{plan.features.maxStorage}GB Storage</span>
                          </li>
                        </ul>
                        {(plan.features.customBranding || plan.features.apiAccess || plan.features.advancedAnalytics || plan.features.prioritySupport || plan.features.customIntegrations) && (
                          <div className="border-t border-border/50 pt-2">
                            <div className="space-y-1 text-xs">
                              {plan.features.customBranding && (
                                <div className="flex items-center gap-2">
                                  <Check className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                  <span>Custom Branding</span>
                                </div>
                              )}
                              {plan.features.apiAccess && (
                                <div className="flex items-center gap-2">
                                  <Check className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                  <span>API Access</span>
                                </div>
                              )}
                              {plan.features.advancedAnalytics && (
                                <div className="flex items-center gap-2">
                                  <Check className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                  <span>Advanced Analytics</span>
                                </div>
                              )}
                              {plan.features.prioritySupport && (
                                <div className="flex items-center gap-2">
                                  <Check className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                  <span>Priority Support</span>
                                </div>
                              )}
                              {plan.features.customIntegrations && (
                                <div className="flex items-center gap-2">
                                  <Check className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                  <span>Custom Integrations</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleContinueToForm}
                  >
                    Continue to Details
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* FORM STEP */}
        {step === 'form' && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Register New Vendor</CardTitle>
                  <p className="text-sm text-muted-foreground">Complete your vendor setup</p>
                </div>
                {selectedPlan && (
                  <div className="text-right">
                    <p className="text-sm font-medium">{selectedPlan.name}</p>
                    <p className="text-xs text-muted-foreground">${selectedPlan.price}/{selectedPlan.billingCycle}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-lg font-semibold mb-2">✓ Vendor registered successfully!</div>
                  <p className="text-sm text-muted-foreground">Redirecting you to login...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input 
                        type="text"
                        name="firstName"
                        className="w-full p-2.5 rounded-md border bg-background" 
                        placeholder="John" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input 
                        type="text"
                        name="lastName"
                        className="w-full p-2.5 rounded-md border bg-background" 
                        placeholder="Doe" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vendor/Company Name</label>
                    <input 
                      type="text"
                      name="vendorName"
                      className="w-full p-2.5 rounded-md border bg-background" 
                      placeholder="Prestige Realty"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vendor Slug (URL-friendly)</label>
                    <input 
                      type="text"
                      name="vendorSlug"
                      className="w-full p-2.5 rounded-md border bg-background" 
                      placeholder="prestige-realty"
                      value={formData.vendorSlug}
                      onChange={handleInputChange}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Auto-generated from vendor name</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Work Email</label>
                    <input 
                      type="email" 
                      name="email"
                      className="w-full p-2.5 rounded-md border bg-background" 
                      placeholder="john@prestige.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email (for vendor)</label>
                    <input 
                      type="email" 
                      name="contactEmail"
                      className="w-full p-2.5 rounded-md border bg-background" 
                      placeholder="support@prestige.com" 
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <input 
                      type="password" 
                      name="password"
                      className="w-full p-2.5 rounded-md border bg-background" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      className="flex-1" 
                      size="lg"
                      type="button"
                      onClick={() => setStep('plan')}
                    >
                      Back to Plans
                    </Button>
                    <Button 
                      className="flex-1" 
                      size="lg"
                      disabled={isLoading}
                      type="submit"
                    >
                      {isLoading ? 'Creating Vendor...' : 'Create Vendor Account'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
