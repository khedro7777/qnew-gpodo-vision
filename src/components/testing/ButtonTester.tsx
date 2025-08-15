
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Loader2,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  Save,
  Search,
  Filter,
  Settings,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Zap,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';

const ButtonTester = () => {
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const [isRunning, setIsRunning] = useState(false);

  const buttonTests = [
    // Basic buttons
    { id: 'primary', label: 'Primary Button', variant: 'default' as const, icon: Play },
    { id: 'secondary', label: 'Secondary Button', variant: 'secondary' as const, icon: Pause },
    { id: 'outline', label: 'Outline Button', variant: 'outline' as const, icon: Square },
    { id: 'ghost', label: 'Ghost Button', variant: 'ghost' as const, icon: Eye },
    { id: 'destructive', label: 'Destructive Button', variant: 'destructive' as const, icon: Trash2 },
    
    // Sizes
    { id: 'sm', label: 'Small Button', variant: 'default' as const, size: 'sm' as const, icon: Plus },
    { id: 'lg', label: 'Large Button', variant: 'default' as const, size: 'lg' as const, icon: Settings },
    
    // With different icons
    { id: 'save', label: 'Save', variant: 'default' as const, icon: Save },
    { id: 'download', label: 'Download', variant: 'outline' as const, icon: Download },
    { id: 'upload', label: 'Upload', variant: 'secondary' as const, icon: Upload },
    { id: 'edit', label: 'Edit', variant: 'ghost' as const, icon: Edit },
    { id: 'search', label: 'Search', variant: 'outline' as const, icon: Search },
    { id: 'filter', label: 'Filter', variant: 'secondary' as const, icon: Filter },
    
    // Navigation buttons
    { id: 'home', label: 'Home', variant: 'ghost' as const, icon: Home },
    { id: 'profile', label: 'Profile', variant: 'ghost' as const, icon: User },
    { id: 'contact', label: 'Contact', variant: 'outline' as const, icon: Mail },
    
    // Status buttons
    { id: 'lock', label: 'Lock', variant: 'destructive' as const, icon: Lock },
    { id: 'unlock', label: 'Unlock', variant: 'default' as const, icon: Unlock },
    { id: 'online', label: 'Online', variant: 'default' as const, icon: Wifi },
    { id: 'offline', label: 'Offline', variant: 'secondary' as const, icon: WifiOff },
    
    // Interactive buttons
    { id: 'like', label: 'Like', variant: 'ghost' as const, icon: Heart },
    { id: 'star', label: 'Star', variant: 'outline' as const, icon: Star },
    { id: 'shield', label: 'Shield', variant: 'default' as const, icon: Shield },
    { id: 'zap', label: 'Zap', variant: 'secondary' as const, icon: Zap }
  ];

  const testButton = async (buttonId: string, buttonLabel: string) => {
    setTestResults(prev => ({ ...prev, [buttonId]: 'pending' }));
    
    try {
      // Simulate button click test
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Random success/failure for demo
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        setTestResults(prev => ({ ...prev, [buttonId]: 'success' }));
        toast.success(`${buttonLabel} test passed`);
      } else {
        throw new Error('Button test failed');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [buttonId]: 'error' }));
      toast.error(`${buttonLabel} test failed`);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const button of buttonTests) {
      await testButton(button.id, button.label);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between tests
    }
    
    setIsRunning(false);
    toast.success('All button tests completed!');
  };

  const resetTests = () => {
    setTestResults({});
    toast.info('Test results reset');
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Passed</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  const stats = {
    total: buttonTests.length,
    tested: Object.keys(testResults).length,
    passed: Object.values(testResults).filter(r => r === 'success').length,
    failed: Object.values(testResults).filter(r => r === 'error').length,
    pending: Object.values(testResults).filter(r => r === 'pending').length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Button Component Tester</CardTitle>
            <div className="flex gap-2">
              <Button onClick={runAllTests} disabled={isRunning}>
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
              <Button variant="outline" onClick={resetTests}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Buttons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.total - stats.tested}</div>
              <div className="text-sm text-muted-foreground">Not Tested</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttonTests.map((buttonTest) => {
          const IconComponent = buttonTest.icon;
          const status = testResults[buttonTest.id];
          
          return (
            <Card key={buttonTest.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{buttonTest.label}</h4>
                  {getStatusIcon(status)}
                </div>
                
                <Button
                  variant={buttonTest.variant}
                  size={buttonTest.size}
                  onClick={() => testButton(buttonTest.id, buttonTest.label)}
                  disabled={status === 'pending'}
                  className="w-full"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {buttonTest.label}
                </Button>
                
                <div className="flex justify-between items-center">
                  {getStatusBadge(status)}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => testButton(buttonTest.id, buttonTest.label)}
                    disabled={status === 'pending'}
                  >
                    Test
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonTester;
