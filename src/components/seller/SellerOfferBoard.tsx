
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  Users, 
  Clock, 
  DollarSign, 
  Star, 
  Shield, 
  FileText, 
  CreditCard,
  MapPin,
  TrendingDown,
  Heart,
  Share2,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SellerOfferProps {
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
    product_images: string[];
    pdf_attachments: string[];
    supplier: {
      id: string;
      name: string;
      logo?: string;
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

const SellerOfferBoard: React.FC<SellerOfferProps> = ({ offer }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPdfSpecs, setShowPdfSpecs] = useState(false);

  const progressPercentage = (offer.current_participants / offer.minimum_joiners) * 100;
  
  const getCurrentDiscount = () => {
    let discount = 0;
    offer.discount_tiers.forEach(tier => {
      if (offer.current_participants >= tier.min_members) {
        discount = tier.discount_percent;
      }
    });
    return discount;
  };

  const currentDiscount = getCurrentDiscount();
  const discountedPrice = offer.base_price * (1 - currentDiscount / 100);

  const handleJoinOffer = () => {
    if (!user) {
      toast.error('Please login to join this offer');
      navigate('/auth');
      return;
    }
    
    if (offer.kyc_required && user.kyc_status !== 'approved') {
      toast.error('KYC verification required for this offer');
      navigate('/kyc');
      return;
    }
    
    navigate(`/offer/${offer.id}/join`);
  };

  const handleDownloadPdf = (pdfUrl: string) => {
    if (!user) {
      toast.error('Please login to download specifications');
      navigate('/auth');
      return;
    }
    
    // Download PDF logic
    window.open(pdfUrl, '_blank');
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Offer Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-sm">
                {offer.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{offer.target_region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Expires: {new Date(offer.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Gallery</h3>
            {offer.product_images && offer.product_images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={offer.product_images[currentImageIndex]} 
                    alt={`Product ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {offer.product_images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {offer.product_images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </Card>

          {/* PDF Specifications */}
          {offer.pdf_attachments && offer.pdf_attachments.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications & Documents</h3>
              <div className="space-y-3">
                {offer.pdf_attachments.map((pdf, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="font-medium">Product Specifications {index + 1}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadPdf(pdf)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Discount Curve Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Volume Discount Chart</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {offer.discount_tiers.map((tier, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border-2 text-center ${
                      offer.current_participants >= tier.min_members 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-sm text-gray-600">
                      {tier.min_members}+ members
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {tier.discount_percent}% OFF
                    </div>
                    <div className="text-sm text-gray-900">
                      ${(offer.base_price * (1 - tier.discount_percent / 100)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Current Progress</span>
                  <span className="text-sm text-gray-600">
                    {offer.current_participants} / {offer.minimum_joiners} minimum
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {currentDiscount > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    ${offer.base_price}
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  ${discountedPrice.toFixed(2)}
                </span>
              </div>
              {currentDiscount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {currentDiscount}% OFF
                </Badge>
              )}
            </div>

            {/* Payment Options */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Payment Options</h4>
              <div className="space-y-2">
                {offer.payment_options.full_payment && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Full Payment</span>
                  </div>
                )}
                {offer.payment_options.deposit && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Deposit (30%)</span>
                  </div>
                )}
                {offer.payment_options.installments && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Installments</span>
                  </div>
                )}
                {offer.payment_options.cod && (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Cash on Delivery</span>
                  </div>
                )}
              </div>
            </div>

            <Button 
              className="w-full mb-4" 
              size="lg"
              onClick={handleJoinOffer}
            >
              <Users className="w-4 h-4 mr-2" />
              Join Offer
            </Button>

            <div className="text-xs text-gray-500 text-center">
              {offer.kyc_required && (
                <p className="mb-1">⚠️ KYC verification required</p>
              )}
              {offer.points_required > 0 && (
                <p>🏆 {offer.points_required} points required</p>
              )}
            </div>
          </Card>

          {/* Supplier Profile */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">Supplier Information</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {offer.supplier.logo ? (
                    <img src={offer.supplier.logo} alt="Supplier" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ShoppingCart className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{offer.supplier.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{offer.supplier.rating}</span>
                      <span className="text-xs text-gray-500">({offer.supplier.review_count})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getKycStatusColor(offer.supplier.kyc_status)}>
                  <Shield className="w-3 h-3 mr-1" />
                  KYC {offer.supplier.kyc_status}
                </Badge>
                {offer.supplier.verified && (
                  <Badge className="bg-blue-100 text-blue-800">
                    ✓ Verified
                  </Badge>
                )}
              </div>

              <Button variant="outline" className="w-full" size="sm">
                View Supplier Profile
              </Button>
            </div>
          </Card>

          {/* Offer Stats */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">Offer Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Participants</span>
                <span className="font-medium">{offer.current_participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Minimum Required</span>
                <span className="font-medium">{offer.minimum_joiners}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days Remaining</span>
                <span className="font-medium">
                  {Math.max(0, Math.ceil((new Date(offer.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant="outline" className="text-xs">
                  {offer.status}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerOfferBoard;
