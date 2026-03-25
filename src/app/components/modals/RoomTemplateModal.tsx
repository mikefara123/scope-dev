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
import { Plus, X, DollarSign, Trash2 } from 'lucide-react';

interface DefaultItem {
  name: string;
  category: string;
  estimated_cost: number;
}

interface RoomTemplateFormData {
  name: string;
  description: string;
  default_items: DefaultItem[];
  project_types: string[];
}

interface RoomTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: RoomTemplateFormData) => void;
  roomTemplate?: RoomTemplateFormData | null;
  mode: 'create' | 'edit';
  availableProjectTypes: Array<{ id: string; name: string; }>;
}

const ITEM_CATEGORIES = [
  'Furniture',
  'Lighting',
  'Textiles',
  'Decor',
  'Fixtures',
  'Appliances',
  'Technology',
  'Flooring',
  'Window Treatments',
  'Other',
];

export function RoomTemplateModal({ 
  open, 
  onOpenChange, 
  onSave, 
  roomTemplate,
  mode,
  availableProjectTypes
}: RoomTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultItems, setDefaultItems] = useState<DefaultItem[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  
  // New item form
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Furniture');
  const [newItemCost, setNewItemCost] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (roomTemplate && mode === 'edit') {
      setName(roomTemplate.name);
      setDescription(roomTemplate.description);
      setDefaultItems(roomTemplate.default_items);
      setSelectedProjectTypes(roomTemplate.project_types);
    } else {
      // Reset for create mode
      setName('');
      setDescription('');
      setDefaultItems([]);
      setSelectedProjectTypes([]);
      setNewItemName('');
      setNewItemCategory('Furniture');
      setNewItemCost('');
    }
  }, [roomTemplate, mode, open]);

  const handleAddItem = () => {
    if (newItemName.trim() && newItemCost) {
      const cost = parseFloat(newItemCost);
      if (!isNaN(cost) && cost >= 0) {
        setDefaultItems([
          ...defaultItems,
          {
            name: newItemName.trim(),
            category: newItemCategory,
            estimated_cost: cost,
          }
        ]);
        setNewItemName('');
        setNewItemCost('');
        setNewItemCategory('Furniture');
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    setDefaultItems(defaultItems.filter((_, i) => i !== index));
  };

  const toggleProjectType = (projectTypeId: string) => {
    if (selectedProjectTypes.includes(projectTypeId)) {
      setSelectedProjectTypes(selectedProjectTypes.filter(id => id !== projectTypeId));
    } else {
      setSelectedProjectTypes([...selectedProjectTypes, projectTypeId]);
    }
  };

  const totalEstimate = defaultItems.reduce((sum, item) => sum + item.estimated_cost, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || defaultItems.length === 0) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave({
      name: name.trim(),
      description: description.trim(),
      default_items: defaultItems,
      project_types: selectedProjectTypes,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (mode === 'create') {
      setName('');
      setDescription('');
      setDefaultItems([]);
      setSelectedProjectTypes([]);
      setNewItemName('');
      setNewItemCategory('Furniture');
      setNewItemCost('');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Room Template' : 'Edit Room Template'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a reusable room configuration with default line items and budget estimates.'
              : 'Update room template configuration and default items.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="rt-name">Room Template Name</Label>
              <Input
                id="rt-name"
                placeholder="e.g., Living Room - Modern"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="rt-description">Description</Label>
              <Textarea
                id="rt-description"
                placeholder="Brief description of this room template..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Associated Project Types */}
            <div className="space-y-2">
              <Label>Associated Project Types</Label>
              <p className="text-xs text-muted-foreground">
                This template will be available for these project types.
              </p>
              <div className="flex flex-wrap gap-2">
                {availableProjectTypes.map((pt) => (
                  <Badge
                    key={pt.id}
                    variant={selectedProjectTypes.includes(pt.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleProjectType(pt.id)}
                  >
                    {pt.name}
                    {selectedProjectTypes.includes(pt.id) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Default Items */}
            <div className="space-y-2">
              <Label>Default Line Items</Label>
              <p className="text-xs text-muted-foreground">
                Add items that will be included when using this room template.
              </p>

              {/* Add Item Form */}
              <div className="grid grid-cols-12 gap-2">
                <Input
                  placeholder="Item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="col-span-5"
                />
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="col-span-4 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  {ITEM_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="col-span-2 relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Cost"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    className="pl-8"
                    min="0"
                    step="0.01"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!newItemName.trim() || !newItemCost}
                  size="sm"
                  className="col-span-1"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Items List */}
              {defaultItems.length > 0 ? (
                <div className="border rounded-lg overflow-hidden mt-2">
                  <div className="bg-muted/50 px-3 py-2 grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-3">Category</div>
                    <div className="col-span-3 text-right">Est. Cost</div>
                    <div className="col-span-1"></div>
                  </div>
                  <div className="divide-y">
                    {defaultItems.map((item, index) => (
                      <div key={index} className="px-3 py-2 grid grid-cols-12 gap-2 text-sm hover:bg-muted/30">
                        <div className="col-span-5 font-medium">{item.name}</div>
                        <div className="col-span-3 text-muted-foreground">{item.category}</div>
                        <div className="col-span-3 text-right font-mono">
                          ${item.estimated_cost.toLocaleString()}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/50 px-3 py-2 grid grid-cols-12 gap-2 border-t-2">
                    <div className="col-span-8 font-semibold text-sm">Total Estimate</div>
                    <div className="col-span-3 text-right font-mono font-bold">
                      ${totalEstimate.toLocaleString()}
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
              ) : (
                <div className="p-6 border-2 border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    No items added yet. Add items above.
                  </p>
                </div>
              )}
            </div>

            {/* Validation Messages */}
            {defaultItems.length === 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  ⚠️ Add at least one default item to create this template.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim() || defaultItems.length === 0}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Template' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
