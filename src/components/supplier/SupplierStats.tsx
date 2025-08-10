
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, TrendingUp, Users, FileText } from 'lucide-react';
import { SupplierOffer, Invoice } from '@/hooks/useSupplierPanel';

interface SupplierStatsProps {
  offers: SupplierOffer[];
  invoices: Invoice[];
}

export const SupplierStats: React.FC<SupplierStatsProps> = ({ offers, invoices }) => {
  const stats = {
    totalOffers: offers?.length || 0,
    activeOffers: offers?.filter(offer => offer.status === 'active').length || 0,
    totalParticipants: offers?.reduce((sum, offer) => sum + (offer.current_participants || 0), 0) || 0,
    pendingInvoices: invoices?.filter(invoice => invoice.status === 'pending').length || 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
            </div>
            <Package className="w-8 h-8 text-productivity-blue" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Offers</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeOffers}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalParticipants}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingInvoices}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
