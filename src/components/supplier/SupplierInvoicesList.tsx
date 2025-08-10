
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus } from 'lucide-react';
import { Invoice } from '@/hooks/useSupplierPanel';

interface SupplierInvoicesListProps {
  invoices: Invoice[];
  onCreateInvoice: () => void;
}

export const SupplierInvoicesList: React.FC<SupplierInvoicesListProps> = ({ invoices, onCreateInvoice }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
      </CardHeader>
      <CardContent>
        {!invoices || invoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-600 mb-4">Create invoices for your customers</p>
            <Button onClick={onCreateInvoice} className="bg-productivity-blue hover:bg-productivity-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{invoice.invoice_number}</h3>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                    {invoice.status}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{invoice.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Amount: ${invoice.amount}</span>
                  <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
