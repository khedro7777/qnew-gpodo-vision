
import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-productivity-blue to-productivity-purple rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gpodo</h1>
              <p className="text-sm text-gray-600">Focus & Productivity</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-productivity-green/10 px-3 py-2 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-productivity-green" />
            <span className="text-sm font-medium text-productivity-green">Ready to Focus</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
