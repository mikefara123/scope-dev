import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { mockProjects, getProjectById } from '@/app/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { X, Plus } from 'lucide-react';

interface CreateBudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  preSelectedProjectId?: string;
}

// Common room types for interior design projects
const DEFAULT_ROOMS = [
  'Living Room',
  'Dining Room',
  'Kitchen',
  'Master Bedroom',
  'Bedroom 2',
  'Bedroom 3',
  'Master Bathroom',
  'Guest Bathroom',
  'Powder Room',
  'Home Office',
  'Entry/Foyer',
  'Family Room',
  'Laundry Room',
  'Outdoor/Patio'
];

export function CreateBudgetModal({ open, onClose, onSave, preSelectedProjectId }: CreateBudgetModalProps) {
  const { agency } = useAuth();
  const [formData, setFormData] = useState({
    projectId: preSelectedProjectId || '',
    name: '',
    phase: '',
    description: '',
    defaultMarkup: agency?.default_product_markup || 35,
    defaultShipping: agency?.default_shipping_percentage || 15,
    defaultOther: agency?.default_other_cost_percentage || 10,
  });
  
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [newRoomInput, setNewRoomInput] = useState('');
  const [showAddRoom, setShowAddRoom] = useState(false);

  // When project is selected, load all default rooms
  useEffect(() => {
    if (formData.projectId) {
      const project = getProjectById(formData.projectId);
      // Default to all rooms when a project is selected
      setSelectedRooms([...DEFAULT_ROOMS]);
    }
  }, [formData.projectId]);

  const handleSubmit = () => {
    if (!formData.projectId || !formData.name) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave({
      ...formData,
      rooms: selectedRooms
    });
    
    // Reset form
    setFormData({
      projectId: preSelectedProjectId || '',
      name: '',
      phase: '',
      description: '',
      defaultMarkup: agency?.default_product_markup || 35,
      defaultShipping: agency?.default_shipping_percentage || 15,
      defaultOther: agency?.default_other_cost_percentage || 10,
    });
    setSelectedRooms([]);
    setNewRoomInput('');
    setShowAddRoom(false);
    
    onClose();
  };

  const removeRoom = (room: string) => {
    setSelectedRooms(selectedRooms.filter(r => r !== room));
  };

  const addCustomRoom = () => {
    if (newRoomInput.trim() && !selectedRooms.includes(newRoomInput.trim())) {
      setSelectedRooms([...selectedRooms, newRoomInput.trim()]);
      setNewRoomInput('');
      setShowAddRoom(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomRoom();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Budget Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Budget Assignment</h3>
            
            <div>
              <Label>Project *</Label>
              <Select 
                value={formData.projectId} 
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                disabled={!!preSelectedProjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.clientName} - {project.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                All budgets must be assigned to a project
              </p>
            </div>
          </div>

          {/* Section 2: Budget Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Budget Details</h3>
            
            <div>
              <Label>Budget Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Initial Budget, Phase 1 Budget, Revised Budget"
              />
            </div>

            <div>
              <Label>Phase / Stage</Label>
              <Input
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                placeholder="e.g., Phase 1 - Living Areas"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Specify which phase or stage this budget covers
              </p>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what this budget covers..."
                rows={3}
              />
            </div>
          </div>

          {/* Section 3: Room Selection */}
          {formData.projectId && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Rooms for This Budget</h3>
              <p className="text-sm text-muted-foreground">
                Select which rooms this budget will cover. You can add or remove rooms as needed.
              </p>
              
              <div className="flex flex-wrap gap-2 p-4 border border-border rounded-lg min-h-[80px] bg-muted/20">
                {selectedRooms.map((room) => (
                  <div
                    key={room}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <span>{room}</span>
                    <button
                      type="button"
                      onClick={() => removeRoom(room)}
                      className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {/* Add Room Button/Input */}
                {showAddRoom ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                    <input
                      type="text"
                      value={newRoomInput}
                      onChange={(e) => setNewRoomInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onBlur={() => {
                        if (newRoomInput.trim()) {
                          addCustomRoom();
                        } else {
                          setShowAddRoom(false);
                        }
                      }}
                      placeholder="Room name..."
                      className="bg-transparent border-none outline-none text-sm w-32"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddRoom(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary text-white rounded-full text-sm font-medium hover:bg-secondary/90 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Room</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Settings</h3>
            <p className="text-sm text-muted-foreground">
              These defaults will be applied to new line items. You can override them per item.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Markup %</Label>
                <Input
                  type="number"
                  value={formData.defaultMarkup}
                  onChange={(e) => setFormData({ ...formData, defaultMarkup: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Product markup percentage
                </p>
              </div>

              <div>
                <Label>Shipping %</Label>
                <Input
                  type="number"
                  value={formData.defaultShipping}
                  onChange={(e) => setFormData({ ...formData, defaultShipping: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Shipping cost percentage
                </p>
              </div>

              <div>
                <Label>Other Costs %</Label>
                <Input
                  type="number"
                  value={formData.defaultOther}
                  onChange={(e) => setFormData({ ...formData, defaultOther: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Other costs percentage
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h4 className="font-medium mb-2 text-sm">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your budget will be created with the structure: General → Rooms → Miscellaneous</li>
              <li>• You can add line items from your Item Library or create custom items</li>
              <li>• Line items can be organized by Room or Category</li>
              <li>• Send for client approval when ready</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--primary-foreground)' 
            }}
            onClick={handleSubmit}
          >
            Create Budget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
