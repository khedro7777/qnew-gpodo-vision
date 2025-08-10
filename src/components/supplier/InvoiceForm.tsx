
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { toast } from 'sonner';

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ isOpen, onClose }) => {
  const { createInvoice, isCreatingInvoice } = useSupplierPanel();
  
  const [formData, setFormData] = useState({
    buyer_id: '',
    offer_id: '',
    description: '',
    amount: '',
    currency: 'USD',
    payment_method: 'PayPal' as 'PayPal' | 'BTC' | 'ETH' | 'USDT',
    due_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyer_id || !formData.description || !formData.amount || !formData.due_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate due date is in future
    if (new Date(formData.due_date) <= new Date()) {
      toast.error('Due date must be in the future');
      return;
    }

    try {
      createInvoice({
        ...formData,
        amount: parseFloat(formData.amount),
        offer_id: formData.offer_id || undefined,
        status: 'pending',
        supplier_id: '', // Will be set by the hook
      });

      onClose();
      
      // Reset form
      setFormData({
        buyer_id: '',
        offer_id: '',
        description: '',
        amount: '',
        currency: 'USD',
        payment_method: 'PayPal',
        due_date: '',
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="buyer_id">Buyer ID *</Label>
            <Input
              id="buyer_id"
              value={formData.buyer_id}
              onChange={(e) => setFormData({ ...formData, buyer_id: e.target.value })}
              placeholder="Enter buyer user ID"
              required
            />
          </div>

          <div>
            <Label htmlFor="offer_id">Related Offer ID (Optional)</Label>
            <Input
              id="offer_id"
              value={formData.offer_id}
              onChange={(e) => setFormData({ ...formData, offer_id: e.target.value })}
              placeholder="Enter offer ID if applicable"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the invoice..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={(value: 'PayPal' | 'BTC' | 'ETH' | 'USDT') => setFormData({ ...formData, payment_method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="BTC">Bitcoin</SelectItem>
                  <SelectItem value="ETH">Ethereum</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingInvoice}>
              {isCreatingInvoice ? 'Creating...' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
