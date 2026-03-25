import { Link } from 'react-router';
import { Plus, MoreVertical, LayoutGrid, List, MapPin, DollarSign, Clock, ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockProjects } from '@/app/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { CreateProjectModal } from '@/app/components/modals/CreateProjectModal';
import { EmptyState, ViewModeToggle, InfoItem, InfoRow } from '@/app/components/common';

type ViewMode = 'card' | 'list';
type SortColumn = 'client' | 'status' | 'budget' | 'approved' | 'pending' | 'progress' | 'updated' | 'clientAccessed';
type SortDirection = 'asc' | 'desc';

export function ProjectsList() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case 'client':
        aValue = a.clientName.toLowerCase();
        bValue = b.clientName.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'budget':
        aValue = a.totalBudgeted;
        bValue = b.totalBudgeted;
        break;
      case 'approved':
        aValue = a.approvedAmount;
        bValue = b.approvedAmount;
        break;
      case 'pending':
        aValue = a.pendingAmount;
        bValue = b.pendingAmount;
        break;
      case 'progress':
        aValue = (a.approvedAmount / a.totalBudgeted) * 100;
        bValue = (b.approvedAmount / b.totalBudgeted) * 100;
        break;
      case 'updated':
        aValue = a.updatedAt.getTime();
        bValue = b.updatedAt.getTime();
        break;
      case 'clientAccessed':
        // Mock data - in production this would be actual client access timestamps
        aValue = (a as any).clientLastAccessed?.getTime() || 0;
        bValue = (b as any).clientLastAccessed?.getTime() || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ column, children, align = 'left' }: { column: SortColumn; children: React.ReactNode; align?: 'left' | 'right' }) => (
    <th 
      className={`p-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted/30 transition-colors ${align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => handleSort(column)}
    >
      <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage all your client projects</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="gradient"
          size="lg"
          className="gap-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-soft">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
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
        Showing {filteredProjects.length} of {mockProjects.length} projects
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="h-full hover:shadow-float transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-secondary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-secondary transition-colors">
                        {project.clientName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {project.address}
                      </div>
                    </div>
                    <button className="p-1 hover:bg-accent rounded transition-colors">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <Badge
                    variant={project.status === 'Active' ? 'success' : project.status === 'Completed' ? 'info' : 'warning'}
                    className="mb-4"
                  >
                    {project.status}
                  </Badge>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>Total Budget</span>
                      </div>
                      <span className="font-bold font-mono">${(project.totalBudgeted / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-success/5">
                      <span className="text-muted-foreground">Approved</span>
                      <span className="font-semibold font-mono text-success">${(project.approvedAmount / 1000).toFixed(0)}K</span>
                    </div>
                    {project.pendingAmount > 0 && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-warning/5">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-semibold font-mono text-[var(--warning)]">
                          ${(project.pendingAmount / 1000).toFixed(0)}K
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {project.totalBudgeted > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="font-mono">
                          {Math.round((project.approvedAmount / project.totalBudgeted) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary transition-all duration-500"
                          style={{ 
                            width: `${(project.approvedAmount / project.totalBudgeted) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
                  <SortableHeader column="client">
                    Client & Location
                  </SortableHeader>
                  <SortableHeader column="status">
                    Status
                  </SortableHeader>
                  <SortableHeader column="budget" align="right">
                    Total Budget
                  </SortableHeader>
                  <SortableHeader column="approved" align="right">
                    Approved
                  </SortableHeader>
                  <SortableHeader column="pending" align="right">
                    Pending
                  </SortableHeader>
                  <SortableHeader column="progress">
                    Progress
                  </SortableHeader>
                  <SortableHeader column="updated">
                    Last Updated
                  </SortableHeader>
                  <SortableHeader column="clientAccessed">
                    Client Accessed
                  </SortableHeader>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.map((project) => {
                  // Mock client access data - in production this would come from database
                  const clientLastAccessed = (project as any).clientLastAccessed || null;
                  
                  return (
                    <tr 
                      key={project.id}
                      className="hover:bg-accent/30 transition-colors group cursor-pointer"
                      onClick={() => window.location.href = `/projects/${project.id}`}
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                            {project.clientName}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {project.address}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={project.status === 'Active' ? 'success' : project.status === 'Completed' ? 'info' : 'warning'}
                        >
                          {project.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono font-semibold">
                          ${(project.totalBudgeted / 1000).toFixed(0)}K
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono font-semibold text-success">
                          ${(project.approvedAmount / 1000).toFixed(0)}K
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {project.pendingAmount > 0 ? (
                          <span className="font-mono font-semibold text-[var(--warning)]">
                            ${(project.pendingAmount / 1000).toFixed(0)}K
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                            <div
                              className="h-full bg-secondary"
                              style={{ 
                                width: `${(project.approvedAmount / project.totalBudgeted) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground min-w-[3rem] text-right">
                            {Math.round((project.approvedAmount / project.totalBudgeted) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                        </div>
                      </td>
                      <td className="p-4">
                        {clientLastAccessed ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {formatDistanceToNow(clientLastAccessed, { addSuffix: true })}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Never</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button 
                          className="p-1 hover:bg-accent rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
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
      {filteredProjects.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Get started by creating your first project'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => setShowCreateModal(true)} variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        </Card>
      )}

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={(data) => {
          console.log('Project created:', data);
          // Handle project creation
        }}
      />
    </div>
  );
}
