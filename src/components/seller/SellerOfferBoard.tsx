
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  Shield, 
  Download, 
  CreditCard,
  Check,
  Image as ImageIcon,
  FileText,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OfferProps {
  offer: {
    id: string;
    title: string;
    category: string;
    target_region: string;
    base_price: number;
    current_participants: number;
    minimum_joiners: number;
    deadline: string;
    status: string;
    visibility: string;
    kyc_required: boolean;
    points_required: number;
    product_images?: string[];
    pdf_attachments?: string[];
    supplier: {
      id: string;
      name: string;
      logo: string;
      rating: number;
      review_count: number;
      kyc_status: 'approved' | 'pending' | 'rejected';
      verified: boolean;
    };
    discount_tiers: Array<{
      min_members: number;
      discount_percent: number;
      tier_order: number;
    }>;
    payment_options: {
      deposit: boolean;
      installments: boolean;
      full_payment: boolean;
      cod: boolean;
    };
  };
}

const SellerOfferBoard = ({ offer }: OfferProps) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Calculate current discount based on participants
  const currentDiscount = offer.discount_tiers.reduce((discount, tier) => {
    if (offer.current_participants >= tier.min_members) {
      return Math.max(discount, tier.discount_percent);
    }
    return discount;
  }, 0);

  const currentPrice = offer.base_price * (1 - currentDiscount / 100);
  const progress = (offer.current_participants / offer.minimum_joiners) * 100;

  // Generate chart data
  const chartData = offer.discount_tiers.map(tier => ({
    participants: tier.min_members,
    price: offer.base_price * (1 - tier.discount_percent / 100),
    discount: tier.discount_percent
  }));

  const handleJoinOffer = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Handle join offer logic
    console.log('Joining offer:', offer.id);
  };

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{offer.category}</Badge>
            <Badge className="bg-green-100 text-green-800">
              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{offer.target_region}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Ends {new Date(offer.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {offer.product_images && offer.product_images.length > 0 ? (
                      <img 
                        src={offer.product_images[selectedImage]} 
                        alt={offer.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No images available</p>
                      </div>
                    )}
                  </div>
                  
                  {offer.product_images && offer.product_images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {offer.product_images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img 
                            src={image} 
                            alt={`${offer.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Discount Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  Price vs Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="participants" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'price' ? `$${value}` : `${value}%`,
                          name === 'price' ? 'Price' : 'Discount'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        dot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* PDF Downloads */}
            {isLoggedIn && offer.pdf_attachments && offer.pdf_attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents & Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {offer.pdf_attachments.map((pdf, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-red-600" />
                          <span>Document {index + 1}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Purchase Info */}
          <div className="space-y-6">
            {/* Supplier Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-gray-600">
                      {offer.supplier.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{offer.supplier.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{offer.supplier.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({offer.supplier.review_count} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {offer.supplier.verified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Check className="w-3 h-3 mr-1" />
                      Verified Supplier
                    </Badge>
                  )}
                  <Badge className={
                    offer.supplier.kyc_status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }>
                    <Shield className="w-3 h-3 mr-1" />
                    KYC {offer.supplier.kyc_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-green-600">
                        ${currentPrice.toFixed(2)}
                      </span>
                      {currentDiscount > 0 && (
                        <span className="text-xl text-gray-500 line-through">
                          ${offer.base_price}
                        </span>
                      )}
                    </div>
                    {currentDiscount > 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        {currentDiscount}% OFF
                      </Badge>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{offer.current_participants}/{offer.minimum_joiners}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.max(0, offer.minimum_joiners - offer.current_participants)} more needed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{offer.current_participants} joined</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {Math.ceil((new Date(offer.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {offer.payment_options.deposit && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Deposit Payment</span>
                    </div>
                  )}
                  {offer.payment_options.installments && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Installment Plans</span>
                    </div>
                  )}
                  {offer.payment_options.full_payment && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Full Payment</span>
                    </div>
                  )}
                  {offer.payment_options.cod && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Cash on Delivery</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Join Button */}
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
              onClick={handleJoinOffer}
            >
              {isLoggedIn ? 'Join This Offer' : 'Login to Join Offer'}
            </Button>

            {offer.kyc_required && (
              <p className="text-xs text-center text-gray-500">
                <Shield className="w-3 h-3 inline mr-1" />
                KYC verification required to join
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOfferBoard;
