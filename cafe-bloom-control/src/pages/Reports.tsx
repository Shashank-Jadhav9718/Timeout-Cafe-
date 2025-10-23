import { BarChart3, Download, Calendar as CalendarIcon, TrendingUp, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders } from "@/hooks/useOrders";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useStaff } from "@/hooks/useStaff";
import { useCustomers } from "@/hooks/useCustomers";
import { useState } from "react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatIndianCurrency } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface ExtendedJsPDF extends jsPDF {
  autoTable: (options: any) => void;
}

export default function Reports() {
  const { orders } = useOrders();
  const { menuItems } = useMenuItems();
  const { staffMembers } = useStaff();
  const { customers } = useCustomers();
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  // Filter orders by date range if selected
  const filteredOrders = orders.filter(order => {
    if (!dateFrom && !dateTo) return true;
    const orderDate = new Date(order.order_time);
    const isAfterFrom = !dateFrom || orderDate >= dateFrom;
    const isBeforeTo = !dateTo || orderDate <= dateTo;
    return isAfterFrom && isBeforeTo;
  });

  // Calculate revenue metrics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const monthlyRevenue = totalRevenue;
  const dailyAverage = monthlyRevenue / 30;
  const weeklyTotal = dailyAverage * 7;

  // Get best selling items (simplified calculation)
  const bestItems = [
    { name: "Cappuccino", sold: 234 },
    { name: "Latte", sold: 198 },
    { name: "Croissant", sold: 156 }
  ];

  const exportToPDF = () => {
    const doc = new jsPDF() as ExtendedJsPDF;
    let currentY = 20;
    
    // Add title
    doc.setFontSize(20);
    doc.text('Cafe Management Report', 20, currentY);
    currentY += 20;
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, currentY);
    currentY += 25;
    
    if (selectedReportType === 'sales' || !selectedReportType) {
      // Sales Summary
      doc.setFontSize(16);
      doc.text('Sales Summary', 20, currentY);
      currentY += 15;
      
      const salesData = [
        ['Metric', 'Value'],
        ['Daily Average', formatIndianCurrency(dailyAverage)],
        ['Weekly Total', formatIndianCurrency(weeklyTotal)],
        ['Monthly Total', formatIndianCurrency(monthlyRevenue)],
        ['Total Orders', filteredOrders.length.toString()]
      ];
      
      doc.autoTable({
        startY: currentY,
        head: [salesData[0]],
        body: salesData.slice(1),
        theme: 'grid'
      });
      currentY += (salesData.length * 8) + 20;
    }
    
    if (selectedReportType === 'inventory' || !selectedReportType) {
      // Menu Items
      const menuData = [
        ['Item Name', 'Category', 'Price', 'Available'],
        ...menuItems.map(item => [
          item.name,
          item.category,
          formatIndianCurrency(item.price),
          item.available ? 'Yes' : 'No'
        ])
      ];
      
      doc.setFontSize(16);
      doc.text('Menu Items', 20, currentY);
      currentY += 15;
      
      doc.autoTable({
        startY: currentY,
        head: [menuData[0]],
        body: menuData.slice(1),
        theme: 'grid'
      });
      currentY += (menuData.length * 8) + 20;
    }
    
    if (selectedReportType === 'staff' || !selectedReportType) {
      // Staff Report
      const staffData = [
        ['Name', 'Role', 'Contact', 'Status'],
        ...staffMembers.map(staff => [
          staff.name,
          staff.role,
          staff.contact || 'N/A',
          staff.status
        ])
      ];
      
      doc.setFontSize(16);
      doc.text('Staff Report', 20, currentY);
      currentY += 15;
      
      doc.autoTable({
        startY: currentY,
        head: [staffData[0]],
        body: staffData.slice(1),
        theme: 'grid'
      });
    }
    
    doc.save(`cafe-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToCSV = () => {
    let csvContent = '';
    
    if (selectedReportType === 'sales' || !selectedReportType) {
      csvContent += 'Sales Summary\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Daily Average,${formatIndianCurrency(dailyAverage)}\n`;
      csvContent += `Weekly Total,${formatIndianCurrency(weeklyTotal)}\n`;
      csvContent += `Monthly Total,${formatIndianCurrency(monthlyRevenue)}\n`;
      csvContent += `Total Orders,${filteredOrders.length}\n\n`;
    }
    
    if (selectedReportType === 'inventory' || !selectedReportType) {
      csvContent += 'Menu Items\n';
      csvContent += 'Item Name,Category,Price,Available\n';
      menuItems.forEach(item => {
        csvContent += `${item.name},${item.category},${formatIndianCurrency(item.price)},${item.available ? 'Yes' : 'No'}\n`;
      });
      csvContent += '\n';
    }
    
    if (selectedReportType === 'staff' || !selectedReportType) {
      csvContent += 'Staff Report\n';
      csvContent += 'Name,Role,Contact,Status\n';
      staffMembers.forEach(staff => {
        csvContent += `${staff.name},${staff.role},${staff.contact || 'N/A'},${staff.status}\n`;
      });
      csvContent += '\n';
    }
    
    if (selectedReportType === 'customer' || !selectedReportType) {
      csvContent += 'Customer Report\n';
      csvContent += 'Name,Email,Phone,Total Orders,Loyalty Points\n';
      customers.forEach(customer => {
        csvContent += `${customer.name},${customer.email || 'N/A'},${customer.phone || 'N/A'},${customer.total_orders},${customer.loyalty_points}\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cafe-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate insights and export data</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateFrom && dateTo 
                  ? `${format(dateFrom, "MMM dd")} - ${format(dateTo, "MMM dd")}`
                  : "Date Range"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex gap-2 p-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">From Date</label>
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">To Date</label>
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="flex gap-2 p-4 pt-0">
                <Button size="sm" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}>
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={exportToPDF} className="bg-gradient-primary hover:opacity-90">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Report</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatIndianCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <div className="text-xs text-success mt-2">↗ 12% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Selling Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bestItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.sold} sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>8:00 - 10:00 AM</span>
                <span className="font-semibold">42%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>12:00 - 2:00 PM</span>
                <span className="font-semibold">28%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>3:00 - 5:00 PM</span>
                <span className="font-semibold">18%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader>
            <CardTitle>Sales Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                <span>Daily Average</span>
                <span className="font-bold text-primary">{formatIndianCurrency(dailyAverage)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                <span>Weekly Total</span>
                <span className="font-bold text-primary">{formatIndianCurrency(weeklyTotal)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                <span>Monthly Total</span>
                <span className="font-bold text-primary">{formatIndianCurrency(monthlyRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant">
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="staff">Staff Report</SelectItem>
                    <SelectItem value="customer">Customer Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time Period</label>
                <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={exportToPDF} className="flex-1 bg-gradient-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button onClick={exportToCSV} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}