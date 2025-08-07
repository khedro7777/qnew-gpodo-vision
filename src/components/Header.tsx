import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign, Calendar, User, Menu, X, LogOut, Settings, Download } from 'lucide-react';
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

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
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo - LinkedIn style */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">GPO</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">GPO SMART</h1>
              <p className="text-xs text-gray-500 -mt-1">Professional B2B Network</p>
            </div>
          </div>

          {/* Desktop Navigation - LinkedIn style */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Primary Navigation */}
            <nav className="flex items-center gap-6">
              <a href="#" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-xs mt-1">Home</span>
              </a>
              <a href="#" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-xs mt-1">My Network</span>
              </a>
              <a href="#" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-xs mt-1">Jobs</span>
              </a>
              <a href="#" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
                <span className="text-xs mt-1">Messaging</span>
              </a>
              <a href="#" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Calendar className="w-5 h-5" />
                <span className="text-xs mt-1">Notifications</span>
              </a>
            </nav>

            {/* Date & Time */}
            <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="hidden xl:inline">{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Settings & Language */}
            <div className="flex items-center gap-2">
              <LanguageSelector />
              
              {/* Install App Button */}
              {showInstallPrompt && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleInstallApp}
                  className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden xl:inline">Install App</span>
                </Button>
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {getInitials(profile?.full_name)}
                        </AvatarFallback>
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAuthModal(true)}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Join now
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6" 
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign in
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
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">Navigation</span>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 py-2">Home</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 py-2">My Network</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 py-2">Jobs</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 py-2">Messaging</a>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">Settings</span>
                <div className="flex gap-2">
                  <LanguageSelector />
                  {showInstallPrompt && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleInstallApp}
                      className="gap-1 text-blue-600"
                    >
                      <Download className="w-4 h-4" />
                      Install App
                    </Button>
                  )}
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
                    Join now
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAuthModal(true)}>
                    Sign in
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
