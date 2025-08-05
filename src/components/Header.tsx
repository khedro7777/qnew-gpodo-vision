
import React, { useState, useEffect } from 'react';
import { Clock, Globe, MapPin, DollarSign, Calendar, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-productivity-blue to-productivity-purple rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GPODO</h1>
              <p className="text-xs text-gray-600">Smart B2B Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Date & Time */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Globe className="w-4 h-4" />
                    EN
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
                  <DropdownMenuItem>🇸🇦 العربية</DropdownMenuItem>
                  <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
                  <DropdownMenuItem>🇨🇳 中文</DropdownMenuItem>
                  <DropdownMenuItem>🇪🇸 Español</DropdownMenuItem>
                  <DropdownMenuItem>🇮🇳 हिन्दी</DropdownMenuItem>
                  <DropdownMenuItem>🇯🇵 日本語</DropdownMenuItem>
                  <DropdownMenuItem>🇰🇷 한국어</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MapPin className="w-4 h-4" />
                    US
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>🇺🇸 United States</DropdownMenuItem>
                  <DropdownMenuItem>🇬🇧 United Kingdom</DropdownMenuItem>
                  <DropdownMenuItem>🇨🇦 Canada</DropdownMenuItem>
                  <DropdownMenuItem>🇦🇺 Australia</DropdownMenuItem>
                  <DropdownMenuItem>🇩🇪 Germany</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <DollarSign className="w-4 h-4" />
                    USD
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>USD - US Dollar</DropdownMenuItem>
                  <DropdownMenuItem>EUR - Euro</DropdownMenuItem>
                  <DropdownMenuItem>GBP - British Pound</DropdownMenuItem>
                  <DropdownMenuItem>CAD - Canadian Dollar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Links */}
            <nav className="flex items-center gap-4 text-sm">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#support" className="text-gray-600 hover:text-gray-900 transition-colors">Help & Support</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">Login</Button>
              <Button size="sm" className="bg-productivity-blue hover:bg-productivity-blue/90">
                Create Account
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">Quick Links</span>
                <a href="#about" className="text-sm text-gray-600 hover:text-gray-900">About Us</a>
                <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How It Works</a>
                <a href="#support" className="text-sm text-gray-600 hover:text-gray-900">Help & Support</a>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Login</Button>
                <Button size="sm" className="bg-productivity-blue hover:bg-productivity-blue/90">
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
