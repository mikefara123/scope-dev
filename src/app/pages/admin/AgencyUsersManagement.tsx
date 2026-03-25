import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Search, 
  Users, 
  UserPlus,
  Mail,
  Shield,
  Clock,
  MoreVertical,
  UserCheck,
  UserX,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

// Mock data for agency details
const mockAgency = {
  id: '1',
  name: 'Acme Design Studio',
  status: 'active',
  plan: 'Professional',
  totalSeats: 25,
  usedSeats: 18,
};

// Mock data for agency users
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@acmedesign.com',
    role: 'Agency Admin',
    status: 'active',
    lastActive: new Date('2026-01-28T10:30:00'),
    joinedDate: new Date('2024-03-15'),
    projectsCount: 12,
    budgetsCount: 24,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@acmedesign.com',
    role: 'Agency Admin',
    status: 'active',
    lastActive: new Date('2026-01-28T09:15:00'),
    joinedDate: new Date('2024-03-15'),
    projectsCount: 8,
    budgetsCount: 15,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@acmedesign.com',
    role: 'Designer',
    status: 'active',
    lastActive: new Date('2026-01-28T11:45:00'),
    joinedDate: new Date('2024-06-20'),
    projectsCount: 15,
    budgetsCount: 32,
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@acmedesign.com',
    role: 'Designer',
    status: 'active',
    lastActive: new Date('2026-01-27T16:20:00'),
    joinedDate: new Date('2024-08-10'),
    projectsCount: 10,
    budgetsCount: 18,
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@acmedesign.com',
    role: 'Designer',
    status: 'inactive',
    lastActive: new Date('2026-01-15T14:30:00'),
    joinedDate: new Date('2025-01-05'),
    projectsCount: 3,
    budgetsCount: 5,
  },
  {
    id: '6',
    name: 'Robert Martinez',
    email: 'robert.martinez@acmedesign.com',
    role: 'Read-Only',
    status: 'active',
    lastActive: new Date('2026-01-28T08:00:00'),
    joinedDate: new Date('2025-03-12'),
    projectsCount: 0,
    budgetsCount: 0,
  },
];

type ActionDialogType = 'deactivate' | 'activate' | 'reset-password' | 'change-role' | 'delete' | null;

export function AgencyUsersManagement() {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionDialog, setActionDialog] = useState<ActionDialogType>(null);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [newRole, setNewRole] = useState('');

  // Filter users
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAction = (action: ActionDialogType, user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setActionDialog(action);
    if (action === 'change-role') {
      setNewRole(user.role);
    }
  };

  const handleConfirmAction = () => {
    if (!selectedUser) return;

    switch (actionDialog) {
      case 'deactivate':
        toast.success(`${selectedUser.name} has been deactivated`);
        break;
      case 'activate':
        toast.success(`${selectedUser.name} has been activated`);
        break;
      case 'reset-password':
        toast.success(`Password reset email sent to ${selectedUser.email}`);
        break;
      case 'change-role':
        toast.success(`${selectedUser.name}'s role has been changed to ${newRole}`);
        break;
      case 'delete':
        toast.success(`${selectedUser.name} has been removed from the agency`);
        break;
    }

    setActionDialog(null);
    setSelectedUser(null);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Agency Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Designer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Read-Only':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportUsers = () => {
    toast.success('User list exported successfully');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/users')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agencies
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#319795]" />
              <h1 className="text-3xl font-semibold text-foreground">{mockAgency.name}</h1>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                {mockAgency.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Manage users and seat allocations for this agency
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportUsers} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-[#319795] hover:bg-[#2c7a7b] text-white">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Seat Usage Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Seat Usage</div>
              <div className="text-2xl font-bold mt-1">
                {mockAgency.usedSeats} / {mockAgency.totalSeats} seats
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Available</div>
              <div className="text-2xl font-bold text-[#319795]">
                {mockAgency.totalSeats - mockAgency.usedSeats}
              </div>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#319795] transition-all"
              style={{ width: `${(mockAgency.usedSeats / mockAgency.totalSeats) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>
              {((mockAgency.usedSeats / mockAgency.totalSeats) * 100).toFixed(0)}% utilized
            </span>
            <span>Plan: {mockAgency.plan}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockUsers.filter(u => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockUsers.filter(u => u.role === 'Agency Admin').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Designers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockUsers.filter(u => u.role === 'Designer').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agency Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Agency Admin">Agency Admin</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Read-Only">Read-Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Budgets</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadge(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(user.lastActive, { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{user.projectsCount}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{user.budgetsCount}</div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {user.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleAction('deactivate', user)}>
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAction('activate', user)}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={() => handleAction('reset-password', user)}>
                              <KeyRound className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handleAction('change-role', user)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleAction('delete', user)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      {/* Deactivate User Dialog */}
      <Dialog open={actionDialog === 'deactivate'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {selectedUser?.name}? They will no longer be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmAction}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate User Dialog */}
      <Dialog open={actionDialog === 'activate'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate User</DialogTitle>
            <DialogDescription>
              Activate {selectedUser?.name}? They will regain access to the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} className="bg-[#319795] hover:bg-[#2c7a7b]">
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={actionDialog === 'reset-password'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to {selectedUser?.email}? They will receive instructions to create a new password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} className="bg-[#319795] hover:bg-[#2c7a7b]">
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={actionDialog === 'change-role'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role">Select New Role</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger id="role" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agency Admin">Agency Admin</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Read-Only">Read-Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} className="bg-[#319795] hover:bg-[#2c7a7b]">
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={actionDialog === 'delete'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Remove User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedUser?.name} from this agency? This action cannot be undone. 
              All their projects and data will be reassigned or archived.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmAction}>
              Remove User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
