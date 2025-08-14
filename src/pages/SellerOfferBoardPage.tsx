
import React from 'react';
import { useParams } from 'react-router-dom';
import SellerOfferBoard from '@/components/seller/SellerOfferBoard';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';

const SellerOfferBoardPage = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const { offers, isLoading } = useSupplierPanel();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offer details...</p>
        </div>
      </div>
    );
  }

  // Find the specific offer or use mock data for demo
  const supplierOffer = offers.find(o => o.id === offerId);
  
  // Transform SupplierOffer to the expected format
  const offer = supplierOffer ? {
    id: supplierOffer.id,
    title: supplierOffer.title,
    category: supplierOffer.category || 'General',
    target_region: supplierOffer.target_region || 'Global',
    base_price: supplierOffer.base_price,
    current_participants: supplierOffer.current_participants,
    minimum_joiners: supplierOffer.minimum_joiners,
    deadline: supplierOffer.deadline,
    status: supplierOffer.status,
    visibility: supplierOffer.visibility,
    kyc_required: supplierOffer.kyc_required,
    points_required: supplierOffer.points_required,
    product_images: supplierOffer.product_images || ['/placeholder.svg'],
    pdf_attachments: supplierOffer.pdf_attachments || [],
    supplier: {
      id: 'sup1',
      name: 'Workspace Solutions Inc.',
      logo: '/placeholder.svg',
      rating: 4.8,
      review_count: 245,
      kyc_status: 'approved' as const,
      verified: true
    },
    discount_tiers: supplierOffer.group_discount_tiers?.map(tier => ({
      min_members: tier.min_members,
      discount_percent: tier.discount_percent || 0,
      tier_order: tier.tier_order
    })) || [
      { min_members: 5, discount_percent: 10, tier_order: 1 },
      { min_members: 10, discount_percent: 15, tier_order: 2 },
      { min_members: 20, discount_percent: 25, tier_order: 3 },
      { min_members: 50, discount_percent: 35, tier_order: 4 }
    ],
    payment_options: {
      deposit: true,
      installments: true,
      full_payment: true,
      cod: false
    }
  } : {
    id: offerId || '1',
    title: 'Premium Office Furniture Bundle - Complete Workspace Solution',
    category: 'Office Equipment',
    target_region: 'North America',
    base_price: 899,
    current_participants: 12,
    minimum_joiners: 5,
    deadline: '2024-03-15T23:59:59Z',
    status: 'active',
    visibility: 'public',
    kyc_required: true,
    points_required: 50,
    product_images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    pdf_attachments: [
      '/specs/furniture-specs.pdf',
      '/agreements/sales-agreement.pdf'
    ],
    supplier: {
      id: 'sup1',
      name: 'Workspace Solutions Inc.',
      logo: '/placeholder.svg',
      rating: 4.8,
      review_count: 245,
      kyc_status: 'approved' as const,
      verified: true
    },
    discount_tiers: [
      { min_members: 5, discount_percent: 10, tier_order: 1 },
      { min_members: 10, discount_percent: 15, tier_order: 2 },
      { min_members: 20, discount_percent: 25, tier_order: 3 },
      { min_members: 50, discount_percent: 35, tier_order: 4 }
    ],
    payment_options: {
      deposit: true,
      installments: true,
      full_payment: true,
      cod: false
    }
  };

  return <SellerOfferBoard offer={offer} />;
};

export default SellerOfferBoardPage;
