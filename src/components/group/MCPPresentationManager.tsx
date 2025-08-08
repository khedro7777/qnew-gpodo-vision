import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Presentation, 
  Plus, 
  FileText, 
  Download, 
  Eye, 
  Vote, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface PresentationType {
  id: string;
  group_id: string;
  title: string;
  description: string;
  file_url: string;
  created_at: string;
  created_by: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

interface GroupType {
  id: string;
  name: string;
}

const MCPPresentationManager = ({ groupId, group }: { groupId: string; group: GroupType }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('view');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPresentation, setNewPresentation] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { data: presentations, isLoading, refetch } = useQuery({
    queryKey: ['group-presentations', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_presentations')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching presentations:', error);
        throw error;
      }
      return data as PresentationType[];
    },
  });

  const createPresentationMutation = useMutation({
    mutationFn: async () => {
      if (!user || !newPresentation.file) {
        throw new Error('Missing user or file');
      }

      setUploading(true);
      const fileExt = newPresentation.file.name.split('.').pop();
      const filePath = `presentations/${groupId}/${Date.now()}-${newPresentation.file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('group-documents')
        .upload(filePath, newPresentation.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('group-documents')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('group_presentations')
        .insert({
          group_id: groupId,
          title: newPresentation.title,
          description: newPresentation.description,
          file_url: publicUrlData.publicUrl,
          created_by: user.id,
          status: 'submitted',
        });

      if (dbError) {
        throw dbError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-presentations', groupId] });
      toast.success('Presentation created and submitted successfully!');
      setNewPresentation({ title: '', description: '', file: null });
      setIsCreateModalOpen(false);
      setUploading(false);
    },
    onError: (error: any) => {
      toast.error('Failed to create presentation: ' + error.message);
      setUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPresentation({ ...newPresentation, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresentation.title || !newPresentation.description || !newPresentation.file) {
      toast.error('Please fill in all fields and select a file.');
      return;
    }

    try {
      await createPresentationMutation.mutateAsync();
    } catch (error) {
      console.error('Presentation creation failed:', error);
    }
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
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : presentations && presentations.length > 0 ? (
            presentations.map((presentation) => (
              <Card key={presentation.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {presentation.title}
                    <Badge variant="outline">{presentation.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">{presentation.description}</p>
                  <div className="flex items-center justify-between">
                    <a href={presentation.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      <Download className="w-4 h-4 mr-2 inline-block" />
                      Download Presentation
                    </a>
                    <p className="text-xs text-gray-500">
                      Uploaded on {new Date(presentation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center">
              <FileText className="w-10 h-10 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No presentations available. Start by creating one!</p>
            </Card>
          )}
        </div>
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
              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Presentation
                  </>
                )}
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
