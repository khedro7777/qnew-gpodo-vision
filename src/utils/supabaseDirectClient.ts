
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzlhzajmxprhyrmrqxir.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bGh6YWpteHByaHlybXJxeGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTI4MzYsImV4cCI6MjA2OTk4ODgzNn0.s5lHWMEToMdHnL5twcttQCQJRVR2rEwhPKoRu9P9hTY';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Example usage function for todos
export const getTodos = async () => {
  const { data, error } = await supabaseClient
    .from('todos')
    .select();
  
  if (error) {
    console.error('Error fetching todos:', error);
    return null;
  }
  
  return data;
};

// You can add more utility functions here as needed
export const insertTodo = async (todo: { title: string; description?: string }) => {
  const { data, error } = await supabaseClient
    .from('todos')
    .insert(todo)
    .select();
  
  if (error) {
    console.error('Error inserting todo:', error);
    return null;
  }
  
  return data;
};

export default supabaseClient;
