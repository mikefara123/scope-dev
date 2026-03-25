import { Download, TrendingUp, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

const reportCards = [
  {
    id: 'budget-vs-actual',
    title: 'Budget vs. Actual Analysis',
    description: 'Compare budgeted amounts to actual spending across all projects',
    icon: TrendingUp,
    color: 'var(--primary)',
  },
  {
    id: 'profit-margins',
    title: 'Profit Margins Report',
    description: 'Analyze markup and profit margins by project and category',
    icon: DollarSign,
    color: 'var(--success)',
  },
  {
    id: 'spending-category',
    title: 'Spending by Category',
    description: 'Breakdown of spending across furniture, lighting, and accessories',
    icon: TrendingUp,
    color: 'var(--secondary)',
  },
  {
    id: 'approval-pipeline',
    title: 'Approval Pipeline',
    description: 'View status of all budgets pending client approval',
    icon: Clock,
    color: 'var(--warning)',
  },
  {
    id: 'monthly-revenue',
    title: 'Monthly Revenue',
    description: 'Track approved budget values and revenue trends over time',
    icon: DollarSign,
    color: 'var(--success)',
  },
  {
    id: 'client-activity',
    title: 'Client Activity',
    description: 'See which clients have viewed, approved, or requested changes',
    icon: CheckCircle,
    color: 'var(--primary)',
  },
];

export function Reports() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Analytics and insights for your interior design business
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue (MTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">$485,000</div>
            <p className="text-xs text-success mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Project Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">$162,000</div>
            <p className="text-xs text-muted-foreground mt-1">Across 12 projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-success mt-1">Above industry avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">8 with active budgets</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportCards.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: report.color + '20' }}
                  >
                    <report.icon
                      className="h-6 w-6"
                      style={{ color: report.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {report.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'var(--primary-foreground)',
                        }}
                      >
                        Generate Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Preview Chart Placeholder */}
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-end gap-2 h-20">
                    {[40, 65, 55, 80, 70, 90, 75].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t"
                        style={{
                          height: `${height}%`,
                          backgroundColor: report.color,
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: 'Budget vs Actual - Q1 2026', date: 'Jan 24, 2026', size: '2.4 MB' },
              { name: 'Monthly Revenue Report', date: 'Jan 20, 2026', size: '1.8 MB' },
              { name: 'Client Activity Summary', date: 'Jan 15, 2026', size: '890 KB' },
            ].map((export_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30"
              >
                <div className="flex-1">
                  <p className="font-medium">{export_.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Exported on {export_.date} • {export_.size}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
