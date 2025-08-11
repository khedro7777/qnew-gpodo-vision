
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { Upload, X, Plus, Minus, FileText, Image, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CreateOfferWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOfferWorkflow: React.FC<CreateOfferWorkflowProps> = ({ isOpen, onClose }) => {
  const { createOffer, isCreatingOffer } = useSupplierPanel();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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

  const [discountTiers, setDiscountTiers] = useState([
    { min_members: 5, discount_percent: 10, tier_order: 1 },
    { min_members: 10, discount_percent: 15, tier_order: 2 },
    { min_members: 20, discount_percent: 25, tier_order: 3 },
  ]);

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedPDFs, setUploadedPDFs] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setUploadedImages(prev => [...prev, ...imageFiles]);
  };

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    setUploadedPDFs(prev => [...prev, ...pdfFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removePDF = (index: number) => {
    setUploadedPDFs(prev => prev.filter((_, i) => i !== index));
  };

  const addDiscountTier = () => {
    const lastTier = discountTiers[discountTiers.length - 1];
    setDiscountTiers(prev => [...prev, {
      min_members: lastTier.min_members + 10,
      discount_percent: lastTier.discount_percent + 5,
      tier_order: prev.length + 1
    }]);
  };

  const removeDiscountTier = (index: number) => {
    if (discountTiers.length > 1) {
      setDiscountTiers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateDiscountTier = (index: number, field: string, value: number) => {
    setDiscountTiers(prev => prev.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    ));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.base_price || !formData.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

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
        tiers: discountTiers.map(tier => ({
          min_members: tier.min_members,
          discount_percent: tier.discount_percent,
          tier_order: tier.tier_order,
        })),
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
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
    setDiscountTiers([
      { min_members: 5, discount_percent: 10, tier_order: 1 },
      { min_members: 10, discount_percent: 15, tier_order: 2 },
      { min_members: 20, discount_percent: 25, tier_order: 3 },
    ]);
    setUploadedImages([]);
    setUploadedPDFs([]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your offer..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="business">Business Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Strategy</h3>
            
            <div className="grid grid-cols-2 gap-4">
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
              <div className="flex justify-between items-center mb-4">
                <Label>Discount Tiers</Label>
                <Button onClick={addDiscountTier} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tier
                </Button>
              </div>
              <div className="space-y-3">
                {discountTiers.map((tier, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label className="text-sm">Min Members</Label>
                          <Input
                            type="number"
                            value={tier.min_members}
                            onChange={(e) => updateDiscountTier(index, 'min_members', parseInt(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm">Discount %</Label>
                          <Input
                            type="number"
                            value={tier.discount_percent}
                            onChange={(e) => updateDiscountTier(index, 'discount_percent', parseInt(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        {discountTiers.length > 1 && (
                          <Button
                            onClick={() => removeDiscountTier(index)}
                            size="sm"
                            variant="outline"
                            className="mt-6"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media & Documents</h3>
            
            <div>
              <Label>Product Images (JPG/PNG)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="text-center">
                    <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                  </div>
                </Label>
              </div>
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-xs mt-1 truncate">{file.name}</p>
                      <Button
                        onClick={() => removeImage(index)}
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>PDF Specifications & Sales Agreement</Label>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handlePDFUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <Label
                  htmlFor="pdf-upload"
                  className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="text-center">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Upload PDF documents</p>
                  </div>
                </Label>
              </div>
              {uploadedPDFs.length > 0 && (
                <div className="space-y-2 mt-4">
                  {uploadedPDFs.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        onClick={() => removePDF(index)}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings & Publishing</h3>
            
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
                  <SelectItem value="public">Public - Anyone can see and join</SelectItem>
                  <SelectItem value="invite_only">Invite Only - Restricted access</SelectItem>
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
              <Label htmlFor="points_required">Points Required to Join</Label>
              <Input
                id="points_required"
                type="number"
                value={formData.points_required}
                onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) || 0 })}
                min="0"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Set points required for buyers to join this offer (0 = free to join)
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Offer Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Title:</span>
                  <span className="text-sm font-medium">{formData.title || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Base Price:</span>
                  <span className="text-sm font-medium">${formData.base_price || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Discount Tiers:</span>
                  <span className="text-sm font-medium">{discountTiers.length} configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Images:</span>
                  <span className="text-sm font-medium">{uploadedImages.length} uploaded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">PDFs:</span>
                  <span className="text-sm font-medium">{uploadedPDFs.length} uploaded</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
          <div className="flex items-center gap-4 mt-4">
            <Progress value={(currentStep / totalSteps) * 100} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {renderStepContent()}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isCreatingOffer}>
                <DollarSign className="w-4 h-4 mr-2" />
                {isCreatingOffer ? 'Creating...' : 'Create Offer'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
