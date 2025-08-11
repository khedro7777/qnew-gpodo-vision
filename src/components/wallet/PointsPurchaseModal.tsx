
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, CreditCard, Wallet, Plus, Zap } from 'lucide-react';
import { usePayPalPayment } from '@/hooks/usePayPalPayment';
import { toast } from 'sonner';

interface PointsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoints?: number;
}

export const PointsPurchaseModal: React.FC<PointsPurchaseModalProps> = ({ 
  isOpen, 
  onClose, 
  currentPoints = 0 
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [customAmount, setCustomAmount] = useState('');
  const { createPayment, loading } = usePayPalPayment();

  const pointPackages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      points: 1000,
      price: 10,
      popular: false,
      description: 'Perfect for new sellers',
      features: ['Publish 10 offers', 'Basic support', '30-day validity']
    },
    {
      id: 'professional',
      name: 'Professional Pack',
      points: 5000,
      price: 45,
      popular: true,
      description: 'Most popular choice',
      features: ['Publish 50 offers', 'Priority support', '90-day validity', 'Featured listings']
    },
    {
      id: 'business',
      name: 'Business Pack',
      points: 12000,
      price: 100,
      popular: false,
      description: 'For growing businesses',
      features: ['Unlimited offers', 'Premium support', '180-day validity', 'Analytics dashboard']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack',
      points: 25000,
      price: 200,
      popular: false,
      description: 'Maximum value',
      features: ['Unlimited everything', 'Dedicated manager', '365-day validity', 'Custom features']
    }
  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setCustomAmount('');
  };

  const handlePurchase = async () => {
    let amount = 0;
    let points = 0;

    if (selectedPackage) {
      const pkg = pointPackages.find(p => p.id === selectedPackage);
      if (pkg) {
        amount = pkg.price;
        points = pkg.points;
      }
    } else if (customAmount) {
      amount = parseFloat(customAmount);
      points = Math.round(amount * 100); // 1 USD = 100 points
    }

    if (amount <= 0) {
      toast.error('Please select a package or enter a valid amount');
      return;
    }

    try {
      const result = await createPayment(amount, 'USD');
      if (result.success && result.approvalUrl) {
        // Store purchase info for completion
        localStorage.setItem('pendingPointsPurchase', JSON.stringify({
          amount,
          points,
          timestamp: Date.now()
        }));
        
        // Redirect to PayPal
        window.location.href = result.approvalUrl;
      } else {
        toast.error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    }
  };

  const getPointsForAmount = (amount: number) => {
    return Math.round(amount * 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Buy Platform Points
          </DialogTitle>
          <DialogDescription>
            Purchase points to unlock platform features and publish offers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Current Balance</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {currentPoints.toLocaleString()} points
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose a Package</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pointPackages.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`cursor-pointer transition-all ${
                    selectedPackage === pkg.id 
                      ? 'ring-2 ring-blue-500 border-blue-500' 
                      : 'hover:border-gray-300'
                  } ${pkg.popular ? 'relative' : ''}`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600">
                        {pkg.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">points</div>
                      <div className="text-xl font-semibold mt-2">
                        ${pkg.price}
                      </div>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Or Enter Custom Amount</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="custom-amount">Amount (USD)</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedPackage('');
                      }}
                      min="1"
                      step="0.01"
                    />
                  </div>
                  {customAmount && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">You'll receive</div>
                      <div className="text-xl font-bold text-blue-600">
                        {getPointsForAmount(parseFloat(customAmount) || 0).toLocaleString()} points
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Exchange rate: 1 USD = 100 points
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Button */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={loading || (!selectedPackage && !customAmount)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <CreditCard className="w-4 h-4 mr-2 animate-pulse" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase with PayPal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
