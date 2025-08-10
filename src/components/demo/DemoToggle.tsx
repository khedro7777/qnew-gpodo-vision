
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDemo } from '@/contexts/DemoContext';
import { Eye, EyeOff } from 'lucide-react';

export const DemoToggle = () => {
  const { isDemoMode, toggleDemoMode } = useDemo();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {isDemoMode && (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
          Demo Mode
        </Badge>
      )}
      <Button
        onClick={toggleDemoMode}
        variant={isDemoMode ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-2"
      >
        {isDemoMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {isDemoMode ? 'Exit Demo' : 'Demo Mode'}
      </Button>
    </div>
  );
};
