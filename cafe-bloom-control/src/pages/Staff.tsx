import { UserCheck, Plus, Edit, Trash2, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useStaff, StaffMember } from "@/hooks/useStaff";
import { useState } from "react";

export default function Staff() {
  const { staffMembers, loading, createStaff, updateStaff, deleteStaff } = useStaff();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const getRoleColor = (role: StaffMember["role"]) => {
    switch (role) {
      case "Manager": return "bg-primary text-primary-foreground";
      case "Barista": return "bg-accent text-accent-foreground";
      case "Server": return "bg-secondary text-secondary-foreground";
      case "Chef": return "bg-warning text-warning-foreground";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Staff Management</h1>
          <p className="text-muted-foreground">Manage your cafe staff and schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const staffData = {
                name: formData.get('name') as string,
                role: formData.get('role') as StaffMember['role'],
                contact: formData.get('contact') as string,
                shift: formData.get('shift') as string,
                status: 'active' as const,
              };
              createStaff(staffData);
              setIsAddDialogOpen(false);
              (e.target as HTMLFormElement).reset();
            }} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Barista">Barista</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input id="contact" name="contact" type="tel" />
              </div>
              <div>
                <Label htmlFor="shift">Shift</Label>
                <Input id="shift" name="shift" placeholder="e.g., 9:00 AM - 5:00 PM" />
              </div>
              <Button type="submit" className="w-full">Add Staff Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="bg-gradient-card shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{staffMembers.length}</div>
            <p className="text-xs text-muted-foreground">Total Staff</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{staffMembers.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Active Today</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{staffMembers.filter(s => s.status === 'inactive').length}</div>
            <p className="text-xs text-muted-foreground">On Break</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{staffMembers.filter(s => s.role === 'Barista').length}</div>
            <p className="text-xs text-muted-foreground">Baristas</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card className="bg-gradient-card shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={staff.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{staff.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(staff.role)}>
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {staff.contact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {staff.shift}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={staff.status === "active" ? "default" : "secondary"}
                      className={staff.status === "active" 
                        ? "bg-success text-success-foreground" 
                        : "bg-muted text-muted-foreground"
                      }
                    >
                      {staff.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingStaff(staff)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {staff.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteStaff(staff.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Staff Dialog */}
      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {editingStaff && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updates = {
                name: formData.get('name') as string,
                role: formData.get('role') as StaffMember['role'],
                contact: formData.get('contact') as string,
                shift: formData.get('shift') as string,
                status: formData.get('status') as 'active' | 'inactive',
              };
              updateStaff(editingStaff.id, updates);
              setEditingStaff(null);
            }} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" defaultValue={editingStaff.name} required />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select name="role" defaultValue={editingStaff.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Barista">Barista</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-contact">Contact</Label>
                <Input id="edit-contact" name="contact" type="tel" defaultValue={editingStaff.contact || ''} />
              </div>
              <div>
                <Label htmlFor="edit-shift">Shift</Label>
                <Input id="edit-shift" name="shift" defaultValue={editingStaff.shift || ''} />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select name="status" defaultValue={editingStaff.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Update Staff Member</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}