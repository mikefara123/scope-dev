import { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Minus, Layers, Columns2, Lock, Split } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { cn } from '@/app/components/ui/utils';

// Mock comparison data with released status
const comparisonData = {
  original: {
    name: 'Initial Budget v1.0',
    total: 145000,
    itemCount: 42
  },
  revised: {
    name: 'Revised Budget v2.0',
    total: 168000,
    itemCount: 44
  },
  changes: {
    added: [
      { id: '1', name: 'Accent Chair', room: 'Living Room', details: 'Velvet upholstery', amount: 2400, released: false },
      { id: '2', name: 'Side Table', room: 'Living Room', details: 'Marble top', amount: 800, released: false },
      { id: '3', name: 'Table Lamp', room: 'Bedroom', details: 'Brass finish', amount: 450, released: false }
    ],
    removed: [
      { id: '4', name: 'Floor Lamp', room: 'Living Room', details: 'Original specification', amount: 800, released: true }
    ],
    changed: [
      {
        id: '5',
        name: 'Sofa',
        room: 'Living Room',
        details: 'Upgraded fabric',
        originalAmount: 6000,
        revisedAmount: 8500,
        difference: 2500,
        released: false
      },
      {
        id: '6',
        name: 'Dining Table',
        room: 'Dining Room',
        details: 'Size increased',
        originalAmount: 3500,
        revisedAmount: 4200,
        difference: 700,
        released: true
      },
      {
        id: '7',
        name: 'Area Rug',
        room: 'Living Room',
        details: 'Pattern changed',
        originalAmount: 2800,
        revisedAmount: 2200,
        difference: -600,
        released: false
      },
      {
        id: '8',
        name: 'Coffee Table',
        room: 'Living Room',
        details: 'No changes',
        originalAmount: 1800,
        revisedAmount: 1800,
        difference: 0,
        released: true
      }
    ]
  }
};

type ViewMode = 'side-by-side' | 'overlay';

