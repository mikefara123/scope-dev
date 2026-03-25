import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Home, Plus, X } from 'lucide-react';

interface ProjectTypeFormData {
  name: string;
  description: string;
  default_rooms: string[];
  color: string;
  icon: string;
}

interface ProjectTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProjectTypeFormData) => void;
  projectType?: ProjectTypeFormData | null;
  mode: 'create' | 'edit';
}

const PRESET_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Indigo', value: '#6366f1' },
];

export function ProjectTypeModal({ 
  open, 
  onOpenChange, 
  onSave, 
  projectType,
  mode 
}: ProjectTypeModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultRooms, setDefaultRooms] = useState<string[]>([]);
  const [newRoom, setNewRoom] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectType && mode === 'edit') {
      setName(projectType.name);
      setDescription(projectType.description);
      setDefaultRooms(projectType.default_rooms);
      setColor(projectType.color);
    } else {
      // Reset for create mode
      setName('');
      setDescription('');
      setDefaultRooms([]);
      setNewRoom('');
      setColor('#3b82f6');
    }
  }, [projectType, mode, open]);

  const handleAddRoom = () => {
    if (newRoom.trim() && !defaultRooms.includes(newRoom.trim())) {
      setDefaultRooms([...defaultRooms, newRoom.trim()]);
      setNewRoom('');
    }
  };

  const handleRemoveRoom = (roomToRemove: string) => {
    setDefaultRooms(defaultRooms.filter(room => room !== roomToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRoom();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave({
      name: name.trim(),
      description: description.trim(),
      default_rooms: defaultRooms,
      color,
      icon: 'home',
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (mode === 'create') {
      setName('');
      setDescription('');
      setDefaultRooms([]);
      setNewRoom('');
      setColor('#3b82f6');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Project Type' : 'Edit Project Type'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a reusable project template with default rooms and settings.'
              : 'Update project type configuration and default rooms.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="pt-name">Project Type Name</Label>
              <Input
                id="pt-name"
                placeholder="e.g., Residential - Full Home"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="pt-description">Description</Label>
              <Textarea
                id="pt-description"
                placeholder="Brief description of this project type..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label>Brand Color</Label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor.value}
                    type="button"
                    onClick={() => setColor(presetColor.value)}
                    className={`h-10 w-10 rounded-lg border-2 transition-all ${
                      color === presetColor.value
                        ? 'border-primary scale-110'
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: presetColor.value }}
                    title={presetColor.name}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-10 rounded-lg border-2 border-border cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground font-mono">{color}</span>
                </div>
              </div>
            </div>

            {/* Default Rooms */}
            <div className="space-y-2">
              <Label htmlFor="pt-rooms">Default Rooms</Label>
              <p className="text-xs text-muted-foreground">
                These rooms will be auto-created when starting a new project of this type.
              </p>
              
              {/* Add Room Input */}
              <div className="flex gap-2">
                <Input
                  id="pt-rooms"
                  placeholder="Add a room (e.g., Living Room)"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  type="button"
                  onClick={handleAddRoom}
                  disabled={!newRoom.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Rooms List */}
              {defaultRooms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-muted/50 rounded-lg">
                  {defaultRooms.map((room) => (
                    <Badge key={room} variant="secondary" className="gap-1 pr-1">
                      <Home className="h-3 w-3" />
                      {room}
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(room)}
                        className="ml-1 hover:bg-background rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {defaultRooms.length === 0 && (
                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    No default rooms yet. Add rooms above.
                  </p>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Home className="h-6 w-6" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {name || 'Project Type Name'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {description || 'Description will appear here...'}
                    </p>
                    {defaultRooms.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {defaultRooms.length} default {defaultRooms.length === 1 ? 'room' : 'rooms'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Project Type' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
