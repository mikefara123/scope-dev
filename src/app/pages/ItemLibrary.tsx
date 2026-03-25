import { useState, useMemo } from 'react';
import { Plus, Search, MoreVertical, Filter, Download, Upload, Globe, Building2, User, Edit, Trash2, Eye, EyeOff, Lock, Unlock, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { mockLibraryItems } from '@/app/data/mockData';
import { LibraryItem } from '@/app/data/types';
import { AddEditItemModal } from '@/app/components/modals/AddEditItemModal';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/lib/permissions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

const CATEGORIES = [
  'All Items',
  'Furniture',
  'Lighting',
  'Window Treatments',
  'Floor Covering',
  'Wall Treatments',
  'Artwork & Accessories',
  'Technology',
  'Labor & Services'
];

export function ItemLibrary() {
  const { hasPermission, userRole, currentUser } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>(mockLibraryItems);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['All Items']));
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'global' | 'agency' | 'personal'>('all');
  const [showInactiveItems, setShowInactiveItems] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLocked, setIsLocked] = useState(true);
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');

  const isPlatformAdmin = userRole === 'platform_admin';
  // Platform admins use MANAGE_PLATFORM_LIBRARY, others use MANAGE_ITEM_LIBRARY
  const canManageLibrary = isPlatformAdmin 
    ? hasPermission(Permission.MANAGE_PLATFORM_LIBRARY)
    : hasPermission(Permission.MANAGE_ITEM_LIBRARY);

  // Handle category selection with Ctrl+Click support
  const handleCategoryClick = (category: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      const newSelected = new Set(selectedCategories);
      if (category === 'All Items') {
        // If clicking "All Items" with Ctrl, clear others
        setSelectedCategories(new Set(['All Items']));
      } else {
        // Remove "All Items" if present
        newSelected.delete('All Items');
        if (newSelected.has(category)) {
          newSelected.delete(category);
          // If nothing left, default to "All Items"
          if (newSelected.size === 0) {
            setSelectedCategories(new Set(['All Items']));
            return;
          }
        } else {
          newSelected.add(category);
        }
        setSelectedCategories(newSelected);
      }
    } else {
      // Normal click - select only this category
      setSelectedCategories(new Set([category]));
    }
  };

  // Filter and search items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter - support multiple categories
      if (!selectedCategories.has('All Items')) {
        if (!selectedCategories.has(item.category)) {
          return false;
        }
      }

      // Scope filter
      if (scopeFilter !== 'all' && item.scope !== scopeFilter) {
        return false;
      }

      // Active/Inactive filter
      if (!showInactiveItems && !item.isActive) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.sku?.toLowerCase().includes(query) ||
          item.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [items, selectedCategories, scopeFilter, showInactiveItems, searchQuery]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      if (item.isActive || showInactiveItems) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [items, showInactiveItems]);

  const handleAddItem = () => {
    setEditingItem(null);
    setShowAddEditModal(true);
  };

  const handleEditItem = (item: LibraryItem) => {
    setEditingItem(item);
    setShowAddEditModal(true);
  };

  const handleSaveItem = (itemData: Partial<LibraryItem>) => {
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...itemData, updatedAt: new Date() }
          : item
      ));
    } else {
      // Add new item
      const newItem: LibraryItem = {
        id: `lib${Date.now()}`,
        ...itemData as Omit<LibraryItem, 'id' | 'createdAt' | 'updatedAt'>,
        createdBy: currentUser?.email,
        agencyId: userRole === 'agency_admin' || userRole === 'designer' ? 'agency1' : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setItems([...items, newItem]);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const handleToggleActive = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId
        ? { ...item, isActive: !item.isActive, updatedAt: new Date() }
        : item
    ));
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) {
      setItems(items.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories(new Set(['All Items']));
    setScopeFilter('all');
    setSearchQuery('');
    setShowInactiveItems(false);
  };

  const hasActiveFilters = () => {
    return !selectedCategories.has('All Items') || 
           selectedCategories.size > 1 ||
           scopeFilter !== 'all' || 
           searchQuery !== '' || 
           showInactiveItems;
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting items...', filteredItems);
    alert('Export functionality coming soon!');
  };

  const handleImport = () => {
    // TODO: Implement CSV import
    console.log('Importing items...');
    alert('Import functionality coming soon!');
  };

  const canEditItem = (item: LibraryItem) => {
    if (isLocked) return false;
    if (!canManageLibrary) return false;
    if (isPlatformAdmin) return true; // Platform admin can edit everything
    if (item.scope === 'global') return false; // Regular users can't edit global items
    if (item.scope === 'personal' && item.createdBy === currentUser?.email) return true;
    if (item.scope === 'agency') return true;
    return false;
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'global':
        return <Globe className="h-4 w-4" />;
      case 'agency':
        return <Building2 className="h-4 w-4" />;
      case 'personal':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getScopeBadgeColor = (scope: string) => {
    switch (scope) {
      case 'global':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agency':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'personal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return '';
    }
  };

  // Get row height based on density
  const getRowPadding = () => density === 'compact' ? 'py-1' : 'py-4';
  const getTextSize = () => density === 'compact' ? 'text-xs' : 'text-sm';
  const getHeaderPadding = () => density === 'compact' ? 'py-1.5' : 'py-3';
  const getIconSize = () => density === 'compact' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Categories Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-4 overflow-y-auto flex-shrink-0">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">CATEGORIES</h3>
          <div className="space-y-1">
            {CATEGORIES.map((category) => {
              const count = category === 'All Items' 
                ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
                : categoryCounts[category] || 0;
              const isSelected = selectedCategories.has(category);

              return (
                <button
                  key={category}
                  onClick={(e) => handleCategoryClick(category, e)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category}</span>
                    {count > 0 && (
                      <span className={`text-xs ${
                        isSelected 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3 px-2">
            Tip: Hold Ctrl/Cmd to select multiple categories
          </p>
        </div>

        {/* Scope Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">SCOPE</h3>
          <div className="space-y-1">
            {[
              { value: 'all', label: 'All Items', icon: null },
              { value: 'global', label: 'Global', icon: <Globe className="h-3 w-3" /> },
              { value: 'agency', label: 'Agency', icon: <Building2 className="h-3 w-3" /> },
              { value: 'personal', label: 'Personal', icon: <User className="h-3 w-3" /> }
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setScopeFilter(value as typeof scopeFilter)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  scopeFilter === value
                    ? 'bg-secondary text-white'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-sm font-medium">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Show Inactive Toggle */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={() => setShowInactiveItems(!showInactiveItems)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {showInactiveItems ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            <span>{showInactiveItems ? 'Hide' : 'Show'} Inactive Items</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">Item Library</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your catalog of furniture, materials, and services
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Lock/Unlock Button - Admin Only */}
              {canManageLibrary && (
                <Button
                  variant="outline"
                  onClick={() => setIsLocked(!isLocked)}
                  size="sm"
                  className={isLocked ? '' : 'border-warning text-warning'}
                >
                  {isLocked ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Locked
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlocked
                    </>
                  )}
                </Button>
              )}
              
              {/* Density Toggle */}
              <Select value={density} onValueChange={(value: any) => setDensity(value)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleExport}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {canManageLibrary && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleImport}
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    disabled={isLocked}
                    variant={isLocked ? "ghost" : "default"}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, SKU, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
              {selectedItems.size > 0 && canManageLibrary && !isLocked && (
                <Button
                  variant="outline"
                  onClick={handleBulkDelete}
                  className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedItems.size})
                </Button>
              )}
            </div>

            {/* Results count - moved to right */}
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1 overflow-auto">
          {filteredItems.length === 0 ? (
            <Card className="m-6 p-12">
              <div className="text-center">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No items found</p>
                  <p className="text-sm mt-2">
                    {searchQuery 
                      ? 'Try adjusting your search or filters' 
                      : 'Get started by adding your first item'}
                  </p>
                </div>
                {canManageLibrary && !searchQuery && !isLocked && (
                  <Button
                    onClick={handleAddItem}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Item
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  {/* Sticky Header */}
                  <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
                    <tr className={`text-left text-sm font-medium text-muted-foreground ${getHeaderPadding()}`}>
                      {canManageLibrary && !isLocked && (
                        <th className={`${getHeaderPadding()} px-4 w-12 bg-muted/50`}>
                          <input
                            type="checkbox"
                            checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(new Set(filteredItems.map(item => item.id)));
                              } else {
                                setSelectedItems(new Set());
                              }
                            }}
                            className="rounded border-border"
                          />
                        </th>
                      )}
                      <th className={`${getHeaderPadding()} px-4 sticky left-0 bg-muted/50 z-20`}>Item Name</th>
                      <th className={`${getHeaderPadding()} px-4 bg-muted/50`}>Category</th>
                      <th className={`${getHeaderPadding()} px-4 bg-muted/50`}>Scope</th>
                      <th className={`${getHeaderPadding()} px-4 text-right bg-muted/50`}>Quality</th>
                      <th className={`${getHeaderPadding()} px-4 text-right bg-muted/50`}>Premium</th>
                      <th className={`${getHeaderPadding()} px-4 text-right bg-muted/50`}>Luxury</th>
                      <th className={`${getHeaderPadding()} px-4 text-right bg-muted/50`}>UltraLux</th>
                      <th className={`${getHeaderPadding()} px-4 bg-muted/50`}>Unit</th>
                      <th className={`${getHeaderPadding()} px-4 bg-muted/50`}>Status</th>
                      <th className={`${getHeaderPadding()} px-4 text-right bg-muted/50`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredItems.map((item) => {
                      const isHighlighted = selectedCategories.size > 1 && 
                                          !selectedCategories.has('All Items') && 
                                          selectedCategories.has(item.category);
                      
                      return (
                        <tr 
                          key={item.id} 
                          className={`hover:bg-muted/30 transition-colors ${
                            isHighlighted ? 'bg-primary/5' : ''
                          }`}
                        >
                          {canManageLibrary && !isLocked && (
                            <td className={`${getRowPadding()} px-4`}>
                              <input
                                type="checkbox"
                                checked={selectedItems.has(item.id)}
                                onChange={(e) => {
                                  const newSelected = new Set(selectedItems);
                                  if (e.target.checked) {
                                    newSelected.add(item.id);
                                  } else {
                                    newSelected.delete(item.id);
                                  }
                                  setSelectedItems(newSelected);
                                }}
                                className="rounded border-border"
                              />
                            </td>
                          )}
                          <td className={`${getRowPadding()} px-4 sticky left-0 bg-card z-10`}>
                            <div className={`font-medium ${getTextSize()}`}>{item.name}</div>
                          </td>
                          <td className={`${getRowPadding()} px-4`}>
                            <Badge variant="outline" className={getTextSize()}>{item.category}</Badge>
                          </td>
                          <td className={`${getRowPadding()} px-4`}>
                            <div className={`inline-flex items-center gap-1 ${density === 'compact' ? 'px-1.5 py-0.5' : 'px-2 py-1'} rounded-md text-xs font-medium border ${getScopeBadgeColor(item.scope)}`}>
                              <span className={density === 'compact' ? 'hidden' : ''}>
                                {getScopeIcon(item.scope)}
                              </span>
                              <span className="capitalize">{item.scope}</span>
                            </div>
                          </td>
                          <td className={`${getRowPadding()} px-4 text-right font-mono ${getTextSize()}`}>
                            {item.qualityPrice ? `$${item.qualityPrice.toLocaleString()}` : '-'}
                          </td>
                          <td className={`${getRowPadding()} px-4 text-right font-mono ${getTextSize()}`}>
                            {item.premiumPrice ? `$${item.premiumPrice.toLocaleString()}` : '-'}
                          </td>
                          <td className={`${getRowPadding()} px-4 text-right font-mono ${getTextSize()}`}>
                            {item.luxuryPrice ? `$${item.luxuryPrice.toLocaleString()}` : '-'}
                          </td>
                          <td className={`${getRowPadding()} px-4 text-right font-mono ${getTextSize()}`}>
                            {item.ultraLuxPrice ? `$${item.ultraLuxPrice.toLocaleString()}` : '-'}
                          </td>
                          <td className={`${getRowPadding()} px-4 ${getTextSize()} text-muted-foreground`}>{item.unit}</td>
                          <td className={`${getRowPadding()} px-4`}>
                            <Badge
                              variant={item.isActive ? 'success' : 'subtle'}
                              className={getTextSize()}
                            >
                              {item.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className={`${getRowPadding()} px-4`}>
                            <div className="flex justify-end gap-1">
                              {canEditItem(item) ? (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditItem(item)}
                                    title="Edit item"
                                    className={density === 'compact' ? 'h-7 w-7 p-0' : ''}
                                  >
                                    <Edit className={density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleToggleActive(item.id)}
                                    title={item.isActive ? 'Deactivate' : 'Activate'}
                                    className={density === 'compact' ? 'h-7 w-7 p-0' : ''}
                                  >
                                    {item.isActive ? (
                                      <EyeOff className={density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'} />
                                    ) : (
                                      <Eye className={density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'} />
                                    )}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteItem(item.id)}
                                    className={`text-destructive hover:text-destructive ${density === 'compact' ? 'h-7 w-7 p-0' : ''}`}
                                    title="Delete item"
                                  >
                                    <Trash2 className={density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'} />
                                  </Button>
                                </>
                              ) : (
                                <span className={`${getTextSize()} text-muted-foreground px-3`}>
                                  {item.scope === 'global' ? 'Platform Managed' : isLocked ? 'Locked' : 'View Only'}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Click to add item at bottom - only when unlocked */}
              {canManageLibrary && !isLocked && (
                <div className="border-t border-border">
                  <button
                    onClick={handleAddItem}
                    className="w-full px-4 py-3 text-left text-sm text-muted-foreground hover:bg-muted/30 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Click to add item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddEditItemModal
        open={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
      />
    </div>
  );
}