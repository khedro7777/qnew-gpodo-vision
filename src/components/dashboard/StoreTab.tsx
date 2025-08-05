
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Plus, Package, TrendingUp } from 'lucide-react';

const StoreTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="flex items-center gap-4">
          <Store className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">P2P Store</h2>
            <p className="text-white/80">User-added peer-to-peer products</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">My Products</h3>
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No products listed yet</p>
          </div>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketplace</h3>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Browse available products</p>
          </div>
          <Button variant="outline" className="w-full">
            Explore Marketplace
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default StoreTab;
