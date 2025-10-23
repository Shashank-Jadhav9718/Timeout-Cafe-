import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StaffMember {
  id: string;
  name: string;
  role: "Manager" | "Barista" | "Server" | "Chef";
  contact: string;
  shift: string;
  status: "active" | "inactive";
  avatar_url?: string;
}

export function useStaff() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setStaffMembers((data as StaffMember[]) || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStaff = async (staffData: Omit<StaffMember, 'id'>) => {
    try {
      const { error } = await supabase
        .from('staff')
        .insert([staffData]);

      if (error) throw error;
      
      await fetchStaff();
      toast({
        title: "Success",
        description: "Staff member created successfully",
      });
    } catch (error) {
      console.error('Error creating staff member:', error);
      toast({
        title: "Error",
        description: "Failed to create staff member",
        variant: "destructive",
      });
    }
  };

  const updateStaff = async (id: string, updates: Partial<StaffMember>) => {
    try {
      const { error } = await supabase
        .from('staff')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchStaff();
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
    } catch (error) {
      console.error('Error updating staff member:', error);
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchStaff();
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staffMembers,
    loading,
    refetch: fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  };
}