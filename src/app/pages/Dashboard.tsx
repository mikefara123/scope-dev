import { useAuth } from "@/contexts/AuthContext";
import { projects, budgets, activities } from "@/data/mock";
import { UserRole } from "@/types";
import {
  FolderKanban,
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

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

function ActivityItem({ action, userName, target, details, timestamp }: {
  action: string;
  userName: string;
  target: string;
  details?: string;
  timestamp: string;
}) {
  const time = new Date(timestamp);
  const relative = getRelativeTime(time);

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
        {userName.split(" ").map((n) => n[0]).join("")}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{userName}</span>{" "}
          <span className="text-muted-foreground">{action}</span>{" "}
          <span className="font-medium">{target}</span>
        </p>
        {details && (
          <p className="text-xs text-muted-foreground">{details}</p>
        )}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{relative}</span>
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

export function Dashboard() {
  const { user, agency, isPlatformAdmin } = useAuth();

  if (!user) return null;

  // Filter data by agency for non-platform users
  const agencyProjects = isPlatformAdmin()
    ? projects
    : projects.filter((p) => p.agency_id === user.agency_id);

  const agencyBudgets = isPlatformAdmin()
    ? budgets
    : budgets.filter((b) =>
        agencyProjects.some((p) => p.id === b.projectId)
      );

  const activeProjects = agencyProjects.filter((p) => p.status === "active").length;
  const pendingApprovals = agencyBudgets.filter((b) => b.status === "pending_approval").length;
  const totalBudgetValue = agencyProjects.reduce((sum, p) => sum + p.totalBudgeted, 0);
  const approvedValue = agencyProjects.reduce((sum, p) => sum + p.approvedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1>
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {agency ? agency.name : "Platform overview"} — Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={activeProjects}
          icon={FolderKanban}
          trend="+2 this month"
          color="primary"
        />
        <StatCard
          label="Pending Approvals"
          value={pendingApprovals}
          icon={Clock}
          color="warning"
        />
        <StatCard
          label="Total Budget Value"
          value={`$${(totalBudgetValue / 1000).toFixed(0)}k`}
          icon={DollarSign}
          trend="+12% vs last month"
          color="secondary"
        />
        <StatCard
          label="Approved Value"
          value={`$${(approvedValue / 1000).toFixed(0)}k`}
          icon={CheckCircle2}
          color="success"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2>Recent Activity</h2>
            <button className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline">
              View All <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {activities.slice(0, 5).map((activity) => (
              <ActivityItem
                key={activity.id}
                action={activity.action}
                userName={activity.userName}
                target={activity.target}
                details={activity.details}
                timestamp={activity.timestamp}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions / Project Summary */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4">Projects</h2>
          <div className="space-y-3">
            {agencyProjects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {project.projectName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.clientName}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    project.status === "active"
                      ? "bg-success-light text-success-dark"
                      : project.status === "on_hold"
                      ? "bg-warning-light text-warning-dark"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {project.status === "active"
                    ? "Active"
                    : project.status === "on_hold"
                    ? "On Hold"
                    : "Completed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
