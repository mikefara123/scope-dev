/**
 * Data API Layer
 * Mock implementation for projects, users, agencies.
 * Structured to be swapped with real REST/GraphQL calls.
 */

import { users, agencies, projects, budgets, activities } from "@/data/mock";
import type { User, Agency, Project, Budget, Activity, QualityLevel, Contact, Room, Phase } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ========================================
// Response Types
// ========================================

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ========================================
// User API
// ========================================

/**
 * Update user profile fields.
 * PATCH /api/users/:userId
 */
export async function updateUserProfile(
  userId: string,
  fields: { name?: string; email?: string; phone?: string }
): Promise<ApiResponse<User>> {
  await delay(500 + Math.random() * 300);

  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false, error: "User not found." };

  // Check email uniqueness
  if (fields.email && fields.email !== user.email) {
    const duplicate = users.find(
      (u) => u.id !== userId && u.email.toLowerCase() === fields.email!.toLowerCase()
    );
    if (duplicate) return { success: false, error: "Email already in use." };
  }

  if (fields.name !== undefined) user.name = fields.name;
  if (fields.email !== undefined) user.email = fields.email;
  if (fields.phone !== undefined) user.phone = fields.phone;

  return { success: true, data: { ...user } };
}

/**
 * Change user password.
 * POST /api/users/:userId/change-password
 */
export async function changeUserPassword(
  userId: string,
  _currentPassword: string,
  _newPassword: string
): Promise<ApiResponse> {
  await delay(500 + Math.random() * 300);

  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false, error: "User not found." };

  // Mock: accept any current password. In production, verify hash.
  if (_newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  return { success: true };
}

// ========================================
// Agency API
// ========================================

/**
 * Update agency settings.
 * PATCH /api/agencies/:agencyId
 */
export async function updateAgencySettings(
  agencyId: string,
  fields: {
    name?: string;
    type?: "individual" | "company";
    address?: string;
    phone?: string;
    website?: string;
    theme_colors?: { primary: string; secondary: string };
    defaults?: { product_markup: number; shipping_percentage: number; other_cost_percentage: number };
  }
): Promise<ApiResponse<Agency>> {
  await delay(500 + Math.random() * 300);

  const agency = agencies.find((a) => a.id === agencyId);
  if (!agency) return { success: false, error: "Agency not found." };

  if (fields.name !== undefined) agency.name = fields.name;
  if (fields.type !== undefined) agency.type = fields.type;
  if (fields.address !== undefined) agency.address = fields.address;
  if (fields.phone !== undefined) agency.phone = fields.phone;
  if (fields.website !== undefined) agency.website = fields.website;
  if (fields.theme_colors) {
    agency.theme_colors.primary = fields.theme_colors.primary;
    agency.theme_colors.secondary = fields.theme_colors.secondary;
  }
  if (fields.defaults) {
    agency.defaults.product_markup = fields.defaults.product_markup;
    agency.defaults.shipping_percentage = fields.defaults.shipping_percentage;
    agency.defaults.other_cost_percentage = fields.defaults.other_cost_percentage;
  }

  return { success: true, data: { ...agency } };
}

// ========================================
// Project API
// ========================================

/**
 * List projects for an agency.
 * GET /api/projects?agency_id=xxx
 */
export async function listProjects(agencyId?: string): Promise<ApiResponse<Project[]>> {
  await delay(300 + Math.random() * 200);

  const list = agencyId
    ? projects.filter((p) => p.agency_id === agencyId)
    : [...projects];

  return { success: true, data: list };
}

/**
 * Get a single project.
 * GET /api/projects/:projectId
 */
export async function getProject(projectId: string): Promise<ApiResponse<Project>> {
  await delay(200 + Math.random() * 200);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return { success: false, error: "Project not found." };

  return { success: true, data: { ...project } };
}

/**
 * Create a new project.
 * POST /api/projects
 */
