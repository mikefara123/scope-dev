import { Link, useParams } from 'react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { getProjectById, getBudgetsByProject } from '@/app/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { InfoDisplay } from '@/app/components/common';

export function ProjectDetail() {
  const { projectId } = useParams();
  const project = getProjectById(projectId!);
  const budgets = getBudgetsByProject(projectId!);

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-foreground">{project.clientName}</h1>
          <p className="text-muted-foreground">{project.address}, {project.city}, {project.state} {project.zip}</p>
        </div>
        <Badge
          className={project.status === 'Active' ? 'bg-success text-white' : 'bg-warning text-white'}
        >
          {project.status}
        </Badge>
        <Button
          variant="outline"
          className="border-primary text-primary"
        >
          Edit Project
        </Button>
      </div>

      <Tabs defaultValue="budgets" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoDisplay label="Project Name" value={project.projectName} />
                <InfoDisplay label="Description" value={project.description} />
                <InfoDisplay 
                  label="Primary Contact" 
                  value={
                    <>
                      <div>{project.contacts[0]?.name}</div>
                      <div className="text-sm text-muted-foreground">{project.contacts[0]?.email}</div>
                    </>
                  } 
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Budgeted</span>
                  <span className="text-2xl font-bold">${(project.totalBudgeted / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Approved Amount</span>
                  <span className="text-xl font-semibold text-success">${(project.approvedAmount / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending Amount</span>
                  <span 
                    className="text-xl font-semibold text-warning"
                  >
                    ${(project.pendingAmount / 1000).toFixed(0)}K
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rooms and Phases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rooms ({project.rooms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.rooms.map((room) => (
                    <div key={room.id} className="flex justify-between items-center p-3 rounded-lg bg-muted">
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-muted-foreground">{room.floor}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{room.squareFootage} sq ft</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phases ({project.phases.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.phases.map((phase) => (
                    <div key={phase.id} className="p-3 rounded-lg bg-muted">
                      <p className="font-medium">{phase.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Budgets ({budgets.length})</h3>
            <Button
              variant="secondary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {budgets.map((budget) => (
              <Card key={budget.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">{budget.name} {budget.version}</h4>
                        <Badge
                          variant={
                            budget.status === 'Approved' 
                              ? 'success' 
                              : budget.status.includes('Pending')
                              ? 'warning'
                              : 'subtle'
                          }
                        >
                          {budget.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created {formatDistanceToNow(budget.createdAt, { addSuffix: true })}
                        {budget.phase && ` • ${budget.phase}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${budget.grandTotal.toLocaleString()}</p>
                      <div className="flex gap-2 mt-2">
                        <Link to={`/projects/${projectId}/budgets/${budget.id}`}>
                          <Button size="sm" variant="outline">Edit</Button>
                        </Link>
                        <Link to={`/budgets/${budget.id}/preview`}>
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                        {budget.status === 'Approved' && (
                          <Link to={`/budgets/${budget.id}/actual-costs`}>
                            <Button size="sm" variant="outline">Track Costs</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Activity timeline would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}