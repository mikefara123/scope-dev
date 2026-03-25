import { useState } from 'react';
import { Plus, Users, UserCheck, Mail, Crown, Search, MoreVertical, Edit, Trash2, Shield, UserX } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { InviteUserModal } from '@/app/components/modals/InviteUserModal';
import { EditUserModal } from '@/app/components/modals/EditUserModal';
import { DeleteConfirmDialog } from '@/app/components/modals/DeleteConfirmDialog';
import { toast } from 'sonner';
import { StatCard } from '@/app/components/common';
import { useAuth } from '@/contexts/AuthContext';
import { getUsersByAgency } from '@/data/mock-multi-tenant';
import { User, UserStatus } from '@/types/multi-tenant';
import { getRoleDisplayName, getRoleBadgeColor } from '@/lib/permissions';
import { cn } from '@/app/components/ui/utils';

export function UserManagement() {
  const { user: currentUser, agency } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get users for current agency
  const agencyUsers = currentUser ? getUsersByAgency(currentUser.agency_id) : [];

  // Filter users
  const filteredUsers = agencyUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: UserStatus) => {
    const variants: Record<UserStatus, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      invited: 'bg-blue-100 text-blue-800 border-blue-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
    };
    return variants[status];
  };

  const getStatusIcon = (status: UserStatus) => {
    const icons: Record<UserStatus, React.ElementType> = {
      active: UserCheck,
      invited: Mail,
      suspended: UserX,
    };
    return icons[status];
  };

  // Calculate stats
  const activeUsers = agencyUsers.filter(u => u.status === 'active').length;
  const invitedUsers = agencyUsers.filter(u => u.status === 'invited').length;
  const availableLicenses = agency ? agency.total_licenses - agency.used_licenses : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage team members and their access levels
          </p>
        </div>
        <Button className="gap-2" onClick={() => setInviteModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={agencyUsers.length}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Team members"
        />

        <StatCard
          label="Active Users"
          value={activeUsers}
          icon={<UserCheck className="h-4 w-4 text-green-600" />}
          description="Currently active"
        />

        <StatCard
          label="Pending Invites"
          value={invitedUsers}
          icon={<Mail className="h-4 w-4 text-blue-600" />}
          description="Awaiting acceptance"
        />

        <StatCard
          label="Available Licenses"
          value={availableLicenses}
          icon={<Crown className="h-4 w-4 text-muted-foreground" />}
          description={`${agency?.total_licenses} total licenses`}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="agency_admin">Agency Admin</SelectItem>
                <SelectItem value="general_user">Designer</SelectItem>
                <SelectItem value="read_only">Read-Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {filteredUsers.length === agencyUsers.length 
              ? 'Showing all users'
              : `Showing ${filteredUsers.length} of ${agencyUsers.length} users`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const StatusIcon = getStatusIcon(user.status);
                    const isCurrentUser = user.id === currentUser?.id;
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ 
                                backgroundColor: user.avatar_url ? 'transparent' : 'hsl(var(--primary))',
                                backgroundImage: user.avatar_url ? `url(${user.avatar_url})` : 'none',
                                backgroundSize: 'cover'
                              }}
                            >
                              {!user.avatar_url && (
                                <span className="text-sm font-semibold text-white">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                {user.name}
                                {isCurrentUser && (
                                  <Badge variant="outline" className="text-xs">You</Badge>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(getRoleBadgeColor(user.role))}>
                            <Shield className="h-3 w-3 mr-1" />
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('capitalize', getStatusBadge(user.status))}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.last_login ? (
                            <span className="text-sm">
                              {new Date(user.last_login).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setEditModalOpen(true);
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem className="text-orange-600">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              {!isCurrentUser && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive" onClick={() => {
                                    setSelectedUser(user);
                                    setDeleteDialogOpen(true);
                                  }}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove User
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* License Warning */}
      {availableLicenses === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <Crown className="h-5 w-5" />
              No Available Licenses
            </CardTitle>
            <CardDescription className="text-orange-700">
              You've used all {agency?.total_licenses} of your licenses. Upgrade your plan to invite more team members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="border-orange-300 text-orange-900 hover:bg-orange-100">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Invite User Modal */}
      <InviteUserModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        availableLicenses={availableLicenses}
        onInvite={(data) => {
          console.log('Inviting user:', data);
          toast.success(`Invitation sent to ${data.email}`);
        }}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        user={selectedUser}
        onSave={(userId, data) => {
          console.log('Saving user:', userId, data);
          toast.success('User updated successfully');
        }}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Remove Team Member"
        description="Are you sure you want to remove this user? They will immediately lose access to all projects and budgets."
        itemName={selectedUser?.name}
        warningMessage="This action cannot be undone. The user will need to be re-invited if you want to restore their access."
        onConfirm={async () => {
          console.log('Deleting user:', selectedUser?.id);
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.success('User removed successfully');
        }}
      />
    </div>
  );
}