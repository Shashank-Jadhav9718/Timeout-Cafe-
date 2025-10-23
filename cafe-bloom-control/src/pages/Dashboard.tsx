import { 
  IndianRupee, 
  ShoppingCart, 
  ChefHat, 
  Users, 
  TrendingUp,
  AlertCircle 
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useOrders } from "@/hooks/useOrders";
import { useNotifications } from "@/hooks/useNotifications";
import { formatIndianCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { orders, loading: ordersLoading } = useOrders();
  const { notifications, loading: notificationsLoading } = useNotifications();

  // Get recent orders (last 5)
  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.order_number,
    customer: order.customer_name,
    amount: formatIndianCurrency(order.total_amount),
    status: order.status
  }));

  const dashboardStats = [
    {
      title: "Total Sales",
      value: formatIndianCurrency(stats.totalSales),
      description: "Today's revenue",
      icon: IndianRupee,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Daily Orders",
      value: stats.dailyOrders.toString(),
      description: "Orders processed",
      icon: ShoppingCart,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Menu Items",
      value: stats.menuItemsCount.toString(),
      description: "Active items",
      icon: ChefHat,
      trend: { value: 3, isPositive: true }
    },
    {
      title: "Staff Count",
      value: stats.staffCount.toString(),
      description: "Active staff",
      icon: Users,
      trend: { value: 2, isPositive: false }
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your cafe today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 bg-gradient-card shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{order.amount}</span>
                    <Badge 
                      variant={
                        order.status === 'completed' ? 'default' : 
                        order.status === 'preparing' ? 'secondary' : 
                        'outline'
                      }
                      className={
                        order.status === 'completed' ? 'bg-success hover:bg-success/80' :
                        order.status === 'preparing' ? 'bg-warning text-warning-foreground hover:bg-warning/80' :
                        'border-muted-foreground'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="p-3 bg-background/50 rounded-lg border-l-4 border-l-primary/20">
                  <p className="text-sm">{notification.message}</p>
                  <span className={`text-xs font-medium ${
                    notification.type === 'warning' ? 'text-warning' :
                    notification.type === 'success' ? 'text-success' :
                    notification.type === 'error' ? 'text-destructive' :
                    'text-primary'
                  }`}>
                    {notification.type.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}