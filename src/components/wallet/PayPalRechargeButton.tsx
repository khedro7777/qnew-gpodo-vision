
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Loader2 } from 'lucide-react';
import { usePayPalPayment } from '@/hooks/usePayPalPayment';
import { toast } from 'sonner';

const PayPalRechargeButton = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const { createOrder, loading } = usePayPalPayment();

  const predefinedAmounts = [
    { points: 100, usd: 10 },
    { points: 500, usd: 45 },
    { points: 1000, usd: 85 },
    { points: 2000, usd: 160 },
  ];

  const handleQuickAmount = (usdAmount: number) => {
    setAmount(usdAmount.toString());
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const orderID = await createOrder(parseFloat(amount));
      
      if (orderID) {
        // In a real implementation, you would redirect to PayPal
        toast.success('Payment order created successfully!');
        if (onSuccess) {
          onSuccess();
        }
        setIsOpen(false);
      } else {
        toast.error('Failed to create payment order');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <CreditCard className="w-4 h-4 mr-2" />
          PayPal Recharge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recharge Wallet with PayPal</DialogTitle>
          <DialogDescription>
            Add funds to your wallet using PayPal secure payment
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {predefinedAmounts.map((preset) => (
              <Button
                key={preset.points}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(preset.usd)}
                className="text-sm"
              >
                ${preset.usd} → {preset.points} pts
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-24">
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
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="text-blue-800">
              <strong>Exchange Rate:</strong> 1 {currency} = ~10 points
            </p>
            <p className="text-blue-600 mt-1">
              You'll receive approximately <strong>{Math.round(parseFloat(amount || '0') * 10)} points</strong>
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading || !amount}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay with PayPal
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayPalRechargeButton;
