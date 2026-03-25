import { useAuth } from '@/contexts/AuthContext';
import { mockPlatformAnalytics, mockAgencies, mockUsers, mockSubscriptions } from '@/data/mock-multi-tenant';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard } from '@/app/components/common';

export function PlatformDashboard() {
  const { user } = useAuth();
  const analytics = mockPlatformAnalytics;

  // Calculate additional metrics
  const activeSubscriptions = mockSubscriptions.filter(s => s.status === 'active').length;
  const trialSubscriptions = mockSubscriptions.filter(s => s.status === 'trial').length;
  
  // Monthly approvals data (mock)
  const approvalsData = [
    { month: 'Jul', approvals: 28 },
    { month: 'Aug', approvals: 35 },
    { month: 'Sep', approvals: 42 },
    { month: 'Oct', approvals: 38 },
    { month: 'Nov', approvals: 45 },
    { month: 'Dec', approvals: 48 },
    { month: 'Jan', approvals: 48 },
  ];

  // Revenue data
  const revenueData = [
    { month: 'Jul', mrr: 2400 },
    { month: 'Aug', mrr: 2800 },
    { month: 'Sep', mrr: 3100 },
    { month: 'Oct', mrr: 3300 },
    { month: 'Nov', mrr: 3500 },
    { month: 'Dec', mrr: 3600 },
    { month: 'Jan', mrr: 3647 },
  ];

  // Agency status distribution
  const agencyStatusData = [
    { name: 'Active', value: analytics.active_agencies, color: '#10b981' },
    { name: 'Trial', value: analytics.trial_agencies, color: '#f59e0b' },
    { name: 'Suspended', value: 0, color: '#ef4444' },
  ];

  // Subscription tier distribution
  const tierData = [
    { name: 'Starter', value: 2, color: '#6366f1' },
    { name: 'Professional', value: 1, color: '#8b5cf6' },
    { name: 'Enterprise', value: 0, color: '#ec4899' },
  ];

  // Recent activities (mock)
  const recentActivities = [
    {
      id: 1,
      agency: 'Luxe Interiors Design Studio',
      action: 'Budget Approved',
      user: 'Emily Thompson',
      value: '$125,000',
      time: '2 hours ago'
    },
    {
      id: 2,
      agency: 'Modern Living Co.',
      action: 'New Project Created',
      user: 'Amanda Rodriguez',
      value: null,
      time: '4 hours ago'
    },
    {
      id: 3,
      agency: 'Sarah Chen Design',
      action: 'Trial Started',
      user: 'Sarah Chen',
      value: null,
      time: '1 day ago'
    },
    {
      id: 4,
      agency: 'Luxe Interiors Design Studio',
      action: 'Budget Approved',
      user: 'Michael Johnson',
      value: '$98,500',
      time: '1 day ago'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here's what's happening across your platform.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Agencies"
          value={analytics.total_agencies}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          description={`+${analytics.trial_agencies} in trial`}
        />

        <StatCard
          label="Active Users"
          value={analytics.total_users}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description={`${analytics.active_users_today} active today`}
        />

        <StatCard
          label="Monthly Revenue"
          value={`$${analytics.mrr.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="+12.5% from last month"
        />

        <StatCard
          label="Approvals This Month"
          value={analytics.approvals_this_month}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description={`Avg. $${(analytics.average_approval_value / 1000).toFixed(0)}k per approval`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approvals Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Approvals Trend</CardTitle>
            <CardDescription>Monthly approval activity across all agencies</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={approvalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="approvals" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Approvals"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly recurring revenue (MRR) trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="mrr" 
                  fill="hsl(var(--secondary))" 
                  name="MRR ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agency Status */}
        <Card>
          <CardHeader>
            <CardTitle>Agency Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={agencyStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agencyStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Tiers */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Tiers</CardTitle>
            <CardDescription>Distribution by plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Platform highlights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm">Active Subscriptions</span>
              </div>
              <span className="font-semibold">{activeSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Trial Accounts</span>
              </div>
              <span className="font-semibold">{trialSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Total Projects</span>
              </div>
              <span className="font-semibold">{analytics.total_projects}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Total Budgets</span>
              </div>
              <span className="font-semibold">{analytics.total_budgets}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across all agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.agency} • {activity.user}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.value && (
                    <p className="font-semibold text-green-600">{activity.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}