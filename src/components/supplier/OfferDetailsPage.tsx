
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupplierOffer } from '@/hooks/useSupplierPanel';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingDown,
  MapPin,
  Star,
  Shield,
  Download,
  Eye,
  UserPlus,
  Share2,
  CreditCard,
  Truck,
  FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OfferDetailsPageProps {
  offer: SupplierOffer;
  onBack: () => void;
}

export const OfferDetailsPage: React.FC<OfferDetailsPageProps> = ({ offer, onBack }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const progressPercentage = (offer.current_participants / offer.minimum_joiners) * 100;
  const daysLeft = Math.ceil((new Date(offer.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Generate discount curve data
  const discountCurveData = offer.group_discount_tiers?.map(tier => ({
    participants: tier.min_members,
    discount: tier.discount_percent || 0,
    price: offer.base_price * (1 - (tier.discount_percent || 0) / 100)
  })) || [];

  const mockImages = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  const paymentOptions = [
    { type: 'Full Payment', description: 'Pay complete amount upfront', discount: '5% additional discount' },
    { type: 'Installments', description: '3-6 month payment plan', discount: 'No additional fees' },
    { type: 'Deposit', description: '30% deposit, rest on delivery', discount: 'Standard pricing' },
    { type: 'COD', description: 'Cash on delivery', discount: 'Additional 2% fee' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Offers
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{offer.title}</h1>
          <p className="text-muted-foreground">{offer.description}</p>
        </div>
        <Badge variant={
          offer.status === 'active' ? 'default' :
          offer.status === 'completed' ? 'secondary' :
          offer.status === 'expired' ? 'destructive' : 'outline'
        }>
          {offer.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    src={mockImages[selectedImageIndex]} 
                    alt="Product"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {mockImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                        selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="discount-curve">Discount Curve</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="payment">Payment Options</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span>{offer.category || 'General'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target Region:</span>
                          <span>{offer.target_region || 'Global'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Price:</span>
                          <span className="font-medium">${offer.base_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min. Joiners:</span>
                          <span>{offer.minimum_joiners}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">KYC Required:</span>
                          <span>{offer.kyc_required ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Points Required:</span>
                          <span>{offer.points_required || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visibility:</span>
                          <span className="capitalize">{offer.visibility.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discount-curve">
              <Card>
                <CardHeader>
                  <CardTitle>Discount Progression</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Price decreases as more participants join
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={discountCurveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="participants" 
                          label={{ value: 'Participants', position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis 
                          label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'price' ? `$${value}` : `${value}%`,
                            name === 'price' ? 'Price' : 'Discount'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {offer.group_discount_tiers?.map((tier, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {tier.min_members}+ people
                        </div>
                        <div className="text-2xl font-bold">
                          {tier.discount_percent}% off
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${(offer.base_price * (1 - (tier.discount_percent || 0) / 100)).toFixed(2)} per unit
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Specifications</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Download detailed specifications and sales agreements
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-muted-foreground mb-4">
                      Documents will be available after login/subscription
                    </p>
                    <Button variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Login to Access Documents
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium">Product Specifications</div>
                        <div className="text-sm text-muted-foreground">Detailed technical specs</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="w-8 h-8 text-green-500" />
                      <div className="flex-1">
                        <div className="font-medium">Sales Agreement</div>
                        <div className="text-sm text-muted-foreground">Terms and conditions</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Options</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose the payment method that works best for you
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <CreditCard className="w-8 h-8 text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium">{option.type}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                        <div className="text-sm text-green-600 font-medium">{option.discount}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Current Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">${offer.base_price}</div>
                <div className="text-sm text-muted-foreground">Base price per unit</div>
              </div>
              
              {offer.group_discount_tiers && offer.group_discount_tiers[0] && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    ${(offer.base_price * (1 - (offer.group_discount_tiers[0].discount_percent || 0) / 100)).toFixed(2)}
                  </div>
                  <div className="text-sm text-green-600">
                    Next tier price ({offer.group_discount_tiers[0].min_members} people)
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participation Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{offer.current_participants} joined</span>
                  <span>{offer.minimum_joiners} minimum</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{offer.target_region || 'Global'}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                <UserPlus className="w-4 h-4 mr-2" />
                Join This Offer
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Watch
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">S</span>
                </div>
                <div>
                  <div className="font-medium">Sample Supplier</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (127 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">KYC Verified</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time:</span>
                  <span>Within 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Time:</span>
                  <span>7-14 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span>98.5%</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View Supplier Profile
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery:</span>
                <span>7-14 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Cost:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insurance:</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking:</span>
                <span>Available</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
