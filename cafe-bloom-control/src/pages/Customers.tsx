import { useState } from "react";
import { Users, Search, Star, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomers, Customer } from "@/hooks/useCustomers";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { customers, loading, updateCustomer } = useCustomers();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusBadge = (status: Customer["status"]) => {
    switch (status) {
      case "vip": return "bg-accent text-accent-foreground";
      case "regular": return "bg-primary text-primary-foreground";
      case "new": return "bg-success text-success-foreground";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Customer Management</h1>
          <p className="text-muted-foreground">Track customer loyalty and order history</p>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="bg-gradient-card shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">
              {customers.filter(c => c.status === "vip").length}
            </div>  
            <p className="text-xs text-muted-foreground">VIP Customers</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              {customers.filter(c => c.status === "new").length}
            </div>
            <p className="text-xs text-muted-foreground">New This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">
              {Math.round(customers.reduce((sum, c) => sum + c.loyalty_points, 0) / customers.length)}
            </div>
            <p className="text-xs text-muted-foreground">Avg Loyalty Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6 bg-gradient-card shadow-elegant">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="bg-gradient-card shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{customer.total_orders}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="font-semibold">{customer.loyalty_points}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.last_visit ? new Date(customer.last_visit).toLocaleDateString() : 'Never'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(customer.status)}>
                      {customer.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredCustomers.length === 0 && (
        <Card className="text-center py-12 bg-gradient-card mt-6">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No customers found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}