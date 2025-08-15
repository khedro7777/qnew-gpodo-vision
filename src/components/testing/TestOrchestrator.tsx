
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RotateCcw,
  Download,
  Activity
} from 'lucide-react';
import { DashboardTests } from './tests/DashboardTests';
import { SupplierTests } from './tests/SupplierTests';
import { GroupRoomTests } from './tests/GroupRoomTests';
import { WalletTests } from './tests/WalletTests';
import { AuthTests } from './tests/AuthTests';
import { UIComponentTests } from './tests/UIComponentTests';
import { IntegrationTests } from './tests/IntegrationTests';

export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
  details?: any;
  timestamp: string;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: 'idle' | 'running' | 'completed';
  progress: number;
}

const TestOrchestrator = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [globalStatus, setGlobalStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);

  useEffect(() => {
    initializeTestSuites();
  }, []);

  const initializeTestSuites = () => {
    const suites: TestSuite[] = [
      {
        id: 'dashboard',
        name: 'Dashboard Tests',
        description: 'Tests for client dashboard functionality',
        tests: [],
        status: 'idle',
        progress: 0
      },
      {
        id: 'supplier',
        name: 'Supplier Tests',
        description: 'Tests for supplier dashboard and offers',
        tests: [],
        status: 'idle',
        progress: 0
      },
      {
        id: 'group-room',
        name: 'Group Room Tests',
        description: 'Tests for group room functionality',
        tests: [],
        status: 'idle',
        progress: 0
      },
      {
        id: 'wallet',
        name: 'Wallet Tests',
        description: 'Tests for wallet and payment functionality',
        tests: [],
        status: 'idle',
        progress: 0
      },
      {
        id: 'auth',
        name: 'Authentication Tests',
        description: 'Tests for login, signup, and auth flows',
        tests: [],
        status: 'idle',
        progress: 0
      },
      {
        id: 'ui-components',
        name: 'UI Component Tests',
        description: 'Tests for individual UI components',
        tests: [],
        status: 'idle',
        progress: 0
      },
      {
        id: 'integration',
        name: 'Integration Tests',
        description: 'End-to-end integration tests',
        tests: [],
        status: 'idle',
        progress: 0
      }
    ];
    setTestSuites(suites);
  };

  const runAllTests = async () => {
    setGlobalStatus('running');
    
    for (const suite of testSuites) {
      await runTestSuite(suite.id);
    }
    
    setGlobalStatus('completed');
  };

  const runTestSuite = async (suiteId: string) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? { ...suite, status: 'running', progress: 0 }
        : suite
    ));

    let testComponent;
    switch (suiteId) {
      case 'dashboard':
        testComponent = DashboardTests;
        break;
      case 'supplier':
        testComponent = SupplierTests;
        break;
      case 'group-room':
        testComponent = GroupRoomTests;
        break;
      case 'wallet':
        testComponent = WalletTests;
        break;
      case 'auth':
        testComponent = AuthTests;
        break;
      case 'ui-components':
        testComponent = UIComponentTests;
        break;
      case 'integration':
        testComponent = IntegrationTests;
        break;
      default:
        return;
    }

    try {
      const results = await testComponent.run();
      
      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId 
          ? { 
              ...suite, 
              tests: results, 
              status: 'completed',
              progress: 100
            }
          : suite
      ));
    } catch (error) {
      console.error(`Test suite ${suiteId} failed:`, error);
      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId 
          ? { 
              ...suite, 
              status: 'completed',
              progress: 100
            }
          : suite
      ));
    }
  };

  const getTotalStats = () => {
    const allTests = testSuites.flatMap(suite => suite.tests);
    return {
      total: allTests.length,
      passed: allTests.filter(t => t.status === 'passed').length,
      failed: allTests.filter(t => t.status === 'failed').length,
      pending: allTests.filter(t => t.status === 'pending').length,
      running: allTests.filter(t => t.status === 'running').length
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Live Testing System
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Comprehensive testing for all application functionality
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={runAllTests}
                disabled={globalStatus === 'running'}
                className="bg-green-600 hover:bg-green-700"
              >
                {globalStatus === 'running' ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={initializeTestSuites}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
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
              <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>

          {/* Global Progress */}
          {globalStatus === 'running' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round((stats.passed + stats.failed) / Math.max(stats.total, 1) * 100)}%</span>
              </div>
              <Progress value={(stats.passed + stats.failed) / Math.max(stats.total, 1) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Suites */}
      <Tabs defaultValue="suites" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suites">Test Suites</TabsTrigger>
          <TabsTrigger value="results">Detailed Results</TabsTrigger>
        </TabsList>

        <TabsContent value="suites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testSuites.map((suite) => (
              <Card key={suite.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{suite.name}</CardTitle>
                    <Badge variant={
                      suite.status === 'completed' ? 'default' :
                      suite.status === 'running' ? 'secondary' : 'outline'
                    }>
                      {suite.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{suite.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suite.status === 'running' && (
                      <Progress value={suite.progress} />
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {suite.tests.filter(t => t.status === 'passed').length}
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-600" />
                          {suite.tests.filter(t => t.status === 'failed').length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-600" />
                          {suite.tests.filter(t => t.status === 'pending').length}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => runTestSuite(suite.id)}
                        disabled={suite.status === 'running'}
                      >
                        Run
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {testSuites.map((suite) => (
            <Card key={suite.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {suite.name}
                  <Badge variant={
                    suite.tests.every(t => t.status === 'passed') ? 'default' :
                    suite.tests.some(t => t.status === 'failed') ? 'destructive' : 'secondary'
                  }>
                    {suite.tests.length > 0 ? 
                      `${suite.tests.filter(t => t.status === 'passed').length}/${suite.tests.length}` :
                      'No tests run'
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suite.tests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No tests have been run yet</p>
                  ) : (
                    suite.tests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {test.status === 'passed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {test.status === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                          {test.status === 'running' && <Clock className="w-5 h-5 text-blue-600 animate-spin" />}
                          {test.status === 'pending' && <Clock className="w-5 h-5 text-gray-600" />}
                          {test.status === 'skipped' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                          
                          <div>
                            <div className="font-medium">{test.name}</div>
                            {test.error && (
                              <div className="text-sm text-red-600 mt-1">{test.error}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {test.duration && `${test.duration}ms`}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestOrchestrator;
