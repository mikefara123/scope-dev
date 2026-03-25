import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockAgencies, getUsersByAgency, getSubscriptionByAgency } from '@/data/mock-multi-tenant';
import type { Agency } from '@/types/multi-tenant';
import { 
  Building2, 
  Users, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  PauseCircle,
  PlayCircle,
  Crown
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';
import { StatCard } from '@/app/components/common/StatCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function AgenciesManagement() {
  const navigate = useNavigate();
  const [agencies] = useState<Agency[]>(mockAgencies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Filter agencies
  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;
    const matchesTier = tierFilter === 'all' || agency.subscription_tier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      trial: 'bg-orange-100 text-orange-800 border-orange-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return variants[status] || variants.active;
  };

  const getTierBadge = (tier: string) => {
    const variants: Record<string, string> = {
      starter: 'bg-blue-100 text-blue-800 border-blue-200',
      professional: 'bg-purple-100 text-purple-800 border-purple-200',
      enterprise: 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return variants[tier] || variants.starter;
  };

  const getAccountTypeIcon = (type: string) => {
    return type === 'company' ? <Building2 className="h-4 w-4" /> : <Users className="h-4 w-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agencies</h1>
          <p className="text-muted-foreground">
            Manage all design agencies on your platform
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Agency
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Tier Filter */}
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agencies Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Agencies ({filteredAgencies.length})</CardTitle>
          <CardDescription>
            {filteredAgencies.length === agencies.length 
              ? 'Showing all agencies'
              : `Showing ${filteredAgencies.length} of ${agencies.length} agencies`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agency</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Licenses</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No agencies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgencies.map((agency) => {
                    const users = getUsersByAgency(agency.id);
                    const subscription = getSubscriptionByAgency(agency.id);
                    
                    return (
                      <TableRow key={agency.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {agency.logo_url ? (
                              <img 
                                src={agency.logo_url} 
                                alt={agency.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{agency.name}</p>
                              <p className="text-sm text-muted-foreground">{agency.address?.split(',')[0] || 'No address'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAccountTypeIcon(agency.type)}
                            <span className="capitalize">{agency.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('capitalize', getStatusBadge(agency.status))}>
                            {agency.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('capitalize', getTierBadge(agency.subscription_tier))}>
                            {agency.subscription_tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{users.length}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'font-medium',
                              agency.used_licenses >= agency.total_licenses ? 'text-orange-600' : 'text-muted-foreground'
                            )}>
                              {agency.used_licenses} / {agency.total_licenses}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(agency.created_at).toLocaleDateString()}
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
                              <DropdownMenuItem onClick={() => navigate(`/admin/agencies/${agency.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Agency
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {agency.status === 'active' ? (
                                <DropdownMenuItem className="text-orange-600">
                                  <PauseCircle className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Agencies"
          value={agencies.length}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        />

        <StatCard
          label="Active"
          value={agencies.filter(a => a.status === 'active').length}
          icon={<PlayCircle className="h-4 w-4 text-green-600" />}
        />

        <StatCard
          label="Trial"
          value={agencies.filter(a => a.status === 'trial').length}
          icon={<Crown className="h-4 w-4 text-orange-600" />}
        />

        <StatCard
          label="Total Users"
          value={agencies.reduce((sum, agency) => sum + agency.used_licenses, 0)}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}