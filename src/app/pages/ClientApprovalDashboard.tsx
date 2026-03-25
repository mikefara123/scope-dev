import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  Building2,
  User,
  LayoutGrid,
  List,
  Package,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { ViewModeToggle } from '@/app/components/common';

// Mock data - in production, this would be fetched via the token
const mockClientData = {
  clientName: 'John & Mary Anderson',
  clientEmail: 'john.anderson@email.com',
  companyName: 'Anderson Family',
  agencyName: 'Luxe Interiors Design Studio',
  agencyLogo: null,
  designerName: 'Emily Thompson',
  designerEmail: 'emily@luxeinteriors.com',
  designerPhone: '(555) 123-4567',
};

const mockClientBudgets = [
  {
    id: 'budget-1',
    token: 'abc123xyz',
    projectName: 'Riverside Penthouse',
    budgetName: 'Budget v2.0 - Living Room & Kitchen',
    version: 'v2.0',
    phase: 'Living Room & Kitchen',
    totalAmount: 125000,
    itemCount: 24,
    status: 'Pending Review',
    sentDate: new Date('2026-02-01'),
    dueDate: new Date('2026-02-08'),
    designerMessage: 'Hi John and Mary, here\'s the revised budget with the changes we discussed.',
    lastViewed: null,
    hasComments: true,
    unreadComments: 2,
  },
  {
    id: 'budget-2',
    token: 'def456abc',
    projectName: 'Riverside Penthouse',
    budgetName: 'Budget v1.0 - Master Bedroom',
    version: 'v1.0',
    phase: 'Master Bedroom',
    totalAmount: 68500,
    itemCount: 18,
    status: 'Pending Review',
    sentDate: new Date('2026-01-28'),
    dueDate: new Date('2026-02-05'),
    designerMessage: 'Excited to share the master bedroom selections with you!',
    lastViewed: new Date('2026-01-29'),
    hasComments: false,
    unreadComments: 0,
  },
  {
    id: 'budget-3',
    token: 'ghi789def',
    projectName: 'Riverside Penthouse',
    budgetName: 'Budget v1.0 - Living Room & Kitchen',
    version: 'v1.0',
    phase: 'Living Room & Kitchen',
    totalAmount: 118000,
    itemCount: 22,
    status: 'Approved',
    sentDate: new Date('2026-01-20'),
    dueDate: new Date('2026-01-27'),
    designerMessage: 'Initial budget for your review.',
    lastViewed: new Date('2026-01-21'),
    approvedDate: new Date('2026-01-22'),
    hasComments: true,
    unreadComments: 0,
  },
  {
    id: 'budget-4',
    token: 'jkl012ghi',
    projectName: 'Riverside Penthouse',
    budgetName: 'Budget v1.0 - Dining Room',
    version: 'v1.0',
    phase: 'Dining Room',
    totalAmount: 42000,
    itemCount: 12,
    status: 'Changes Requested',
    sentDate: new Date('2026-01-25'),
    dueDate: new Date('2026-02-02'),
    designerMessage: 'Dining room furniture and lighting selections.',
    lastViewed: new Date('2026-01-26'),
    hasComments: true,
    unreadComments: 1,
  },
];

type ViewMode = 'card' | 'list';
type StatusFilter = 'all' | 'Pending Review' | 'Approved' | 'Changes Requested';

