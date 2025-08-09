
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Download, Play } from 'lucide-react';
import { useContentTypes } from '@/hooks/useContentManagement';
import { toast } from 'sonner';

const APIGenerator = () => {
  const { data: contentTypes } = useContentTypes();
  const [selectedContentType, setSelectedContentType] = useState<string>('');

  const generateAPICode = (contentType: any) => {
    return `// Generated API endpoints for ${contentType.name}

// GET all ${contentType.name}
export const get${contentType.singular_name.replace(/\s+/g, '')}s = async () => {
  const { data, error } = await supabase
    .from('content_entries')
    .select('*')
    .eq('content_type_id', '${contentType.id}')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// GET single ${contentType.singular_name}
export const get${contentType.singular_name.replace(/\s+/g, '')} = async (id: string) => {
  const { data, error } = await supabase
    .from('content_entries')
    .select('*')
    .eq('id', id)
    .eq('content_type_id', '${contentType.id}')
    .single();
  
  if (error) throw error;
  return data;
};

// CREATE ${contentType.singular_name}
export const create${contentType.singular_name.replace(/\s+/g, '')} = async (entryData: any) => {
  const { data, error } = await supabase
    .from('content_entries')
    .insert({
      content_type_id: '${contentType.id}',
      data: entryData,
      status: 'draft',
      created_by: auth.uid(),
      updated_by: auth.uid()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// UPDATE ${contentType.singular_name}
export const update${contentType.singular_name.replace(/\s+/g, '')} = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('content_entries')
    .update({
      data: updates,
      updated_by: auth.uid(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// DELETE ${contentType.singular_name}
export const delete${contentType.singular_name.replace(/\s+/g, '')} = async (id: string) => {
  const { error } = await supabase
    .from('content_entries')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// TypeScript interfaces
export interface ${contentType.singular_name.replace(/\s+/g, '')}Data {
${contentType.fields?.map((field: any) => 
  `  ${field.name}: ${getTypeScriptType(field.type)};${field.required ? '' : ' // Optional'}`
).join('\n') || '  // No fields defined'}
}

export interface ${contentType.singular_name.replace(/\s+/g, '')} {
  id: string;
  data: ${contentType.singular_name.replace(/\s+/g, '')}Data;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  published_at?: string;
}`;
  };

  const getTypeScriptType = (fieldType: string) => {
    switch (fieldType) {
      case 'text':
      case 'textarea':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'date':
        return 'string';
      case 'json':
        return 'any';
      case 'relation':
        return 'string';
      default:
        return 'any';
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const downloadAsFile = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">API Code Generator</h2>
        <p className="text-gray-600">Generate TypeScript API functions for your content types</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contentTypes?.map((contentType) => (
                <button
                  key={contentType.id}
                  onClick={() => setSelectedContentType(contentType.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedContentType === contentType.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{contentType.name}</div>
                  <div className="text-sm text-gray-500">
                    {contentType.fields?.length || 0} fields
                  </div>
                </button>
              )) || (
                <div className="text-center text-gray-500 py-8">
                  No content types available. Create some content types first.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Generated API Code
              </span>
              {selectedContentType && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const contentType = contentTypes?.find(ct => ct.id === selectedContentType);
                      if (contentType) {
                        copyToClipboard(generateAPICode(contentType));
                      }
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const contentType = contentTypes?.find(ct => ct.id === selectedContentType);
                      if (contentType) {
                        const filename = `${contentType.api_id}-api.ts`;
                        downloadAsFile(generateAPICode(contentType), filename);
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedContentType ? (
              <div className="space-y-4">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  <code>
                    {generateAPICode(contentTypes?.find(ct => ct.id === selectedContentType))}
                  </code>
                </pre>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <Play className="h-3 w-3 mr-1" />
                    Ready to use
                  </Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Supabase</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a content type to generate API code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIGenerator;
