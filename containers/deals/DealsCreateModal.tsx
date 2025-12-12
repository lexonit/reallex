import React, { useState } from 'react';
import { Deal, DealStage, CurrentUser } from '../../types';
import { Button } from '../../components/Button';
import { Modal } from '../../components/ui/Modal';
import { useProperties } from '../../hooks/useProperties';

interface DealsCreateModalProps {
  user: CurrentUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deal: Partial<Deal>) => Promise<void> | void;
}

export const DealsCreateModal: React.FC<DealsCreateModalProps> = ({ user, isOpen, onClose, onSubmit }) => {
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({
    name: '',
    value: 0,
    stage: DealStage.QUALIFICATION,
    closeDate: new Date().toISOString().split('T')[0],
    probability: 20,
    propertyId: undefined,
    propertyAddress: '' as any
  });

  const { data: propertiesData } = useProperties(undefined, user?.id);

  const handleSubmit = async () => {
    if (!newDeal.name || !newDeal.value) return;
    await onSubmit(newDeal);
    onClose();
    setNewDeal({
      name: '',
      value: 0,
      stage: DealStage.QUALIFICATION,
      closeDate: new Date().toISOString().split('T')[0],
      probability: 20
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Deal"
      footer={<Button onClick={handleSubmit} className="w-full">Create Opportunity</Button>}
    >
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Deal Name</label>
          <input
            className="w-full p-2.5 rounded-md border bg-background"
            placeholder="e.g. Smith Residence Purchase"
            value={newDeal.name}
            onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Est. Value ($)</label>
            <input
              type="number"
              className="w-full p-2.5 rounded-md border bg-background"
              placeholder="0"
              value={newDeal.value}
              onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Est. Close Date</label>
            <input
              type="date"
              className="w-full p-2.5 rounded-md border bg-background"
              value={newDeal.closeDate}
              onChange={(e) => setNewDeal({ ...newDeal, closeDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Stage</label>
            <select
              className="w-full p-2.5 rounded-md border bg-background"
              value={newDeal.stage}
              onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as DealStage })}
            >
              {Object.values(DealStage).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Probability (%)</label>
            <input
              type="number"
              className="w-full p-2.5 rounded-md border bg-background"
              value={newDeal.probability}
              onChange={(e) => setNewDeal({ ...newDeal, probability: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Property (optional)</label>
          <select
            className="w-full p-2.5 rounded-md border bg-background"
            value={newDeal.propertyId || ''}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selected = (propertiesData as any)?.properties?.find((p: any) => p._id === selectedId);
              setNewDeal({
                ...newDeal,
                propertyId: selectedId || undefined,
                propertyAddress: selected?.address || newDeal.propertyAddress,
              });
            }}
          >
            <option value="">Select from available properties</option>
            {(propertiesData as any)?.properties?.map((p: any) => (
              <option key={p._id} value={p._id}>
                {p.address} {p.price ? `- $${p.price.toLocaleString()}` : ''}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">Pick an existing property or enter one manually below.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Manual Property Address</label>
          <input
            className="w-full p-2.5 rounded-md border bg-background"
            placeholder="123 Main St, City, State"
            value={(newDeal as any).propertyAddress || ''}
            onChange={(e) => setNewDeal({ ...newDeal, propertyAddress: e.target.value, propertyId: undefined })}
          />
          <p className="text-xs text-muted-foreground">If the property is not in the list, type the address here.</p>
        </div>
      </div>
    </Modal>
  );
};
