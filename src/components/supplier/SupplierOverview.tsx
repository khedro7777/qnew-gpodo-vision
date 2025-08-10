
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Settings } from 'lucide-react';
import { SupplierOffer, Invoice, Complaint } from '@/hooks/useSupplierPanel';

interface SupplierOverviewProps {
  offers: SupplierOffer[];
  invoices: Invoice[];
  complaints: Complaint[];
  onCreateOffer: () => void;
  onCreateInvoice: () => void;
  onGoToSettings: () => void;
}

export const SupplierOverview: React.FC<SupplierOverviewProps> = ({
  offers,
  invoices,
  complaints,
  onCreateOffer,
  onCreateInvoice,
  onGoToSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Your Supplier Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                onClick={onCreateOffer} 
                className="w-full justify-start bg-productivity-blue hover:bg-productivity-blue/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Offer
              </Button>
              <Button 
                onClick={onCreateInvoice} 
                variant="outline" 
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
              <Button 
                onClick={onGoToSettings} 
                variant="outline" 
                className="w-full justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Payment Settings
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Dashboard loaded successfully</p>
              <p>• {offers?.length || 0} offers currently managed</p>
              <p>• {invoices?.length || 0} invoices in system</p>
              <p>• {complaints?.length || 0} complaints to review</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
