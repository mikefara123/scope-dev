import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/layouts/RootLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectsList } from './pages/ProjectsList';
import { ProjectDetail } from './pages/ProjectDetail';
import { BudgetBuilder } from './pages/BudgetBuilder';
import { BudgetsList } from './pages/BudgetsList';
import { BudgetPreview } from './pages/BudgetPreview';
import { BudgetComparison } from './pages/BudgetComparison';
import { ActualCostTracking } from './pages/ActualCostTracking';
import { CustomerApproval } from './pages/CustomerApproval';
import { ItemLibrary } from './pages/ItemLibrary';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { UserManagement } from './pages/UserManagement';
import { AuditLog } from './pages/AuditLog';
import { TemplatesManagement } from './pages/TemplatesManagement';
import { ClientApprovalDashboard } from './pages/ClientApprovalDashboard';
import { Documentation } from './pages/Documentation';

// Platform Admin Pages
import { PlatformDashboard } from './pages/admin/PlatformDashboard';
import { AgenciesManagement } from './pages/admin/AgenciesManagement';
import { PlatformAnalytics } from './pages/admin/PlatformAnalytics';
import { BillingManagement } from './pages/admin/BillingManagement';
import { PlatformAdminUsers } from './pages/admin/PlatformAdminUsers';
import { AgencyUsersManagement } from './pages/admin/AgencyUsersManagement';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/documentation',
    Component: Documentation,
  },
  {
    path: '/approve/:token',
    Component: CustomerApproval,
  },
  {
    path: '/client-approval/:token',
    Component: ClientApprovalDashboard,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      
      // Platform Admin Routes
      { path: 'admin', Component: PlatformDashboard },
      { path: 'admin/agencies', Component: AgenciesManagement },
      { path: 'admin/users', Component: PlatformAdminUsers },
      { path: 'admin/agencies/:agencyId/users', Component: AgencyUsersManagement },
      { path: 'admin/analytics', Component: PlatformAnalytics },
      { path: 'admin/billing', Component: BillingManagement },
      
      // Standard Routes
      { path: 'projects', Component: ProjectsList },
      { path: 'projects/:projectId', Component: ProjectDetail },
      { path: 'projects/:projectId/budgets/:budgetId', Component: BudgetBuilder },
      { path: 'budgets', Component: BudgetsList },
      { path: 'budgets/:budgetId/preview', Component: BudgetPreview },
      { path: 'budgets/:budgetId/compare', Component: BudgetComparison },
      { path: 'budgets/:budgetId/actual-costs', Component: ActualCostTracking },
      { path: 'library', Component: ItemLibrary },
      { path: 'reports', Component: Reports },
      
      // Settings Routes
      { path: 'settings', Component: Settings },
      { path: 'settings/users', Component: UserManagement },
      { path: 'settings/audit', Component: AuditLog },
      { path: 'settings/templates', Component: TemplatesManagement },
    ],
  },
]);