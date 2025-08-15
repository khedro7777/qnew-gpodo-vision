
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
  };

  // Don't show anything if already installed
  if (isInstalled) return null;

  // Install button for header/navbar
  const InstallButton = () => (
    <Button 
      onClick={handleInstallClick}
      disabled={!deferredPrompt}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );

  // Install banner for mobile/desktop
  const InstallBanner = () => (
    <Card className="fixed bottom-4 left-4 right-4 z-50 md:max-w-md md:left-auto md:right-4 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Smartphone className="w-5 h-5 text-primary md:hidden" />
              <Monitor className="w-5 h-5 text-primary hidden md:block" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Install GroupBuy</h4>
              <p className="text-xs text-muted-foreground">
                Get the full app experience
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissBanner}
            className="p-1 h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={handleInstallClick}
            size="sm" 
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={dismissBanner}
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Show install button in appropriate contexts */}
      {deferredPrompt && <InstallButton />}
      
      {/* Show install banner if conditions are met */}
      {showInstallBanner && <InstallBanner />}
    </>
  );
};

// Hook for other components to use
export const usePWAInstall = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    setIsInstalled(isStandalone || isIOSStandalone);

    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return { canInstall, isInstalled };
};
