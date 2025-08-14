
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { toast } from 'sonner';

interface CreateOfferFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOfferForm = ({ isOpen, onClose }: CreateOfferFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    target_region: '',
    base_price: 0,
    minimum_joiners: 1,
    deadline: '',
    visibility: 'public' as const,
    kyc_required: false,
    points_required: 0
  });

  const { createOffer, isCreatingOffer } = useSupplierPanel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const offerData = {
      ...formData,
      status: 'draft' as const,
      tiers: []
    };

    createOffer(offerData);
    onClose();
    setFormData({
      title: '',
      description: '',
      category: '',
      target_region: '',
      base_price: 0,
      minimum_joiners: 1,
      deadline: '',
      visibility: 'public' as const,
      kyc_required: false,
      points_required: 0
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Offer Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="base_price">Base Price ($)</Label>
              <Input
                id="base_price"
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="minimum_joiners">Minimum Joiners</Label>
              <Input
                id="minimum_joiners"
                type="number"
                value={formData.minimum_joiners}
                onChange={(e) => setFormData({ ...formData, minimum_joiners: Number(e.target.value) })}
                required
                min={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="target_region">Target Region</Label>
              <Input
                id="target_region"
                value={formData.target_region}
                onChange={(e) => setFormData({ ...formData, target_region: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-6 justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingOffer}>
              {isCreatingOffer ? 'Creating...' : 'Create Offer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferForm;
