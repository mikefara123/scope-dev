import { Link } from 'react-router';
import { ArrowLeft, BookOpen, Users, Layers, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-primary">
                  Design SaaS Documentation
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-border bg-primary text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Budget Management Platform for Interior Designers
            </h2>
            <p className="text-xl mb-8 text-white/90">
              A comprehensive SaaS application that handles multiple project workflows with budget creation, 
              line item management, client approvals, and team collaboration.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-white">
                <Zap className="h-5 w-5" />
                <span>Multi-tenant Platform</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-white">
                <Users className="h-5 w-5" />
                <span>3 User Roles</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-white">
                <Shield className="h-5 w-5" />
                <span>WCAG AA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Overview
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-4">
                <strong>Design SaaS</strong> is a comprehensive budget management SaaS application built specifically 
                for interior designers and design agencies. It provides a multi-tenant platform that streamlines the 
                entire budget lifecycle—from creation to client approval—with Excel-like functionality, intelligent 
                item libraries, and collaborative workflows.
              </p>
            </div>
          </section>

          {/* Core Purpose */}
          <section className="mb-12 bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Core Purpose
            </h2>
            <p className="text-muted-foreground mb-6">
              Interior designers face significant challenges managing project budgets:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold text-destructive mb-2">❌ Manual Spreadsheets</h3>
                <p className="text-sm text-muted-foreground">Error-prone, difficult to collaborate on, and lack version control</p>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold text-destructive mb-2">❌ Client Communication</h3>
                <p className="text-sm text-muted-foreground">Endless email chains for budget approvals and revisions</p>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold text-destructive mb-2">❌ Item Pricing</h3>
                <p className="text-sm text-muted-foreground">Repeatedly researching and pricing the same items across projects</p>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold text-destructive mb-2">❌ Team Collaboration</h3>
                <p className="text-sm text-muted-foreground">Multiple designers working on budgets without real-time sync</p>
              </div>
            </div>
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 text-secondary">
                ✓ Design SaaS Solves These Problems
              </h3>
              <p className="text-muted-foreground">
                By providing a purpose-built platform that handles the entire budget workflow with intelligence, 
                automation, and professional polish.
              </p>
            </div>
          </section>

          {/* User Roles */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              User Roles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Platform Admin */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">SaaS Owner</h3>
                    <p className="text-sm text-muted-foreground">Platform Admin</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Manages the entire multi-tenant system
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Manage all design agencies</li>
                  <li>• Monitor platform analytics</li>
                  <li>• Handle billing & subscriptions</li>
                  <li>• Provide technical support</li>
                </ul>
              </div>

              {/* Agency Admin */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Agency Admin</h3>
                    <p className="text-sm text-muted-foreground">Agency Owner</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Manages their team and clients
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Manage team members</li>
                  <li>• Create and manage clients</li>
                  <li>• Define agency item libraries</li>
                  <li>• Set up project templates</li>
                </ul>
              </div>

              {/* Interior Designer */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Designer</h3>
                    <p className="text-sm text-muted-foreground">Interior Designer</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Creates budgets and manages projects
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Create and manage projects</li>
                  <li>• Build detailed budgets</li>
                  <li>• Send budgets for approval</li>
                  <li>• Export to various formats</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Key Features
            </h2>
            
            <div className="space-y-6">
              {/* Multi-Tenant Architecture */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">
                  1. Multi-Tenant Architecture
                </h3>
                <p className="text-muted-foreground mb-3">
                  Complete isolation between design agencies. Each agency has its own team members, clients, 
                  projects, budgets, item libraries, and branding settings.
                </p>
              </div>

              {/* Budget Builder */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">
                  2. Budget Builder (Excel-like Interface)
                </h3>
                <p className="text-muted-foreground mb-4">
                  The heart of Design SaaS—a powerful, intuitive budget creation tool.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Room Sections</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Organize items by room</li>
                      <li>• Collapsible sections</li>
                      <li>• Drag-and-drop between rooms</li>
                      <li>• Section summaries and totals</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Line Item Management</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Inline editing (Notion-style)</li>
                      <li>• Real-time calculations</li>
                      <li>• Bulk actions</li>
                      <li>• Quick add functionality</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Item Library System */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">
                  3. Item Library System
                </h3>
                <p className="text-muted-foreground mb-4">
                  Multi-level scoping for intelligent item reuse across the platform.
                </p>
                <div className="space-y-2">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <strong className="text-sm">Platform Library</strong> - Global items available to all agencies
                  </div>
                  <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3">
                    <strong className="text-sm">Agency Library</strong> - Agency-specific items for all team designers
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <strong className="text-sm">Project Library</strong> - Project-specific custom items
                  </div>
                </div>
              </div>

              {/* Project & Budget Management */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">
                  4. Project & Budget Management
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Dual View Modes</h4>
                    <p className="text-sm text-muted-foreground">List and Card views for projects and budgets</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quick Actions</h4>
                    <p className="text-sm text-muted-foreground">Three-dot menus for Edit, Duplicate, Archive, Delete</p>
                  </div>
                </div>
              </div>

              {/* Client Approval Workflows */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">
                  5. Client Approval Workflows
                </h3>
                <p className="text-muted-foreground mb-4">
                  Streamlined approval process with digital signatures and version tracking.
                </p>
                <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Digital signatures (legally binding)</li>
                    <li>• Version tracking for all revisions</li>
                    <li>• Client comment system</li>
                    <li>• Interim budgets for "what-if" scenarios</li>
                    <li>• Full approval audit trail</li>
                  </ul>
                </div>
              </div>

              {/* Additional Features */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">
                  6. Additional Features
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Project Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      Accelerate budget creation with reusable templates for common project types
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Team Collaboration</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time collaboration with activity feeds and @mentions
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Export & Reporting</h4>
                    <p className="text-sm text-muted-foreground">
                      Export to PDF, Excel, CSV with branded templates
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Platform-wide analytics and agency performance metrics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design System */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Design System
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-4">Color Palette</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg border border-border bg-primary"></div>
                      <div>
                        <p className="font-semibold">Primary: Navy</p>
                        <p className="text-sm text-muted-foreground">#1a365d</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg border border-border bg-secondary"></div>
                      <div>
                        <p className="font-semibold">Secondary: Teal</p>
                        <p className="text-sm text-muted-foreground">#319795</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Design Philosophy</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Solid colors only, no gradients</li>
                    <li>✓ WCAG AA compliant contrast ratios</li>
                    <li>✓ Consistent component styling</li>
                    <li>✓ Accessible keyboard navigation</li>
                    <li>✓ Screen reader friendly</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Technology Stack
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Frontend</h3>
                <p className="text-sm text-muted-foreground">React with TypeScript</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Routing</h3>
                <p className="text-sm text-muted-foreground">React Router (Data mode)</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Styling</h3>
                <p className="text-sm text-muted-foreground">Tailwind CSS v4</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Components</h3>
                <p className="text-sm text-muted-foreground">Custom UI library</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">State</h3>
                <p className="text-sm text-muted-foreground">React hooks & context</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Data</h3>
                <p className="text-sm text-muted-foreground">Mock data (Supabase ready)</p>
              </div>
            </div>
          </section>

          {/* Success Metrics */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Success Metrics
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full mb-4 flex items-center justify-center bg-primary text-primary-foreground">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">For Designers</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 70% reduction in budget creation time</li>
                  <li>• 95% reduction in calculation errors</li>
                  <li>• Faster approval cycles</li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full mb-4 flex items-center justify-center bg-secondary text-secondary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">For Agencies</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time team collaboration</li>
                  <li>• Consistent pricing across team</li>
                  <li>• Improved client retention</li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="h-12 w-12 rounded-full mb-4 flex items-center justify-center bg-primary text-primary-foreground">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">For Platform</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• High user engagement</li>
                  <li>• Low churn rate</li>
                  <li>• Scalable architecture</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-12">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6">
                Empower your interior design business with professional budget management
              </p>
              <Link to="/login">
                <Button size="lg">
                  Sign In to Design SaaS
                </Button>
              </Link>
            </div>
          </section>

          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
            <p>
              For detailed user scenarios, technical implementation details, and complete feature documentation, 
              see the full PROJECT.md file in the repository.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
