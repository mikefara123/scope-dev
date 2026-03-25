import { useState } from 'react';
import { Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { cn } from '@/app/components/ui/utils';

interface SendForApprovalModalProps {
  open: boolean;
  onClose: () => void;
  budgetData?: {
    name: string;
    total: number;
    itemCount: number;
  };
}

const STEPS = [
  { id: 1, name: 'Review' },
  { id: 2, name: 'Internal' },
  { id: 3, name: 'Client Details' },
  { id: 4, name: 'Export Options' },
  { id: 5, name: 'Confirm' }
];

export function SendForApprovalModal({ open, onClose, budgetData }: SendForApprovalModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [requireInternal, setRequireInternal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState(['client@example.com']);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('Budget Proposal - Project Name');
  const [emailMessage, setEmailMessage] = useState(
    'Dear {client_name},\n\nPlease review the attached budget proposal for your project.\n\nTotal: {total_amount}\nItems: {item_count}\n\nBest regards,\nYour Design Team'
  );

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      // Skip step 2 if internal approval not required
      if (currentStep === 1 && !requireInternal) {
        setCurrentStep(3);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // Skip step 2 if internal approval not required
      if (currentStep === 3 && !requireInternal) {
        setCurrentStep(1);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleSend = () => {
    // Handle send logic
    console.log('Sending budget for approval...');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Send for Approval</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between py-6">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center font-medium transition-colors',
                    step.id < currentStep
                      ? 'bg-success text-white'
                      : step.id === currentStep
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 font-medium',
                    step.id === currentStep
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-colors',
                    step.id < currentStep ? 'bg-success' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px] py-4">
          {/* Step 1: Review */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Budget</h3>
              <div className="p-6 rounded-lg bg-muted/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget Name:</span>
                  <span className="font-medium">{budgetData?.name || 'Budget v1.0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-mono font-bold text-lg">
                    ${budgetData?.total.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Items:</span>
                  <span className="font-medium">{budgetData?.itemCount || 0}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Preview the budget before sending
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Make sure all line items and calculations are correct
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Internal Approval */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Internal Approval</h3>
              
              <div className="flex items-start gap-3">
                <Checkbox
                  id="require-internal"
                  checked={requireInternal}
                  onCheckedChange={(checked) => setRequireInternal(checked as boolean)}
                />
                <div>
                  <Label htmlFor="require-internal" className="cursor-pointer">
                    Require internal approval first
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get approval from team lead before sending to client
                  </p>
                </div>
              </div>

              {requireInternal && (
                <div className="space-y-3 pl-7">
                  <div>
                    <Label>Select Approver</Label>
                    <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background">
                      <option>Team Lead - Jane Smith</option>
                      <option>Senior Designer - Mike Johnson</option>
                      <option>Project Manager - Sarah Davis</option>
                    </select>
                  </div>
                  <div>
                    <Label>Internal Notes</Label>
                    <Textarea
                      placeholder="Add notes for internal reviewer..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Client Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Client Details</h3>
              
              <div>
                <Label>Send To *</Label>
                <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-background mt-1">
                  {emailRecipients.map((email, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                    >
                      {email}
                      <button
                        onClick={() => setEmailRecipients(emailRecipients.filter((_, i) => i !== index))}
                        className="ml-1 hover:opacity-80"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="email"
                    placeholder="Add email..."
                    className="flex-1 min-w-[200px] bg-transparent outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setEmailRecipients([...emailRecipients, e.currentTarget.value]);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <Label>CC Recipients (optional)</Label>
                <Input
                  placeholder="Add CC emails separated by comma"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Email Subject</Label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={6}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available merge fields: {'{client_name}'}, {'{total_amount}'}, {'{item_count}'}
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Export Options */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Export Options</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox id="detail-items" defaultChecked />
                  <Label htmlFor="detail-items" className="cursor-pointer">
                    Include detailed line items
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="room-summaries" defaultChecked />
                  <Label htmlFor="room-summaries" className="cursor-pointer">
                    Include room summaries
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="cost-breakdown" />
                  <Label htmlFor="cost-breakdown" className="cursor-pointer">
                    Include cost breakdowns (markup, shipping, etc.)
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="terms" defaultChecked />
                  <Label htmlFor="terms" className="cursor-pointer">
                    Include terms and conditions
                  </Label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label>Attach Additional Documents</Label>
                <div className="mt-2 p-8 border-2 border-dashed border-border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Drag files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, or images (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirm */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Confirm & Send</h3>
              
              <div className="p-6 rounded-lg bg-green-50 border border-green-200">
                <p className="font-medium text-green-900 mb-3">
                  Ready to send budget for approval
                </p>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>Recipients:</span>
                    <span className="font-medium">{emailRecipients.length} client(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-mono font-medium">
                      ${budgetData?.total.toLocaleString() || '0'}
                    </span>
                  </div>
                  {requireInternal && (
                    <div className="flex justify-between">
                      <span>Internal Approval:</span>
                      <span className="font-medium">Required</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  After sending, the budget status will change to "Pending Approval" and the client
                  will receive an email with a link to review and approve the budget.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : prevStep}
          >
            {currentStep === 1 ? (
              'Cancel'
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </>
            )}
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={nextStep}
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              variant="success"
            >
              Send for Approval
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}