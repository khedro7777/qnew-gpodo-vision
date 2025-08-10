
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ isOpen, onClose }) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Processing</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">PayPal Integration</h3>
            <p className="text-muted-foreground mb-4">
              Invoices are now handled through PayPal directly. Please configure your PayPal settings in the Payment Settings tab.
            </p>
            <Button onClick={onClose}>
              Close
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
