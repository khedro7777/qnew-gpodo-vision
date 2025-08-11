
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/hooks/useWallet';
import { usePayPalPayment } from '@/hooks/usePayPalPayment';
import { BuyPointsButton } from '@/components/wallet/BuyPointsButton';
import { 
  Wallet, 
  CreditCard, 
  Plus,
  Minus,
  TrendingUp,
  DollarSign,
  Bitcoin,
  History,
  Download,
  Upload,
  Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SupplierWalletPanel = () => {
  const { wallet, balance, transactions, isLoading } = useWallet();
  const { createPayment, loading: paypalLoading } = usePayPalPayment();
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Mock points data - in real app this would come from API
  const pointsBalance = 1250;
  const pointsRequired = {
    publishOffer: 100,
    featuredListing: 500,
    premiumSupport: 200,
    marketplaceBoost: 300
  };

  const handlePayPalRecharge = async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      return;
    }
    
    try {
      const result = await createPayment(parseFloat(rechargeAmount));
      if (result.approvalUrl) {
        window.open(result.approvalUrl, '_blank');
      }
    } catch (error) {
      console.error('PayPal recharge failed:', error);
    }
  };

  const cryptoWallets = [
    { symbol: 'BTC', name: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', balance: '0.00234' },
    { symbol: 'ETH', name: 'Ethereum', address: '0x742d35Cc6664C02e6f5B2F22F6f6B72b3c5b5b5b', balance: '0.156' },
    { symbol: 'USDT', name: 'Tether', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', balance: '450.00' }
  ];

  const mockEarnings = [
    { month: 'Jan', amount: 2450 },
    { month: 'Feb', amount: 3200 },
    { month: 'Mar', amount: 2800 },
    { month: 'Apr', amount: 3600 },
    { month: 'May', amount: 4200 },
    { month: 'Jun', amount: 3800 }
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pointsBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Platform points available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,800</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Wallet Tabs */}
      <Tabs defaultValue="recharge" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recharge">Recharge</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="recharge" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Funds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recharge-amount">Amount (USD)</Label>
                  <Input
                    id="recharge-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Payment Methods</h4>
                  
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handlePayPalRecharge}
                    disabled={paypalLoading || !rechargeAmount}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    PayPal
                    <Badge variant="secondary" className="ml-auto">Instant</Badge>
                  </Button>

                  <Button className="w-full justify-start" variant="outline">
                    <Bitcoin className="w-4 h-4 mr-2" />
                    Cryptocurrency
                    <Badge variant="secondary" className="ml-auto">1-3 hours</Badge>
                  </Button>

                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Bank Transfer
                    <Badge variant="secondary" className="ml-auto">1-2 days</Badge>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>• Minimum recharge: $10</p>
                  <p>• PayPal fee: 2.9% + $0.30</p>
                  <p>• Crypto fee: Network fees apply</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Minus className="w-5 h-5" />
                  Withdraw Funds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: ${balance.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Withdrawal Methods</h4>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    PayPal Account
                    <Badge variant="secondary" className="ml-auto">1-2 days</Badge>
                  </Button>

                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Bank Account
                    <Badge variant="secondary" className="ml-auto">3-5 days</Badge>
                  </Button>

                  <Button className="w-full justify-start" variant="outline">
                    <Bitcoin className="w-4 h-4 mr-2" />
                    Crypto Wallet
                    <Badge variant="secondary" className="ml-auto">1 hour</Badge>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>• Minimum withdrawal: $25</p>
                  <p>• Processing fee: $2.50</p>
                  <p>• Daily limit: $5,000</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="points" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Points System</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use points to unlock platform features and boost your offers
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Point Balance</h4>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <Star className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                    <div className="text-3xl font-bold text-blue-600">{pointsBalance.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Available Points</div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <BuyPointsButton 
                      currentPoints={pointsBalance}
                      variant="default"
                      size="default"
                      className="w-full"
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      1 USD = 100 Points
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Point Pricing</h4>
                  <div className="space-y-3">
                    {Object.entries(pointsRequired).map(([feature, points]) => (
                      <div key={feature} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {feature === 'publishOffer' && 'Publish a new group offer'}
                            {feature === 'featuredListing' && 'Feature offer on homepage'}
                            {feature === 'premiumSupport' && 'Priority customer support'}
                            {feature === 'marketplaceBoost' && 'Boost offer visibility'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{points}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cryptocurrency Wallets</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your crypto wallet addresses for payments
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cryptoWallets.map((wallet, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Bitcoin className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium">{wallet.name} ({wallet.symbol})</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {wallet.address.slice(0, 20)}...
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{wallet.balance} {wallet.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        ${(parseFloat(wallet.balance) * 45000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-4">Recent Crypto Transactions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium">Received BTC Payment</div>
                      <div className="text-muted-foreground">Order #12345</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">+0.00156 BTC</div>
                      <div className="text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-medium">USDT Withdrawal</div>
                      <div className="text-muted-foreground">To external wallet</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600">-150.00 USDT</div>
                      <div className="text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' || transaction.type === 'recharge'
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' || transaction.type === 'recharge' ? (
                          <Plus className="w-5 h-5 text-green-600" />
                        ) : (
                          <Minus className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        transaction.type === 'credit' || transaction.type === 'recharge'
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' || transaction.type === 'recharge' ? '+' : '-'}
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <Badge variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
