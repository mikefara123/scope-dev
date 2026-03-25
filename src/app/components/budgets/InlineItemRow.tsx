import { useState, useRef, useEffect } from 'react';
import { LibraryItem, BudgetLineItem, QualityLevel } from '@/app/data/types';
import { mockLibraryItems } from '@/app/data/mockData';
import { Badge } from '@/app/components/ui/badge';
import { TextInput } from '@/app/components/ui/text-input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Check } from 'lucide-react';

interface InlineItemRowProps {
  room: string;
  phase: string;
  defaultQuality: QualityLevel;
  defaultMarkup: number;
  itemNumber: number;
  onSave: (item: Partial<BudgetLineItem>) => void;
  onCancel: () => void;
}

export function InlineItemRow({
  room,
  phase,
  defaultQuality,
  defaultMarkup,
  itemNumber,
  onSave,
  onCancel
}: InlineItemRowProps) {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [quality, setQuality] = useState<QualityLevel>(defaultQuality);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Each');
  const [netCost, setNetCost] = useState(0);
  const [markupPercent, setMarkupPercent] = useState(defaultMarkup);
  
  const [showLibraryDropdown, setShowLibraryDropdown] = useState(false);
  const [filteredLibraryItems, setFilteredLibraryItems] = useState<LibraryItem[]>([]);
  const [selectedLibraryIndex, setSelectedLibraryIndex] = useState(0);
  const itemNameInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter library items based on input
  useEffect(() => {
    if (itemName.trim().length > 0) {
      const filtered = mockLibraryItems.filter(item => 
        item.name.toLowerCase().includes(itemName.toLowerCase()) ||
        item.category.toLowerCase().includes(itemName.toLowerCase()) ||
        (item.subcategory?.toLowerCase().includes(itemName.toLowerCase()))
      ).slice(0, 10); // Limit to 10 results
      
      setFilteredLibraryItems(filtered);
      setShowLibraryDropdown(filtered.length > 0);
    } else {
      setShowLibraryDropdown(false);
      setFilteredLibraryItems([]);
    }
    setSelectedLibraryIndex(0);
  }, [itemName]);

  // Auto-focus on mount
  useEffect(() => {
    itemNameInputRef.current?.focus();
  }, []);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLibraryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLibraryItem = (libraryItem: LibraryItem) => {
    setItemName(libraryItem.name);
    setCategory(libraryItem.category);
    setDetails(libraryItem.description);
    setUnit(libraryItem.unit);
    
    // Get price based on quality level
    let price = 0;
    switch (quality) {
      case 'Quality':
        price = libraryItem.qualityPrice || 0;
        break;
      case 'Premium':
        price = libraryItem.premiumPrice || 0;
        break;
      case 'Luxury':
        price = libraryItem.luxuryPrice || 0;
        break;
      case 'UltraLux':
        price = libraryItem.ultraLuxPrice || 0;
        break;
    }
    setNetCost(price);
    setShowLibraryDropdown(false);
    
    // Focus on next editable field
    setTimeout(() => {
      const quantityInput = document.querySelector('[data-field="quantity"]') as HTMLInputElement;
      quantityInput?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showLibraryDropdown && filteredLibraryItems.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedLibraryIndex(prev => 
          prev < filteredLibraryItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedLibraryIndex(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === 'Enter' && filteredLibraryItems.length > 0) {
        e.preventDefault();
        selectLibraryItem(filteredLibraryItems[selectedLibraryIndex]);
      } else if (e.key === 'Escape') {
        setShowLibraryDropdown(false);
      }
    } else if (e.key === 'Enter' && !showLibraryDropdown) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const calculateCosts = () => {
    const itemCost = netCost * (1 + markupPercent / 100);
    const shipping = itemCost * 0.05; // 5% default
    const other = itemCost * 0.02; // 2% default
    const subtotal = itemCost * quantity + shipping + other;
    const tax = subtotal * 0.08; // 8% default
    const total = subtotal + tax;

    return {
      itemCost: Math.round(itemCost * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      other: Math.round(other * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  };

  const handleSave = () => {
    if (!itemName.trim()) {
      itemNameInputRef.current?.focus();
      return;
    }

    const costs = calculateCosts();
    const newItem: Partial<BudgetLineItem> = {
      id: `temp-${Date.now()}`,
      itemNumber,
      itemName: itemName.trim(),
      category: category || 'Furniture',
      details: details.trim(),
      phase,
      quality,
      quantity,
      unit,
      netCost,
      markupPercent,
      itemCost: costs.itemCost,
      shipping: costs.shipping,
      other: costs.other,
      tax: costs.tax,
      total: costs.total,
      room,
    };

    onSave(newItem);
  };

  return (
    <div className="relative">
      <div 
        className="flex border-b border-border hover:bg-muted/30 bg-accent/30 group text-sm"
        onKeyDown={handleKeyDown}
      >
        {/* Checkbox */}
        <div className="w-10 p-2 flex items-center justify-center">
          <div className="h-4 w-4" />
        </div>

        {/* Item Number */}
        <div className="w-12 p-2 flex items-center text-muted-foreground">
          {itemNumber}
        </div>

        {/* Item Name with Autocomplete */}
        <div className="w-48 p-2 relative" ref={dropdownRef}>
          <TextInput
            ref={itemNameInputRef}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Start typing item name..."
            className="h-7 text-sm border-0 focus-visible:ring-1 focus-visible:ring-ring px-2 font-medium"
            autoComplete="off"
          />
          
          {/* Library Dropdown */}
          {showLibraryDropdown && filteredLibraryItems.length > 0 && (
            <div className="absolute left-0 top-full mt-1 w-96 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-2 text-xs text-muted-foreground border-b border-border">
                Select from library or continue typing
              </div>
              {filteredLibraryItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-accent border-b border-border last:border-0 ${
                    index === selectedLibraryIndex ? 'bg-accent' : ''
                  }`}
                  onClick={() => selectLibraryItem(item)}
                  onMouseEnter={() => setSelectedLibraryIndex(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.category}
                        {item.subcategory && ` • ${item.subcategory}`}
                      </div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 text-right">
                      <div className="text-xs font-mono">
                        {quality === 'Quality' && item.qualityPrice && `$${item.qualityPrice.toLocaleString()}`}
                        {quality === 'Premium' && item.premiumPrice && `$${item.premiumPrice.toLocaleString()}`}
                        {quality === 'Luxury' && item.luxuryPrice && `$${item.luxuryPrice.toLocaleString()}`}
                        {quality === 'UltraLux' && item.ultraLuxPrice && `$${item.ultraLuxPrice.toLocaleString()}`}
                      </div>
                      <div className="text-xs text-muted-foreground">per {item.unit}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="w-40 p-2">
          <TextInput
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="h-7 text-sm border-0 focus-visible:ring-1 focus-visible:ring-ring px-2"
            list="categories"
          />
          <datalist id="categories">
            <option value="Furniture" />
            <option value="Lighting" />
            <option value="Window Treatments" />
            <option value="Floor Covering" />
            <option value="Artwork & Accessories" />
            <option value="Technology" />
          </datalist>
        </div>

        {/* Details */}
        <div className="w-64 p-2">
          <TextInput
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details/notes..."
            className="h-7 text-sm border-0 focus-visible:ring-1 focus-visible:ring-ring px-2"
          />
        </div>

        {/* Phase */}
        <div className="w-32 p-2 flex items-center text-muted-foreground text-sm">
          {phase}
        </div>

        {/* Quality */}
        <div className="w-24 p-2">
          <Select value={quality} onValueChange={(val) => setQuality(val as QualityLevel)}>
            <SelectTrigger className="h-7 text-xs border-0">
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
        </div>

        {/* Quantity */}
        <div className="w-20 p-2">
          <TextInput
            data-field="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-7 text-sm border-0 focus-visible:ring-1 focus-visible:ring-ring px-2 text-right font-mono"
            min="1"
          />
        </div>

        {/* Unit */}
        <div className="w-20 p-2">
          <TextInput
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="h-7 text-sm border-0 focus-visible:ring-1 focus-visible:ring-ring px-2"
            list="units"
          />
          <datalist id="units">
            <option value="Each" />
            <option value="Yards" />
            <option value="Sq Ft" />
            <option value="Linear Ft" />
            <option value="Room" />
            <option value="Roll" />
          </datalist>
        </div>

        {/* Net Cost */}
        <div className="w-28 p-2">
          <TextInput
            type="number"
            value={netCost}
            onChange={(e) => setNetCost(parseFloat(e.target.value) || 0)}
            className="h-7 text-sm border-0 focus-visible:ring-1 focus-visible:ring-ring px-2 text-right font-mono"
            step="0.01"
            min="0"
          />
        </div>

        {/* Markup % */}
        <div className="w-20 p-2">
          <TextInput
            type="number"
            value={markupPercent}
            onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
            className="h-7 text-sm border-0 focus-visible:ring-1 focus-visible:ring-ring px-2 text-right font-mono"
            step="1"
            min="0"
          />
        </div>

        {/* Calculated fields - display only */}
        <div className="w-28 p-2 flex items-center justify-end text-muted-foreground font-mono text-sm">
          ${calculateCosts().itemCost.toLocaleString()}
        </div>
        <div className="w-24 p-2 flex items-center justify-end text-muted-foreground font-mono text-sm">
          ${calculateCosts().shipping.toLocaleString()}
        </div>
        <div className="w-24 p-2 flex items-center justify-end text-muted-foreground font-mono text-sm">
          ${calculateCosts().other.toLocaleString()}
        </div>
        <div className="w-24 p-2 flex items-center justify-end text-muted-foreground font-mono text-sm">
          ${calculateCosts().tax.toLocaleString()}
        </div>
        <div className="w-28 p-2 flex items-center justify-end text-muted-foreground font-mono font-bold text-sm">
          ${calculateCosts().total.toLocaleString()}
        </div>

        {/* Actions */}
        <div className="w-12 p-2 flex items-center justify-center">
          <button
            onClick={handleSave}
            className="h-7 w-7 rounded hover:bg-accent flex items-center justify-center text-green-600"
            title="Save item (Enter)"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Helper text */}
      <div className="absolute left-12 -bottom-5 text-xs text-muted-foreground">
        Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to save, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> to cancel
      </div>
    </div>
  );
}