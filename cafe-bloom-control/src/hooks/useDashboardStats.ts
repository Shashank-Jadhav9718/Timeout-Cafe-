import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalSales: number;
  dailyOrders: number;
  menuItemsCount: number;
  staffCount: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    dailyOrders: 0,
    menuItemsCount: 0,
    staffCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Fetch daily sales and orders
      const { data: todayOrders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('order_time', `${today}T00:00:00`)
        .lt('order_time', `${today}T23:59:59`);

      if (ordersError) throw ordersError;

      // Calculate total sales for today
      const totalSales = todayOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const dailyOrders = todayOrders?.length || 0;

      // Fetch menu items count
      const { count: menuItemsCount, error: menuError } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('available', true);

      if (menuError) throw menuError;

      // Fetch active staff count
      const { count: staffCount, error: staffError } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (staffError) throw staffError;

      setStats({
        totalSales,
        dailyOrders,
        menuItemsCount: menuItemsCount || 0,
        staffCount: staffCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
}