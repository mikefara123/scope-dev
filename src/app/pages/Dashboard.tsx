import { Link } from 'react-router';
import { 
  FolderOpen, 
  Clock, 
  DollarSign, 
  Send, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Users,
  BarChart3,
  Eye,
  FileText,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { mockProjects, mockActivities } from '@/app/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/multi-tenant';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MetricCard } from '@/app/components/common';

export function Dashboard() {
  const { user, agency } = useAuth();
  
  const activeProjects = mockProjects.filter(p => p.status === 'Active').length;
  const pendingApprovals = mockProjects.reduce((acc, p) => acc + (p.pendingAmount > 0 ? 1 : 0), 0);
  const totalBudgetValue = mockProjects.reduce((acc, p) => acc + p.totalBudgeted, 0);
  const budgetsSentThisMonth = 3;
  const completedProjects = mockProjects.filter(p => p.status === 'Completed').length;

  const recentActivities = mockActivities.slice(0, 5);

  // Mock data for charts
  const monthlyBudgetData = [
    { month: 'Jan', value: 145000, budgets: 4 },
    { month: 'Feb', value: 198000, budgets: 6 },
    { month: 'Mar', value: 167000, budgets: 5 },
    { month: 'Apr', value: 223000, budgets: 7 },
    { month: 'May', value: 289000, budgets: 9 },
    { month: 'Jun', value: 312000, budgets: 8 },
  ];

  const projectStatusData = [
    { name: 'Active', value: activeProjects, color: '#319795' },
    { name: 'Pending Approval', value: pendingApprovals, color: '#F59E0B' },
    { name: 'Completed', value: completedProjects, color: '#10B981' },
    { name: 'On Hold', value: 2, color: '#94A3B8' },
  ];

  const budgetBreakdownData = [
    { category: 'Furniture', value: 125000, color: '#1a365d' },
    { category: 'Lighting', value: 45000, color: '#319795' },
    { category: 'Fixtures', value: 67000, color: '#2d4a7c' },
    { category: 'Decor', value: 38000, color: '#4a9e9c' },
    { category: 'Other', value: 23000, color: '#94A3B8' },
  ];

  const upcomingDeadlines = [
    { id: 1, project: 'Riverside Penthouse', task: 'Budget v2.0 Review', dueDate: '2 days', priority: 'high' },
    { id: 2, project: 'Downtown Loft', task: 'Client Presentation', dueDate: '4 days', priority: 'medium' },
    { id: 3, project: 'Suburban Villa', task: 'Final Approval', dueDate: '1 week', priority: 'low' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto bg-background min-h-screen">
      {/* Header with Welcome Message */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/budgets">
            <Button variant="outline" size="lg" className="gap-2 shadow-lg">
              <Receipt className="h-5 w-5" />
              Go to My Budgets
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="secondary" size="lg" className="gap-2 shadow-lg">
              <FolderOpen className="h-5 w-5" />
              Go to My Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics - Enhanced with trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Active Projects"
          value={activeProjects}
          icon={FolderOpen}
          iconBgColor="secondary"
          borderColor="secondary"
          badge={{
            label: '+12%',
            variant: 'success',
            icon: TrendingUp,
          }}
          description="2 new this week"
        />

        <MetricCard
          label="Pending Approvals"
          value={pendingApprovals}
          icon={Clock}
          iconBgColor="warning"
          borderColor="warning"
          badge={{
            label: 'Action needed',
            variant: 'warning',
          }}
          description={`$${(mockProjects.reduce((acc, p) => acc + p.pendingAmount, 0) / 1000).toFixed(0)}k in value`}
        />

        <MetricCard
          label="Total Budget Value"
          value={`$${(totalBudgetValue / 1000).toFixed(0)}k`}
          icon={DollarSign}
          iconBgColor="success"
          borderColor="success"
          badge={{
            label: '+8%',
            variant: 'success',
            icon: TrendingUp,
          }}
          description={`Across ${mockProjects.length} projects`}
        />

        <MetricCard
          label="Budgets Sent"
          value={budgetsSentThisMonth}
          icon={Send}
          iconBgColor="primary"
          borderColor="primary"
          badge={{
            label: 'This month',
            variant: 'info',
          }}
          description="2 awaiting response"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Trend</CardTitle>
            <CardDescription>Monthly budget creation over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyBudgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#319795" 
                  strokeWidth={3}
                  dot={{ fill: '#319795', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Distribution of projects by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Breakdown by Category</CardTitle>
          <CardDescription>Total budget allocation across all active projects</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {budgetBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Enhanced */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your projects</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 hover:bg-muted/30 p-3 rounded-lg transition-colors">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: activity.type === 'budget_approved' 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(49, 151, 149, 0.1)' 
                    }}
                  >
                    {activity.type === 'budget_approved' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-[#319795]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.task}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.project}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        item.priority === 'high' 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : item.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due in {item.dueDate}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Projects Needing Attention - Enhanced */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects Needing Attention</CardTitle>
              <CardDescription>Budgets pending client approval</CardDescription>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {pendingApprovals} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProjects.filter(p => p.pendingAmount > 0).map((project) => (
              <Link 
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-[#319795] hover:bg-muted/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[#319795]/10 flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-[#319795]" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-[#319795] transition-colors">{project.clientName}</p>
                    <p className="text-sm text-muted-foreground">{project.address}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <Badge
                      style={{ 
                        backgroundColor: 'var(--warning)', 
                        color: 'white' 
                      }}
                    >
                      Pending Approval
                    </Badge>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      ${(project.pendingAmount / 1000).toFixed(0)}K pending
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-[#319795] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}