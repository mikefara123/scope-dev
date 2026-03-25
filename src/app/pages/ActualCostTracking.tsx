import { useState } from 'react';
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { cn } from '@/app/components/ui/utils';
import { getBudgetById } from '@/app/data/mockData';

interface ActualCostItem {
  id: string;
  itemName: string;
  room: string;
  budgetedTotal: number;
  actualNetCost: number | null;
  actualShipping: number | null;
  actualOther: number | null;
  actualTotal: number;
  variance: number;
  released: boolean;
}

export function ActualCostTracking() {
  const { budgetId } = useParams();
  const budget = getBudgetById(budgetId!);

  // Initialize actual cost items from budget line items
  const [actualItems, setActualItems] = useState<ActualCostItem[]>(
    budget?.lineItems.map((item) => ({
      id: item.id,
      itemName: item.itemName,
      room: item.room,
      budgetedTotal: item.total,
      actualNetCost: null,
      actualShipping: null,
      actualOther: null,
      actualTotal: 0,
      variance: 0,
      released: false,
    })) || []
  );

  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);

  if (!budget) {
    return <div className="p-6">Budget not found</div>;
  }

  // Update actual cost calculation
  const updateActualItem = (id: string, field: string, value: any) => {
    setActualItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          if (['actualNetCost', 'actualShipping', 'actualOther'].includes(field)) {
            const netCost = updated.actualNetCost || 0;
            const shipping = updated.actualShipping || 0;
            const other = updated.actualOther || 0;
            const tax = (netCost + shipping + other) * 0.08; // 8% tax
            const actualTotal = netCost + shipping + other + tax;
            const variance = item.budgetedTotal - actualTotal;

            return {
              ...updated,
              actualTotal,
              variance,
            };
          }

          return updated;
        }
        return item;
      })
    );
  };

  // Calculate summary statistics
  const summary = actualItems.reduce(
    (acc, item) => {
      return {
        totalBudgeted: acc.totalBudgeted + item.budgetedTotal,
        totalActual: acc.totalActual + (item.released ? item.actualTotal : 0),
        totalVariance: acc.totalVariance + (item.released ? item.variance : 0),
        releasedCount: acc.releasedCount + (item.released ? 1 : 0),
      };
    },
    { totalBudgeted: 0, totalActual: 0, totalVariance: 0, releasedCount: 0 }
  );

  const percentComplete = (summary.releasedCount / actualItems.length) * 100;
  const remainingBudget = summary.totalBudgeted - summary.totalActual;

  // Group by room
  const itemsByRoom = actualItems.reduce((acc, item) => {
    if (!acc[item.room]) acc[item.room] = [];
    acc[item.room].push(item);
    return acc;
  }, {} as Record<string, ActualCostItem[]>);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/projects/${budget.projectId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold">Actual Cost Tracking</h1>
            <p className="text-muted-foreground mt-1">
              {budget.name} {budget.version}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budgeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              ${summary.totalBudgeted.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actual to Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              ${summary.totalActual.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'text-2xl font-bold font-mono',
                  summary.totalVariance >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {summary.totalVariance >= 0 ? '+' : ''}$
                {Math.abs(summary.totalVariance).toLocaleString()}
              </div>
              {summary.totalVariance >= 0 ? (
                <TrendingDown className="h-5 w-5 text-success" />
              ) : (
                <TrendingUp className="h-5 w-5 text-destructive" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.totalVariance >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Released</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.releasedCount} / {actualItems.length}
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {percentComplete.toFixed(0)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              ${remainingBudget.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actual Cost Table */}
      <Card>
        <CardHeader>
          <CardTitle>Line Item Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(itemsByRoom).map(([room, items]) => (
              <div key={room}>
                {/* Room Header */}
                <div className="flex items-center justify-between py-2 border-b-2 border-border mb-2">
                  <h3 className="font-semibold text-lg">{room}</h3>
                  <span className="text-sm text-muted-foreground">{items.length} items</span>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-xs">
                      <tr>
                        <th className="text-left p-2 font-medium">Item</th>
                        <th className="text-right p-2 font-medium font-mono">Budgeted Total</th>
                        <th className="text-right p-2 font-medium font-mono">Actual Net</th>
                        <th className="text-right p-2 font-medium font-mono">Actual Ship</th>
                        <th className="text-right p-2 font-medium font-mono">Actual Other</th>
                        <th className="text-right p-2 font-medium font-mono">Actual Total</th>
                        <th className="text-right p-2 font-medium font-mono">Variance</th>
                        <th className="text-center p-2 font-medium">Released</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className={cn(
                            'border-b border-border hover:bg-muted/30',
                            item.released && 'bg-muted/20'
                          )}
                        >
                          {/* Item Name */}
                          <td className="p-2 font-medium">{item.itemName}</td>

                          {/* Budgeted Total */}
                          <td className="p-2 text-right font-mono">
                            ${item.budgetedTotal.toLocaleString()}
                          </td>

                          {/* Actual Net Cost */}
                          <td className="p-2 text-right">
                            {editingCell?.id === item.id &&
                            editingCell?.field === 'actualNetCost' ? (
                              <input
                                type="number"
                                value={item.actualNetCost || ''}
                                onChange={(e) =>
                                  updateActualItem(
                                    item.id,
                                    'actualNetCost',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                onBlur={() => setEditingCell(null)}
                                className="w-full px-2 py-1 border border-primary rounded text-right font-mono"
                                placeholder="0"
                                autoFocus
                              />
                            ) : (
                              <div
                                onClick={() =>
                                  setEditingCell({ id: item.id, field: 'actualNetCost' })
                                }
                                className="cursor-pointer hover:bg-muted px-2 py-1 rounded font-mono"
                              >
                                {item.actualNetCost !== null ? (
                                  `$${item.actualNetCost.toLocaleString()}`
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Actual Shipping */}
                          <td className="p-2 text-right">
                            {editingCell?.id === item.id &&
                            editingCell?.field === 'actualShipping' ? (
                              <input
                                type="number"
                                value={item.actualShipping || ''}
                                onChange={(e) =>
                                  updateActualItem(
                                    item.id,
                                    'actualShipping',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                onBlur={() => setEditingCell(null)}
                                className="w-full px-2 py-1 border border-primary rounded text-right font-mono"
                                placeholder="0"
                                autoFocus
                              />
                            ) : (
                              <div
                                onClick={() =>
                                  setEditingCell({ id: item.id, field: 'actualShipping' })
                                }
                                className="cursor-pointer hover:bg-muted px-2 py-1 rounded font-mono"
                              >
                                {item.actualShipping !== null ? (
                                  `$${item.actualShipping}`
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Actual Other */}
                          <td className="p-2 text-right">
                            {editingCell?.id === item.id &&
                            editingCell?.field === 'actualOther' ? (
                              <input
                                type="number"
                                value={item.actualOther || ''}
                                onChange={(e) =>
                                  updateActualItem(
                                    item.id,
                                    'actualOther',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                onBlur={() => setEditingCell(null)}
                                className="w-full px-2 py-1 border border-primary rounded text-right font-mono"
                                placeholder="0"
                                autoFocus
                              />
                            ) : (
                              <div
                                onClick={() =>
                                  setEditingCell({ id: item.id, field: 'actualOther' })
                                }
                                className="cursor-pointer hover:bg-muted px-2 py-1 rounded font-mono"
                              >
                                {item.actualOther !== null ? (
                                  `$${item.actualOther}`
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Actual Total (Calculated) */}
                          <td className="p-2 text-right font-mono font-semibold bg-muted/30">
                            {item.actualTotal > 0 ? (
                              `$${item.actualTotal.toLocaleString()}`
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* Variance */}
                          <td className="p-2 text-right">
                            {item.actualTotal > 0 ? (
                              <span
                                className={cn(
                                  'font-mono font-bold',
                                  item.variance >= 0 ? 'text-success' : 'text-destructive'
                                )}
                              >
                                {item.variance >= 0 ? '+' : ''}$
                                {Math.abs(item.variance).toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* Released Checkbox */}
                          <td className="p-2 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={item.released}
                                onCheckedChange={(checked) =>
                                  updateActualItem(item.id, 'released', checked)
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
