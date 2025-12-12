import React from 'react';
import { Deal, DealStage } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import {
  X, DollarSign, Calendar, Users, FileText, CheckCircle2,
  AlertCircle, Clock, TrendingUp, Home, MapPin, Building2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface DealDetailViewProps {
  deal: Deal;
  onClose: () => void;
  onEdit?: () => void;
}

export const DealDetailView: React.FC<DealDetailViewProps> = ({ deal, onClose, onEdit }) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStageColor = (stage: DealStage) => {
    switch (stage) {
      case DealStage.QUALIFICATION:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case DealStage.PROPOSAL:
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case DealStage.NEGOTIATION:
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case DealStage.UNDER_CONTRACT:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
      case DealStage.CLOSED_WON:
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case DealStage.CLOSED_LOST:
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-background rounded-xl shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{deal.name}</h2>
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold',
                getStageColor(deal.stage)
              )}>
                {deal.stage}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                {deal.dealType}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Close: {formatDate(deal.closeDate)}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {deal.probability}% probability
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Deal Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(deal.value)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="text-2xl font-bold">{formatCurrency(deal.commissionAmount)}</p>
                    {deal.commissionRate && (
                      <p className="text-xs text-muted-foreground">{deal.commissionRate}%</p>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Down Payment</p>
                    <p className="text-2xl font-bold">{formatCurrency(deal.downPayment)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Earnest Money</p>
                    <p className="text-2xl font-bold">{formatCurrency(deal.earnestMoney)}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property & Pricing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Home className="h-5 w-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {deal.propertyAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{deal.propertyAddress}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium">List Price</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(deal.listPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Offer Price</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(deal.offerPrice)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5" />
                  Financing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm text-muted-foreground">{deal.financingType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Loan Amount</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(deal.loanAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Interest Rate</p>
                    <p className="text-sm text-muted-foreground">
                      {deal.interestRate ? `${deal.interestRate}%` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Closing Costs</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(deal.closingCosts)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Parties Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" />
                Parties Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deal.clientName && (
                  <div>
                    <p className="text-sm font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">{deal.clientName}</p>
                  </div>
                )}
                {deal.buyerAgent && (
                  <div>
                    <p className="text-sm font-medium">Buyer Agent</p>
                    <p className="text-sm text-muted-foreground">{deal.buyerAgent}</p>
                  </div>
                )}
                {deal.sellerAgent && (
                  <div>
                    <p className="text-sm font-medium">Seller Agent</p>
                    <p className="text-sm text-muted-foreground">{deal.sellerAgent}</p>
                  </div>
                )}
                {deal.titleCompany && (
                  <div>
                    <p className="text-sm font-medium">Title Company</p>
                    <p className="text-sm text-muted-foreground">{deal.titleCompany}</p>
                  </div>
                )}
                {deal.lender && (
                  <div>
                    <p className="text-sm font-medium">Lender</p>
                    <p className="text-sm text-muted-foreground">{deal.lender}</p>
                  </div>
                )}
                {deal.attorney && (
                  <div>
                    <p className="text-sm font-medium">Attorney</p>
                    <p className="text-sm text-muted-foreground">{deal.attorney}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Important Dates Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Offer Date', date: deal.offerDate },
                  { label: 'Acceptance Date', date: deal.acceptanceDate },
                  { label: 'Inspection Date', date: deal.inspectionDate },
                  { label: 'Appraisal Date', date: deal.appraisalDate },
                  { label: 'Closing Date', date: deal.closingDate },
                  { label: 'Possession Date', date: deal.possessionDate },
                ].filter(item => item.date).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                    </div>
                  </div>
                ))}
                {![deal.offerDate, deal.acceptanceDate, deal.inspectionDate, deal.appraisalDate, deal.closingDate, deal.possessionDate].some(d => d) && (
                  <p className="text-sm text-muted-foreground text-center py-4">No dates recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contingencies */}
          {deal.contingencies && deal.contingencies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5" />
                  Contingencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deal.contingencies.map((cont, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      {cont.status === 'SATISFIED' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : cont.status === 'FAILED' ? (
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{cont.type.replace('_', ' ')}</p>
                          <span className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            cont.status === 'SATISFIED' && 'bg-green-500/10 text-green-600',
                            cont.status === 'PENDING' && 'bg-orange-500/10 text-orange-600',
                            cont.status === 'WAIVED' && 'bg-blue-500/10 text-blue-600',
                            cont.status === 'FAILED' && 'bg-red-500/10 text-red-600'
                          )}>
                            {cont.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Due: {formatDate(cont.dueDate)}</p>
                        {cont.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{cont.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Milestones */}
          {deal.milestones && deal.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deal.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        milestone.status === 'COMPLETED' && 'bg-green-500',
                        milestone.status === 'PENDING' && 'bg-blue-500',
                        milestone.status === 'OVERDUE' && 'bg-red-500'
                      )}>
                        {milestone.status === 'COMPLETED' && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{milestone.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(milestone.dueDate)}
                          </span>
                        </div>
                        {milestone.completedDate && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Completed: {formatDate(milestone.completedDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {deal.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{deal.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {deal.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
