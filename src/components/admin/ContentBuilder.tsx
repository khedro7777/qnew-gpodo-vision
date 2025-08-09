
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Eye, Edit, Trash2, Settings } from 'lucide-react';
import { useContentTypes, useCreateContentType, ContentField } from '@/hooks/useContentManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const ContentBuilder = () => {
  const { adminUser } = useAdminAuth();
  const { data: contentTypes, isLoading } = useContentTypes();
  const createContentType = useCreateContentType();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newContentType, setNewContentType] = useState({
    name: '',
    singular_name: '',
    api_id: '',
    fields: [] as ContentField[],
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true
    }
  });

  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as const,
    required: false,
    unique: false
  });

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'date', label: 'Date' },
    { value: 'json', label: 'JSON' },
    { value: 'relation', label: 'Relation' }
  ];

  const addField = () => {
    if (!newField.name) return;
    
    const field: ContentField = {
      id: `field_${Date.now()}`,
      ...newField,
      default_value: null,
      validation: null
    };
    
    setNewContentType(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));
    
    setNewField({
      name: '',
      type: 'text',
      required: false,
      unique: false
    });
  };

  const removeField = (fieldId: string) => {
    setNewContentType(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
  };

  const handleCreateContentType = async () => {
    if (!newContentType.name || !newContentType.singular_name) {
      return;
    }

    // Generate API ID from name
    const apiId = newContentType.name.toLowerCase().replace(/\s+/g, '-');
    
    await createContentType.mutateAsync({
      ...newContentType,
      api_id: apiId
    });

    // Reset form
    setNewContentType({
      name: '',
      singular_name: '',
      api_id: '',
      fields: [],
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true
      }
    });
    setIsCreating(false);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading content types...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Builder</h2>
          <p className="text-gray-600">Create and manage content types for your application</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Content Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Content Type</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={newContentType.name}
                    onChange={(e) => setNewContentType(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Blog Posts"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="singular_name">Singular Name</Label>
                  <Input
                    id="singular_name"
                    value={newContentType.singular_name}
                    onChange={(e) => setNewContentType(prev => ({ ...prev, singular_name: e.target.value }))}
                    placeholder="e.g., Blog Post"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Fields</h3>
                
                <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label>Field Name</Label>
                    <Input
                      value={newField.name}
                      onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Field name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newField.type}
                      onValueChange={(value: any) => setNewField(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="flex gap-2">
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={newField.required}
                          onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                        />
                        <span className="text-sm">Required</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={newField.unique}
                          onChange={(e) => setNewField(prev => ({ ...prev, unique: e.target.checked }))}
                        />
                        <span className="text-sm">Unique</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button onClick={addField} className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {newContentType.fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{field.name}</span>
                        <Badge variant="secondary">{field.type}</Badge>
                        {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                        {field.unique && <Badge variant="outline" className="text-xs">Unique</Badge>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContentType} disabled={createContentType.isPending}>
                  {createContentType.isPending ? 'Creating...' : 'Create Content Type'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentTypes?.map((contentType) => (
          <Card key={contentType.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{contentType.name}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  API ID: <code className="bg-gray-100 px-1 rounded">{contentType.api_id}</code>
                </div>
                <div>
                  <span className="text-sm font-medium">Fields: </span>
                  <span className="text-sm text-gray-600">
                    {contentType.fields?.length || 0} fields defined
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {contentType.fields?.slice(0, 3).map((field) => (
                    <Badge key={field.id} variant="outline" className="text-xs">
                      {field.name}
                    </Badge>
                  ))}
                  {(contentType.fields?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(contentType.fields?.length || 0) - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!contentTypes || contentTypes.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No content types created yet</div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Content Type
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentBuilder;
