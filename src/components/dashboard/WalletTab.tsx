
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, History, Plus } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { usePayPalPayment } from '@/hooks/usePayPalPayment';
import PayPalRechargeButton from '@/components/wallet/PayPalRechargeButton';

const WalletTab = () => {
  const { balance, transactions, isLoading } = useWallet();
  const { loading, captureOrder } = usePayPalPayment();

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Wallet Balance
          </CardTitle>
          <CardDescription>
            Your current wallet balance and quick actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-productivity-blue">
                {isLoading ? '...' : `${balance?.toLocaleString() || 0} points`}
              </div>
              <p className="text-gray-600 mt-1">Available Balance</p>
            </div>
            
            <div className="flex gap-3">
              <PayPalRechargeButton onSuccess={() => window.location.reload()} />
              <Button variant="outline" className="flex-1">
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions?.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'recharge' ? 'bg-green-500' : 
                    transaction.type === 'payment' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium capitalize">{transaction.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'recharge' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'recharge' ? '+' : '-'}{transaction.amount} pts
                  </p>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletTab;
