import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TestTube, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings,
  FileText,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  log: string;
}

const MCPTestSetup = () => {
  const { user } = useAuth();
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testScript, setTestScript] = useState('');
  const [tests, setTests] = useState<TestResult[]>([]);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  useEffect(() => {
    // Load existing tests from local storage or database
    const storedTests = localStorage.getItem('mcpTests');
    if (storedTests) {
      setTests(JSON.parse(storedTests));
    }
  }, []);

  useEffect(() => {
    // Save tests to local storage whenever tests state changes
    localStorage.setItem('mcpTests', JSON.stringify(tests));
  }, [tests]);

  const handleCreateTest = () => {
    if (!testName || !testDescription || !testScript) {
      toast.error('Please fill in all fields');
      return;
    }

    const newTest: TestResult = {
      id: Date.now().toString(),
      name: testName,
      status: 'pending',
      progress: 0,
      log: '',
    };

    setTests([...tests, newTest]);
    setTestName('');
    setTestDescription('');
    setTestScript('');
    toast.success('Test created successfully!');
  };

  const handleRunTest = (testId: string) => {
    setRunningTestId(testId);
    const testIndex = tests.findIndex(test => test.id === testId);
    if (testIndex === -1) return;

    const updatedTests = [...tests];
    updatedTests[testIndex] = { ...updatedTests[testIndex], status: 'running', progress: 0, log: '' };
    setTests(updatedTests);

    // Simulate test execution
    const interval = setInterval(() => {
      setTests(prevTests => {
        const currentTestIndex = prevTests.findIndex(test => test.id === testId);
        if (currentTestIndex === -1) {
          clearInterval(interval);
          return prevTests;
        }

        const currentTest = prevTests[currentTestIndex];
        if (currentTest.status === 'completed' || currentTest.status === 'failed') {
          clearInterval(interval);
          return prevTests;
        }

        const newProgress = Math.min(currentTest.progress + 10, 100);
        const newLog = currentTest.log + `\nProgress: ${newProgress}% - Step completed`;
        const updatedTest = { ...currentTest, progress: newProgress, log: newLog };
        const updatedTestsList = [...prevTests];
        updatedTestsList[currentTestIndex] = updatedTest;

        if (newProgress === 100) {
          clearInterval(interval);
          setRunningTestId(null);
          toast.success(`Test "${currentTest.name}" completed successfully!`);
          return updatedTestsList.map(test =>
            test.id === testId ? { ...test, status: 'completed' } : test
          );
        }

        return updatedTestsList;
      });
    }, 500);
  };

  const handlePauseTest = (testId: string) => {
    setRunningTestId(null);
    setTests(prevTests =>
      prevTests.map(test =>
        test.id === testId ? { ...test, status: 'pending' } : test
      )
    );
    toast.info('Test paused');
  };

  const handleResetTest = (testId: string) => {
    setTests(prevTests =>
      prevTests.map(test =>
        test.id === testId ? { ...test, status: 'pending', progress: 0, log: '' } : test
      )
    );
    toast.success('Test reset');
  };

  const handleDeleteTest = (testId: string) => {
    setTests(prevTests => prevTests.filter(test => test.id !== testId));
    toast.success('Test deleted');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          MCP Test Setup
        </CardTitle>
        <CardDescription>Create and manage your MCP tests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Test Form */}
        <div className="space-y-2">
          <Label htmlFor="testName">Test Name</Label>
          <Input
            id="testName"
            placeholder="Enter test name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="testDescription">Test Description</Label>
          <Input
            id="testDescription"
            placeholder="Enter test description"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="testScript">Test Script</Label>
          <Textarea
            id="testScript"
            placeholder="Enter test script"
            value={testScript}
            onChange={(e) => setTestScript(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateTest} className="bg-blue-600 hover:bg-blue-700">
          Create Test
        </Button>

        <Separator className="my-4" />

        {/* Test List */}
        {tests.length === 0 ? (
          <div className="text-center py-4">
            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No tests created yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {test.name}
                    {test.status === 'completed' && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </Badge>
                    )}
                    {test.status === 'running' && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 animate-pulse">
                        <Clock className="w-4 h-4 mr-1" />
                        Running
                      </Badge>
                    )}
                    {test.status === 'failed' && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        <XCircle className="w-4 h-4 mr-1" />
                        Failed
                      </Badge>
                    )}
                    {test.status === 'pending' && (
                      <Badge variant="outline">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    {test.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRunTest(test.id)}
                        disabled={runningTestId !== null}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Run Test
                      </Button>
                    )}
                    {test.status === 'running' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePauseTest(test.id)}
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Test
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetTest(test.id)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTest(test.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={test.progress} />
                  {test.log && (
                    <div className="mt-4 text-sm text-gray-600">
                      <Label>Log:</Label>
                      <Textarea value={test.log} readOnly className="mt-1 h-24" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MCPTestSetup;
