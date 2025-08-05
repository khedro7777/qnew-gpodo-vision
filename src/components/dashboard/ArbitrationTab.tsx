
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const ArbitrationTab = () => {
  const disputes = [
    {
      id: '1',
      title: 'Delivery Delay Dispute',
      group: 'Tech Supplies Group',
      status: 'in_progress',
      created: '2025-08-01',
      amount: '$5,000',
      description: 'Supplier failed to deliver within agreed timeframe'
    },
    {
      id: '2',
      title: 'Quality Issue Resolution',
      group: 'Manufacturing Group',
      status: 'resolved',
      created: '2025-07-15',
      amount: '$12,000',
      description: 'Products did not meet specified quality standards'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Scale className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Arbitration Center</h2>
            <p className="text-white/80">Manage disputes and legal matters</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Disputes</h3>
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{dispute.title}</h4>
                  <Badge className={`${
                    dispute.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    dispute.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  } border-0`}>
                    {dispute.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{dispute.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{dispute.group}</span>
                  <span>{dispute.amount}</span>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4">
            <FileText className="w-4 h-4 mr-2" />
            File New Dispute
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Arbitration Services</h3>
          <div className="grid gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Scale className="w-6 h-6 mb-1" />
              Mediation Services
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="w-6 h-6 mb-1" />
              Legal Documentation
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <AlertCircle className="w-6 h-6 mb-1" />
              Risk Assessment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ArbitrationTab;
