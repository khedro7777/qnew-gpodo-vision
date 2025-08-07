import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign, Calendar, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import LanguageSelector from '@/components/LanguageSelector';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GPO</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">GPO SMART</h1>
              <p className="text-xs text-gray-600">Smart B2B Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Date & Time */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="hidden xl:inline">{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-2">
              <LanguageSelector />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="hidden xl:inline">US</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>🇺🇸 United States</DropdownMenuItem>
                  <DropdownMenuItem>🇬🇧 United Kingdom</DropdownMenuItem>
                  <DropdownMenuItem>🇨🇦 Canada</DropdownMenuItem>
                  <DropdownMenuItem>🇦🇺 Australia</DropdownMenuItem>
                  <DropdownMenuItem>🇩🇪 Germany</DropdownMenuItem>
                  <DropdownMenuItem>🇸🇦 Saudi Arabia</DropdownMenuItem>
                  <DropdownMenuItem>🇦🇪 United Arab Emirates</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="hidden xl:inline">USD</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>USD - US Dollar</DropdownMenuItem>
                  <DropdownMenuItem>EUR - Euro</DropdownMenuItem>
                  <DropdownMenuItem>GBP - British Pound</DropdownMenuItem>
                  <DropdownMenuItem>CAD - Canadian Dollar</DropdownMenuItem>
                  <DropdownMenuItem>SAR - Saudi Riyal</DropdownMenuItem>
                  <DropdownMenuItem>AED - UAE Dirham</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Links */}
            <nav className="hidden xl:flex items-center gap-4 text-sm">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#founders-message" className="text-gray-600 hover:text-gray-900 transition-colors">Founder's Message</a>
              <a href="#support" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                        <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.full_name && (
                          <p className="font-medium">{profile.full_name}</p>
                        )}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {profile?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation('/client-dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
                    Login
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAuthModal(true)}>
                    Create Account
                  </Button>
                </>
              )}
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
                <a href="#founders-message" className="text-sm text-gray-600 hover:text-gray-900">Founder's Message</a>
                <a href="#support" className="text-sm text-gray-600 hover:text-gray-900">Support</a>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">Settings</span>
                <div className="flex gap-2">
                  <LanguageSelector />
                  <Button variant="ghost" size="sm" className="gap-1 flex-1">
                    <MapPin className="w-4 h-4" />
                    US
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 flex-1">
                    <DollarSign className="w-4 h-4" />
                    USD
                  </Button>
                </div>
              </div>
              
              {user && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">Account</span>
                  <Button variant="ghost" size="sm" onClick={() => handleNavigation('/client-dashboard')} className="justify-start">
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleNavigation('/profile')} className="justify-start">
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleNavigation('/settings')} className="justify-start">
                    Settings
                  </Button>
                </div>
              )}
              
              {!user && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
                    Login
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAuthModal(true)}>
                    Create Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
};

export default Header;