export function ClientApprovalDashboard() {
  const { token } = useParams();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter budgets
  const filteredBudgets = mockClientBudgets.filter(budget => {
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    const matchesSearch = 
      budget.budgetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.phase?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const pendingCount = mockClientBudgets.filter(b => b.status === 'Pending Review').length;
  const approvedCount = mockClientBudgets.filter(b => b.status === 'Approved').length;
  const changesRequestedCount = mockClientBudgets.filter(b => b.status === 'Changes Requested').length;
  const totalPendingValue = mockClientBudgets
    .filter(b => b.status === 'Pending Review')
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const totalUnreadComments = mockClientBudgets.reduce((sum, b) => sum + b.unreadComments, 0);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending Review': return 'warning';
      case 'Changes Requested': return 'destructive';
      default: return 'subtle';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="h-4 w-4" />;
      case 'Pending Review': return <Clock className="h-4 w-4" />;
      case 'Changes Requested': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: Date) => {
    return new Date() > dueDate;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-primary text-white shadow-xl">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm text-white/80">Sent by {mockClientData.agencyName}</p>
                  <h1 className="text-3xl font-bold">Budget Approval Portal</h1>
                </div>
              </div>
              <p className="text-lg text-white/90 mt-2">
                Welcome, {mockClientData.clientName}
              </p>
            </div>
            
            {/* Designer Contact Card */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{mockClientData.designerName}</p>
                    <p className="text-sm text-white/80">Your Designer</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-white/90">{mockClientData.designerEmail}</p>
                      <p className="text-white/90">{mockClientData.designerPhone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-warning bg-white shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Pending Review
              </CardTitle>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm bg-warning">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-foreground">{pendingCount}</div>
              </div>
              {totalPendingValue > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  ${totalPendingValue.toLocaleString()} total
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-success bg-white shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Approved
              </CardTitle>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm bg-success">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-foreground">{approvedCount}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">All set!</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive bg-white shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Changes Requested
              </CardTitle>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm bg-destructive">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-foreground">{changesRequestedCount}</div>
              </div>
              {changesRequestedCount > 0 && (
                <p className="text-xs text-muted-foreground mt-2">Needs your feedback</p>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary bg-white shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Unread Messages
              </CardTitle>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm bg-secondary">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-foreground">{totalUnreadComments}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {totalUnreadComments > 0 ? "New updates" : "You're all caught up"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-soft">
          <div className="flex items-center gap-4 flex-1">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Budgets</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Changes Requested">Changes Requested</option>
            </select>
            
            <input
              type="search"
              placeholder="Search budgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <ViewModeToggle
            modes={[
              { value: 'card' as const, label: 'Card', icon: <LayoutGrid className="h-4 w-4" /> },
              { value: 'list' as const, label: 'List', icon: <List className="h-4 w-4" /> }
            ]}
            currentMode={viewMode}
            onChange={setViewMode}
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredBudgets.length} of {mockClientBudgets.length} budgets
        </div>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBudgets.map((budget) => (
              <Card 
                key={budget.id}
                className="hover:shadow-float transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-secondary"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-secondary transition-colors">
                        {budget.budgetName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{budget.projectName}</p>
                    </div>
                    {budget.unreadComments > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {budget.unreadComments} new
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStatusVariant(budget.status)} className="gap-1">
                      {getStatusIcon(budget.status)}
                      {budget.status}
                    </Badge>
                    {isOverdue(budget.dueDate) && budget.status === 'Pending Review' && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Amount and Items */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>Total Amount</span>
                      </div>
                      <span className="font-mono font-bold text-foreground text-lg">
                        ${budget.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>Items</span>
                      </div>
                      <span className="font-semibold">{budget.itemCount}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Sent {formatDistanceToNow(budget.sentDate)} ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className={isOverdue(budget.dueDate) && budget.status === 'Pending Review' ? 'text-destructive font-semibold' : ''}>
                        Due {format(budget.dueDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                    {budget.lastViewed && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>Last viewed {formatDistanceToNow(budget.lastViewed)} ago</span>
                      </div>
                    )}
                  </div>

                  {/* Designer Message Preview */}
                  {budget.designerMessage && (
                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {budget.designerMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link to={`/approve/${budget.token}`}>
                    <Button 
                      variant="gradient"
                      size="lg"
                      className="w-full gap-2 shadow-md"
                    >
                      {budget.status === 'Pending Review' ? 'Review Budget' : 'View Budget'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <Card className="overflow-hidden shadow-elevated">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Budget
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Project
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Items
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Due Date
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBudgets.map((budget) => (
                    <tr 
                      key={budget.id}
                      className="hover:bg-accent/30 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                              {budget.budgetName}
                            </span>
                            {budget.unreadComments > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {budget.unreadComments} new
                              </Badge>
                            )}
                          </div>
                          {budget.lastViewed && (
                            <span className="text-xs text-muted-foreground">
                              Last viewed {formatDistanceToNow(budget.lastViewed)} ago
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {budget.projectName}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(budget.status)} className="gap-1">
                            {getStatusIcon(budget.status)}
                            {budget.status}
                          </Badge>
                          {isOverdue(budget.dueDate) && budget.status === 'Pending Review' && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono font-bold text-foreground">
                          ${budget.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-semibold">{budget.itemCount}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-sm ${isOverdue(budget.dueDate) && budget.status === 'Pending Review' ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                            {format(budget.dueDate, 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Sent {formatDistanceToNow(budget.sentDate)} ago
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link to={`/approve/${budget.token}`}>
                          <Button 
                            variant="gradient"
                            size="sm"
                            className="gap-2 shadow-sm"
                          >
                            {budget.status === 'Pending Review' ? 'Review' : 'View'}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {filteredBudgets.length === 0 && (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">No budgets found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'No budgets have been sent for your review yet.'
                  }
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Help Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about a budget or need clarification on any items, 
                  don't hesitate to reach out to your designer.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Contact {mockClientData.designerName}
                  </Button>
                  <Button variant="ghost" size="sm">
                    View FAQ
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}