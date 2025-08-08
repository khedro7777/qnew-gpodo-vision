import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Send, 
  MessageSquare, 
  Settings, 
  Activity, 
  Brain, 
  Zap, 
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface MCPAgentTabProps {
  groupId: string;
}

const MCPAgentTab: React.FC<MCPAgentTabProps> = ({ groupId }) => {
  const { user } = useAuth();
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'paused' | 'completed' | 'error'>('idle');
  const [agentProgress, setAgentProgress] = useState(0);
  const [agentOutput, setAgentOutput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    // Mock agent progress updates
    let interval: NodeJS.Timeout;
    if (agentStatus === 'running' && agentProgress < 100) {
      interval = setInterval(() => {
        setAgentProgress((prevProgress) => {
          const newProgress = Math.min(prevProgress + 10, 100);
          if (newProgress === 100) {
            setAgentStatus('completed');
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 500);
    }

    return () => clearInterval(interval);
  }, [agentStatus]);

  const handleStartAgent = () => {
    setAgentStatus('running');
    setAgentProgress(0);
    setAgentOutput('');
    toast.success('MCP Agent started!');
  };

  const handlePauseAgent = () => {
    setAgentStatus('paused');
    toast.info('MCP Agent paused.');
  };

  const handleResumeAgent = () => {
    setAgentStatus('running');
    toast.success('MCP Agent resumed.');
  };

  const handleStopAgent = () => {
    setAgentStatus('idle');
    setAgentProgress(0);
    toast.warning('MCP Agent stopped.');
  };

  const handleSendInput = () => {
    setAgentOutput((prevOutput) => prevOutput + `\n[User]: ${userInput}`);
    setUserInput('');
  };

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  const getStatusBadge = () => {
    switch (agentStatus) {
      case 'idle':
        return <Badge variant="outline"><Clock className="w-4 h-4 mr-2" /> Idle</Badge>;
      case 'running':
        return <Badge className="bg-green-100 text-green-800"><PlayCircle className="w-4 h-4 mr-2" /> Running</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800"><PauseCircle className="w-4 h-4 mr-2" /> Paused</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-4 h-4 mr-2" /> Completed</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-4 h-4 mr-2" /> Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            MCP Agent
          </CardTitle>
          <CardDescription>
            Automated agent for managing group workflows and tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              {getStatusBadge()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <Progress value={agentProgress} className="mt-1" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {agentStatus === 'idle' && (
              <Button onClick={handleStartAgent} className="bg-green-600 hover:bg-green-700 text-white">
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Agent
              </Button>
            )}
            {agentStatus === 'running' && (
              <Button onClick={handlePauseAgent} variant="secondary">
                <PauseCircle className="w-4 h-4 mr-2" />
                Pause Agent
              </Button>
            )}
            {agentStatus === 'paused' && (
              <Button onClick={handleResumeAgent} className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlayCircle className="w-4 h-4 mr-2" />
                Resume Agent
              </Button>
            )}
            {(agentStatus === 'running' || agentStatus === 'paused') && (
              <Button onClick={handleStopAgent} variant="destructive">
                Stop Agent
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Agent Activity
          </CardTitle>
          <CardDescription>
            Real-time output and logs from the MCP Agent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Agent output will appear here..."
            value={agentOutput}
            readOnly
            className="resize-none h-48 bg-gray-50"
          />
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter input for the agent..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button onClick={handleSendInput}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agent Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Agent Settings
          </CardTitle>
          <CardDescription>
            Configure the behavior and parameters of the MCP Agent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" type="password" placeholder="••••••••" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" type="text" value="GPT-4" readOnly />
          </div>
          <Button variant="outline" onClick={handleSettingsToggle}>
            {settingsOpen ? 'Hide Settings' : 'Show Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCPAgentTab;
