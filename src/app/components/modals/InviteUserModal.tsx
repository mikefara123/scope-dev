import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { UserRole } from '@/types/multi-tenant';
import { Mail, User as UserIcon, Shield } from 'lucide-react';

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (data: { name: string; email: string; role: UserRole }) => void;
  availableLicenses: number;
}

export function InviteUserModal({ open, onOpenChange, onInvite, availableLicenses }: InviteUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.GENERAL_USER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onInvite({ name: name.trim(), email: email.trim(), role });
    
    // Reset form
    setName('');
    setEmail('');
    setRole(UserRole.GENERAL_USER);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setRole(UserRole.GENERAL_USER);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to a new team member. They'll receive an email with setup instructions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* License Warning */}
            {availableLicenses === 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">
                  ⚠️ No available licenses
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Please upgrade your plan or remove a user to invite someone new.
                </p>
              </div>
            )}

            {availableLicenses > 0 && availableLicenses <= 2 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  {availableLicenses} {availableLicenses === 1 ? 'license' : 'licenses'} remaining
                </p>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="space-y-2">
                {/* Agency Admin */}
                <label
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    role === UserRole.AGENCY_ADMIN
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.AGENCY_ADMIN}
                    checked={role === UserRole.AGENCY_ADMIN}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Agency Admin</span>
                      <Badge variant="secondary" className="text-xs">Full Access</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manage users, settings, billing, and all agency data
                    </p>
                  </div>
                </label>

                {/* Designer/General User */}
                <label
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    role === UserRole.GENERAL_USER
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.GENERAL_USER}
                    checked={role === UserRole.GENERAL_USER}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Designer</span>
                      <Badge variant="secondary" className="text-xs">Standard</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create and manage projects, budgets, and use all standard features
                    </p>
                  </div>
                </label>

                {/* Read Only */}
                <label
                  className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    role === UserRole.READ_ONLY_USER
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.READ_ONLY_USER}
                    checked={role === UserRole.READ_ONLY_USER}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">Read-Only</span>
                      <Badge variant="outline" className="text-xs">View Only</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      View projects and budgets, but cannot make changes
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || availableLicenses === 0}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
