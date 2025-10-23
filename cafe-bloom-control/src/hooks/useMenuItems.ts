import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Beverage" | "Food" | "Dessert";
  available: boolean;
  image_url?: string;
}

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setMenuItems((data as MenuItem[]) || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMenuItem = async (newItem: Omit<MenuItem, 'id'>) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert([newItem]);

      if (error) throw error;
      
      await fetchMenuItems();
      toast({
        title: "Success",
        description: "Menu item created successfully",
      });
    } catch (error) {
      console.error('Error creating menu item:', error);
      toast({
        title: "Error",
        description: "Failed to create menu item",
        variant: "destructive",
      });
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchMenuItems();
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      });
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchMenuItems();
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    loading,
    refetch: fetchMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
}