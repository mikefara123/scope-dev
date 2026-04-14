import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { projects } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Permission, type ProjectStatus } from "@/types";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  DollarSign,
  DoorOpen,
  FolderKanban,
} from "lucide-react";

const STATUS_FILTERS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
];

const statusBadge: Record<ProjectStatus, { label: string; classes: string }> = {
  active: { label: "Active", classes: "bg-success-light text-success-dark" },
  on_hold: { label: "On Hold", classes: "bg-warning-light text-warning-dark" },
  completed: { label: "Completed", classes: "bg-muted text-muted-foreground" },
};

type SortKey = "name" | "client" | "date" | "budget";

export function Projects() {
  const { user, isPlatformAdmin, hasPermission } = useAuth();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [viewMode, setViewMode] = useState<"card" | "list">(() => {
    try {
      return (localStorage.getItem("scope_projects_view") as "card" | "list") ?? "card";
    } catch { return "card"; }
  });

  const canCreate = hasPermission(Permission.CREATE_PROJECT);

  const toggleView = (mode: "card" | "list") => {
    setViewMode(mode);
    try { localStorage.setItem("scope_projects_view", mode); } catch {}
  };

  const filtered = useMemo(() => {
    let list = isPlatformAdmin()
      ? projects
      : projects.filter((p) => p.agency_id === user?.agency_id);

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.projectName.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }

    // Sort
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.projectName.localeCompare(b.projectName);
        case "client":
          return a.clientName.localeCompare(b.clientName);
        case "budget":
          return b.totalBudgeted - a.totalBudgeted;
        case "date":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return list;
  }, [search, statusFilter, sortBy, user, isPlatformAdmin]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canCreate && (
          <Link
            to="/projects/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="h-11 w-full rounded-xl border border-border bg-white pl-11 pr-4 text-sm shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filters */}
          <div className="flex gap-1 rounded-lg border border-border bg-muted p-0.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  statusFilter === f.value
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-border bg-white px-2 text-xs shadow-xs outline-none"
          >
            <option value="date">Recent</option>
            <option value="name">Name</option>
            <option value="client">Client</option>
            <option value="budget">Budget</option>
          </select>

          {/* View toggle */}
          <div className="flex gap-0.5 rounded-lg border border-border bg-muted p-0.5">
            <button
              onClick={() => toggleView("card")}
              className={cn(
                "rounded-md p-1.5 transition-all",
                viewMode === "card" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleView("list")}
              className={cn(
                "rounded-md p-1.5 transition-all",
                viewMode === "list" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <FolderKanban className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 text-sm font-medium text-foreground">No projects found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"}
          </p>
          {canCreate && !search && statusFilter === "all" && (
            <Link
              to="/projects/new"
              className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </Link>
          )}
        </div>
      )}

      {/* Card View */}
      {filtered.length > 0 && viewMode === "card" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const badge = statusBadge[p.status];
            return (
              <div
                key={p.id}
                className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-border-strong"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {p.projectName}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.clientName}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", badge.classes)}>
                    {badge.label}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  {p.city && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {p.city}, {p.state}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <DoorOpen className="h-3 w-3" />
                    {p.rooms.length} room{p.rooms.length !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3 w-3" />
                    ${p.totalBudgeted.toLocaleString()} budgeted
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Updated {new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {filtered.length > 0 && viewMode === "list" && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Rooms</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => {
                const badge = statusBadge[p.status];
                return (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{p.projectName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.clientName}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", badge.classes)}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-foreground">
                      ${p.totalBudgeted.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.rooms.length}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
