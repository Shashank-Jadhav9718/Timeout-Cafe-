import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatIndianCurrency } from "@/lib/utils";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CartRef {
  addToCart: (item: { id: string; name: string; price: number }) => void;
}

const Cart = forwardRef<CartRef, CartProps>(({ isOpen, onOpenChange }, ref) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const { menuItems } = useMenuItems();
  const { createOrder } = useOrders();
  const { toast } = useToast();

  const TAX_RATE = 0.05; // 5% tax

  const addToCart = (menuItem: { id: string; name: string; price: number }) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.menu_item_id === menuItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.menu_item_id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        menu_item_id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }];
    });
  };

  useImperativeHandle(ref, () => ({
    addToCart
  }));

  const updateQuantity = (menuItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.menu_item_id === menuItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCartItems(prev => prev.filter(item => item.menu_item_id !== menuItemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOrder({
        customer_name: customerName,
        table_number: tableNumber ? parseInt(tableNumber) : undefined,
        total_amount: total,
        order_items: cartItems.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price
        }))
      });

      // Clear form and cart
      setCustomerName("");
      setTableNumber("");
      clearCart();
      setIsCheckoutOpen(false);
      onOpenChange?.(false);

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Cart Trigger - Floating Action Button */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-warm bg-gradient-primary hover:opacity-90 z-50"
            size="icon"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                  {totalItems}
                </Badge>
              )}
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Your Cart ({totalItems} items)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add items from the menu to get started</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.menu_item_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatIndianCurrency(item.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.menu_item_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatIndianCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%):</span>
                    <span>{formatIndianCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{formatIndianCurrency(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={clearCart} className="flex-1">
                    Clear Cart
                  </Button>
                  <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                        Checkout
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Complete Your Order</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="customer-name">Customer Name *</Label>
                          <Input
                            id="customer-name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Enter customer name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="table-number">Table Number (optional)</Label>
                          <Input
                            id="table-number"
                            type="number"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="Enter table number"
                          />
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex justify-between font-bold">
                            <span>Total Amount:</span>
                            <span className="text-primary">{formatIndianCurrency(total)}</span>
                          </div>
                        </div>
                        <Button onClick={handleCheckout} className="w-full bg-gradient-primary hover:opacity-90">
                          Place Order
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

Cart.displayName = "Cart";

export default Cart;