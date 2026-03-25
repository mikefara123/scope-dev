import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Search, 
  Building2, 
  Users, 
  ArrowRight,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

// Mock data for agencies with user statistics
const mockAgencies = [
  {
    id: '1',
    name: 'Acme Design Studio',
    status: 'active',
    plan: 'Professional',
    totalSeats: 25,
    usedSeats: 18,
    totalUsers: 18,
    activeUsers: 16,
    inactiveUsers: 2,
    adminUsers: 2,
    designerUsers: 14,
    readOnlyUsers: 2,
    lastActivity: new Date('2026-01-27'),
  },
  {
    id: '2',
    name: 'Modern Interiors Co.',
    status: 'active',
    plan: 'Enterprise',
    totalSeats: 50,
    usedSeats: 42,
    totalUsers: 42,
    activeUsers: 40,
    inactiveUsers: 2,
    adminUsers: 3,
    designerUsers: 35,
    readOnlyUsers: 4,
    lastActivity: new Date('2026-01-28'),
  },
  {
    id: '3',
    name: 'Elite Spaces',
    status: 'active',
    plan: 'Starter',
    totalSeats: 10,
    usedSeats: 8,
    totalUsers: 8,
    activeUsers: 7,
    inactiveUsers: 1,
    adminUsers: 1,
    designerUsers: 6,
    readOnlyUsers: 1,
    lastActivity: new Date('2026-01-26'),
  },
  {
    id: '4',
    name: 'Luxe Living Designs',
    status: 'trial',
    plan: 'Trial',
    totalSeats: 5,
    usedSeats: 3,
    totalUsers: 3,
    activeUsers: 3,
    inactiveUsers: 0,
    adminUsers: 1,
    designerUsers: 2,
    readOnlyUsers: 0,
    lastActivity: new Date('2026-01-28'),
  },
  {
    id: '5',
    name: 'Urban Studios',
    status: 'suspended',
    plan: 'Professional',
    totalSeats: 15,
    usedSeats: 12,
    totalUsers: 12,
    activeUsers: 0,
    inactiveUsers: 12,
    adminUsers: 1,
    designerUsers: 10,
    readOnlyUsers: 1,
    lastActivity: new Date('2026-01-10'),
  },
];

export function PlatformAdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Calculate totals
  const totalAgencies = mockAgencies.length;
  const totalUsers = mockAgencies.reduce((acc, agency) => acc + agency.totalUsers, 0);
  const totalSeats = mockAgencies.reduce((acc, agency) => acc + agency.totalSeats, 0);
  const usedSeats = mockAgencies.reduce((acc, agency) => acc + agency.usedSeats, 0);
  const seatUtilization = ((usedSeats / totalSeats) * 100).toFixed(1);

  // Filter agencies
  const filteredAgencies = mockAgencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;
    const matchesPlan = planFilter === 'all' || agency.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeatUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users across all agencies on the platform
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Agencies
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAgencies}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {mockAgencies.filter(a => a.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Across all agencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Seat Utilization
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getSeatUtilizationColor(parseFloat(seatUtilization))}`}>
              {seatUtilization}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {usedSeats} of {totalSeats} seats used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users Today
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockAgencies.reduce((acc, a) => acc + a.activeUsers, 0)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Currently online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Agencies</CardTitle>
          <CardDescription>
            Select an agency to view and manage their users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {/* Plan Filter */}
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
                <SelectItem value="Trial">Trial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agency List */}
          <div className="space-y-3">
            {filteredAgencies.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No agencies found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredAgencies.map((agency) => {
                const seatPercentage = (agency.usedSeats / agency.totalSeats) * 100;
                
                return (
                  <Link
                    key={agency.id}
                    to={`/admin/agencies/${agency.id}/users`}
                    className="block p-4 rounded-lg border border-border hover:border-[#319795] hover:bg-muted/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Agency Icon */}
                        <div className="h-12 w-12 rounded-lg bg-[#319795]/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-6 w-6 text-[#319795]" />
                        </div>

                        {/* Agency Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-[#319795] transition-colors">
                              {agency.name}
                            </h3>
                            <Badge variant="outline" className={getStatusColor(agency.status)}>
                              {agency.status}
                            </Badge>
                            <Badge variant="outline">
                              {agency.plan}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{agency.totalUsers} users</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={getSeatUtilizationColor(seatPercentage)}>
                                {agency.usedSeats}/{agency.totalSeats} seats ({seatPercentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div>
                              <span className="text-green-600">{agency.activeUsers} active</span>
                              {agency.inactiveUsers > 0 && (
                                <span className="text-muted-foreground"> · {agency.inactiveUsers} inactive</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Breakdown */}
                      <div className="hidden lg:flex items-center gap-6 mr-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-[#1a365d]">{agency.adminUsers}</div>
                          <div className="text-xs text-muted-foreground">Admins</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-[#319795]">{agency.designerUsers}</div>
                          <div className="text-xs text-muted-foreground">Designers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-muted-foreground">{agency.readOnlyUsers}</div>
                          <div className="text-xs text-muted-foreground">Read-Only</div>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-[#319795] transition-colors flex-shrink-0" />
                    </div>

                    {/* Progress Bar for Seat Usage */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Seat Usage</span>
                        <span className={getSeatUtilizationColor(seatPercentage)}>
                          {seatPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            seatPercentage >= 90
                              ? 'bg-red-500'
                              : seatPercentage >= 70
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${seatPercentage}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