export async function createProject(data: {
  agency_id: string;
  projectName: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  contacts: Contact[];
  rooms: Room[];
  phases: Phase[];
  defaultQuality: QualityLevel;
  defaultMarkup: number;
  defaultShipping: number;
  defaultOther: number;
}): Promise<ApiResponse<Project>> {
  await delay(600 + Math.random() * 400);

  if (!data.projectName.trim()) return { success: false, error: "Project name is required." };
  if (!data.clientName.trim()) return { success: false, error: "Client name is required." };
  if (!data.rooms.some((r) => r.name.trim())) return { success: false, error: "At least one room is required." };
  if (!data.phases.some((p) => p.name.trim())) return { success: false, error: "At least one phase is required." };

  const newProject: Project = {
    id: generateId("proj"),
    agency_id: data.agency_id,
    clientName: data.clientName,
    projectName: data.projectName,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    contacts: data.contacts.filter((c) => c.name.trim()),
    rooms: data.rooms.filter((r) => r.name.trim()),
    phases: data.phases.filter((p) => p.name.trim()),
    status: "active",
    defaultQuality: data.defaultQuality,
    defaultMarkup: data.defaultMarkup,
    defaultShipping: data.defaultShipping,
    defaultOther: data.defaultOther,
    totalBudgeted: 0,
    approvedAmount: 0,
    pendingAmount: 0,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };

  projects.push(newProject);
  return { success: true, data: newProject };
}

/**
 * Update an existing project.
 * PATCH /api/projects/:projectId
 */
export async function updateProject(
  projectId: string,
  fields: Partial<Pick<Project, "projectName" | "clientName" | "address" | "city" | "state" | "zip" | "status" | "contacts" | "rooms" | "phases" | "defaultQuality" | "defaultMarkup" | "defaultShipping" | "defaultOther">>
): Promise<ApiResponse<Project>> {
  await delay(500 + Math.random() * 300);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return { success: false, error: "Project not found." };

  Object.assign(project, fields, { updatedAt: new Date().toISOString().split("T")[0] });
  return { success: true, data: { ...project } };
}

/**
 * Delete a project.
 * DELETE /api/projects/:projectId
 */
export async function deleteProject(projectId: string): Promise<ApiResponse> {
  await delay(400 + Math.random() * 300);

  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return { success: false, error: "Project not found." };

  projects.splice(index, 1);
  return { success: true };
}

// ========================================
// Budget API (stubs for future sprints)
// ========================================

/**
 * List budgets for an agency (via project IDs).
 * GET /api/budgets?project_ids=xxx,yyy
 */
export async function listBudgets(projectIds?: string[]): Promise<ApiResponse<Budget[]>> {
  await delay(300 + Math.random() * 200);

  const list = projectIds
    ? budgets.filter((b) => projectIds.includes(b.projectId))
    : [...budgets];

  return { success: true, data: list };
}

// ========================================
// Dashboard API
// ========================================

export interface DashboardData {
  activeProjects: number;
  pendingApprovals: number;
  totalBudgetValue: number;
  approvedValue: number;
  projectsByStatus: { name: string; value: number }[];
  recentActivities: Activity[];
  deadlines: { label: string; project: string; daysUntil: number }[];
}

/**
 * Fetch aggregated dashboard data.
 * GET /api/dashboard?agency_id=xxx
 */
export async function getDashboardData(agencyId?: string): Promise<ApiResponse<DashboardData>> {
  await delay(300 + Math.random() * 200);

  const agencyProjects = agencyId
    ? projects.filter((p) => p.agency_id === agencyId)
    : projects;

  const agencyBudgets = budgets.filter((b) =>
    agencyProjects.some((p) => p.id === b.projectId)
  );

  const active = agencyProjects.filter((p) => p.status === "active").length;
  const onHold = agencyProjects.filter((p) => p.status === "on_hold").length;
  const completed = agencyProjects.filter((p) => p.status === "completed").length;

  return {
    success: true,
    data: {
      activeProjects: active,
      pendingApprovals: agencyBudgets.filter((b) => b.status === "pending_approval").length,
      totalBudgetValue: agencyProjects.reduce((sum, p) => sum + p.totalBudgeted, 0),
      approvedValue: agencyProjects.reduce((sum, p) => sum + p.approvedAmount, 0),
      projectsByStatus: [
        { name: "Active", value: active },
        { name: "On Hold", value: onHold },
        { name: "Completed", value: completed },
      ].filter((d) => d.value > 0),
      recentActivities: activities.slice(0, 5),
      deadlines: [
        { label: "Budget approval due", project: "Beverly Hills Residence", daysUntil: -1 },
        { label: "Phase 1 delivery", project: "Downtown Office Redesign", daysUntil: 2 },
        { label: "Client review meeting", project: "Beverly Hills Residence", daysUntil: 5 },
        { label: "Final walkthrough", project: "Malibu Beach House", daysUntil: 8 },
        { label: "Vendor quotes deadline", project: "Downtown Office Redesign", daysUntil: 12 },
      ],
    },
  };
}
