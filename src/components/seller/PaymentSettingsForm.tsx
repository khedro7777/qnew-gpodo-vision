
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupplierPanel, SupplierPaymentSettings } from '@/hooks/useSupplierPanel';

interface PaymentSettingsFormProps {
  initialData?: SupplierPaymentSettings | null;
}

const PaymentSettingsForm = ({ initialData }: PaymentSettingsFormProps) => {
  const [formData, setFormData] = useState({
    paypal_email: initialData?.paypal_email || '',
    paypal_client_id: initialData?.paypal_client_id || '',
    crypto_wallet_btc: initialData?.crypto_wallet_btc || '',
    crypto_wallet_eth: initialData?.crypto_wallet_eth || '',
    crypto_wallet_usdt: initialData?.crypto_wallet_usdt || ''
  });

  const { updatePaymentSettings, isUpdatingSettings } = useSupplierPanel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PayPal Settings</h3>
            <div>
              <Label htmlFor="paypal_email">PayPal Email</Label>
              <Input
                id="paypal_email"
                type="email"
                value={formData.paypal_email}
                onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
                placeholder="your-paypal@email.com"
              />
            </div>
            <div>
              <Label htmlFor="paypal_client_id">PayPal Client ID</Label>
              <Input
                id="paypal_client_id"
                value={formData.paypal_client_id}
                onChange={(e) => setFormData({ ...formData, paypal_client_id: e.target.value })}
                placeholder="Your PayPal Client ID"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cryptocurrency Wallets</h3>
            <div>
              <Label htmlFor="crypto_wallet_btc">Bitcoin Wallet Address</Label>
              <Input
                id="crypto_wallet_btc"
                value={formData.crypto_wallet_btc}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_btc: e.target.value })}
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              />
            </div>
            <div>
              <Label htmlFor="crypto_wallet_eth">Ethereum Wallet Address</Label>
              <Input
                id="crypto_wallet_eth"
                value={formData.crypto_wallet_eth}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_eth: e.target.value })}
                placeholder="0x742d35Cc6634C0532925a3b8D54B3f8f8ab37Bc3"
              />
            </div>
            <div>
              <Label htmlFor="crypto_wallet_usdt">USDT Wallet Address</Label>
              <Input
                id="crypto_wallet_usdt"
                value={formData.crypto_wallet_usdt}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_usdt: e.target.value })}
                placeholder="TKwkHWk5SzH6vgBcttjhJkSxCfLu5JNvpy"
              />
            </div>
          </div>

          <Button type="submit" disabled={isUpdatingSettings}>
            {isUpdatingSettings ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentSettingsForm;
