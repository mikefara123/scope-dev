import { mockPlatformAnalytics, mockAgencies } from '@/data/mock-multi-tenant';
import { 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  BarChart3,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { StatCard } from '@/app/components/common';

export function PlatformAnalytics() {
  const analytics = mockPlatformAnalytics;

  // User engagement over time
  const engagementData = [
    { date: 'Jan 1', dau: 5, wau: 7, mau: 9 },
    { date: 'Jan 8', dau: 6, wau: 8, mau: 9 },
    { date: 'Jan 15', dau: 7, wau: 8, mau: 9 },
    { date: 'Jan 22', dau: 7, wau: 9, mau: 9 },
    { date: 'Jan 28', dau: 7, wau: 8, mau: 9 },
  ];

  // Revenue metrics
  const revenueData = [
    { month: 'Jul', mrr: 2400, arr: 28800, new: 400 },
    { month: 'Aug', mrr: 2800, arr: 33600, new: 400 },
    { month: 'Sep', mrr: 3100, arr: 37200, new: 300 },
    { month: 'Oct', mrr: 3300, arr: 39600, new: 200 },
    { month: 'Nov', mrr: 3500, arr: 42000, new: 200 },
    { month: 'Dec', mrr: 3600, arr: 43200, new: 100 },
    { month: 'Jan', mrr: 3647, arr: 43764, new: 47 },
  ];

  // Budget approvals by value range
  const approvalsByValueData = [
    { range: '$0-50k', count: 28, color: '#6366f1' },
    { range: '$50-100k', count: 35, color: '#8b5cf6' },
    { range: '$100-150k', count: 22, color: '#a855f7' },
    { range: '$150k+', count: 13, color: '#c084fc' },
  ];

  // Regional distribution (mock)
  const regionalData = [
    { region: 'West Coast', users: 4, agencies: 2, color: '#10b981' },
    { region: 'East Coast', users: 3, agencies: 1, color: '#3b82f6' },
    { region: 'Midwest', users: 2, agencies: 0, color: '#f59e0b' },
  ];

  // Feature usage
  const featureUsageData = [
    { feature: 'Budget Builder', usage: 95 },
    { feature: 'Client Approvals', usage: 88 },
    { feature: 'Cost Tracking', usage: 72 },
    { feature: 'Reports', usage: 65 },
    { feature: 'Item Library', usage: 90 },
  ];

  // Churn data
  const churnData = [
    { month: 'Jul', retained: 100, churned: 0 },
    { month: 'Aug', retained: 100, churned: 0 },
    { month: 'Sep', retained: 100, churned: 0 },
    { month: 'Oct', retained: 100, churned: 0 },
    { month: 'Nov', retained: 100, churned: 0 },
    { month: 'Dec', retained: 100, churned: 0 },
    { month: 'Jan', retained: 100, churned: 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-muted-foreground">
          Deep insights into user engagement, revenue, and platform health
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              label="Active Today"
              value={analytics.active_users_today}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              description={`${Math.round((analytics.active_users_today / analytics.total_users) * 100)}% of total users`}
            />

            <StatCard
              label="Active This Week"
              value={analytics.active_users_this_week}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              description={`${Math.round((analytics.active_users_this_week / analytics.total_users) * 100)}% of total users`}
            />

            <StatCard
              label="Active This Month"
              value={analytics.active_users_this_month}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              description="100% engagement rate"
            />

            <StatCard
              label="Approvals/Week"
              value={analytics.approvals_this_week}
              icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
              description="+8% from last week"
            />
          </div>

          {/* Engagement Trends */}
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Trend</CardTitle>
              <CardDescription>Daily, weekly, and monthly active users over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="dau" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDau)" name="Daily Active" />
                  <Area type="monotone" dataKey="wau" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorWau)" name="Weekly Active" />
                  <Area type="monotone" dataKey="mau" stroke="#10b981" fillOpacity={1} fill="url(#colorMau)" name="Monthly Active" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Approvals by Value */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Approvals by Value Range</CardTitle>
              <CardDescription>Distribution of approval amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={approvalsByValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Approvals">
                    {approvalsByValueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="MRR"
              value={`$${analytics.mrr.toLocaleString()}`}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              description="+12.5% from last month"
            />

            <StatCard
              label="ARR"
              value={`$${analytics.arr.toLocaleString()}`}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              description="Annual recurring revenue"
            />

            <StatCard
              label="ARPU"
              value={`$${Math.round(analytics.mrr / analytics.total_users)}`}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              description="Average revenue per user"
            />
          </div>

          {/* Revenue Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
              <CardDescription>MRR and ARR trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="mrr" stroke="#3b82f6" strokeWidth={2} name="MRR ($)" />
                  <Line yAxisId="left" type="monotone" dataKey="new" stroke="#10b981" strokeWidth={2} name="New MRR ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Churn Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Retention & Churn</CardTitle>
              <CardDescription>Customer retention over time (percentage)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={churnData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="retained" stackId="1" stroke="#10b981" fill="#10b981" name="Retained %" />
                  <Area type="monotone" dataKey="churned" stackId="1" stroke="#ef4444" fill="#ef4444" name="Churned %" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900">
                  ✨ Excellent retention! 0% churn rate for the past 6 months
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Users and agencies by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {regionalData.map((region) => (
                  <div key={region.region}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5" style={{ color: region.color }} />
                        <span className="font-medium">{region.region}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{region.agencies} agencies</span>
                        <span className="font-medium">{region.users} users</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${(region.users / analytics.total_users) * 100}%`,
                          backgroundColor: region.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regionalData.map((region) => (
              <Card key={region.region}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" style={{ color: region.color }} />
                    {region.region}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Agencies</span>
                    <span className="font-semibold">{region.agencies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Users</span>
                    <span className="font-semibold">{region.users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">% of Total</span>
                    <span className="font-semibold">{Math.round((region.users / analytics.total_users) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Adoption</CardTitle>
              <CardDescription>Percentage of users actively using each feature</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureUsageData.map((feature) => (
                  <div key={feature.feature}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{feature.feature}</span>
                      <span className="text-sm font-semibold">{feature.usage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${feature.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Used Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="font-medium">Budget Builder</span>
                    <span className="text-primary font-semibold">95%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="font-medium">Item Library</span>
                    <span className="text-primary font-semibold">90%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="font-medium">Client Approvals</span>
                    <span className="text-primary font-semibold">88%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="font-medium">Reports</span>
                    <span className="text-orange-600 font-semibold">65%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="font-medium">Cost Tracking</span>
                    <span className="text-orange-600 font-semibold">72%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Consider onboarding improvements or tutorials for these features
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}