export function BudgetComparison() {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [releasedItems, setReleasedItems] = useState<Record<string, boolean>>({
    '4': true,
    '6': true,
    '8': true
  });

  const netChange = comparisonData.revised.total - comparisonData.original.total;
  const percentChange = ((netChange / comparisonData.original.total) * 100).toFixed(1);
  const isIncrease = netChange > 0;

  const toggleReleased = (id: string) => {
    setReleasedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Count released items
  const releasedCount = Object.values(releasedItems).filter(Boolean).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/projects/1">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold">Budget Comparison</h1>
            <p className="text-muted-foreground mt-1">Compare budget versions and track changes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border border-border bg-card">
            <option>{comparisonData.original.name}</option>
            <option>Budget v0.9</option>
            <option>Budget v0.8</option>
          </select>
          <span className="flex items-center px-3 text-muted-foreground font-semibold">vs</span>
          <select className="px-4 py-2 rounded-lg border border-border bg-card">
            <option>{comparisonData.revised.name}</option>
            <option>Budget v2.1</option>
            <option>Budget v1.5</option>
          </select>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === 'side-by-side' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('side-by-side')}
            className={viewMode === 'side-by-side' ? 'bg-card shadow-sm' : ''}
          >
            <Split className="h-4 w-4 mr-2" />
            Side by Side
          </Button>
          <Button
            variant={viewMode === 'overlay' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('overlay')}
            className={viewMode === 'overlay' ? 'bg-card shadow-sm' : ''}
          >
            <Layers className="h-4 w-4 mr-2" />
            Overlay
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <Lock className="inline h-4 w-4 mr-1" />
            {releasedCount} items released (cannot be removed)
          </div>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Change Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Original Total</p>
              <p className="text-2xl font-bold font-mono">
                ${comparisonData.original.total.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Revised Total</p>
              <p className="text-2xl font-bold font-mono">
                ${comparisonData.revised.total.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Net Change</p>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    'text-2xl font-bold font-mono',
                    isIncrease ? 'text-warning' : 'text-success'
                  )}
                >
                  {isIncrease ? '+' : ''}${netChange.toLocaleString()}
                </p>
                {isIncrease ? (
                  <TrendingUp className="h-5 w-5 text-warning" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-success" />
                )}
              </div>
              <p className={cn('text-sm', isIncrease ? 'text-warning' : 'text-success')}>
                {isIncrease ? '+' : ''}{percentChange}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Items Added</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{comparisonData.changes.added.length}</p>
                <Plus className="h-5 w-5 text-success" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Items Changed</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{comparisonData.changes.changed.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side by Side View */}
      {viewMode === 'side-by-side' && (
        <>
          {/* Added Items */}
          {comparisonData.changes.added.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Added Items</CardTitle>
                  <Badge className="bg-success text-white">
                    {comparisonData.changes.added.length} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left text-sm font-medium text-muted-foreground">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Details</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Released?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {comparisonData.changes.added.map((item) => (
                        <tr key={item.id} className="bg-green-50 hover:bg-green-100 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                                <Plus className="h-3 w-3 text-white" />
                              </div>
                              <span className="font-medium text-green-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-green-800">{item.room}</td>
                          <td className="py-4 px-4 text-sm text-green-700">{item.details}</td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-green-900">
                            +${item.amount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={releasedItems[item.id] || false}
                                onCheckedChange={() => toggleReleased(item.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Removed Items */}
          {comparisonData.changes.removed.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Removed Items</CardTitle>
                  <Badge className="bg-destructive text-destructive-foreground">
                    {comparisonData.changes.removed.length} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left text-sm font-medium text-muted-foreground">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Details</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Released?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {comparisonData.changes.removed.map((item) => (
                        <tr
                          key={item.id}
                          className={cn(
                            'bg-red-50 hover:bg-red-100 transition-colors',
                            releasedItems[item.id] && 'opacity-60'
                          )}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                                <Minus className="h-3 w-3 text-white" />
                              </div>
                              <span className={cn('font-medium text-red-900', 'line-through')}>
                                {item.name}
                              </span>
                              {releasedItems[item.id] && (
                                <Lock className="h-4 w-4 text-red-700" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-red-800">{item.room}</td>
                          <td className="py-4 px-4 text-sm text-red-700">{item.details}</td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-red-900">
                            -${item.amount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <Checkbox
                                checked={releasedItems[item.id] || false}
                                onCheckedChange={() => toggleReleased(item.id)}
                                disabled={releasedItems[item.id]}
                              />
                              {releasedItems[item.id] && (
                                <span className="text-xs text-red-700 font-medium">
                                  Cannot remove
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Changed Items */}
          {comparisonData.changes.changed.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Changed Items</CardTitle>
                  <Badge className="bg-warning text-white">
                    {comparisonData.changes.changed.length} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left text-sm font-medium text-muted-foreground">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4 text-right">Original</th>
                        <th className="py-3 px-4 text-right">Revised</th>
                        <th className="py-3 px-4 text-right">Change</th>
                        <th className="py-3 px-4 text-center">Released?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {comparisonData.changes.changed.map((item) => (
                        <tr
                          key={item.id}
                          className={cn(
                            'hover:bg-yellow-100 transition-colors',
                            item.difference !== 0 ? 'bg-yellow-50' : 'bg-muted/20'
                          )}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              {releasedItems[item.id] && (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">{item.room}</td>
                          <td className="py-4 px-4 text-right font-mono">
                            ${item.originalAmount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-semibold">
                            ${item.revisedAmount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {item.difference !== 0 ? (
                              <span
                                className={cn(
                                  'font-mono font-bold',
                                  item.difference > 0 ? 'text-warning' : 'text-success'
                                )}
                              >
                                {item.difference > 0 ? '+' : ''}${item.difference.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={releasedItems[item.id] || false}
                                onCheckedChange={() => toggleReleased(item.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Overlay View */}
      {viewMode === 'overlay' && (
        <Card>
          <CardHeader>
            <CardTitle>All Changes (Overlay View)</CardTitle>
            <p className="text-sm text-muted-foreground">
              All changes displayed in a single view with color coding
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-left text-sm font-medium text-muted-foreground">
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Room</th>
                    <th className="py-3 px-4 text-right">Original</th>
                    <th className="py-3 px-4 text-right">Revised</th>
                    <th className="py-3 px-4 text-right">Change</th>
                    <th className="py-3 px-4 text-center">Released?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Added Items */}
                  {comparisonData.changes.added.map((item) => (
                    <tr key={item.id} className="bg-green-50">
                      <td className="py-4 px-4">
                        <Badge className="bg-success text-white">
                          <Plus className="h-3 w-3 mr-1" />
                          Added
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-medium text-green-900">{item.name}</td>
                      <td className="py-4 px-4 text-green-800">{item.room}</td>
                      <td className="py-4 px-4 text-right text-muted-foreground">—</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-green-900">
                        ${item.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-green-900">
                        +${item.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={releasedItems[item.id] || false}
                            onCheckedChange={() => toggleReleased(item.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Removed Items */}
                  {comparisonData.changes.removed.map((item) => (
                    <tr key={item.id} className={cn('bg-red-50', releasedItems[item.id] && 'opacity-60')}>
                      <td className="py-4 px-4">
                        <Badge className="bg-destructive text-destructive-foreground">
                          <Minus className="h-3 w-3 mr-1" />
                          Removed
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-red-900 line-through">{item.name}</span>
                          {releasedItems[item.id] && <Lock className="h-4 w-4 text-red-700" />}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-red-800">{item.room}</td>
                      <td className="py-4 px-4 text-right font-mono text-red-900">
                        ${item.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground">—</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-red-900">
                        -${item.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={releasedItems[item.id] || false}
                            onCheckedChange={() => toggleReleased(item.id)}
                            disabled={releasedItems[item.id]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Changed Items */}
                  {comparisonData.changes.changed.map((item) => (
                    <tr
                      key={item.id}
                      className={cn(
                        item.difference !== 0 ? 'bg-yellow-50' : 'bg-muted/20'
                      )}
                    >
                      <td className="py-4 px-4">
                        {item.difference !== 0 ? (
                          <Badge className="bg-warning text-white">
                            Changed
                          </Badge>
                        ) : (
                          <Badge variant="outline">Unchanged</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {releasedItems[item.id] && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{item.room}</td>
                      <td className="py-4 px-4 text-right font-mono">
                        ${item.originalAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-semibold">
                        ${item.revisedAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {item.difference !== 0 ? (
                          <span
                            className={cn(
                              'font-mono font-bold',
                              item.difference > 0 ? 'text-warning' : 'text-success'
                            )}
                          >
                            {item.difference > 0 ? '+' : ''}${item.difference.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={releasedItems[item.id] || false}
                            onCheckedChange={() => toggleReleased(item.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Banner for Released Items */}
      {releasedCount > 0 && (
        <Card className="border-warning bg-warning/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-warning">Protected Items Notice</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {releasedCount} item{releasedCount > 1 ? 's have' : ' has'} been marked as released (purchased). 
                  These items are locked and cannot be removed from the revised budget. They can only be modified if absolutely necessary.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}