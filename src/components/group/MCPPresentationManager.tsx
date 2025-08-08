import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Presentation, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  FileText, 
  Calendar, 
  Users,
  PlayCircle,
  PauseCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface MCPPresentation {
  id: string;
  group_id: string;
  title: string;
  description: string;
  file_url: string;
  created_at: string;
  status: 'active' | 'pending' | 'archived';
}

interface MCPPresentationManagerProps {
  groupId: string;
  group: any; // Replace 'any' with the actual type of 'group'
}

const MCPPresentationManager: React.FC<MCPPresentationManagerProps> = ({ groupId, group }) => {
  const [presentations, setPresentations] = useState<MCPPresentation[]>([]);
  const [newPresentation, setNewPresentation] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState<MCPPresentation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPresentation, setEditedPresentation] = useState({
    id: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    // Fetch presentations for the group
    const fetchPresentations = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual Supabase fetch logic
        const mockPresentations: MCPPresentation[] = [
          {
            id: '1',
            group_id: groupId,
            title: 'Introduction to GPODO',
            description: 'A brief overview of the GPODO platform and its features.',
            file_url: 'https://example.com/presentation1.pdf',
            created_at: new Date().toISOString(),
            status: 'active',
          },
          {
            id: '2',
            group_id: groupId,
            title: 'Market Analysis',
            description: 'Analysis of current market trends and opportunities.',
            file_url: 'https://example.com/presentation2.pdf',
            created_at: new Date().toISOString(),
            status: 'active',
          },
        ];
        setPresentations(mockPresentations);
      } catch (error) {
        console.error('Error fetching presentations:', error);
        toast.error('Failed to load presentations.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresentations();
  }, [groupId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewPresentation({ ...newPresentation, [field]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewPresentation({ ...newPresentation, file: e.target.files[0] });
    }
  };

  const handleUploadPresentation = async () => {
    if (!newPresentation.title || !newPresentation.description || !newPresentation.file) {
      toast.error('Please fill in all fields and select a file.');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock presentation data
      const uploadedPresentation: MCPPresentation = {
        id: Math.random().toString(),
        group_id: groupId,
        title: newPresentation.title,
        description: newPresentation.description,
        file_url: 'https://example.com/uploaded-presentation.pdf',
        created_at: new Date().toISOString(),
        status: 'pending',
      };

      setPresentations([...presentations, uploadedPresentation]);
      setNewPresentation({ title: '', description: '', file: null });
      toast.success('Presentation uploaded successfully!');
    } catch (error) {
      console.error('Error uploading presentation:', error);
      toast.error('Failed to upload presentation.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenEditModal = (presentation: MCPPresentation) => {
    setSelectedPresentation(presentation);
    setEditedPresentation({
      id: presentation.id,
      title: presentation.title,
      description: presentation.description,
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setEditedPresentation({ ...editedPresentation, [field]: e.target.value });
  };

  const handleSavePresentation = async () => {
    setIsLoading(true);
    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update presentation in the list
      const updatedPresentations = presentations.map((p) =>
        p.id === editedPresentation.id ? { ...p, title: editedPresentation.title, description: editedPresentation.description } : p
      );
      setPresentations(updatedPresentations);

      toast.success('Presentation updated successfully!');
    } catch (error) {
      console.error('Error saving presentation:', error);
      toast.error('Failed to save presentation.');
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const handleDeletePresentation = async (presentationId: string) => {
    setIsLoading(true);
    try {
      // Simulate deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove presentation from the list
      const updatedPresentations = presentations.filter((p) => p.id !== presentationId);
      setPresentations(updatedPresentations);

      toast.success('Presentation deleted successfully!');
    } catch (error) {
      console.error('Error deleting presentation:', error);
      toast.error('Failed to delete presentation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Manage Presentations</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Upload New Presentation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Upload New Presentation</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Presentation Title"
                value={newPresentation.title}
                onChange={(e) => handleInputChange(e, 'title')}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Presentation Description"
                value={newPresentation.description}
                onChange={(e) => handleInputChange(e, 'description')}
              />
            </div>
            <div>
              <Label htmlFor="file">File</Label>
              <Input type="file" id="file" onChange={handleFileChange} />
            </div>
            <Button onClick={handleUploadPresentation} disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Presentation
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Presentation List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Existing Presentations</h3>
          {isLoading ? (
            <p>Loading presentations...</p>
          ) : (
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <div className="p-4 space-y-4">
                {presentations.map((presentation) => (
                  <Card key={presentation.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h4 className="font-semibold">{presentation.title}</h4>
                        <p className="text-sm text-gray-500">{presentation.description}</p>
                        <Badge variant="secondary" className="mt-2">
                          {presentation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(presentation)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePresentation(presentation.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Edit Presentation Modal */}
        {isEditModalOpen && selectedPresentation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="max-w-md w-full p-6">
              <CardHeader>
                <CardTitle>Edit Presentation</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    type="text"
                    id="edit-title"
                    value={editedPresentation.title}
                    onChange={(e) => handleEditInputChange(e, 'title')}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editedPresentation.description}
                    onChange={(e) => handleEditInputChange(e, 'description')}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePresentation} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MCPPresentationManager;
