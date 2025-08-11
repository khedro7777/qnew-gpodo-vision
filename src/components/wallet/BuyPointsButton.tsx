
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Plus } from 'lucide-react';
import { PointsPurchaseModal } from './PointsPurchaseModal';

interface BuyPointsButtonProps {
  currentPoints?: number;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const BuyPointsButton: React.FC<BuyPointsButtonProps> = ({
  currentPoints = 0,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${className} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white`}
        onClick={() => setShowModal(true)}
      >
        <Star className="w-4 h-4 mr-2" />
        Buy Points
        <Plus className="w-3 h-3 ml-1" />
      </Button>

      <PointsPurchaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentPoints={currentPoints}
      />
    </>
  );
};
