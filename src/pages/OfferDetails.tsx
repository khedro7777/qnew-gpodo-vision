
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, TrendingDown, MapPin, Building2, Calendar, Share2, UserPlus, MessageCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OfferDetails = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const [isJoining, setIsJoining] = useState(false);

  // Mock data - in real application, this would be fetched from API
  const offer = {
    id: offerId,
    title: 'HP EliteDesk Desktop Computers - Group Offer',
    description: 'Get HP EliteDesk 800 G9 high-performance desktop computers with exclusive discounts when reaching the required number. The computers are new with 3-year warranty and free maintenance service for the first year.',
    supplier: {
      name: 'Advanced Technology Company',
      logo: '/placeholder.svg',
      verified: true,
      rating: 4.8,
      completedOffers: 156
    },
    product: {
      name: 'HP EliteDesk 800 G9',
      description: 'Intel Core i7 processor, 16GB RAM, 512GB SSD storage, Windows 11 Pro operating system',
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      specifications: [
        'Intel Core i7-12700 processor (12th generation)',
        '16GB DDR4 RAM',
        '512GB SSD hard drive',
        'Original Windows 11 Pro operating system',
        'Intel UHD Graphics 770',
        'USB 3.0 and USB-C ports',
        '3-year manufacturer warranty'
      ]
    },
    pricing: {
      basePrice: 800,
      currentDiscount: 15,
      maxDiscount: 35,
      currency: 'USD',
      discountTiers: [
        { members: 10, discount: 10 },
        { members: 25, discount: 20 },
        { members: 40, discount: 30 },
        { members: 50, discount: 35 }
      ]
    },
    groupDetails: {
      currentMembers: 12,
      targetMembers: 50,
      minMembers: 10,
      membersList: [
        { name: 'Ahmed Mohammed', joinedAt: '2024-01-10', avatar: '/placeholder.svg' },
        { name: 'Fatima Ali', joinedAt: '2024-01-11', avatar: '/placeholder.svg' },
        { name: 'Mohammed Saad', joinedAt: '2024-01-12', avatar: '/placeholder.svg' }
      ]
    },
    location: {
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      city: 'Riyadh'
    },
    timing: {
      deadline: '2024-02-15',
      createdAt: '2024-01-10T00:00:00Z',
      estimatedDelivery: '7-10 business days'
    },
    status: 'active' as const,
    category: 'Technology',
    terms: [
      'Pay 50% upfront upon offer confirmation',
      'Remainder upon delivery',
      'Full refund guarantee if minimum threshold not reached',
      'Delivery within 7-10 business days from order confirmation',
      'Free delivery service within major cities'
    ]
  };

  const discountProgress = (offer.groupDetails.currentMembers / offer.groupDetails.targetMembers) * 100;
  const daysLeft = Math.ceil((new Date(offer.timing.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const currentPrice = offer.pricing.basePrice * (1 - (offer.pricing.currentDiscount / 100));

  const handleJoinOffer = async () => {
    setIsJoining(true);
    // Simulate API call
    setTimeout(() => {
      setIsJoining(false);
      // Show success message or redirect
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Offer Header */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                        {offer.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">{offer.supplier.name}</span>
                          {offer.supplier.verified && (
                            <Badge className="bg-green-100 text-green-800 border-0">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <span>{offer.location.flag} {offer.location.country}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0 capitalize">
                      Active
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {offer.description}
                  </p>
                </CardContent>
              </Card>

              {/* Tabs Content */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Product Details</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing & Discounts</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {offer.product.specifications.map((spec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-gray-700">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pricing" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Discount Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {offer.pricing.discountTiers.map((tier, index) => (
                          <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                            offer.groupDetails.currentMembers >= tier.members 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-gray-500" />
                              <span className="font-medium">{tier.members} members or more</span>
                            </div>
                            <Badge className={
                              offer.groupDetails.currentMembers >= tier.members 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 text-gray-700'
                            }>
                              {tier.discount}% discount
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="members" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Offer Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {offer.groupDetails.membersList.map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                              {member.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500">
                                Joined on {new Date(member.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="terms" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Terms & Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {offer.terms.map((term, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            <span className="text-gray-700">{term}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pricing Card */}
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-center">Current Price</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      ${currentPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      Original Price: ${offer.pricing.basePrice}
                    </p>
                    <Badge className="bg-green-100 text-green-800 border-0 mt-2">
                      Save ${(offer.pricing.basePrice - currentPrice).toFixed(2)}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {offer.groupDetails.currentMembers} / {offer.groupDetails.targetMembers}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(discountProgress)}%
                      </span>
                    </div>
                    <Progress value={discountProgress} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Minimum: {offer.groupDetails.minMembers}</span>
                      <span>{daysLeft} days left</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={handleJoinOffer}
                      disabled={isJoining}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      size="lg"
                    >
                      {isJoining ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Joining...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-5 h-5" />
                          Join Offer Now
                        </div>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Delivery Time:</span>
                      <span className="font-medium">{offer.timing.estimatedDelivery}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Supplier Rating:</span>
                      <span className="font-medium">⭐ {offer.supplier.rating}/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Card */}
              <Card>
                <CardContent className="p-4">
                  <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Flag className="w-4 h-4 mr-2" />
                    Report Offer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OfferDetails;
