import { useState } from 'react';
import { Upload, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

const SETTINGS_SECTIONS = [
  { id: 'profile', name: 'Profile' },
  { id: 'company', name: 'Company' },
  { id: 'branding', name: 'Theme & Branding' },
  { id: 'defaults', name: 'Default Values' },
  { id: 'users', name: 'Users & Permissions' },
  { id: 'billing', name: 'Billing' },
  { id: 'integrations', name: 'Integrations' },
  { id: 'notifications', name: 'Notifications' },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [primaryColor, setPrimaryColor] = useState('#1a365d');
  const [secondaryColor, setSecondaryColor] = useState('#319795');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Settings Sidebar */}
      <aside className="w-64 border-r border-border bg-card overflow-y-auto flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <nav className="space-y-1">
            {SETTINGS_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {section.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold">Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your personal information</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-semibold">
                      JD
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG or GIF (max 2MB)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input defaultValue="Jane" className="mt-1" />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input defaultValue="Designer" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input type="email" defaultValue="jane@example.com" className="mt-1" />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input type="tel" defaultValue="(555) 123-4567" className="mt-1" />
                  </div>

                  <div className="pt-4 border-t">
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Password</Label>
                    <Input type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input type="password" className="mt-1" />
                  </div>
                  <Button variant="outline">Update Password</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Company Section */}
          {activeSection === 'company' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold">Company</h1>
                <p className="text-muted-foreground mt-1">Manage your company information</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Company Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input defaultValue="Jane's Interior Design Studio" className="mt-1" />
                  </div>

                  <div>
                    <Label>Company Logo</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop your logo here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG or SVG (recommended size: 200x200px)
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Input defaultValue="123 Design Street" className="mt-1" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label>City</Label>
                      <Input defaultValue="McLean" className="mt-1" />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input defaultValue="VA" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label>Website</Label>
                    <Input defaultValue="https://janedesign.com" className="mt-1" />
                  </div>

                  <div className="pt-4 border-t">
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Theme & Branding Section */}
          {activeSection === 'branding' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold">Theme & Branding</h1>
                <p className="text-muted-foreground mt-1">
                  Customize how your budgets appear to clients
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                  <CardDescription>
                    These colors will be used on client-facing budget proposals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex gap-3 mt-2">
                        <div
                          className="h-12 w-12 rounded-lg border-2 border-border cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => document.getElementById('primary-color')?.click()}
                        />
                        <div className="flex-1">
                          <Input
                            id="primary-color"
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-12 w-32 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Secondary/Accent Color</Label>
                      <div className="flex gap-3 mt-2">
                        <div
                          className="h-12 w-12 rounded-lg border-2 border-border cursor-pointer"
                          style={{ backgroundColor: secondaryColor }}
                          onClick={() => document.getElementById('secondary-color')?.click()}
                        />
                        <div className="flex-1">
                          <Input
                            id="secondary-color"
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="h-12 w-32 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button variant="outline">Preview Client View</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your budget proposals will appear to clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-border rounded-lg p-6 bg-muted/30">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="h-12 w-32 rounded flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Your Logo
                      </div>
                      <div className="text-right">
                        <h3 className="font-semibold">Budget Proposal</h3>
                        <p className="text-sm text-muted-foreground">January 26, 2026</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Amount</span>
                        <span className="text-2xl font-bold font-mono">$168,000</span>
                      </div>
                      <button
                        className="w-full mt-4 py-3 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        Approve Budget
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Default Values Section */}
          {activeSection === 'defaults' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold">Default Values</h1>
                <p className="text-muted-foreground mt-1">
                  Set default values for new projects and budgets
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Defaults</CardTitle>
                  <CardDescription>
                    These values can be overridden per project or per line item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Default Quality Level</Label>
                    <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background">
                      <option>Quality</option>
                      <option selected>Premium</option>
                      <option>Luxury</option>
                      <option>UltraLux</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Default Markup %</Label>
                      <Input type="number" defaultValue="30" min="0" max="100" className="mt-1" />
                    </div>
                    <div>
                      <Label>Default Shipping %</Label>
                      <Input type="number" defaultValue="5" min="0" max="100" className="mt-1" />
                    </div>
                    <div>
                      <Label>Default Other Costs %</Label>
                      <Input type="number" defaultValue="2" min="0" max="100" className="mt-1" />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button>
                      Save Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Default Tax Rate (%)</Label>
                    <Input type="number" defaultValue="8" step="0.1" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Can be auto-detected based on project address
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="auto-tax" className="mt-1" defaultChecked />
                    <div>
                      <Label htmlFor="auto-tax" className="cursor-pointer">
                        Auto-detect tax rate from project address
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Requires valid address with city and state
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users & Permissions Section */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold">Users & Permissions</h1>
                  <p className="text-muted-foreground mt-1">Manage team members and access</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>3 of 5 seats used</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr className="text-left text-sm font-medium text-muted-foreground">
                          <th className="p-3">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Status</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="p-3 font-medium">Jane Designer</td>
                          <td className="p-3 text-muted-foreground">jane@example.com</td>
                          <td className="p-3">
                            <Badge>Admin</Badge>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-success text-white">
                              Active
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-xs text-muted-foreground">You</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Mike Johnson</td>
                          <td className="p-3 text-muted-foreground">mike@example.com</td>
                          <td className="p-3">
                            <select className="px-2 py-1 rounded border border-border text-sm">
                              <option>Admin</option>
                              <option selected>User</option>
                              <option>Read Only</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-success text-white">
                              Active
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Sarah Davis</td>
                          <td className="p-3 text-muted-foreground">sarah@example.com</td>
                          <td className="p-3">
                            <select className="px-2 py-1 rounded border border-border text-sm">
                              <option>Admin</option>
                              <option>User</option>
                              <option selected>Read Only</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">Pending</Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Billing Section */}
          {activeSection === 'billing' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold">Billing</h1>
                <p className="text-muted-foreground mt-1">Manage your subscription and billing</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
                    <div>
                      <h3 className="text-2xl font-bold">Professional Plan</h3>
                      <p className="text-muted-foreground mt-1">
                        5 users • Unlimited projects • Priority support
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">$99</div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">Cancel Subscription</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <div className="h-12 w-16 bg-muted rounded flex items-center justify-center font-bold">
                      VISA
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-muted-foreground">Expires 12/2026</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { date: 'Jan 1, 2026', amount: '$99.00', status: 'Paid' },
                      { date: 'Dec 1, 2025', amount: '$99.00', status: 'Paid' },
                      { date: 'Nov 1, 2025', amount: '$99.00', status: 'Paid' },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{invoice.date}</div>
                          <div className="text-sm text-muted-foreground">
                            Professional Plan
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-mono font-semibold">{invoice.amount}</div>
                          <Badge
                            className="bg-success text-white"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {invoice.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Integrations Section */}
          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold">Integrations</h1>
                <p className="text-muted-foreground mt-1">Connect with external services</p>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    name: 'DocuSign',
                    description: 'E-signature integration for budget approvals',
                    connected: false,
                  },
                  {
                    name: 'Google Maps',
                    description: 'Address autocomplete and tax rate detection',
                    connected: true,
                  },
                  {
                    name: 'QuickBooks',
                    description: 'Sync budgets with your accounting software',
                    connected: false,
                  },
                  {
                    name: 'Slack',
                    description: 'Get notifications for budget approvals',
                    connected: false,
                  },
                ].map((integration) => (
                  <Card key={integration.name}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <h3 className="font-semibold text-lg">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                      {integration.connected ? (
                        <div className="flex items-center gap-2">
                          <Badge
                            className="bg-success text-white"
                          >
                            Connected
                          </Badge>
                          <Button variant="outline" size="sm">
                            Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button>
                          Connect
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold">Notifications</h1>
                <p className="text-muted-foreground mt-1">Manage how you receive notifications</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: 'Budget approved by client',
                      description: 'Receive an email when a client approves a budget',
                      checked: true,
                    },
                    {
                      label: 'Budget changes requested',
                      description: 'Get notified when a client requests changes',
                      checked: true,
                    },
                    {
                      label: 'Client views budget',
                      description: 'Know when a client opens a budget proposal',
                      checked: false,
                    },
                    {
                      label: 'Team member comments',
                      description: 'Receive emails for internal comments and notes',
                      checked: true,
                    },
                    {
                      label: 'Weekly summary',
                      description: 'Get a weekly digest of your project activity',
                      checked: true,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                      <input
                        type="checkbox"
                        defaultChecked={item.checked}
                        className="mt-1"
                        id={`notification-${i}`}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`notification-${i}`} className="cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>In-App Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" defaultChecked className="mt-1" />
                    <div>
                      <Label className="cursor-pointer">Enable in-app notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notification bell with updates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}