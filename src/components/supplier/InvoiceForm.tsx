
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Send } from 'lucide-react';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { toast } from 'sonner';

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  buyerId?: string;
  offerId?: string;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ isOpen, onClose, buyerId, offerId }) => {
  const { createInvoice, isCreatingInvoice } = useSupplierPanel();
  
  const [formData, setFormData] = useState({
    buyer_id: buyerId || '',
    offer_id: offerId || '',
    description: '',
    amount: '',
    currency: 'USD',
    payment_method: '' as 'PayPal' | 'BTC' | 'ETH' | 'USDT' | '',
    due_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyer_id || !formData.description || !formData.amount || !formData.due_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.due_date) <= new Date()) {
      toast.error('Due date must be in the future');
      return;
    }

    try {
      await createInvoice({
        ...formData,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method || undefined,
      });
      
      onClose();
      
      // Reset form
      setFormData({
        buyer_id: '',
        offer_id: '',
        description: '',
        amount: '',
        currency: 'USD',
        payment_method: '',
        due_date: '',
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create Invoice
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyer_id">Buyer ID *</Label>
                  <Input
                    id="buyer_id"
                    value={formData.buyer_id}
                    onChange={(e) => setFormData({ ...formData, buyer_id: e.target.value })}
                    placeholder="Enter buyer user ID"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    The user ID of the buyer
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="offer_id">Related Offer (Optional)</Label>
                  <Input
                    id="offer_id"
                    value={formData.offer_id}
                    onChange={(e) => setFormData({ ...formData, offer_id: e.target.value })}
                    placeholder="Enter offer ID if applicable"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the products/services being invoiced..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="SAR">SAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="due_date">Due Date *</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_method">Preferred Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(value: any) => setFormData({ ...formData, payment_method: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingInvoice}>
              <Send className="w-4 h-4 mr-2" />
              {isCreatingInvoice ? 'Creating...' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
