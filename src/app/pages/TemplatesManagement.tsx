import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Folder,
  FileText,
  Home,
  DollarSign
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockProjectTypes, mockRoomTemplates } from '@/data/mock-multi-tenant';
import type { ProjectType, RoomTemplate } from '@/types/multi-tenant';
import { StatCard } from '@/app/components/common';

export function TemplatesManagement() {
  const { agency } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('project-types');

  const [projectTypes] = useState<ProjectType[]>(mockProjectTypes);
  const [roomTemplates] = useState<RoomTemplate[]>(mockRoomTemplates);

  // Filter by search
  const filteredProjectTypes = projectTypes.filter(pt => 
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pt.description && pt.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRoomTemplates = roomTemplates.filter(rt =>
    rt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rt.description && rt.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Templates</h1>
        <p className="text-muted-foreground">
          Create reusable project types and room templates to speed up budget creation
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="project-types">Project Types</TabsTrigger>
          <TabsTrigger value="room-templates">Room Templates</TabsTrigger>
        </TabsList>

        {/* Project Types Tab */}
        <TabsContent value="project-types" className="space-y-6">
          {/* Search and Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search project types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2 bg-[#1a365d] hover:bg-[#2d4a7c] text-white">
              <Plus className="h-4 w-4" />
              New Project Type
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Total Project Types"
              value={projectTypes.length}
              icon={<Folder className="h-4 w-4 text-muted-foreground" />}
              description="Reusable templates"
            />

            <StatCard
              label="Residential"
              value={projectTypes.filter(pt => pt.name.includes('Residential')).length}
              icon={<Home className="h-4 w-4 text-blue-600" />}
              description="Home projects"
            />

            <StatCard
              label="Commercial"
              value={projectTypes.filter(pt => pt.name.includes('Commercial')).length}
              icon={<Folder className="h-4 w-4 text-purple-600" />}
              description="Business projects"
            />
          </div>

          {/* Project Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjectTypes.map((projectType) => (
              <Card key={projectType.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-12 w-12 rounded-lg flex items-center justify-center bg-[#1a365d]/10"
                      >
                        <Home className="h-6 w-6 text-[#1a365d]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{projectType.name}</CardTitle>
                        <CardDescription>{projectType.description}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Default Rooms ({projectType.default_rooms.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {projectType.default_rooms.slice(0, 3).map((room, idx) => (
                          <Badge key={idx} variant="outline">
                            {room}
                          </Badge>
                        ))}
                        {projectType.default_rooms.length > 3 && (
                          <Badge variant="outline">
                            +{projectType.default_rooms.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Created {new Date(projectType.created_at).toLocaleDateString()}</span>
                      <span>{projectType.default_rooms.length} default rooms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjectTypes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No project types found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or create a new project type
                </p>
                <Button className="gap-2 bg-[#1a365d] hover:bg-[#2d4a7c] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project Type
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Room Templates Tab */}
        <TabsContent value="room-templates" className="space-y-6">
          {/* Search and Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search room templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Room Template
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Total Templates"
              value={roomTemplates.length}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              description="Reusable room configs"
            />

            <StatCard
              label="Avg. Items per Room"
              value={roomTemplates.length > 0 ? Math.round(roomTemplates.reduce((sum, rt) => sum + rt.default_items.length, 0) / roomTemplates.length) : 0}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              description="Default line items"
            />

            <StatCard
              label="Total Rooms"
              value={roomTemplates.length}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              description="All templates"
            />
          </div>

          {/* Room Templates List */}
          <div className="space-y-4">
            {filteredRoomTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline">
                          {template.default_items.length} items
                        </Badge>
                      </div>
                      <CardDescription>{template.description || 'No description'}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Default Items ({template.default_items.length})</p>
                      {template.default_items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {template.default_items.map((itemId, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">Item {itemId}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No default items</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Created {new Date(template.created_at).toLocaleDateString()}</span>
                      <span>{template.default_items.length} default items</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRoomTemplates.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No room templates found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or create a new room template
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Room Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
