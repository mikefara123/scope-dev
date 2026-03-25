import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { AuditLogEntry } from '@/types/multi-tenant';
import { 
  FileText, 
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { cn } from '@/app/components/ui/utils';
import { StatCard } from '@/app/components/common';

export function AuditLog() {
  const { user, agency } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');

  // Mock audit log entries
  const mockAuditLog: AuditLogEntry[] = [
    {
      id: 'log-1',
      agency_id: user?.agency_id || '',
      user_id: 'user-2',
      user_name: 'Emily Thompson',
      action: 'approve',
      resource_type: 'budget',
      resource_id: 'budget-1',
      resource_name: 'Riverside Penthouse - Living Room',
      changes: [
        { field: 'status', old_value: 'pending', new_value: 'approved' }
      ],
      created_at: '2025-01-28T14:30:00Z',
    },
    {
      id: 'log-2',
      agency_id: user?.agency_id || '',
      user_id: 'user-3',
      user_name: 'Michael Johnson',
      action: 'create',
      resource_type: 'project',
      resource_id: 'proj-5',
      resource_name: 'Downtown Loft Redesign',
      created_at: '2025-01-28T10:15:00Z',
    },
    {
      id: 'log-3',
      agency_id: user?.agency_id || '',
      user_id: 'user-2',
      user_name: 'Emily Thompson',
      action: 'update',
      resource_type: 'budget',
      resource_id: 'budget-2',
      resource_name: 'Modern Villa - Kitchen',
      changes: [
        { field: 'total_cost', old_value: '$45,000', new_value: '$48,500' },
        { field: 'line_items', old_value: '12 items', new_value: '14 items' }
      ],
      created_at: '2025-01-27T16:45:00Z',
    },
    {
      id: 'log-4',
      agency_id: user?.agency_id || '',
      user_id: 'user-1',
      user_name: 'Jennifer Martinez',
      action: 'create',
      resource_type: 'user',
      resource_id: 'user-5',
      resource_name: 'Robert Davis',
      created_at: '2025-01-26T11:20:00Z',
    },
    {
      id: 'log-5',
      agency_id: user?.agency_id || '',
      user_id: 'user-3',
      user_name: 'Michael Johnson',
      action: 'send',
      resource_type: 'budget',
      resource_id: 'budget-3',
      resource_name: 'Corporate Office - Conference Room',
      created_at: '2025-01-26T09:30:00Z',
    },
    {
      id: 'log-6',
      agency_id: user?.agency_id || '',
      user_id: 'user-2',
      user_name: 'Emily Thompson',
      action: 'delete',
      resource_type: 'item',
      resource_id: 'item-42',
      resource_name: 'Vintage Chandelier',
      created_at: '2025-01-25T14:00:00Z',
    },
    {
      id: 'log-7',
      agency_id: user?.agency_id || '',
      user_id: 'user-1',
      user_name: 'Jennifer Martinez',
      action: 'update',
      resource_type: 'agency',
      resource_id: user?.agency_id || '',
      resource_name: agency?.name || '',
      changes: [
        { field: 'default_markup', old_value: '30%', new_value: '35%' }
      ],
      created_at: '2025-01-24T13:15:00Z',
    },
  ];

  // Filter audit log
  const filteredLogs = mockAuditLog.filter(log => {
    const matchesSearch = log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesResource = resourceFilter === 'all' || log.resource_type === resourceFilter;
    return matchesSearch && matchesAction && matchesResource;
  });

  const getActionBadge = (action: string) => {
    const variants: Record<string, string> = {
      create: 'bg-green-100 text-green-800 border-green-200',
      update: 'bg-blue-100 text-blue-800 border-blue-200',
      delete: 'bg-red-100 text-red-800 border-red-200',
      approve: 'bg-purple-100 text-purple-800 border-purple-200',
      reject: 'bg-orange-100 text-orange-800 border-orange-200',
      send: 'bg-teal-100 text-teal-800 border-teal-200',
      login: 'bg-gray-100 text-gray-800 border-gray-200',
      logout: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return variants[action] || variants.update;
  };

  const getResourceIcon = (resourceType: string) => {
    const icons: Record<string, React.ElementType> = {
      project: FileText,
      budget: FileText,
      item: FileText,
      user: User,
      agency: Activity,
      settings: Activity,
      library: FileText,
    };
    return icons[resourceType] || FileText;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Audit Log</h1>
          <p className="text-muted-foreground">
            Complete history of all changes and activities
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Activities"
          value={mockAuditLog.length}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          description="Last 7 days"
        />

        <StatCard
          label="Budget Changes"
          value={mockAuditLog.filter(l => l.resource_type === 'budget').length}
          icon={<FileText className="h-4 w-4 text-blue-600" />}
          description="Budget activities"
        />

        <StatCard
          label="User Actions"
          value={mockAuditLog.filter(l => l.resource_type === 'user').length}
          icon={<User className="h-4 w-4 text-green-600" />}
          description="User management"
        />

        <StatCard
          label="Approvals"
          value={mockAuditLog.filter(l => l.action === 'approve').length}
          icon={<Activity className="h-4 w-4 text-purple-600" />}
          description="Budget approvals"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, resource, or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="send">Send</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="budget">Budgets</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="item">Items</SelectItem>
                <SelectItem value="agency">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({filteredLogs.length})</CardTitle>
          <CardDescription>
            {filteredLogs.length === mockAuditLog.length 
              ? 'Showing all activities'
              : `Showing ${filteredLogs.length} of ${mockAuditLog.length} activities`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No activities found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    const ResourceIcon = getResourceIcon(log.resource_type);
                    
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="outline" className={cn('capitalize', getActionBadge(log.action))}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{log.user_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ResourceIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{log.resource_name || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground capitalize">{log.resource_type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.changes && log.changes.length > 0 ? (
                            <div className="space-y-1">
                              {log.changes.map((change, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="text-muted-foreground capitalize">{change.field}:</span>{' '}
                                  <span className="line-through text-red-600">{change.old_value}</span>
                                  {' → '}
                                  <span className="text-green-600">{change.new_value}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatTimeAgo(log.created_at)}
                          </div>
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
    </div>
  );
}