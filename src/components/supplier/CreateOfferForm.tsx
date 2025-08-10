
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { toast } from 'sonner';

interface CreateOfferFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOfferForm: React.FC<CreateOfferFormProps> = ({ isOpen, onClose }) => {
  const { createOffer, isCreatingOffer } = useSupplierPanel();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    target_region: '',
    base_price: '',
    minimum_joiners: '1',
    deadline: '',
    visibility: 'public' as 'public' | 'invite_only',
    kyc_required: false,
    points_required: 0,
    product_images: [] as string[],
    pdf_attachments: [] as string[],
  });

  const [tiers, setTiers] = useState([
    { min_members: 5, discount_percent: 10, tier_order: 1 },
    { min_members: 10, discount_percent: 15, tier_order: 2 },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.base_price || !formData.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate deadline is in future
    if (new Date(formData.deadline) <= new Date()) {
      toast.error('Deadline must be in the future');
      return;
    }

    try {
      createOffer({
        ...formData,
        base_price: parseFloat(formData.base_price),
        minimum_joiners: parseInt(formData.minimum_joiners),
        status: 'draft',
        tiers: tiers.map(tier => ({
          min_members: tier.min_members,
          discount_percent: tier.discount_percent,
          tier_order: tier.tier_order,
        })),
      });

      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        target_region: '',
        base_price: '',
        minimum_joiners: '1',
        deadline: '',
        visibility: 'public',
        kyc_required: false,
        points_required: 0,
        product_images: [],
        pdf_attachments: [],
      });

      setTiers([
        { min_members: 5, discount_percent: 10, tier_order: 1 },
        { min_members: 10, discount_percent: 15, tier_order: 2 },
      ]);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Group Discount Offer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter offer title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your offer..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Electronics, Clothing"
              />
            </div>
            <div>
              <Label htmlFor="target_region">Target Region</Label>
              <Input
                id="target_region"
                value={formData.target_region}
                onChange={(e) => setFormData({ ...formData, target_region: e.target.value })}
                placeholder="e.g., North America, Europe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="base_price">Base Price (USD) *</Label>
              <Input
                id="base_price"
                type="number"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="minimum_joiners">Minimum Joiners *</Label>
              <Input
                id="minimum_joiners"
                type="number"
                value={formData.minimum_joiners}
                onChange={(e) => setFormData({ ...formData, minimum_joiners: e.target.value })}
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={formData.visibility} onValueChange={(value: 'public' | 'invite_only') => setFormData({ ...formData, visibility: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="invite_only">Invite Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="kyc_required"
              checked={formData.kyc_required}
              onCheckedChange={(checked) => setFormData({ ...formData, kyc_required: checked })}
            />
            <Label htmlFor="kyc_required">Require KYC Verification</Label>
          </div>

          <div>
            <Label htmlFor="points_required">Points Required</Label>
            <Input
              id="points_required"
              type="number"
              value={formData.points_required}
              onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div>
            <Label>Discount Tiers</Label>
            <div className="space-y-2">
              {tiers.map((tier, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Min members"
                    value={tier.min_members}
                    onChange={(e) => {
                      const newTiers = [...tiers];
                      newTiers[index].min_members = parseInt(e.target.value) || 0;
                      setTiers(newTiers);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Discount %"
                    value={tier.discount_percent}
                    onChange={(e) => {
                      const newTiers = [...tiers];
                      newTiers[index].discount_percent = parseInt(e.target.value) || 0;
                      setTiers(newTiers);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
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
