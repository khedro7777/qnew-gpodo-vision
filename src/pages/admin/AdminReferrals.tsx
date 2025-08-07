
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

interface ReferralLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  target_audience?: string;
  visible_in: string[];
  is_active: boolean;
  created_at: string;
}

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState<ReferralLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReferral, setEditingReferral] = useState<ReferralLink | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    target_audience: 'all',
    visible_in: ['dashboard'],
    is_active: true,
  });

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error loading referrals:', error);
      toast.error('Failed to load referral links');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingReferral) {
        const { error } = await supabase
          .from('referral_links')
          .update(formData)
          .eq('id', editingReferral.id);

        if (error) throw error;
        toast.success('Referral link updated successfully');
      } else {
        const { error } = await supabase
          .from('referral_links')
          .insert([formData]);

        if (error) throw error;
        toast.success('Referral link created successfully');
      }

      setIsDialogOpen(false);
      setEditingReferral(null);
      resetForm();
      loadReferrals();
    } catch (error) {
      console.error('Error saving referral:', error);
      toast.error('Failed to save referral link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this referral link?')) return;

    try {
      const { error } = await supabase
        .from('referral_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Referral link deleted successfully');
      loadReferrals();
    } catch (error) {
      console.error('Error deleting referral:', error);
      toast.error('Failed to delete referral link');
    }
  };

  const handleEdit = (referral: ReferralLink) => {
    setEditingReferral(referral);
    setFormData({
      title: referral.title,
      url: referral.url,
      description: referral.description || '',
      target_audience: referral.target_audience || 'all',
      visible_in: referral.visible_in,
      is_active: referral.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      target_audience: 'all',
      visible_in: ['dashboard'],
      is_active: true,
    });
  };

  const openDialog = () => {
    resetForm();
    setEditingReferral(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Referral Links</h2>
          <p className="text-gray-600">Manage referral links shown to users</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Referral Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReferral ? 'Edit Referral Link' : 'Add Referral Link'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Storacha Wallet"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/ref=123"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Register for a crypto wallet to enable payment integrations."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingReferral ? 'Update' : 'Create'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Referral Links</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">{referral.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[200px]">{referral.url}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-4 h-4"
                        onClick={() => window.open(referral.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {referral.description || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={referral.is_active ? 'default' : 'secondary'}>
                      {referral.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(referral.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(referral)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(referral.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferrals;
