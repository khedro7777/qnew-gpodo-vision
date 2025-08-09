
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContentType {
  id: string;
  name: string;
  singular_name: string;
  api_id: string;
  fields: ContentField[];
  permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface ContentField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'date' | 'json' | 'relation';
  required: boolean;
  unique: boolean;
  default_value?: any;
  validation?: any;
}

export interface ContentEntry {
  id: string;
  content_type_id: string;
  data: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Database types (what Supabase returns)
interface DbContentType {
  id: string;
  name: string;
  singular_name: string;
  api_id: string;
  fields: any; // JSON from database
  permissions: any; // JSON from database
  created_at: string;
  updated_at: string;
}

interface DbContentEntry {
  id: string;
  content_type_id: string;
  data: any; // JSON from database
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export const useContentTypes = () => {
  return useQuery({
    queryKey: ['content_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database results to our TypeScript types
      return (data || []).map((item: DbContentType): ContentType => ({
        ...item,
        fields: Array.isArray(item.fields) ? item.fields : [],
        permissions: typeof item.permissions === 'object' ? item.permissions : {}
      }));
    },
  });
};

export const useCreateContentType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contentType: Omit<ContentType, 'id' | 'created_at' | 'updated_at'>) => {
      // Transform our TypeScript types to database format
      const dbData = {
        ...contentType,
        fields: JSON.stringify(contentType.fields),
        permissions: JSON.stringify(contentType.permissions)
      };
      
      const { data, error } = await supabase
        .from('content_types')
        .insert(dbData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content_types'] });
      toast.success('Content type created successfully');
    },
    onError: (error: any) => {
      toast.error('Error creating content type: ' + error.message);
    },
  });
};

export const useContentEntries = (contentTypeId: string) => {
  return useQuery({
    queryKey: ['content_entries', contentTypeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_entries')
        .select('*')
        .eq('content_type_id', contentTypeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database results to our TypeScript types
      return (data || []).map((item: DbContentEntry): ContentEntry => ({
        ...item,
        data: typeof item.data === 'object' ? item.data : {},
        status: item.status as 'draft' | 'published' | 'archived'
      }));
    },
    enabled: !!contentTypeId,
  });
};

export const useCreateContentEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: Omit<ContentEntry, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('content_entries')
        .insert({
          ...entry,
          data: JSON.stringify(entry.data),
          created_by: entry.created_by,
          updated_by: entry.created_by
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['content_entries', data.content_type_id] });
      toast.success('Content entry created successfully');
    },
    onError: (error: any) => {
      toast.error('Error creating content entry: ' + error.message);
    },
  });
};

export const useUpdateContentEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<ContentEntry>; 
    }) => {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Convert data to JSON if it exists
      if (updates.data) {
        updateData.data = JSON.stringify(updates.data);
      }
      
      const { data, error } = await supabase
        .from('content_entries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['content_entries', data.content_type_id] });
      toast.success('Content entry updated successfully');
    },
    onError: (error: any) => {
      toast.error('Error updating content entry: ' + error.message);
    },
  });
};

export const useDeleteContentEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content_entries'] });
      toast.success('Content entry deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Error deleting content entry: ' + error.message);
    },
  });
};

export const usePublishContentEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('content_entries')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['content_entries', data.content_type_id] });
      toast.success('Content entry published successfully');
    },
    onError: (error: any) => {
      toast.error('Error publishing content entry: ' + error.message);
    },
  });
};
