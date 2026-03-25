import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { LibraryItem } from '@/app/data/types';
import { useAuth } from '@/contexts/AuthContext';

interface AddEditItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Partial<LibraryItem>) => void;
  item?: LibraryItem | null;
}

const CATEGORIES = [
  'Furniture',
  'Lighting',
  'Window Treatments',
  'Floor Covering',
  'Wall Treatments',
  'Artwork & Accessories',
  'Technology',
  'Labor & Services'
];

const SUBCATEGORIES: Record<string, string[]> = {
  'Furniture': ['Sofas & Chairs', 'Tables & Cabinets', 'Beds', 'Custom', 'Storage'],
  'Lighting': ['Chandeliers', 'Task Lighting', 'Ceiling Lights', 'Wall Sconces', 'Floor Lamps'],
  'Window Treatments': ['Drapery', 'Shades', 'Blinds', 'Hardware'],
  'Floor Covering': ['Rugs', 'Carpet', 'Hardwood', 'Tile'],
  'Wall Treatments': ['Wallpaper', 'Paint', 'Paneling', 'Labor'],
  'Artwork & Accessories': ['Wall Art', 'Sculptures', 'Soft Goods', 'Decorative Objects'],
  'Technology': ['Systems', 'Audio/Video', 'Lighting Control', 'Security'],
  'Labor & Services': ['Installation', 'Delivery', 'Custom Work', 'Professional Services']
};

const UNITS = [
  'Each',
  'Sq Ft',
  'Linear Ft',
  'Yards',
  'Roll',
  'Hour',
  'Day',
  'Room',
  'Set',
  'Pair'
];

export function AddEditItemModal({ open, onClose, onSave, item }: AddEditItemModalProps) {
  const { currentUser, userRole } = useAuth();
  const isPlatformAdmin = userRole === 'platform_admin';

  const [formData, setFormData] = useState({
    name: '',
    category: 'Furniture',
    subcategory: '',
    unit: 'Each',
    qualityPrice: '',
    premiumPrice: '',
    luxuryPrice: '',
    ultraLuxPrice: '',
    description: '',
    vendor: '',
    sku: '',
    notes: '',
    tags: '',
    scope: isPlatformAdmin ? 'global' : 'agency',
    isActive: true
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'Furniture',
        subcategory: item.subcategory || '',
        unit: item.unit || 'Each',
        qualityPrice: item.qualityPrice?.toString() || '',
        premiumPrice: item.premiumPrice?.toString() || '',
        luxuryPrice: item.luxuryPrice?.toString() || '',
        ultraLuxPrice: item.ultraLuxPrice?.toString() || '',
        description: item.description || '',
        vendor: item.vendor || '',
        sku: item.sku || '',
        notes: item.notes || '',
        tags: item.tags?.join(', ') || '',
        scope: item.scope || (isPlatformAdmin ? 'global' : 'agency'),
        isActive: item.isActive ?? true
      });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        category: 'Furniture',
        subcategory: '',
        unit: 'Each',
        qualityPrice: '',
        premiumPrice: '',
        luxuryPrice: '',
        ultraLuxPrice: '',
        description: '',
        vendor: '',
        sku: '',
        notes: '',
        tags: '',
        scope: isPlatformAdmin ? 'global' : 'agency',
        isActive: true
      });
    }
  }, [item, isPlatformAdmin, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData: Partial<LibraryItem> = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      unit: formData.unit,
      qualityPrice: formData.qualityPrice ? parseFloat(formData.qualityPrice) : undefined,
      premiumPrice: formData.premiumPrice ? parseFloat(formData.premiumPrice) : undefined,
      luxuryPrice: formData.luxuryPrice ? parseFloat(formData.luxuryPrice) : undefined,
      ultraLuxPrice: formData.ultraLuxPrice ? parseFloat(formData.ultraLuxPrice) : undefined,
      description: formData.description,
      vendor: formData.vendor || undefined,
      sku: formData.sku || undefined,
      notes: formData.notes || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      scope: formData.scope as 'global' | 'agency' | 'personal',
      isActive: formData.isActive
    };

    onSave(itemData);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-semibold">
              {item ? 'Edit Library Item' : 'Add New Library Item'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {item ? 'Update item details and pricing' : 'Add a new item to your library'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Sectional Sofa"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                    required
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <select
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background"
                  >
                    <option value="">Select subcategory (optional)</option>
                    {SUBCATEGORIES[formData.category]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background"
                  >
                    {UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                {isPlatformAdmin && (
                  <div>
                    <Label htmlFor="scope">Scope *</Label>
                    <select
                      id="scope"
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      required
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background"
                    >
                      <option value="global">Global (All Agencies)</option>
                      <option value="agency">Agency-Specific</option>
                      <option value="personal">Personal</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Global items are available to all agencies
                    </p>
                  </div>
                )}

                <div className="col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    placeholder="Detailed description of the item"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-medium mb-4">Pricing by Quality Level</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qualityPrice">Quality Price</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="qualityPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.qualityPrice}
                      onChange={(e) => setFormData({ ...formData, qualityPrice: e.target.value })}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="premiumPrice">Premium Price</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="premiumPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.premiumPrice}
                      onChange={(e) => setFormData({ ...formData, premiumPrice: e.target.value })}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="luxuryPrice">Luxury Price</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="luxuryPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.luxuryPrice}
                      onChange={(e) => setFormData({ ...formData, luxuryPrice: e.target.value })}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ultraLuxPrice">UltraLux Price</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="ultraLuxPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.ultraLuxPrice}
                      onChange={(e) => setFormData({ ...formData, ultraLuxPrice: e.target.value })}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter prices for applicable quality levels. Leave blank if not available.
              </p>
            </div>

            {/* Vendor Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Vendor Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor">Vendor Name</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="e.g., Mitchell Gold + Bob Williams"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU / Part Number</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., MG-SOFA-3S"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="text-lg font-medium mb-4">Additional Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., living room, seating, upholstery"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas for easier searching
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Internal Notes</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Private notes, special instructions, or vendor contacts"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active (show in library)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              {item ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
