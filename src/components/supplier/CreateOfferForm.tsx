import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';

interface CreateOfferFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOfferForm: React.FC<CreateOfferFormProps> = ({ isOpen, onClose }) => {
  const { createOffer, isCreatingOffer } = useSupplierPanel();
  const { balance, spendFromWallet } = useWallet();
  
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
    points_required: 10,
    sales_agreement_template: '',
    product_images: [] as string[],
    pdf_attachments: [] as string[],
  });

  const [tiers, setTiers] = useState([
    { min_members: 5, discount_percent: 5, tier_order: 1 },
    { min_members: 10, discount_percent: 10, tier_order: 2 },
    { min_members: 20, discount_percent: 15, tier_order: 3 },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.base_price || !formData.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if user has sufficient balance
    if (balance < formData.points_required) {
      toast.error(`Insufficient balance. You need ${formData.points_required} points to publish this offer.`);
      return;
    }

    // Validate deadline is in future
    if (new Date(formData.deadline) <= new Date()) {
      toast.error('Deadline must be in the future');
      return;
    }

    try {
      // First spend the points
      spendFromWallet({
        amount: formData.points_required,
        description: `Publishing offer: ${formData.title}`
      });

      // Create the offer - removing current_participants as it's auto-generated
      createOffer({
        ...formData,
        base_price: parseFloat(formData.base_price),
        minimum_joiners: parseInt(formData.minimum_joiners),
        status: 'active',
        supplier_id: '', // Will be set by RLS
        tiers: tiers.map(tier => ({
          ...tier,
          discount_percent: tier.discount_percent || null,
          fixed_price: null,
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
        points_required: 10,
        sales_agreement_template: '',
        product_images: [],
        pdf_attachments: [],
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const addTier = () => {
    setTiers([...tiers, {
      min_members: Math.max(...tiers.map(t => t.min_members)) + 5,
      discount_percent: Math.max(...tiers.map(t => t.discount_percent || 0)) + 5,
      tier_order: tiers.length + 1,
    }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: string, value: number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Offer Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter offer title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="health">Health & Beauty</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="base_price">Base Price ($) *</Label>
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
                    min="1"
                    value={formData.minimum_joiners}
                    onChange={(e) => setFormData({ ...formData, minimum_joiners: e.target.value })}
                    required
                  />
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
              </div>

              <div>
                <Label htmlFor="target_region">Target Region</Label>
                <Input
                  id="target_region"
                  value={formData.target_region}
                  onChange={(e) => setFormData({ ...formData, target_region: e.target.value })}
                  placeholder="e.g., North America, Europe, Global"
                />
              </div>
            </CardContent>
          </Card>

          {/* Discount Tiers */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Discount Tiers</CardTitle>
                <Button type="button" onClick={addTier} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tiers.map((tier, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Min Members</Label>
                      <Input
                        type="number"
                        value={tier.min_members}
                        onChange={(e) => updateTier(index, 'min_members', parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Discount %</Label>
                      <Input
                        type="number"
                        value={tier.discount_percent}
                        onChange={(e) => updateTier(index, 'discount_percent', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={() => removeTier(index)} 
                      size="sm" 
                      variant="outline"
                      disabled={tiers.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Visibility</Label>
                  <p className="text-sm text-gray-600">Who can see this offer</p>
                </div>
                <Select value={formData.visibility} onValueChange={(value: 'public' | 'invite_only') => setFormData({ ...formData, visibility: value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="invite_only">Invite Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>KYC Required</Label>
                  <p className="text-sm text-gray-600">Require KYC verification to join</p>
                </div>
                <Switch
                  checked={formData.kyc_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, kyc_required: checked })}
                />
              </div>

              <div>
                <Label htmlFor="points_required">Points Required to Publish</Label>
                <Input
                  id="points_required"
                  type="number"
                  value={formData.points_required}
                  onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) })}
                  min="0"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Current balance: {balance} points
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingOffer || balance < formData.points_required}>
              {isCreatingOffer ? 'Creating...' : 'Create Offer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
