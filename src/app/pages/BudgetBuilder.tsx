import { useParams, useNavigate, Link } from 'react-router';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Send, 
  Plus, 
  Grip, 
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  FileText,
  Link2,
  Paperclip,
  Flag,
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Package,
  DollarSign,
  User,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { getBudgetById, getProjectById } from '@/app/data/mockData';
import { useState, useMemo } from 'react';
import { InlineItemRow } from '@/app/components/budgets/InlineItemRow';
import { ApprovalDisplayOptions } from '@/types/approval';
import { BudgetLineItem } from '@/app/data/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { toast } from 'sonner';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type SortField = 'itemNumber' | 'itemName' | 'category' | 'phase' | 'quality' | 'quantity' | 'netCost' | 'total';
type SortDirection = 'asc' | 'desc';

interface DraggableItemProps {
  item: any;
  index: number;
  room: string;
  moveItem: (dragIndex: number, hoverIndex: number, dragRoom: string, hoverRoom: string) => void;
  selectedItems: Set<string>;
  setSelectedItems: (items: Set<string>) => void;
  itemsByRoom: Record<string, any[]>;
}

const DraggableLineItem = ({ item, index, room, moveItem, selectedItems, setSelectedItems, itemsByRoom }: DraggableItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'LINE_ITEM',
    item: { index, room, itemId: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'LINE_ITEM',
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index || draggedItem.room !== room) {
        moveItem(draggedItem.index, index, draggedItem.room, room);
        draggedItem.index = index;
        draggedItem.room = room;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex border-b border-border hover:bg-muted/30 group text-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="w-10 p-2 flex items-center justify-center">
        <input
          type="checkbox"
          className="rounded"
          checked={selectedItems.has(item.id)}
          onChange={(e) => {
            const newSet = new Set(selectedItems);
            if (e.target.checked) {
              newSet.add(item.id);
            } else {
              newSet.delete(item.id);
            }
            setSelectedItems(newSet);
          }}
        />
      </div>
      <div className="w-12 p-2 flex items-center text-muted-foreground">
        <Grip className="h-4 w-4 cursor-move mr-1" />
        {item.itemNumber}
      </div>
      <div className="w-48 p-2 font-medium">{item.itemName}</div>
      <div className="w-40 p-2">
        <Badge variant="outline" className="text-xs truncate max-w-full">{item.category || 'Furniture'}</Badge>
      </div>
      <div className="w-64 p-2 text-muted-foreground truncate">{item.details}</div>
      <div className="w-32 p-2 text-muted-foreground">{item.phase}</div>
      <div className="w-24 p-2">
        <Badge variant="outline">{item.quality}</Badge>
      </div>
      <div className="w-20 p-2 text-right font-mono">{item.quantity}</div>
      <div className="w-20 p-2 text-muted-foreground">{item.unit}</div>
      <div className="w-28 p-2 text-right font-mono">${item.netCost.toLocaleString()}</div>
      <div className="w-20 p-2 text-right font-mono">{item.markupPercent}%</div>
      <div className="w-28 p-2 text-right font-mono font-semibold">${item.itemCost.toLocaleString()}</div>
      <div className="w-24 p-2 text-right font-mono">${item.shipping.toLocaleString()}</div>
      <div className="w-24 p-2 text-right font-mono">${item.other.toLocaleString()}</div>
      <div className="w-24 p-2 text-right font-mono">${item.tax.toLocaleString()}</div>
      <div className="w-28 p-2 text-right font-mono font-bold">${item.total.toLocaleString()}</div>
      <div className="w-12 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Item Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => toast.info('Edit item functionality coming soon')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Item
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => toast.success('Item duplicated')}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Item
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => toast.info('Add notes functionality coming soon')}>
              <FileText className="h-4 w-4 mr-2" />
              Add Notes/Comments
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => toast.info('Attach files functionality coming soon')}>
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => toast.info('Link vendor functionality coming soon')}>
              <Link2 className="h-4 w-4 mr-2" />
              Link to Vendor
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Move to Section Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArrowRight className="h-4 w-4 mr-2" />
                Move to Section
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {Object.keys(itemsByRoom).filter(r => r !== room).map((targetRoom) => (
                  <DropdownMenuItem 
                    key={targetRoom}
                    onClick={() => toast.success(`Item moved to ${targetRoom}`)}
                  >
                    {targetRoom}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            {/* Change Status Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Clock className="h-4 w-4 mr-2" />
                Change Status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => toast.success('Status updated to Pending')}>
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Status updated to Ordered')}>
                  <Package className="h-4 w-4 mr-2" />
                  Ordered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Status updated to Delivered')}>
                  <Package className="h-4 w-4 mr-2" />
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Status updated to Installed')}>
                  <Check className="h-4 w-4 mr-2" />
                  Installed
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => toast.success('Item flagged')}>
              <Flag className="h-4 w-4 mr-2" />
              Flag/Highlight
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => toast.success('Marked as client responsibility')}>
              <User className="h-4 w-4 mr-2" />
              Mark as Client Responsibility
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => toast.info('Apply discount functionality coming soon')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Apply Discount
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => toast.success('Item added to library')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Add to Library
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => toast.success('Item deleted')}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export function BudgetBuilder() {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  const budget = getBudgetById(budgetId!);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('itemNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [activeInlineRoom, setActiveInlineRoom] = useState<string | null>(null);

  // Budget Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [globalMarkup, setGlobalMarkup] = useState(30);
  const [shippingPercent, setShippingPercent] = useState(8);
  const [taxPercent, setTaxPercent] = useState(7.5);
  const [otherPercent, setOtherPercent] = useState(2);
  const [markupIncludesAll, setMarkupIncludesAll] = useState(false); // false = markup on Net Cost only
  const [increasePercent, setIncreasePercent] = useState('');

  // Collapsed rooms state
  const [collapsedRooms, setCollapsedRooms] = useState<Set<string>>(new Set());

  // Toggle room collapse
  const toggleRoomCollapse = (room: string) => {
    setCollapsedRooms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(room)) {
        newSet.delete(room);
      } else {
        newSet.add(room);
      }
      return newSet;
    });
  };

  if (!budget) {
    return <div className="p-6">Budget not found</div>;
  }

  // Get project to retrieve customer email and defaults
  const project = getProjectById(budget.projectId);
  const primaryContact = project?.contacts.find(c => c.isPrimary);
  const customerEmail = primaryContact?.email || '';
  
  const defaultQuality = project?.defaultQuality || 'Premium';
  const defaultMarkup = project?.defaultMarkup || 30;
  const budgetPhase = budget.phase || 'Phase 1';

  // Group items by room
  const [itemsByRoom, setItemsByRoom] = useState<Record<string, typeof budget.lineItems>>(() => {
    return budget.lineItems.reduce((acc, item) => {
      if (!acc[item.room]) acc[item.room] = [];
      acc[item.room].push(item);
      return acc;
    }, {} as Record<string, typeof budget.lineItems>);
  });
  
  // Get next item number
  const getNextItemNumber = () => {
    const allItems = Object.values(itemsByRoom).flat();
    if (allItems.length === 0) return 1;
    return Math.max(...allItems.map(item => item.itemNumber)) + 1;
  };

  // Handle saving new item from inline row
  const handleSaveInlineItem = (room: string, newItem: Partial<BudgetLineItem>) => {
    setItemsByRoom((prev) => ({
      ...prev,
      [room]: [...prev[room], newItem as typeof budget.lineItems[0]]
    }));
    setActiveInlineRoom(null);
    toast.success('Item added successfully');
  };

  // Handle canceling inline row
  const handleCancelInlineRow = () => {
    setActiveInlineRoom(null);
  };

  // Move item function for drag and drop
  const moveItem = (dragIndex: number, hoverIndex: number, dragRoom: string, hoverRoom: string) => {
    setItemsByRoom((prev) => {
      const newItemsByRoom = { ...prev };
      
      // Remove from source room
      const draggedItem = newItemsByRoom[dragRoom][dragIndex];
      newItemsByRoom[dragRoom] = [...newItemsByRoom[dragRoom]];
      newItemsByRoom[dragRoom].splice(dragIndex, 1);
      
      // Add to target room
      if (!newItemsByRoom[hoverRoom]) {
        newItemsByRoom[hoverRoom] = [];
      }
      newItemsByRoom[hoverRoom] = [...newItemsByRoom[hoverRoom]];
      newItemsByRoom[hoverRoom].splice(hoverIndex, 0, { ...draggedItem, room: hoverRoom });
      
      return newItemsByRoom;
    });
  };

  // Add new room
  const handleAddRoom = () => {
    const roomName = prompt('Enter new room name:');
    if (roomName && roomName.trim()) {
      setItemsByRoom((prev) => ({
        ...prev,
        [roomName.trim()]: []
      }));
      toast.success(`Room "${roomName}" added`);
    }
  };

  // Filter and sort items
  const getFilteredAndSortedItems = (items: any[]) => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply phase filter
    if (phaseFilter !== 'all') {
      filtered = filtered.filter(item => item.phase === phaseFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Handle column header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get all unique categories and phases
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    Object.values(itemsByRoom).flat().forEach(item => {
      if (item.category) categories.add(item.category);
    });
    return Array.from(categories);
  }, [itemsByRoom]);

  const allPhases = useMemo(() => {
    const phases = new Set<string>();
    Object.values(itemsByRoom).flat().forEach(item => {
      if (item.phase) phases.add(item.phase);
    });
    return Array.from(phases);
  }, [itemsByRoom]);

  // Handle settings actions
  const handleApplySettings = () => {
    toast.success('Budget settings updated successfully');
    setSettingsOpen(false);
  };

  const handleIncreaseBudget = () => {
    const percent = parseFloat(increasePercent);
    if (isNaN(percent) || percent <= 0) {
      toast.error('Please enter a valid percentage');
      return;
    }
    toast.success(`Budget increased by ${percent}%`);
    setIncreasePercent('');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1 inline" />
      : <ArrowDown className="h-3 w-3 ml-1 inline" />;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-background">
        {/* Top Toolbar - Enhanced */}
        <div className="flex-shrink-0 border-b border-border bg-card shadow-sm px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to={`/projects/${budget.projectId}`}>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{budget.name} {budget.version}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{budget.phase}</p>
            </div>
            <Badge
              variant={budget.status === 'Approved' ? 'success' : 'warning'}
              className="text-sm px-3 py-1"
            >
              {budget.status}
            </Badge>
            <Button variant="outline" size="sm" className="shadow-sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Link to={`/budgets/${budgetId}/preview`}>
              <Button variant="outline" size="sm" className="shadow-sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => navigate(`/budgets/${budgetId}/preview`)}
              className="shadow-md"
            >
              <Send className="h-4 w-4 mr-2" />
              Send for Approval
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex-shrink-0 border-b border-border bg-card px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name, details, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {allPhases.map(phase => (
                  <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchQuery || categoryFilter !== 'all' || phaseFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setPhaseFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
            
            {/* Settings Dialog */}
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Settings className="h-4 w-4 mr-2" />
                  Budget Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Budget Settings</DialogTitle>
                  <DialogDescription>
                    Configure global budget assumptions and apply bulk adjustments
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Global Markup */}
                  <div className="space-y-3">
                    <Label htmlFor="global-markup" className="text-base font-semibold">
                      Global Markup
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="global-markup"
                        type="number"
                        value={globalMarkup}
                        onChange={(e) => setGlobalMarkup(parseFloat(e.target.value))}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Default markup percentage applied to all items
                    </p>
                  </div>

                  <Separator />

                  {/* Markup Calculation Method */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Markup Calculation Method</Label>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                      <div className="space-y-1">
                        <div className="font-medium">Apply Markup to All Costs</div>
                        <div className="text-sm text-muted-foreground">
                          {markupIncludesAll 
                            ? 'Markup applies to Net Cost + Shipping + Tax + Other' 
                            : 'Markup applies to Net Cost only (default)'}
                        </div>
                      </div>
                      <Switch
                        checked={markupIncludesAll}
                        onCheckedChange={setMarkupIncludesAll}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Cost Assumptions */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Cost Assumptions (% of Net Cost)</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      These percentages will appear as assumptions above their respective columns in the budget table
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shipping-percent">Shipping</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="shipping-percent"
                            type="number"
                            step="0.1"
                            value={shippingPercent}
                            onChange={(e) => setShippingPercent(parseFloat(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm">%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tax-percent">Tax</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="tax-percent"
                            type="number"
                            step="0.1"
                            value={taxPercent}
                            onChange={(e) => setTaxPercent(parseFloat(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm">%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="other-percent">Other</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="other-percent"
                            type="number"
                            step="0.1"
                            value={otherPercent}
                            onChange={(e) => setOtherPercent(parseFloat(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Budget Adjustment */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Quick Budget Adjustment</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase the entire budget by a percentage in one click
                    </p>
                    <div className="flex items-center gap-3">
                      <Input
                        placeholder="e.g., 10"
                        type="number"
                        value={increasePercent}
                        onChange={(e) => setIncreasePercent(e.target.value)}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                      <Button 
                        onClick={handleIncreaseBudget}
                        variant="secondary"
                        className="gap-2"
                      >
                        <TrendingUp className="h-4 w-4" />
                        Increase Budget
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApplySettings}>
                    Apply Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Room Navigator */}
          <aside className="w-64 border-r border-border bg-card flex-shrink-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">SECTIONS</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleAddRoom}
                  title="Add new room/section"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {Object.keys(itemsByRoom).map((room) => {
                  const roomTotal = itemsByRoom[room].reduce((sum, item) => sum + item.total, 0);
                  return (
                    <div key={room} className="rounded-lg hover:bg-muted">
                      <div className="px-3 py-2 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{room}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info('Add item to this section');
                            }}
                            title="Add item to this section"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {itemsByRoom[room].length} items
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ${roomTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {/* Section Total */}
                      <div className="px-3 pb-2 text-xs">
                        <div className="flex items-center justify-between pt-1 border-t border-border">
                          <span className="font-medium text-muted-foreground">Total:</span>
                          <span className="font-mono font-semibold">${roomTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Budget Grid - Single Scroll Container */}
          <div className="flex-1 overflow-auto">
            <div className="min-w-max">
              {/* Budget Assumptions Row */}
              <div className="sticky top-0 bg-brand-secondary/10 border-b border-brand-secondary z-20">
                <div className="flex text-xs text-brand-secondary font-medium">
                  <div className="w-10 p-2" />
                  <div className="w-12 p-2" />
                  <div className="w-48 p-2" />
                  <div className="w-40 p-2" />
                  <div className="w-64 p-2" />
                  <div className="w-32 p-2" />
                  <div className="w-24 p-2" />
                  <div className="w-20 p-2" />
                  <div className="w-20 p-2" />
                  <div className="w-28 p-2" />
                  <div className="w-20 p-2" />
                  <div className="w-28 p-2" />
                  <div className="w-24 p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>{shippingPercent}% of Net</span>
                    </div>
                  </div>
                  <div className="w-24 p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>{otherPercent}% of Net</span>
                    </div>
                  </div>
                  <div className="w-24 p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>{taxPercent}% of Net</span>
                    </div>
                  </div>
                  <div className="w-28 p-2" />
                  <div className="w-12" />
                </div>
              </div>

              {/* Table Header */}
              <div className="sticky top-[2.5rem] bg-muted/50 border-b border-border backdrop-blur-sm z-10">
                <div className="flex text-xs font-medium text-muted-foreground">
                  <div className="w-10 p-2 flex items-center justify-center">
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="w-12 p-2 cursor-pointer" onClick={() => handleSort('itemNumber')}>
                    #<SortIcon field="itemNumber" />
                  </div>
                  <div className="w-48 p-2 cursor-pointer" onClick={() => handleSort('itemName')}>
                    Item Name<SortIcon field="itemName" />
                  </div>
                  <div className="w-40 p-2 cursor-pointer" onClick={() => handleSort('category')}>
                    Category<SortIcon field="category" />
                  </div>
                  <div className="w-64 p-2">Details/Notes</div>
                  <div className="w-32 p-2 cursor-pointer" onClick={() => handleSort('phase')}>
                    Phase<SortIcon field="phase" />
                  </div>
                  <div className="w-24 p-2 cursor-pointer" onClick={() => handleSort('quality')}>
                    Quality<SortIcon field="quality" />
                  </div>
                  <div className="w-20 p-2 text-right cursor-pointer" onClick={() => handleSort('quantity')}>
                    Qty<SortIcon field="quantity" />
                  </div>
                  <div className="w-20 p-2">Unit</div>
                  <div className="w-28 p-2 text-right font-mono cursor-pointer" onClick={() => handleSort('netCost')}>
                    Net Cost<SortIcon field="netCost" />
                  </div>
                  <div className="w-20 p-2 text-right">Markup%</div>
                  <div className="w-28 p-2 text-right font-mono">Item Cost</div>
                  <div className="w-24 p-2 text-right font-mono">Shipping</div>
                  <div className="w-24 p-2 text-right font-mono">Other</div>
                  <div className="w-24 p-2 text-right font-mono">Tax</div>
                  <div className="w-28 p-2 text-right font-mono cursor-pointer" onClick={() => handleSort('total')}>
                    Total<SortIcon field="total" />
                  </div>
                  <div className="w-12"></div>
                </div>
              </div>

              {/* Budget Items by Room */}
              {Object.entries(itemsByRoom).map(([room, items]) => {
                const filteredItems = getFilteredAndSortedItems(items);
                const isCollapsed = collapsedRooms.has(room);
                return (
                  <div key={room}>
                    {/* Room Section Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-muted border-y border-border">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-accent"
                          onClick={() => toggleRoomCollapse(room)}
                        >
                          {isCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Grip className="h-4 w-4 text-muted-foreground cursor-move" />
                        <h3 className="font-semibold">{room}</h3>
                        <span className="text-sm text-muted-foreground">
                          ({filteredItems.length} items)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-semibold">
                          ${filteredItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setActiveInlineRoom(room)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Item
                        </Button>
                      </div>
                    </div>

                    {/* Items - Only show if not collapsed */}
                    {!isCollapsed && (
                      <>
                        {filteredItems.map((item, index) => (
                          <DraggableLineItem
                            key={item.id}
                            item={item}
                            index={index}
                            room={room}
                            moveItem={moveItem}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            itemsByRoom={itemsByRoom}
                          />
                        ))}

                        {/* Inline Item Row */}
                        {activeInlineRoom === room && (
                          <InlineItemRow
                            room={room}
                            phase={budgetPhase}
                            defaultQuality={defaultQuality}
                            defaultMarkup={defaultMarkup}
                            itemNumber={getNextItemNumber()}
                            onSave={(newItem) => handleSaveInlineItem(room, newItem)}
                            onCancel={handleCancelInlineRow}
                          />
                        )}
                        
                        {/* Empty row for adding items - visible when no inline row is active or when this room has no inline row */}
                        {activeInlineRoom !== room && (
                          <div 
                            className="flex border-b border-border hover:bg-accent/20 cursor-pointer group text-sm transition-colors"
                            onClick={() => setActiveInlineRoom(room)}
                          >
                            <div className="w-10 p-2" />
                            <div className="w-12 p-2 text-muted-foreground/50">{getNextItemNumber()}</div>
                            <div className="w-48 p-2 text-muted-foreground/50 italic">Click to add item...</div>
                            <div className="flex-1 p-2 text-muted-foreground/30 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              Type to search library or create new item
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Summary Bar */}
        <div className="flex-shrink-0 border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-8 text-sm">
              <div>
                <span className="text-muted-foreground">Total Items:</span>
                <span className="ml-2 font-semibold">{budget.lineItems.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="ml-2 font-mono font-semibold">${budget.subtotal.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tax:</span>
                <span className="ml-2 font-mono font-semibold">${budget.totalTax.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Grand Total</div>
                <div className="text-2xl font-bold font-mono">${budget.grandTotal.toLocaleString()}</div>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(`/budgets/${budgetId}/preview`)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send for Approval
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}