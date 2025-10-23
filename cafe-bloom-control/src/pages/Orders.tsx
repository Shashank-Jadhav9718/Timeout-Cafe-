import { useState } from "react";
import { ShoppingCart, Eye, Clock, CheckCircle, XCircle, Filter, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useOrders, Order } from "@/hooks/useOrders";
import { useMenuItems } from "@/hooks/useMenuItems";
import { formatIndianCurrency } from "@/lib/utils";

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    table_number: "",
    total_amount: "",
    selectedItems: [] as Array<{menu_item_id: string, quantity: number, price: number}>
  });
  
  const { orders, loading, updateOrderStatus, createOrder, updateOrder, deleteOrder } = useOrders();
  const { menuItems } = useMenuItems();

  const filteredOrders = orders.filter(order => {
    return statusFilter === "all" || order.status === statusFilter;
  });

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "preparing": return <ShoppingCart className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "border-warning text-warning";
      case "preparing": return "bg-primary text-primary-foreground";
      case "completed": return "bg-success text-success-foreground";
      case "cancelled": return "bg-destructive text-destructive-foreground";
    }
  };


  const handleCreateOrder = async () => {
    if (!newOrder.customer_name || !newOrder.total_amount || newOrder.selectedItems.length === 0) return;
    
    await createOrder({
      customer_name: newOrder.customer_name,
      table_number: newOrder.table_number ? parseInt(newOrder.table_number) : undefined,
      total_amount: parseFloat(newOrder.total_amount),
      order_items: newOrder.selectedItems
    });
    
    setNewOrder({
      customer_name: "",
      table_number: "",
      total_amount: "",
      selectedItems: []
    });
    setIsAddDialogOpen(false);
  };

  const handleEditOrder = async () => {
    if (!editingOrder) return;
    
    await updateOrder(editingOrder.id, {
      customer_name: editingOrder.customer_name,
      table_number: editingOrder.table_number,
      total_amount: editingOrder.total_amount,
    });
    
    setIsEditDialogOpen(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    await deleteOrder(orderId);
  };

  const addItemToOrder = (menuItemId: string, price: number) => {
    const existingItem = newOrder.selectedItems.find(item => item.menu_item_id === menuItemId);
    if (existingItem) {
      setNewOrder({
        ...newOrder,
        selectedItems: newOrder.selectedItems.map(item =>
          item.menu_item_id === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      setNewOrder({
        ...newOrder,
        selectedItems: [...newOrder.selectedItems, { menu_item_id: menuItemId, quantity: 1, price }]
      });
    }
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Orders Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  value={newOrder.customer_name}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="table_number">Table Number (optional)</Label>
                <Input
                  id="table_number"
                  type="number"
                  value={newOrder.table_number}
                  onChange={(e) => setNewOrder({ ...newOrder, table_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  value={newOrder.total_amount}
                  onChange={(e) => setNewOrder({ ...newOrder, total_amount: e.target.value })}
                />
              </div>
              <div>
                <Label>Add Menu Items</Label>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-2">
                  {menuItems.filter(item => item.available).map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{item.name} - ₹{item.price}</span>
                      <Button size="sm" variant="outline" onClick={() => addItemToOrder(item.id, item.price)}>
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {newOrder.selectedItems.length > 0 && (
                <div>
                  <Label>Selected Items</Label>
                  <div className="space-y-1">
                    {newOrder.selectedItems.map(item => {
                      const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
                      return (
                        <div key={item.menu_item_id} className="text-sm">
                          {menuItem?.name} x{item.quantity} - {formatIndianCurrency(item.price * item.quantity)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <Button onClick={handleCreateOrder} className="w-full">
                Create Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card className="mb-6 bg-gradient-card shadow-elegant">
        <CardContent className="pt-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-gradient-card shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Current Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>
                    <div className="max-w-32">
                      {order.order_items?.map(item => item.menu_items?.name).join(", ") || "No items"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.table_number ? `Table ${order.table_number}` : "Takeaway"}
                  </TableCell>
                  <TableCell className="font-semibold">{formatIndianCurrency(order.total_amount)}</TableCell>
                  <TableCell>{new Date(order.order_time).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusBadgeClass(order.status)} gap-1`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Order</DialogTitle>
                          </DialogHeader>
                          {editingOrder && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit_customer_name">Customer Name</Label>
                                <Input
                                  id="edit_customer_name"
                                  value={editingOrder.customer_name}
                                  onChange={(e) => setEditingOrder({ ...editingOrder, customer_name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit_table_number">Table Number</Label>
                                <Input
                                  id="edit_table_number"
                                  type="number"
                                  value={editingOrder.table_number || ""}
                                  onChange={(e) => setEditingOrder({ ...editingOrder, table_number: e.target.value ? parseInt(e.target.value) : undefined })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit_total_amount">Total Amount</Label>
                                <Input
                                  id="edit_total_amount"
                                  type="number"
                                  step="0.01"
                                  value={editingOrder.total_amount}
                                  onChange={(e) => setEditingOrder({ ...editingOrder, total_amount: parseFloat(e.target.value) })}
                                />
                              </div>
                              <Button onClick={handleEditOrder} className="w-full">
                                Update Order
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this order? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {order.status === "pending" && (
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary-dark"
                          onClick={() => updateOrderStatus(order.id, "preparing")}
                        >
                          Start
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/80"
                          onClick={() => updateOrderStatus(order.id, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 && (
        <Card className="text-center py-12 bg-gradient-card mt-6">
          <CardContent>
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found for the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}