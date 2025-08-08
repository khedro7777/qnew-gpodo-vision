
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { 
  Presentation, 
  Plus, 
  FileText, 
  Eye, 
  Vote, 
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupType {
  id: string;
  name: string;
}

const MCPPresentationManager = ({ groupId, group }: { groupId: string; group: GroupType }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [newPresentation, setNewPresentation] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  // Mock presentations data since the table doesn't exist yet
  const presentations = [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPresentation({ ...newPresentation, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Presentation functionality will be available soon!');
  };

  const tabs = [
    { id: 'view', label: 'View Presentations', icon: Eye },
    { id: 'create', label: 'Create Presentation', icon: Plus },
    { id: 'manage', label: 'Manage Group Access', icon: Users },
    { id: 'vote', label: 'Voting Configuration', icon: Vote },
  ];

  return (
    <div className="space-y-6">
      {/* Presentation Manager Header */}
      <Card className="bg-gradient-to-r from-blue-100 to-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{group.name} Presentations</h2>
              <p className="text-gray-700">Manage and showcase presentations for your group.</p>
            </div>
            <Badge variant="secondary">
              <Presentation className="w-4 h-4 mr-2" />
              {presentations?.length || 0} Presentations
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'view' && (
        <Card className="p-6 text-center">
          <FileText className="w-10 h-10 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Presentation functionality coming soon!</p>
        </Card>
      )}

      {activeTab === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Presentation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Presentation Title"
                  value={newPresentation.title}
                  onChange={(e) => setNewPresentation({ ...newPresentation, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the presentation"
                  value={newPresentation.description}
                  onChange={(e) => setNewPresentation({ ...newPresentation, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="file">Upload Presentation File</Label>
                <Input
                  type="file"
                  id="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
                {newPresentation.file && (
                  <p className="text-sm text-gray-500 mt-1">Selected file: {newPresentation.file.name}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Presentation
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'manage' && (
        <Card className="p-6 text-center">
          <Users className="w-10 h-10 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Group access management features coming soon!</p>
        </Card>
      )}

      {activeTab === 'vote' && (
        <Card className="p-6 text-center">
          <Vote className="w-10 h-10 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Voting configuration options will be available soon.</p>
        </Card>
      )}
    </div>
  );
};

export default MCPPresentationManager;
