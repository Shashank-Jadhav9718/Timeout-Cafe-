import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, ChefHat, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMenuItems, MenuItem } from "@/hooks/useMenuItems";
import { formatIndianCurrency } from "@/lib/utils";
import Cart from "@/components/Cart";
import { useRef } from "react";

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<{ addToCart: (item: { id: string; name: string; price: number }) => void }>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    category: "Beverage" | "Food" | "Dessert";
    available: boolean;
  }>({
    name: "",
    description: "",
    price: 0,
    category: "Food",
    available: true
  });
  
  const { menuItems, loading, createMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "Food",
      available: true
    });
  };

  const handleAddItem = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      available: item.available
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmitAdd = async () => {
    await createMenuItem(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleSubmitEdit = async () => {
    if (editingItem) {
      await updateMenuItem(editingItem.id, formData);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetForm();
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteMenuItem(id);
  };

  const addToCart = (item: MenuItem) => {
    if (cartRef.current) {
      cartRef.current.addToCart({ id: item.id, name: item.name, price: item.price });
      setIsCartOpen(true);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Menu Management</h1>
          <p className="text-muted-foreground">Manage your cafe's menu items and pricing</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90" onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-gradient-card shadow-elegant">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Beverage">Beverages</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Dessert">Desserts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-gradient-card shadow-elegant hover:shadow-warm transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </div>
                <Badge 
                  variant={item.available ? "default" : "destructive"}
                  className={item.available ? 'bg-success hover:bg-success/80' : ''}
                >
                  {item.available ? "Available" : "Out of Stock"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-primary">{formatIndianCurrency(item.price)}</span>
                <Badge variant="outline" className="border-primary/20">
                  {item.category}
                </Badge>
              </div>
              <div className="flex gap-2 mb-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-primary hover:opacity-90" 
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditItem(item)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="text-center py-12 bg-gradient-card">
          <CardContent>
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No menu items found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter item description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-price">Price</Label>
              <Input
                id="add-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-category">Category</Label>
              <Select value={formData.category} onValueChange={(value: "Beverage" | "Food" | "Dessert") => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Beverage">Beverage</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd} disabled={!formData.name || formData.price <= 0}>
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter item description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value: "Beverage" | "Food" | "Dessert") => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Beverage">Beverage</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-available">Available</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit} disabled={!formData.name || formData.price <= 0}>
              Update Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Component */}
      <Cart ref={cartRef} isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </div>
  );
}