import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardData, type DashboardData } from "@/lib/api";
import { Permission } from "@/types";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FolderKanban,
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Plus,
  AlertCircle,
  CalendarClock,
  Loader2,
} from "lucide-react";

// ========================================
// Sub-components
// ========================================

function StatCard({
  label,
  value,
  icon: Icon,
  color = "primary",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: "primary" | "secondary" | "success" | "warning";
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success-light text-success-dark",
    warning: "bg-warning-light text-warning-dark",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  action,
  userName,
  target,
  details,
  timestamp,
}: {
  action: string;
  userName: string;
  target: string;
  details?: string;
  timestamp: string;
}) {
  const relative = getRelativeTime(new Date(timestamp));
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
        {userName.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">
          <span className="font-medium">{userName}</span>{" "}
          <span className="text-muted-foreground">{action}</span>{" "}
          <span className="font-medium">{target}</span>
        </p>
        {details && <p className="text-xs text-muted-foreground">{details}</p>}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{relative}</span>
    </div>
  );
}

function DeadlineItem({ label, project, daysUntil }: { label: string; project: string; daysUntil: number }) {
  const urgency =
    daysUntil <= 0
      ? "text-error bg-error-light"
      : daysUntil <= 3
      ? "text-warning-dark bg-warning-light"
      : "text-success-dark bg-success-light";

  const dateLabel =
    daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil}d left`;

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", daysUntil <= 0 ? "bg-error-light" : daysUntil <= 3 ? "bg-warning-light" : "bg-muted")}>
        {daysUntil <= 0 ? <AlertCircle className="h-4 w-4 text-error" /> : <CalendarClock className={cn("h-4 w-4", daysUntil <= 3 ? "text-warning-dark" : "text-muted-foreground")} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{project}</p>
      </div>
      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", urgency)}>{dateLabel}</span>
    </div>
  );
}

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const PIE_COLORS = ["#14b8a6", "#f59e0b", "#94a3b8"];

const statusLabel: Record<string, { text: string; classes: string }> = {
  active: { text: "Active", classes: "bg-success-light text-success-dark" },
  on_hold: { text: "On Hold", classes: "bg-warning-light text-warning-dark" },
  completed: { text: "Completed", classes: "bg-muted text-muted-foreground" },
};

// ========================================
// Dashboard
// ========================================

export function Dashboard() {
  const { user, agency, isPlatformAdmin, hasPermission } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const agencyId = isPlatformAdmin() ? undefined : user.agency_id;
    getDashboardData(agencyId).then((res) => {
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    });
  }, [user, isPlatformAdmin]);

  if (!user) return null;

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome + Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {agency ? agency.name : "Platform overview"} — Here's what's happening today.
          </p>
        </div>
        {hasPermission(Permission.CREATE_PROJECT) && (
          <Link
            to="/projects/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        )}
      </div>

      {/* Stats — all from API */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Projects" value={data.activeProjects} icon={FolderKanban} color="primary" />
        <StatCard label="Pending Approvals" value={data.pendingApprovals} icon={Clock} color="warning" />
        <StatCard label="Total Budget Value" value={data.totalBudgetValue > 0 ? `$${(data.totalBudgetValue / 1000).toFixed(0)}k` : "$0"} icon={DollarSign} color="secondary" />
        <StatCard label="Approved Value" value={data.approvedValue > 0 ? `$${(data.approvedValue / 1000).toFixed(0)}k` : "$0"} icon={CheckCircle2} color="success" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Budget Trend — real data from API */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4">Budget Trend</h2>
          {data.budgetTrend.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.budgetTrend}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `$${v}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(value: number) => [`$${value}k`, "Budget"]} />
                <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4, fill: "#14b8a6" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
              No budget data yet. Create your first budget to see trends.
            </div>
          )}
        </div>

        {/* Project Status Pie — real data */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4">Project Status</h2>
          {data.projectsByStatus.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={data.projectsByStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {data.projectsByStatus.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-center gap-4">
                {data.projectsByStatus.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-xs text-muted-foreground">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No projects yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity — filtered by agency from API */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2>Recent Activity</h2>
            <Link to="/projects" className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data.recentActivities.map((a) => (
              <ActivityItem key={a.id} action={a.action} userName={a.userName} target={a.target} details={a.details} timestamp={a.timestamp} />
            ))}
            {data.recentActivities.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines — computed from real budgets/projects */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4">Upcoming Deadlines</h2>
          {data.deadlines.length > 0 ? (
            <div className="divide-y divide-border">
              {data.deadlines.map((d, i) => (
                <DeadlineItem key={`deadline-${d.project}-${i}`} label={d.label} project={d.project} daysUntil={d.daysUntil} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No upcoming deadlines</p>
          )}
        </div>
      </div>
    </div>
  );
}
