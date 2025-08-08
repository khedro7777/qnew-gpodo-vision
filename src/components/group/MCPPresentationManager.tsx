
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Presentation, 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack,
  Upload,
  Download,
  Eye,
  Edit3,
  Trash2,
  Users,
  Clock,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  MonitorSpeaker
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const MCPPresentationManager = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState([]);
  const [currentPresentation, setCurrentPresentation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock presentation data
  useEffect(() => {
    const mockPresentations = [
      {
        id: '1',
        title: 'MCP Integration Overview',
        description: 'Introduction to MCP AI capabilities and group workflow integration',
        slides: 12,
        duration: '15 min',
        status: 'ready',
        createdAt: '2024-01-15',
        viewCount: 23,
        thumbnail: '/placeholder.svg'
      },
      {
        id: '2',
        title: 'Group Decision Framework',
        description: 'How MCP facilitates democratic decision-making processes',
        slides: 8,
        duration: '10 min',
        status: 'draft',
        createdAt: '2024-01-14',
        viewCount: 5,
        thumbnail: '/placeholder.svg'
      }
    ];
    setPresentations(mockPresentations);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? 'Presentation paused' : 'Presentation started');
  };

  const handleNextSlide = () => {
    if (currentPresentation && currentSlide < currentPresentation.slides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleCreatePresentation = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Presentation className="w-6 h-6 text-productivity-blue" />
            MCP Presentation Manager
          </h2>
          <p className="text-gray-600 mt-1">Create and manage AI-assisted presentations for your group</p>
        </div>
        <Button onClick={handleCreatePresentation} className="bg-productivity-blue hover:bg-productivity-blue/90">
          <Upload className="w-4 h-4 mr-2" />
          Create Presentation
        </Button>
      </div>

      <Tabs defaultValue="presentations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="presentations">Presentations</TabsTrigger>
          <TabsTrigger value="presenter">Presenter View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="presentations" className="space-y-4">
          <div className="grid gap-4">
            {presentations.map((presentation) => (
              <Card key={presentation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{presentation.title}</CardTitle>
                    <CardDescription>{presentation.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={presentation.status === 'ready' ? 'default' : 'secondary'}>
                      {presentation.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPresentation(presentation)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {presentation.slides} slides
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {presentation.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {presentation.viewCount} views
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="presenter" className="space-y-4">
          {currentPresentation ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg">{currentPresentation.title}</CardTitle>
                    <Badge variant="outline">
                      Slide {currentSlide + 1} of {currentPresentation.slides}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <MonitorSpeaker className="w-16 h-16 text-gray-400" />
                    </div>
                    <Progress 
                      value={(currentSlide / (currentPresentation.slides - 1)) * 100} 
                      className="w-full mb-4" 
                    />
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={handlePrevSlide}>
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePlayPause}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleNextSlide}>
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Presentation Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Time</span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        05:42
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        09:18
                      </span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Presentation Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Speaker Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Welcome everyone to today's presentation. This slide introduces the key concepts we'll be covering...
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Presentation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No presentation selected</h3>
                <p className="text-gray-600 mb-4">Choose a presentation from the list to start presenting</p>
                <Button variant="outline">
                  Select Presentation
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Presentation Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Views</span>
                    <span className="font-medium">128</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. View Time</span>
                    <span className="font-medium">12:34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engagement Rate</span>
                    <span className="font-medium">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">John D.</span>
                    <span className="text-gray-600"> viewed </span>
                    <span className="font-medium">MCP Integration Overview</span>
                    <span className="text-gray-500 block text-xs">2 hours ago</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Sarah M.</span>
                    <span className="text-gray-600"> completed </span>
                    <span className="font-medium">Group Decision Framework</span>
                    <span className="text-gray-500 block text-xs">4 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Presentation Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Presentation</DialogTitle>
            <DialogDescription>
              Set up a new MCP-assisted presentation for your group
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter presentation title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your presentation" rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-productivity-blue hover:bg-productivity-blue/90">
                Create Presentation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCPPresentationManager;
