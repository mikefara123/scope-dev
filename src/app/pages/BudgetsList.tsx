import { Link } from 'react-router';
import { MoreVertical, Plus, Info, LayoutGrid, List, FileText, Calendar, DollarSign, Package, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { mockBudgets, getProjectById } from '@/app/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { CreateBudgetModal } from '@/app/components/modals/CreateBudgetModal';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/lib/permissions';
import { ViewModeToggle, EmptyState } from '@/app/components/common';

type ViewMode = 'card' | 'list';
type SortColumn = 'name' | 'project' | 'phase' | 'status' | 'items' | 'total' | 'updated';
type SortDirection = 'asc' | 'desc';

export function BudgetsList() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { hasPermission } = useAuth();

  const handleCreateBudget = (data: any) => {
    console.log('Creating budget:', data);
    // TODO: Implement budget creation logic
  };

  const canCreateBudget = hasPermission(Permission.CREATE_BUDGET);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredBudgets = mockBudgets.filter(budget => {
    const project = getProjectById(budget.projectId);
    const matchesSearch = 
      budget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project?.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.phase?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    const matchesProject = projectFilter === 'all' || budget.projectId === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  }).sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'project':
        aValue = getProjectById(a.projectId)?.clientName.toLowerCase() || '';
        bValue = getProjectById(b.projectId)?.clientName.toLowerCase() || '';
        break;
      case 'phase':
        aValue = a.phase?.toLowerCase() || '';
        bValue = b.phase?.toLowerCase() || '';
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'items':
        aValue = a.lineItems.length;
        bValue = b.lineItems.length;
        break;
      case 'total':
        aValue = a.grandTotal;
        bValue = b.grandTotal;
        break;
      case 'updated':
        aValue = a.updatedAt.getTime();
        bValue = b.updatedAt.getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const uniqueProjects = Array.from(new Set(mockBudgets.map(b => b.projectId)))
    .map(id => getProjectById(id))
    .filter(Boolean);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed': 
      case 'Approved': 
        return 'success';
      case 'Draft': 
        return 'subtle';
      case 'Rejected': 
        return 'destructive';
      case 'In Review (Internal)':
      case 'In Review (Client)':
      case 'Pending Client':
        return 'warning';
      case 'Tracking':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Archived':
        return 'secondary';
      default: 
        return 'warning';
    }
  };

  const SortableHeader = ({ column, children }: { column: SortColumn; children: React.ReactNode }) => (
    <th 
      className="text-left p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortColumn === column ? (
          sortDirection === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-30" />
        )}
      </div>
    </th>
  );

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto bg-background min-h-screen">
      {/* Header with Title and Actions */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Budgets</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all project budgets
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasPermission(Permission.CREATE_BUDGET) && (
            <Button onClick={() => setShowCreateModal(true)} size="lg" className="gap-2 shadow-md">
              <Plus className="h-5 w-5" />
              New Budget
            </Button>
          )}
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-soft">
        <div className="flex items-center gap-4 flex-1">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="In Review (Internal)">In Review (Internal)</option>
            <option value="In Review (Client)">In Review (Client)</option>
            <option value="Rejected">Rejected</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Tracking">Tracking</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
          
          <select 
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Projects</option>
            {uniqueProjects.map(project => (
              <option key={project!.id} value={project!.id}>
                {project!.clientName}
              </option>
            ))}
          </select>
          
          <input
            type="search"
            placeholder="Search budgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* View Mode Toggle */}
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
        Showing {filteredBudgets.length} of {mockBudgets.length} budgets
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => {
            const project = getProjectById(budget.projectId);
            return (
              <Link 
                key={budget.id} 
                to={`/projects/${budget.projectId}/budgets/${budget.id}`}
                className="block"
              >
                <Card className="hover:shadow-float transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-secondary cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">
                          {budget.name} {budget.version}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{project?.clientName}</p>
                        {budget.phase && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {budget.phase}
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-accent"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // TODO: Show dropdown menu
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    <Badge
                      variant={getStatusVariant(budget.status)}
                      className="mb-4"
                    >
                      {budget.status}
                    </Badge>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>Total Amount</span>
                        </div>
                        <span className="font-mono font-bold text-foreground">
                          ${budget.grandTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>Items</span>
                        </div>
                        <span className="font-semibold">{budget.lineItems.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      Updated {formatDistanceToNow(budget.updatedAt)} ago
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card className="overflow-hidden shadow-elevated">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <SortableHeader column="name">
                    Budget Name
                  </SortableHeader>
                  <SortableHeader column="project">
                    Project
                  </SortableHeader>
                  <SortableHeader column="phase">
                    Phase
                  </SortableHeader>
                  <SortableHeader column="status">
                    Status
                  </SortableHeader>
                  <th 
                    className="text-right p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleSort('items')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Items
                      {sortColumn === 'items' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-right p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Total Amount
                      {sortColumn === 'total' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </div>
                  </th>
                  <SortableHeader column="updated">
                    Last Updated
                  </SortableHeader>
                  <th className="text-right p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBudgets.map((budget) => {
                  const project = getProjectById(budget.projectId);
                  return (
                    <tr 
                      key={budget.id}
                      className="hover:bg-accent/30 transition-colors group cursor-pointer"
                      onClick={() => window.location.href = `/projects/${budget.projectId}/budgets/${budget.id}`}
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                            {budget.name} {budget.version}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {project?.clientName}
                        </span>
                      </td>
                      <td className="p-4">
                        {budget.phase ? (
                          <span className="text-sm text-muted-foreground">
                            {budget.phase}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusVariant(budget.status)}>
                          {budget.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-semibold">{budget.lineItems.length}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono font-bold text-foreground">
                          ${budget.grandTotal.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          {formatDistanceToNow(budget.updatedAt)} ago
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Show dropdown menu
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredBudgets.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No budgets found"
          description={
            searchQuery || statusFilter !== 'all' || projectFilter !== 'all'
              ? 'Try adjusting your filters' 
              : 'Get started by creating your first budget'
          }
          action={
            !searchQuery && statusFilter === 'all' && projectFilter === 'all' ? (
              <Button onClick={() => setShowCreateModal(true)} variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Create Budget Modal */}
      <CreateBudgetModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateBudget}
      />
    </div>
  );
}