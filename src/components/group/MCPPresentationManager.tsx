
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Presentation, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface MCPPresentationManagerProps {
  groupId: string;
}

interface PresentationSession {
  id: string;
  title: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  presenter: string;
  startTime: string;
  duration: number;
  attendees: number;
  materials: string[];
}

const MCPPresentationManager = ({ groupId }: MCPPresentationManagerProps) => {
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState<PresentationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    loadPresentationSessions();
  }, [groupId]);

  const loadPresentationSessions = async () => {
    try {
      // Mock data for demonstration - in real app this would come from database
      const mockSessions: PresentationSession[] = [
        {
          id: '1',
          title: 'Q3 Group Performance Review',
          status: 'scheduled',
          presenter: 'MCP Agent Alpha',
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          duration: 45,
          attendees: 8,
          materials: ['Q3_Report.pdf', 'Performance_Charts.xlsx']
        },
        {
          id: '2',
          title: 'New Partnership Opportunities',
          status: 'active',
          presenter: 'MCP Agent Beta',
          startTime: new Date().toISOString(),
          duration: 30,
          attendees: 12,
          materials: ['Partnership_Deck.pdf']
        },
        {
          id: '3',
          title: 'Risk Assessment Summary',
          status: 'completed',
          presenter: 'MCP Agent Gamma',
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration: 60,
          attendees: 15,
          materials: ['Risk_Report.pdf', 'Mitigation_Plan.docx']
        }
      ];

      setSessions(mockSessions);
      setActiveSession(mockSessions.find(s => s.status === 'active')?.id || null);
    } catch (error) {
      console.error('Error loading presentation sessions:', error);
      toast.error('Failed to load presentation sessions');
    } finally {
      setLoading(false);
    }
  };

  const schedulePresentation = async () => {
    try {
      const newSession: PresentationSession = {
        id: Date.now().toString(),
        title: 'MCP Automated Presentation',
        status: 'scheduled',
        presenter: 'MCP Agent',
        startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        duration: 30,
        attendees: 0,
        materials: []
      };

      setSessions(prev => [newSession, ...prev]);
      toast.success('Presentation scheduled successfully');
    } catch (error) {
      console.error('Error scheduling presentation:', error);
      toast.error('Failed to schedule presentation');
    }
  };

  const controlSession = async (sessionId: string, action: 'start' | 'pause' | 'stop') => {
    try {
      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          switch (action) {
            case 'start':
              return { ...session, status: 'active' as const };
            case 'pause':
              return { ...session, status: 'scheduled' as const };
            case 'stop':
              return { ...session, status: 'completed' as const };
            default:
              return session;
          }
        }
        return session;
      }));

      if (action === 'start') {
        setActiveSession(sessionId);
      } else if (action === 'stop') {
        setActiveSession(null);
      }

      toast.success(`Session ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing session:`, error);
      toast.error(`Failed to ${action} session`);
    }
  };

  const getStatusBadge = (status: PresentationSession['status']) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      active: { color: 'bg-green-100 text-green-800', icon: Play },
      completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Presentation className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">MCP Presentation Manager</h2>
            <p className="text-sm text-gray-600">
              Managed by {profile?.full_name || 'Unknown User'}
            </p>
          </div>
        </div>

        <Button onClick={schedulePresentation}>
          <Presentation className="w-4 h-4 mr-2" />
          Schedule Presentation
        </Button>
      </div>

      {/* Active Session Alert */}
      {activeSession && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-medium text-green-900">Live Presentation in Progress</h3>
                  <p className="text-sm text-green-700">
                    {sessions.find(s => s.id === activeSession)?.title}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => controlSession(activeSession, 'pause')}
                >
                  <Pause className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => controlSession(activeSession, 'stop')}
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{session.title}</h3>
                    {getStatusBadge(session.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Presenter:</span>
                      <br />
                      {session.presenter}
                    </div>
                    <div>
                      <span className="font-medium">Start Time:</span>
                      <br />
                      {new Date(session.startTime).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <br />
                      {session.duration} minutes
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{session.attendees} attendees</span>
                    </div>
                  </div>

                  {session.materials.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Materials:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {session.materials.map((material, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {session.status === 'scheduled' && (
                    <Button
                      size="sm"
                      onClick={() => controlSession(session.id, 'start')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                  
                  {session.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => controlSession(session.id, 'pause')}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => controlSession(session.id, 'stop')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {session.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => controlSession(session.id, 'start')}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Replay
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Presentation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Presentations Scheduled</h3>
            <p className="text-gray-500 mb-4">Schedule your first MCP presentation to get started</p>
            <Button onClick={schedulePresentation}>
              <Presentation className="w-4 h-4 mr-2" />
              Schedule Presentation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPPresentationManager;
