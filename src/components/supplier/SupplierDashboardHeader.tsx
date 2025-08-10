
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

interface SupplierDashboardHeaderProps {
  onCreateOffer: () => void;
  onCreateInvoice: () => void;
}

export const SupplierDashboardHeader: React.FC<SupplierDashboardHeaderProps> = ({
  onCreateOffer,
  onCreateInvoice
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
        <p className="text-gray-600">Manage your group discount offers and business operations</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onCreateInvoice} variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
        <Button onClick={onCreateOffer} className="bg-productivity-blue hover:bg-productivity-blue/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Offer
        </Button>
      </div>
    </div>
  );
};
