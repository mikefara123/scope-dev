import { useState } from 'react';
import { BudgetLineItem, QualityLevel } from '@/app/data/types';
import { Badge } from '@/app/components/ui/badge';
import { TextInput } from '@/app/components/ui/text-input';
import { Grip } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface EditableBudgetLineItemProps {
  item: BudgetLineItem;
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdate: (updates: Partial<BudgetLineItem>) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
}

export function EditableBudgetLineItem({
  item,
  index,
  isSelected,
  onToggleSelect,
  onUpdate,
  dragHandleProps,
  isDragging = false
}: EditableBudgetLineItemProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  // Handle Net Cost edit - when edited, set quality to "Custom"
  const handleNetCostChange = (value: number) => {
    onUpdate({
      netCost: value,
      quality: 'Custom',
      overrides: {
        ...item.overrides,
        netCost: true,
        quality: true
      }
    });
  };

  // Handle override field changes (shipping, other, tax)
  const handleOverrideField = (field: 'shipping' | 'other' | 'tax', value: number) => {
    onUpdate({
      [field]: value,
      overrides: {
        ...item.overrides,
        [field]: true
      }
    });
  };

  // Helper to check if field has override
  const hasOverride = (field: keyof NonNullable<BudgetLineItem['overrides']>) => {
    return item.overrides?.[field] === true;
  };

  // Get cell classname with override styling
  const getCellClassName = (field: keyof NonNullable<BudgetLineItem['overrides']>, baseClassName: string) => {
    const hasFieldOverride = hasOverride(field);
    return `${baseClassName} ${hasFieldOverride ? 'bg-blue-50 border border-blue-200 rounded-md' : ''}`;
  };

  return (
    <div
      className={`flex border-b border-border hover:bg-muted/30 group text-[13px] compact-row ${
        isDragging ? 'opacity-50' : ''
      } ${isSelected ? 'bg-accent/40' : ''}`}
      {...dragHandleProps}
    >
      {/* Checkbox */}
      <div className="w-10 py-1.5 px-2 flex items-center justify-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-gray-300"
        />
      </div>

      {/* Item Number with Drag Handle */}
      <div className="w-12 py-1.5 px-2 flex items-center text-muted-foreground">
        <Grip className="h-3.5 w-3.5 cursor-move mr-1" />
        {item.itemNumber}
      </div>

      {/* Item Name */}
      <div className="w-48 py-1.5 px-2 font-medium">{item.itemName}</div>

      {/* Category */}
      <div className="w-32 py-1.5 px-2">
        <Badge variant="outline" className="text-xs">{item.category || 'Furniture'}</Badge>
      </div>

      {/* Details */}
      <div className="w-64 py-1.5 px-2 text-muted-foreground truncate">{item.details}</div>

      {/* Phase */}
      <div className="w-32 py-1.5 px-2 text-muted-foreground">{item.phase}</div>

      {/* Quality - Editable with override indicator */}
      <div className={getCellClassName('quality', 'w-24 py-1.5 px-2')}>
        {editingField === 'quality' ? (
          <Select 
            value={item.quality} 
            onValueChange={(val) => {
              onUpdate({ 
                quality: val as QualityLevel,
                overrides: {
                  ...item.overrides,
                  quality: true
                }
              });
              setEditingField(null);
            }}
          >
            <SelectTrigger className="h-6 text-xs border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Quality">Quality</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="UltraLux">UltraLux</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-accent"
            onClick={() => setEditingField('quality')}
          >
            {item.quality}
          </Badge>
        )}
      </div>

      {/* Quantity */}
      <div className="w-20 py-1.5 px-2 text-right font-mono">{item.quantity}</div>

      {/* Unit */}
      <div className="w-20 py-1.5 px-2 text-muted-foreground">{item.unit}</div>

      {/* Net Cost - Editable with override indicator */}
      <div className={getCellClassName('netCost', 'w-28 py-1.5 px-2 text-right font-mono')}>
        {editingField === 'netCost' ? (
          <TextInput
            type="number"
            value={item.netCost}
            onChange={(e) => handleNetCostChange(parseFloat(e.target.value) || 0)}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                setEditingField(null);
              }
            }}
            className="h-6 text-xs border-0 focus-visible:ring-1 focus-visible:ring-ring px-1 text-right font-mono"
            autoFocus
            step="0.01"
          />
        ) : (
          <div 
            className="cursor-pointer hover:bg-accent/50 px-1 rounded"
            onClick={() => setEditingField('netCost')}
          >
            ${item.netCost.toLocaleString()}
          </div>
        )}
      </div>

      {/* Markup % */}
      <div className="w-20 py-1.5 px-2 text-right font-mono">{item.markupPercent}%</div>

      {/* Item Cost */}
      <div className="w-28 py-1.5 px-2 text-right font-mono font-semibold">
        ${item.itemCost.toLocaleString()}
      </div>

      {/* Shipping - Editable with override indicator */}
      <div className={getCellClassName('shipping', 'w-24 py-1.5 px-2 text-right font-mono')}>
        {editingField === 'shipping' ? (
          <TextInput
            type="number"
            value={item.shipping}
            onChange={(e) => handleOverrideField('shipping', parseFloat(e.target.value) || 0)}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                setEditingField(null);
              }
            }}
            className="h-6 text-xs border-0 focus-visible:ring-1 focus-visible:ring-ring px-1 text-right font-mono"
            autoFocus
            step="0.01"
          />
        ) : (
          <div 
            className="cursor-pointer hover:bg-accent/50 px-1 rounded"
            onClick={() => setEditingField('shipping')}
          >
            ${item.shipping}
          </div>
        )}
      </div>

      {/* Other - Editable with override indicator */}
      <div className={getCellClassName('other', 'w-24 py-1.5 px-2 text-right font-mono')}>
        {editingField === 'other' ? (
          <TextInput
            type="number"
            value={item.other}
            onChange={(e) => handleOverrideField('other', parseFloat(e.target.value) || 0)}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                setEditingField(null);
              }
            }}
            className="h-6 text-xs border-0 focus-visible:ring-1 focus-visible:ring-ring px-1 text-right font-mono"
            autoFocus
            step="0.01"
          />
        ) : (
          <div 
            className="cursor-pointer hover:bg-accent/50 px-1 rounded"
            onClick={() => setEditingField('other')}
          >
            ${item.other}
          </div>
        )}
      </div>

      {/* Tax - Editable with override indicator */}
      <div className={getCellClassName('tax', 'w-24 py-1.5 px-2 text-right font-mono')}>
        {editingField === 'tax' ? (
          <TextInput
            type="number"
            value={item.tax}
            onChange={(e) => handleOverrideField('tax', parseFloat(e.target.value) || 0)}
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                setEditingField(null);
              }
            }}
            className="h-6 text-xs border-0 focus-visible:ring-1 focus-visible:ring-ring px-1 text-right font-mono"
            autoFocus
            step="0.01"
          />
        ) : (
          <div 
            className="cursor-pointer hover:bg-accent/50 px-1 rounded"
            onClick={() => setEditingField('tax')}
          >
            ${item.tax}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="w-28 py-1.5 px-2 text-right font-mono font-bold">
        ${item.total.toLocaleString()}
      </div>

      {/* Actions - Empty for consistency */}
      <div className="w-12 py-1.5 px-2"></div>
    </div>
  );
}