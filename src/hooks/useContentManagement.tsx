
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

export const useContentTypes = () => {
  return useQuery({
    queryKey: ['content_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_types' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContentType[];
    },
  });
};

export const useCreateContentType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contentType: Omit<ContentType, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('content_types' as any)
        .insert(contentType)
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
        .from('content_entries' as any)
        .select(`
          *,
          profiles!content_entries_created_by_fkey(full_name, email)
        `)
        .eq('content_type_id', contentTypeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContentEntry[];
    },
    enabled: !!contentTypeId,
  });
};

export const useCreateContentEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: Omit<ContentEntry, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('content_entries' as any)
        .insert({
          ...entry,
          created_by: entry.created_by,
          updated_by: entry.created_by
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
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
      const { data, error } = await supabase
        .from('content_entries' as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
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
        .from('content_entries' as any)
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
        .from('content_entries' as any)
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content_entries', data.content_type_id] });
      toast.success('Content entry published successfully');
    },
    onError: (error: any) => {
      toast.error('Error publishing content entry: ' + error.message);
    },
  });
};
