import { useState } from 'react';
import { mockSubscriptions, mockAgencies, getAgencyById } from '@/data/mock-multi-tenant';
import type { Subscription } from '@/types/multi-tenant';
import { 
  CreditCard, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Search
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

export function BillingManagement() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock payment history
  const paymentHistory = [
    {
      id: 'pay-1',
      agency_id: 'agency-1',
      amount: 490,
      status: 'succeeded',
      date: '2025-01-15',
      invoice_url: '#',
    },
    {
      id: 'pay-2',
      agency_id: 'agency-2',
      amount: 117,
      status: 'succeeded',
      date: '2025-01-20',
      invoice_url: '#',
    },
    {
      id: 'pay-3',
      agency_id: 'agency-1',
      amount: 490,
      status: 'succeeded',
      date: '2024-12-15',
      invoice_url: '#',
    },
  ];

  // Calculate metrics
  const totalMRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, sub) => sum + sub.total_price, 0);
  
  const totalARR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, sub) => {
      return sum + (sub.billing_cycle === 'annual' ? sub.total_price : sub.total_price * 12);
    }, 0);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const trialSubscriptions = subscriptions.filter(s => s.status === 'trial').length;

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const agency = getAgencyById(sub.agency_id);
    const matchesSearch = agency?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: React.ElementType }> = {
      active: { className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      trial: { className: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock },
      cancelled: { className: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle },
    };
    return variants[status] || variants.active;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Payments</h1>
        <p className="text-muted-foreground">
          Manage subscriptions, payments, and invoices
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total MRR"
          value={`$${totalMRR.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Monthly recurring revenue"
        />

        <StatCard
          label="Total ARR"
          value={`$${totalARR.toLocaleString()}`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Annual recurring revenue"
        />

        <StatCard
          label="Active Subscriptions"
          value={activeSubscriptions}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
          description="Paying customers"
        />

        <StatCard
          label="Trial Accounts"
          value={trialSubscriptions}
          icon={<Clock className="h-4 w-4 text-orange-600" />}
          description="Potential conversions"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="failed">Failed Payments</TabsTrigger>
        </TabsList>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by agency name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Subscriptions ({filteredSubscriptions.length})</CardTitle>
              <CardDescription>Manage customer subscriptions and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agency</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Billing Cycle</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Next Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((sub) => {
                      const agency = getAgencyById(sub.agency_id);
                      const statusInfo = getStatusBadge(sub.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <TableRow key={sub.id}>
                          <TableCell>
                            <div className="font-medium">{agency?.name || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground">
                              {sub.tier === 'starter' && '1-3 users'}
                              {sub.tier === 'professional' && '4-10 users'}
                              {sub.tier === 'enterprise' && 'Unlimited'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {sub.tier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('capitalize', statusInfo.className)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{sub.billing_cycle}</TableCell>
                          <TableCell>
                            <div className="font-medium">${sub.total_price}</div>
                            <div className="text-xs text-muted-foreground">
                              ${sub.price_per_license}/license
                            </div>
                          </TableCell>
                          <TableCell>
                            {sub.next_payment_date ? (
                              <span className="text-sm">
                                {new Date(sub.next_payment_date).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All successful payments across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => {
                      const agency = getAgencyById(payment.agency_id);
                      
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{agency?.name || 'Unknown'}</div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">${payment.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Succeeded
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failed Payments Tab */}
        <TabsContent value="failed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Failed Payments</CardTitle>
              <CardDescription>Payments that require attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Failed Payments</h3>
                <p className="text-muted-foreground">
                  All payments are processing successfully
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}