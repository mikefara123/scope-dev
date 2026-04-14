import { useAuth } from "@/contexts/AuthContext";
import { projects, budgets, activities } from "@/data/mock";
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
} from "lucide-react";

// ========================================
// Stat Card
// ========================================

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "primary",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
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
          {trend && (
            <p className="mt-1 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

// ========================================
// Activity Item
// ========================================

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
        {userName
          .split(" ")
          .map((n) => n[0])
          .join("")}
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

// ========================================
// Deadline Item
// ========================================

function DeadlineItem({
  label,
  project,
  daysUntil,
}: {
  label: string;
  project: string;
  daysUntil: number;
}) {
  const urgency =
    daysUntil <= 0
      ? "text-error bg-error-light"
      : daysUntil <= 3
      ? "text-warning-dark bg-warning-light"
      : "text-success-dark bg-success-light";

  const dateLabel =
    daysUntil < 0
      ? `${Math.abs(daysUntil)}d overdue`
      : daysUntil === 0
      ? "Today"
      : daysUntil === 1
      ? "Tomorrow"
      : `${daysUntil}d left`;

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          daysUntil <= 0 ? "bg-error-light" : daysUntil <= 3 ? "bg-warning-light" : "bg-muted"
        )}
      >
        {daysUntil <= 0 ? (
          <AlertCircle className="h-4 w-4 text-error" />
        ) : (
          <CalendarClock
            className={cn(
              "h-4 w-4",
              daysUntil <= 3 ? "text-warning-dark" : "text-muted-foreground"
            )}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{project}</p>
      </div>
      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", urgency)}>
        {dateLabel}
      </span>
    </div>
  );
}

// ========================================
// Helpers
// ========================================

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Mock chart data
const MONTHLY_BUDGET_DATA = [
  { month: "Sep", value: 85 },
  { month: "Oct", value: 120 },
  { month: "Nov", value: 145 },
  { month: "Dec", value: 180 },
  { month: "Jan", value: 210 },
  { month: "Feb", value: 245 },
  { month: "Mar", value: 290 },
  { month: "Apr", value: 310 },
];

const PIE_COLORS = ["#14b8a6", "#f59e0b", "#94a3b8"];

// Mock deadlines (relative to today)
function getDeadlines() {
  return [
    { label: "Budget approval due", project: "Beverly Hills Residence", daysUntil: -1 },
    { label: "Phase 1 delivery", project: "Downtown Office Redesign", daysUntil: 2 },
    { label: "Client review meeting", project: "Beverly Hills Residence", daysUntil: 5 },
    { label: "Final walkthrough", project: "Malibu Beach House", daysUntil: 8 },
    { label: "Vendor quotes deadline", project: "Downtown Office Redesign", daysUntil: 12 },
  ];
}

// ========================================
// Dashboard
// ========================================

export function Dashboard() {
  const { user, agency, isPlatformAdmin, hasPermission } = useAuth();

  if (!user) return null;

  const agencyProjects = isPlatformAdmin()
    ? projects
    : projects.filter((p) => p.agency_id === user.agency_id);

  const agencyBudgets = isPlatformAdmin()
    ? budgets
    : budgets.filter((b) => agencyProjects.some((p) => p.id === b.projectId));

  const activeProjects = agencyProjects.filter((p) => p.status === "active").length;
  const onHoldProjects = agencyProjects.filter((p) => p.status === "on_hold").length;
  const completedProjects = agencyProjects.filter((p) => p.status === "completed").length;
  const pendingApprovals = agencyBudgets.filter((b) => b.status === "pending_approval").length;
  const totalBudgetValue = agencyProjects.reduce((sum, p) => sum + p.totalBudgeted, 0);
  const approvedValue = agencyProjects.reduce((sum, p) => sum + p.approvedAmount, 0);

  const pieData = [
    { name: "Active", value: activeProjects },
    { name: "On Hold", value: onHoldProjects },
    { name: "Completed", value: completedProjects },
  ].filter((d) => d.value > 0);

  const deadlines = getDeadlines();

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
          <div className="flex gap-2">
            <Link
              to="/projects/new"
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Projects" value={activeProjects} icon={FolderKanban} trend="+2 this month" color="primary" />
        <StatCard label="Pending Approvals" value={pendingApprovals} icon={Clock} color="warning" />
        <StatCard label="Total Budget Value" value={`$${(totalBudgetValue / 1000).toFixed(0)}k`} icon={DollarSign} trend="+12% vs last month" color="secondary" />
        <StatCard label="Approved Value" value={`$${(approvedValue / 1000).toFixed(0)}k`} icon={CheckCircle2} color="success" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Budget Trend */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4">Budget Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_BUDGET_DATA}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `$${v}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                formatter={(value: number) => [`$${value}k`, "Budget"]}
              />
              <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4, fill: "#14b8a6" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Pie */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4">Project Status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-xs text-muted-foreground">
                  {d.name} ({d.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2>Recent Activity</h2>
            <Link to="/projects" className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activities.slice(0, 5).map((a) => (
              <ActivityItem key={a.id} action={a.action} userName={a.userName} target={a.target} details={a.details} timestamp={a.timestamp} />
            ))}
            {activities.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2>Upcoming Deadlines</h2>
          </div>
          <div className="divide-y divide-border">
            {deadlines.map((d, i) => (
              <DeadlineItem key={i} label={d.label} project={d.project} daysUntil={d.daysUntil} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
