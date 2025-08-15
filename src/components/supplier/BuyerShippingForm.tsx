
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Truck, CreditCard } from 'lucide-react';
import { usePayPalPayment } from '@/hooks/usePayPalPayment';

const shippingFormSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  address_line_1: z.string().min(5, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip_code: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

type ShippingFormData = z.infer<typeof shippingFormSchema>;

interface BuyerShippingFormProps {
  offerId: string;
  offerPrice: number;
  sellerTerms: {
    payment_terms?: string;
    shipping_terms?: string;
    delivery_time?: string;
  };
  onSubmit: (data: ShippingFormData) => void;
}

export const BuyerShippingForm = ({ 
  offerId, 
  offerPrice, 
  sellerTerms, 
  onSubmit 
}: BuyerShippingFormProps) => {
  const { createPayment, loading: paymentLoading } = usePayPalPayment();
  
  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      full_name: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      phone: '',
    },
  });

  const handleFormSubmit = async (data: ShippingFormData) => {
    try {
      // Save shipping information first
      onSubmit(data);
      
      // Then proceed to payment
      const paymentResponse = await createPayment(offerPrice);
      
      if (paymentResponse.success && paymentResponse.approvalUrl) {
        // Open PayPal checkout in new tab
        window.open(paymentResponse.approvalUrl, '_blank');
        toast.success('Shipping information saved. Complete payment in the new tab.');
      } else {
        toast.error('Payment creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to process your request. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Seller Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Seller Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Payment Terms</h4>
            <p className="text-sm text-muted-foreground">
              {sellerTerms.payment_terms || 'Standard payment terms apply. Payment required upon order confirmation.'}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Shipping Terms</h4>
            <p className="text-sm text-muted-foreground">
              {sellerTerms.shipping_terms || 'Standard shipping terms apply. Items will be shipped within 3-5 business days.'}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Delivery Time</h4>
            <p className="text-sm text-muted-foreground">
              {sellerTerms.delivery_time || '7-14 business days depending on location'}
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">${offerPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address, P.O. box" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, unit, building" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="State or Province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP/Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP or Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SA">Saudi Arabia</SelectItem>
                          <SelectItem value="AE">United Arab Emirates</SelectItem>
                          <SelectItem value="KW">Kuwait</SelectItem>
                          <SelectItem value="BH">Bahrain</SelectItem>
                          <SelectItem value="QA">Qatar</SelectItem>
                          <SelectItem value="OM">Oman</SelectItem>
                          <SelectItem value="JO">Jordan</SelectItem>
                          <SelectItem value="LB">Lebanon</SelectItem>
                          <SelectItem value="EG">Egypt</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+966 50 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Save & Proceed to Payment (${offerPrice.toFixed(2)})
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
