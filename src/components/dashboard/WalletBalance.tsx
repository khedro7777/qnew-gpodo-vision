
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Plus, Minus } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { Skeleton } from '@/components/ui/skeleton';

const WalletBalance = () => {
  const { balance, transactions, isLoading } = useWallet();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <CardTitle>رصيد المحفظة</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-productivity-blue" />
            <CardTitle>رصيد المحفظة</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold text-productivity-blue">
            {balance.toFixed(2)} ريال
          </div>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">لا توجد معاملات مالية</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="font-medium mb-2">آخر المعاملات</h4>
            {transactions.slice(0, 3).map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {transaction.type === 'credit' ? (
                    <Plus className="w-4 h-4 text-green-600" />
                  ) : (
                    <Minus className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm">{transaction.description}</span>
                </div>
                <span className={`font-medium ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} ريال
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
