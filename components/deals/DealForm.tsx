import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { 
  Deal, DealStage, DealType, FinancingType, ContingencyType, 
  DealContingency, DealMilestone 
} from '../../types';
import { 
  DollarSign, Home, Users, Calendar, FileText, 
  Check, Plus, X, AlertCircle, ChevronRight, ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface DealFormProps {
  initialData?: Partial<Deal>;
  onSubmit: (data: Partial<Deal>) => void;
  onCancel: () => void;
}

const DEAL_TYPES: DealType[] = ['BUY', 'SELL', 'LEASE', 'RENT'];
const FINANCING_TYPES: FinancingType[] = ['CASH', 'MORTGAGE', 'FINANCING', 'OTHER'];
const CONTINGENCY_TYPES: ContingencyType[] = [
  'INSPECTION', 'FINANCING', 'APPRAISAL', 'TITLE', 'SALE_OF_PROPERTY'
];

const DEAL_STAGES = Object.values(DealStage);

export const DealForm: React.FC<DealFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Deal>>(initialData || {
    name: '',
    dealType: 'BUY',
    value: 0,
    stage: DealStage.QUALIFICATION,
    closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    probability: 20,
    financingType: 'MORTGAGE',
    commissionRate: 3,
    contingencies: [],
    milestones: [],
    tags: []
  });

  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const addContingency = () => {
    const newContingency: DealContingency = {
      type: 'INSPECTION',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PENDING',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      contingencies: [...(prev.contingencies || []), newContingency]
    }));
  };

  const updateContingency = (index: number, field: keyof DealContingency, value: any) => {
    setFormData(prev => {
      const updated = [...(prev.contingencies || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, contingencies: updated };
    });
  };

  const removeContingency = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contingencies: prev.contingencies?.filter((_, i) => i !== index)
    }));
  };

  const addMilestone = () => {
    const newMilestone: DealMilestone = {
      id: `milestone_${Date.now()}`,
      title: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PENDING'
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMilestone]
    }));
  };

  const updateMilestone = (index: number, field: keyof DealMilestone, value: any) => {
    setFormData(prev => {
      const updated = [...(prev.milestones || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, milestones: updated };
    });
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones?.filter((_, i) => i !== index)
    }));
  };

  // Auto-calculate commission
  useEffect(() => {
    if (formData.value && formData.commissionRate) {
      const commission = (formData.value * formData.commissionRate) / 100;
      setFormData(prev => ({ ...prev, commissionAmount: commission }));
    }
  }, [formData.value, formData.commissionRate]);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.dealType && formData.value;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                  s === step
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : s < step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </div>
              <span className="text-xs mt-2 text-muted-foreground">
                {s === 1 && 'Basic Info'}
                {s === 2 && 'Financials'}
                {s === 3 && 'Parties & Dates'}
                {s === 4 && 'Contingencies'}
              </span>
            </div>
            {s < 4 && (
              <div
                className={cn(
                  'flex-1 h-1 mx-2',
                  s < step ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Basic Deal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Deal Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main St - Johnson Purchase"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deal Type *</label>
                <select
                  name="dealType"
                  value={formData.dealType || 'BUY'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                >
                  {DEAL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deal Value *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    name="value"
                    value={formData.value || ''}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stage</label>
                <select
                  name="stage"
                  value={formData.stage || DealStage.QUALIFICATION}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                >
                  {DEAL_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Close Date</label>
                <input
                  type="date"
                  name="closeDate"
                  value={formData.closeDate || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Probability (%)</label>
                <input
                  type="number"
                  name="probability"
                  value={formData.probability || 20}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Property Address</label>
              <input
                type="text"
                name="propertyAddress"
                value={formData.propertyAddress || ''}
                onChange={handleChange}
                placeholder="123 Main St, City, State ZIP"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes about this deal..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Financial Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">List Price</label>
                <input
                  type="number"
                  name="listPrice"
                  value={formData.listPrice || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Offer Price</label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Earnest Money</label>
                <input
                  type="number"
                  name="earnestMoney"
                  value={formData.earnestMoney || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Down Payment</label>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Financing Type</label>
                <select
                  name="financingType"
                  value={formData.financingType || 'MORTGAGE'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                >
                  {FINANCING_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Amount</label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Interest Rate (%)</label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate || ''}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Commission Rate (%)</label>
                <input
                  type="number"
                  name="commissionRate"
                  value={formData.commissionRate || 3}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Commission Amount</label>
                <input
                  type="number"
                  name="commissionAmount"
                  value={formData.commissionAmount || ''}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-input bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Closing Costs</label>
                <input
                  type="number"
                  name="closingCosts"
                  value={formData.closingCosts || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Parties & Dates */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Parties & Important Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">PARTIES INVOLVED</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Buyer Agent</label>
                  <input
                    type="text"
                    name="buyerAgent"
                    value={formData.buyerAgent || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Seller Agent</label>
                  <input
                    type="text"
                    name="sellerAgent"
                    value={formData.sellerAgent || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title Company</label>
                  <input
                    type="text"
                    name="titleCompany"
                    value={formData.titleCompany || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Lender</label>
                  <input
                    type="text"
                    name="lender"
                    value={formData.lender || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Attorney</label>
                  <input
                    type="text"
                    name="attorney"
                    value={formData.attorney || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">IMPORTANT DATES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Offer Date</label>
                  <input
                    type="date"
                    name="offerDate"
                    value={formData.offerDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Acceptance Date</label>
                  <input
                    type="date"
                    name="acceptanceDate"
                    value={formData.acceptanceDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Inspection Date</label>
                  <input
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Appraisal Date</label>
                  <input
                    type="date"
                    name="appraisalDate"
                    value={formData.appraisalDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Closing Date</label>
                  <input
                    type="date"
                    name="closingDate"
                    value={formData.closingDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Possession Date</label>
                  <input
                    type="date"
                    name="possessionDate"
                    value={formData.possessionDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Contingencies & Milestones */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contingencies & Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contingencies */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-muted-foreground">CONTINGENCIES</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContingency}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contingency
                </Button>
              </div>

              {formData.contingencies && formData.contingencies.length > 0 ? (
                <div className="space-y-3">
                  {formData.contingencies.map((cont, idx) => (
                    <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                          <select
                            value={cont.type}
                            onChange={(e) => updateContingency(idx, 'type', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                          >
                            {CONTINGENCY_TYPES.map(type => (
                              <option key={type} value={type}>{type.replace('_', ' ')}</option>
                            ))}
                          </select>

                          <input
                            type="date"
                            value={cont.dueDate}
                            onChange={(e) => updateContingency(idx, 'dueDate', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                          />

                          <select
                            value={cont.status}
                            onChange={(e) => updateContingency(idx, 'status', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="SATISFIED">Satisfied</option>
                            <option value="WAIVED">Waived</option>
                            <option value="FAILED">Failed</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeContingency(idx)}
                          className="ml-2 text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={cont.notes || ''}
                        onChange={(e) => updateContingency(idx, 'notes', e.target.value)}
                        placeholder="Notes..."
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No contingencies added yet
                </div>
              )}
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-muted-foreground">MILESTONES</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMilestone}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>

              {formData.milestones && formData.milestones.length > 0 ? (
                <div className="space-y-3">
                  {formData.milestones.map((milestone, idx) => (
                    <div key={idx} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                            placeholder="Milestone title..."
                            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                          />

                          <input
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => updateMilestone(idx, 'dueDate', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                          />

                          <select
                            value={milestone.status}
                            onChange={(e) => updateMilestone(idx, 'status', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="OVERDUE">Overdue</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMilestone(idx)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No milestones added yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={step === 1 ? onCancel : handlePrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {step === 1 ? 'Cancel' : 'Previous'}
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {step} of {totalSteps}
        </div>

        {step < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
          >
            <Check className="h-4 w-4 mr-2" />
            Create Deal
          </Button>
        )}
      </div>
    </div>
  );
};
