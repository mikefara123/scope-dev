import { useState } from 'react';
import { X, Plus, Trash2, MapPin, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import type { Contact, Room, Phase, QualityLevel, ProjectStatus } from '@/app/data/types';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

// Mock project types - in production, these would come from the database
const mockProjectTypes = [
  {
    id: '1',
    name: 'Full Home Renovation',
    description: 'Complete home interior redesign',
    defaultRooms: ['Living Room', 'Kitchen', 'Master Bedroom', 'Master Bath', 'Guest Bedroom'],
    defaultPhases: ['Design Phase', 'Demolition', 'Construction', 'Installation', 'Final Walkthrough'],
    defaultQualityLevel: 'Premium' as QualityLevel,
    defaultMarkup: 30,
    defaultShipping: 5,
    defaultOtherCosts: 2
  },
  {
    id: '2',
    name: 'Kitchen Remodel',
    description: 'Kitchen renovation project',
    defaultRooms: ['Kitchen', 'Breakfast Nook'],
    defaultPhases: ['Design Phase', 'Demolition', 'Installation', 'Final Walkthrough'],
    defaultQualityLevel: 'Premium' as QualityLevel,
    defaultMarkup: 30,
    defaultShipping: 5,
    defaultOtherCosts: 2
  },
  {
    id: '3',
    name: 'Master Suite',
    description: 'Master bedroom and bathroom renovation',
    defaultRooms: ['Master Bedroom', 'Master Bath', 'Walk-in Closet'],
    defaultPhases: ['Design Phase', 'Construction', 'Installation', 'Final Walkthrough'],
    defaultQualityLevel: 'Luxury' as QualityLevel,
    defaultMarkup: 35,
    defaultShipping: 5,
    defaultOtherCosts: 2
  }
];

export function CreateProjectModal({ open, onClose, onSave }: CreateProjectModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [contacts, setContacts] = useState<Partial<Contact>[]>([
    { name: '', email: '', phone: '', isPrimary: true }
  ]);
  const [rooms, setRooms] = useState<Partial<Room>[]>([]);
  const [phases, setPhases] = useState<Partial<Phase>[]>([]);
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('Premium');
  const [markup, setMarkup] = useState(30);
  const [shipping, setShipping] = useState(5);
  const [otherCosts, setOtherCosts] = useState(2);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (templateId === 'blank') {
      // Reset to blank
      setRooms([]);
      setPhases([]);
      setQualityLevel('Premium');
      setMarkup(30);
      setShipping(5);
      setOtherCosts(2);
      return;
    }

    const template = mockProjectTypes.find(t => t.id === templateId);
    if (template) {
      // Auto-populate from template
      setRooms(template.defaultRooms.map(name => ({ 
        name, 
        floor: 'First Floor', 
        squareFootage: 0 
      })));
      setPhases(template.defaultPhases.map(name => ({ name })));
      setQualityLevel(template.defaultQualityLevel);
      setMarkup(template.defaultMarkup);
      setShipping(template.defaultShipping);
      setOtherCosts(template.defaultOtherCosts);
    }
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', email: '', phone: '', isPrimary: false }]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const addRoom = () => {
    setRooms([...rooms, { name: '', floor: 'First Floor' }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const addPhase = () => {
    setPhases([...phases, { name: '' }]);
  };

  const removePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Section 0: Template Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-secondary" />
              <h3 className="text-lg font-semibold">Start from Template</h3>
            </div>
            
            <div className="space-y-2">
              <Label>Project Type Template (Optional)</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template or start blank..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blank">
                    <div>
                      <div className="font-medium">Blank Project</div>
                      <div className="text-xs text-muted-foreground">Start from scratch</div>
                    </div>
                  </SelectItem>
                  {mockProjectTypes.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {template.defaultRooms.length} rooms • {template.defaultPhases.length} phases
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Templates auto-populate rooms, phases, and default settings. You can customize after selection.
              </p>
            </div>
          </div>

          {/* Section 1: Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Client Information</h3>
            
            {contacts.map((contact, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {contact.isPrimary ? 'Primary Contact' : `Additional Contact ${index}`}
                  </span>
                  {!contact.isPrimary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => {
                      const newContacts = [...contacts];
                      newContacts[index].name = e.target.value;
                      setContacts(newContacts);
                    }}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => {
                      const newContacts = [...contacts];
                      newContacts[index].email = e.target.value;
                      setContacts(newContacts);
                    }}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => {
                      const newContacts = [...contacts];
                      newContacts[index].phone = e.target.value;
                      setContacts(newContacts);
                    }}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addContact} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {/* Section 2: Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Project Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Client/Company Name *</Label>
                <Input placeholder="Johnson Residence" />
              </div>
              
              <div className="col-span-2">
                <Label>Project Name</Label>
                <Input placeholder="Will auto-fill from client name" />
              </div>

              <div className="col-span-2">
                <Label>Project Address *</Label>
                <div className="relative">
                  <Input placeholder="123 Main Street" />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Address will auto-determine sales tax rate
                </p>
              </div>

              <div>
                <Label>City</Label>
                <Input placeholder="McLean" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>State</Label>
                  <Input placeholder="VA" maxLength={2} />
                </div>
                <div>
                  <Label>ZIP</Label>
                  <Input placeholder="22101" />
                </div>
              </div>

              <div className="col-span-2">
                <Label>Project Description</Label>
                <Textarea
                  placeholder="Brief description of the project scope..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Project Status</Label>
                <Select defaultValue="Active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Project Structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Project Structure</h3>
            
            {/* Phases */}
            <div>
              <Label className="mb-2 block">Phases</Label>
              <div className="space-y-2">
                {phases.map((phase, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={phase.name}
                      onChange={(e) => {
                        const newPhases = [...phases];
                        newPhases[index].name = e.target.value;
                        setPhases(newPhases);
                      }}
                      placeholder={`Phase ${index + 1} name`}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhase(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addPhase} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Phase
                </Button>
              </div>
            </div>

            {/* Rooms */}
            <div>
              <Label className="mb-2 block">Rooms</Label>
              <div className="space-y-2">
                {rooms.map((room, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={room.name}
                      onChange={(e) => {
                        const newRooms = [...rooms];
                        newRooms[index].name = e.target.value;
                        setRooms(newRooms);
                      }}
                      placeholder="Room name"
                      className="flex-1"
                    />
                    <Select
                      value={room.floor}
                      onValueChange={(value) => {
                        const newRooms = [...rooms];
                        newRooms[index].floor = value;
                        setRooms(newRooms);
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First Floor">First Floor</SelectItem>
                        <SelectItem value="Second Floor">Second Floor</SelectItem>
                        <SelectItem value="Third Floor">Third Floor</SelectItem>
                        <SelectItem value="Basement">Basement</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRoom(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addRoom} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </div>
            </div>
          </div>

          {/* Section 4: Default Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Default Settings</h3>
            <p className="text-sm text-muted-foreground">
              These defaults can be overridden per budget or line item
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Quality Level</Label>
                <Select defaultValue="Premium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quality">Quality</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="UltraLux">UltraLux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Default Markup %</Label>
                <Input type="number" defaultValue="30" min="0" max="100" />
              </div>

              <div>
                <Label>Default Shipping %</Label>
                <Input type="number" defaultValue="5" min="0" max="100" />
              </div>

              <div>
                <Label>Default Other Costs %</Label>
                <Input type="number" defaultValue="2" min="0" max="100" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button
              variant="default"
              onClick={() => {
                onSave({ contacts, rooms, phases });
                onClose();
              }}
            >
              Save Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}