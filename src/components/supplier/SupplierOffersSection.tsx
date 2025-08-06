
import React from 'react';
import { Button } from '@/components/ui/button';
import { Truck, Filter, Plus, Package } from 'lucide-react';
import SupplierOffer from './SupplierOffer';
import { useNavigate } from 'react-router-dom';

const SupplierOffersSection = () => {
  const navigate = useNavigate();

  const supplierOffers = [
    {
      id: '1',
      title: 'Premium Stainless Steel Kitchen Equipment - Restaurant Grade',
      supplier: {
        name: 'ProKitchen Manufacturing',
        verified: true,
        rating: 4.8,
        reviewCount: 245
      },
      product: {
        name: 'Commercial Kitchen Equipment Set',
        description: 'High-quality stainless steel kitchen equipment perfect for restaurants and commercial kitchens'
      },
      pricing: {
        unitPrice: 2500,
        minOrderQuantity: 5,
        maxOrderQuantity: 100,
        discount: 15,
        currency: 'USD'
      },
      details: {
        currentOrders: 25,
        availableStock: 150,
        moq: 5
      },
      location: {
        country: 'Germany',
        flag: '🇩🇪'
      },
      timing: {
        deliveryTime: '7-14 days',
        validUntil: '2024-04-30',
        createdAt: '2024-01-15'
      },
      status: 'active' as const,
      category: 'Kitchen Equipment',
      features: ['304 Stainless Steel', 'NSF Certified', 'Energy Efficient', 'Easy Maintenance'],
      certifications: ['ISO 9001', 'NSF International', 'CE Mark']
    },
    {
      id: '2',
      title: 'Eco-Friendly Packaging Materials - Biodegradable Solutions',
      supplier: {
        name: 'GreenPack Industries',
        verified: true,
        rating: 4.6,
        reviewCount: 182
      },
      product: {
        name: 'Biodegradable Packaging Set',
        description: 'Sustainable packaging solutions made from renewable materials'
      },
      pricing: {
        unitPrice: 0.85,
        minOrderQuantity: 1000,
        maxOrderQuantity: 50000,
        discount: 25,
        currency: 'USD'
      },
      details: {
        currentOrders: 15000,
        availableStock: 100000,
        moq: 1000
      },
      location: {
        country: 'Netherlands',
        flag: '🇳🇱'
      },
      timing: {
        deliveryTime: '10-21 days',
        validUntil: '2024-05-15',
        createdAt: '2024-01-20'
      },
      status: 'active' as const,
      category: 'Packaging',
      features: ['100% Biodegradable', 'Food Safe', 'Custom Branding', 'Multiple Sizes'],
      certifications: ['FSC Certified', 'BPI Compostable', 'FDA Approved']
    },
    {
      id: '3',
      title: 'High-Performance LED Lighting Systems - Industrial',
      supplier: {
        name: 'BrightTech Solutions',
        verified: false,
        rating: 4.4,
        reviewCount: 98
      },
      product: {
        name: 'Industrial LED Light Fixtures',
        description: 'Energy-efficient LED lighting systems for warehouses and industrial facilities'
      },
      pricing: {
        unitPrice: 450,
        minOrderQuantity: 10,
        maxOrderQuantity: 500,
        discount: 20,
        currency: 'USD'
      },
      details: {
        currentOrders: 45,
        availableStock: 75,
        moq: 10
      },
      location: {
        country: 'South Korea',
        flag: '🇰🇷'
      },
      timing: {
        deliveryTime: '14-28 days',
        validUntil: '2024-04-10',
        createdAt: '2024-02-01'
      },
      status: 'limited_stock' as const,
      category: 'Lighting',
      features: ['80% Energy Savings', 'IP65 Rated', '5 Year Warranty', 'Smart Controls'],
      certifications: ['UL Listed', 'Energy Star', 'RoHS Compliant']
    }
  ];

  const featuredOffer = supplierOffers[0];
  const regularOffers = supplierOffers.slice(1);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Active Supplier Offers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with verified suppliers offering quality products and competitive prices for your business needs
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/supplier/create')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Supplier Offer
            </Button>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter Suppliers
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/supplier')}>
              View All Suppliers
            </Button>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-green-50 rounded-full px-6 py-3 border border-green-200">
              <span className="font-medium text-gray-900">Active Suppliers: </span>
              <span className="font-bold text-green-600">{supplierOffers.filter(o => o.status === 'active').length}</span>
            </div>
            <div className="bg-blue-50 rounded-full px-6 py-3 border border-blue-200">
              <span className="font-medium text-gray-900">Verified Suppliers: </span>
              <span className="font-bold text-blue-600">{supplierOffers.filter(o => o.supplier.verified).length}</span>
            </div>
            <div className="bg-orange-50 rounded-full px-6 py-3 border border-orange-200">
              <span className="font-medium text-gray-900">Avg Rating: </span>
              <span className="font-bold text-orange-600">4.6/5</span>
            </div>
          </div>
        </div>

        {/* Featured Offer */}
        {featuredOffer && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="w-6 h-6 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900">Featured Supplier Offer</h3>
            </div>
            <SupplierOffer offer={featuredOffer} variant="featured" />
          </div>
        )}

        {/* Regular Offers Grid */}
        {regularOffers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Active Supplier Offers</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularOffers.map((offer) => (
                <SupplierOffer key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
            <Package className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Are You a Supplier Looking for Buyers?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Showcase your products and connect with businesses looking for reliable suppliers and quality products
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/supplier/create')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              Register as Supplier
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplierOffersSection;
