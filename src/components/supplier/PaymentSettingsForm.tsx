
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CreditCard, Bitcoin, DollarSign, Save, Eye, EyeOff } from 'lucide-react';
import { useSupplierPanel, SupplierPaymentSettings } from '@/hooks/useSupplierPanel';
import { supabase } from '@/integrations/supabase/client';

interface PaymentSettingsFormProps {
  paymentSettings: SupplierPaymentSettings | null;
}

export const PaymentSettingsForm: React.FC<PaymentSettingsFormProps> = ({ paymentSettings }) => {
  const { updatePaymentSettings, isUpdatingSettings } = useSupplierPanel();
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    paypal_email: '',
    paypal_client_id: '',
    crypto_wallet_btc: '',
    crypto_wallet_eth: '',
    crypto_wallet_usdt: '',
  });

  const [showSecrets, setShowSecrets] = useState(false);

  // Get current user profile
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profile);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (paymentSettings) {
      setFormData({
        paypal_email: paymentSettings.paypal_email || '',
        paypal_client_id: paymentSettings.paypal_client_id || '',
        crypto_wallet_btc: paymentSettings.crypto_wallet_btc || '',
        crypto_wallet_eth: paymentSettings.crypto_wallet_eth || '',
        crypto_wallet_usdt: paymentSettings.crypto_wallet_usdt || '',
      });
    }
  }, [paymentSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(formData);
  };

  const handleIPFSClick = () => {
    // Open IPFS referral link - this would be configurable by admin
    window.open('https://app.pinata.cloud?ref=gpodo', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* DID/IPFS Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Decentralized Identity (DID) & IPFS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
            <div>
              <h4 className="font-medium">Get Your DID Identifier</h4>
              <p className="text-sm text-gray-600">
                Connect to Web3 and get your decentralized identity for enhanced trust and verification
              </p>
            </div>
            <Button onClick={handleIPFSClick} className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open IPFS Account
            </Button>
          </div>

          {profile?.did_identifier && (
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
                <span className="font-medium">DID Connected</span>
              </div>
              <p className="text-sm font-mono bg-white p-2 rounded border">
                {profile.did_identifier}
              </p>
            </div>
          )}

          {!profile?.did_identifier && (
            <div className="p-4 border rounded-lg bg-yellow-50">
              <p className="text-sm text-yellow-800">
                No DID identifier found. Click "Open IPFS Account" to get started with decentralized identity.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PayPal Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              PayPal Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paypal_email">PayPal Email</Label>
              <Input
                id="paypal_email"
                type="email"
                value={formData.paypal_email}
                onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
                placeholder="your-paypal@email.com"
              />
              <p className="text-sm text-gray-600 mt-1">
                Email address associated with your PayPal account
              </p>
            </div>

            <div>
              <Label htmlFor="paypal_client_id">PayPal Client ID (Optional)</Label>
              <div className="relative">
                <Input
                  id="paypal_client_id"
                  type={showSecrets ? "text" : "password"}
                  value={formData.paypal_client_id}
                  onChange={(e) => setFormData({ ...formData, paypal_client_id: e.target.value })}
                  placeholder="Your PayPal Client ID"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                For direct PayPal API integration (advanced users only)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cryptocurrency Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bitcoin className="w-5 h-5 text-orange-500" />
              Cryptocurrency Wallets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="crypto_wallet_btc">Bitcoin (BTC) Address</Label>
              <Input
                id="crypto_wallet_btc"
                value={formData.crypto_wallet_btc}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_btc: e.target.value })}
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                className="font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="crypto_wallet_eth">Ethereum (ETH) Address</Label>
              <Input
                id="crypto_wallet_eth"
                value={formData.crypto_wallet_eth}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_eth: e.target.value })}
                placeholder="0x742d35Cc6635C0532925a3b8D91aBB2cD96aDe13"
                className="font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="crypto_wallet_usdt">USDT Address</Label>
              <Input
                id="crypto_wallet_usdt"
                value={formData.crypto_wallet_usdt}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_usdt: e.target.value })}
                placeholder="TYASr4bfgNaZoagFWfYJh1bEPa6bEKbmL5"
                className="font-mono text-sm"
              />
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Security Notice:</strong> Only enter wallet addresses you control. 
                Never share private keys or seed phrases. These addresses will be used for receiving payments.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdatingSettings} className="bg-productivity-blue hover:bg-productivity-blue/90">
            <Save className="w-4 h-4 mr-2" />
            {isUpdatingSettings ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
