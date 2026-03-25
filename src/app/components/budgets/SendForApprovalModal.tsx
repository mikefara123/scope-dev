import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import { 
  Send, 
  Mail, 
  Eye, 
  AlertCircle, 
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { ApprovalDisplayOptions } from '@/types/approval';

interface SendForApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId: string;
  budgetName: string;
  projectName: string;
  customerEmail?: string;
  onSend: (emails: string[], ccEmails: string[], displayOptions: ApprovalDisplayOptions, message: string) => void;
}

// Mock budget data for preview
const mockBudgetPreview = {
  rooms: [
    { name: 'Living Room', items: 5, total: 12450 },
    { name: 'Master Bedroom', items: 8, total: 8900 },
    { name: 'Kitchen', items: 12, total: 24800 },
  ],
  lineItems: [
    { name: 'Modern Sectional Sofa', cost: 4200, shipping: 150, tax: 340, markup: 30 },
    { name: 'Coffee Table - Walnut', cost: 890, shipping: 45, tax: 75, markup: 25 },
    { name: 'Area Rug 8x10', cost: 1200, shipping: 0, tax: 96, markup: 20 },
  ],
  subtotal: 46150,
  shipping: 850,
  tax: 3692,
  total: 50692,
};

export function SendForApprovalModal({
  isOpen,
  onClose,
  budgetId,
  budgetName,
  projectName,
  customerEmail = '',
  onSend,
}: SendForApprovalModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [primaryEmails, setPrimaryEmails] = useState<string[]>(
    customerEmail ? [customerEmail] : []
  );
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newCcEmail, setNewCcEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  
  // Display options
  const [showLineItems, setShowLineItems] = useState(true);
  const [showRoomSummary, setShowRoomSummary] = useState(true);
  const [costBreakdown, setCostBreakdown] = useState<'detailed' | 'summary' | 'product-only'>('detailed');
  const [showMarkup, setShowMarkup] = useState(false);
  const [showShipping, setShowShipping] = useState(true);
  const [showTax, setShowTax] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addPrimaryEmail = () => {
    if (!newEmail.trim()) return;
    
    if (!validateEmail(newEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (primaryEmails.includes(newEmail)) {
      toast.error('This email is already added');
      return;
    }

    setPrimaryEmails([...primaryEmails, newEmail]);
    setNewEmail('');
  };

  const addCcEmail = () => {
    if (!newCcEmail.trim()) return;
    
    if (!validateEmail(newCcEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (ccEmails.includes(newCcEmail)) {
      toast.error('This email is already added');
      return;
    }

    setCcEmails([...ccEmails, newCcEmail]);
    setNewCcEmail('');
  };

  const removePrimaryEmail = (email: string) => {
    setPrimaryEmails(primaryEmails.filter(e => e !== email));
  };

  const removeCcEmail = (email: string) => {
    setCcEmails(ccEmails.filter(e => e !== email));
  };

  const handleNext = () => {
    if (currentStep === 1 && primaryEmails.length === 0) {
      toast.error('Please add at least one recipient email');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSend = () => {
    if (primaryEmails.length === 0) {
      toast.error('Please add at least one recipient email');
      return;
    }

    const displayOptions: ApprovalDisplayOptions = {
      showLineItems,
      showRoomSummary,
      costBreakdown,
      showMarkup,
      showShipping,
      showTax,
      includeNotes,
      customMessage,
    };

    onSend(primaryEmails, ccEmails, displayOptions, customMessage);
  };

  const handleCloseModal = () => {
    setCurrentStep(1);
    onClose();
  };

  const steps = [
    { number: 1, title: 'Recipients', icon: Mail },
    { number: 2, title: 'Customize', icon: Eye },
    { number: 3, title: 'Review & Send', icon: Send },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-full max-h-full h-screen w-screen p-0 gap-0">
        {/* Accessibility - Visually Hidden */}
        <DialogHeader className="sr-only">
          <DialogTitle>Send Budget for Approval - Step {currentStep} of 3</DialogTitle>
          <DialogDescription>
            {currentStep === 1 && 'Add recipient email addresses for budget approval'}
            {currentStep === 2 && 'Customize the budget presentation and display options'}
            {currentStep === 3 && 'Review your settings and send the budget for approval'}
          </DialogDescription>
        </DialogHeader>

        {/* Full Screen Container */}
        <div className="flex flex-col h-full bg-background">
          {/* Header with Stepper */}
          <div className="border-b bg-card px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Send Budget for Approval</h2>
                  <p className="text-muted-foreground mt-1">
                    {budgetName} • {projectName}
                  </p>
                </div>
                <Button variant="outline" onClick={handleCloseModal}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  
                  return (
                    <div key={step.number} className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-secondary text-white'
                              : isActive
                              ? 'bg-primary text-white'
                              : 'bg-border text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Step {step.number}</div>
                          <div className={`font-semibold ${isActive ? 'text-primary' : ''}`}>
                            {step.title}
                          </div>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`h-0.5 w-24 ${
                            isCompleted ? 'bg-secondary' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-muted/30">
            <div className="max-w-7xl mx-auto p-8">
              {/* Step 1: Recipients */}
              {currentStep === 1 && (
                <div className="max-w-3xl mx-auto space-y-8">
                  <Card className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Who should receive this budget?</h3>
                        <p className="text-muted-foreground">
                          Add client email addresses who can approve or reject the budget
                        </p>
                      </div>

                      {/* Primary Recipients */}
                      <div className="space-y-3">
                        <Label htmlFor="primary-email" className="flex items-center gap-2 text-base">
                          <Mail className="h-5 w-5 text-primary" />
                          Primary Recipients (Required)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          These recipients will be able to approve or reject the budget
                        </p>
                        <div className="flex gap-2">
                          <Input
                            id="primary-email"
                            type="email"
                            placeholder="client@email.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addPrimaryEmail()}
                            className="text-base h-11"
                          />
                          <Button 
                            type="button" 
                            onClick={addPrimaryEmail}
                            size="lg"
                            variant="outline"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Add
                          </Button>
                        </div>
                        
                        {/* Email Chips */}
                        {primaryEmails.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                            {primaryEmails.map((email) => (
                              <Badge 
                                key={email} 
                                variant="outline"
                                className="gap-2 bg-white text-green-700 border-green-300 px-3 py-1.5 text-sm"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                {email}
                                <button
                                  type="button"
                                  onClick={() => removePrimaryEmail(email)}
                                  className="ml-1 hover:text-green-900"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CC Recipients */}
                      <div className="space-y-3 pt-4 border-t">
                        <Label htmlFor="cc-email" className="text-base">
                          CC Recipients (Optional)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          These recipients will receive a copy for their records only (cannot approve/reject)
                        </p>
                        <div className="flex gap-2">
                          <Input
                            id="cc-email"
                            type="email"
                            placeholder="team@email.com"
                            value={newCcEmail}
                            onChange={(e) => setNewCcEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCcEmail()}
                            className="text-base h-11"
                          />
                          <Button 
                            type="button" 
                            onClick={addCcEmail}
                            size="lg"
                            variant="outline"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Add
                          </Button>
                        </div>
                        
                        {ccEmails.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg border">
                            {ccEmails.map((email) => (
                              <Badge 
                                key={email} 
                                variant="outline"
                                className="gap-2 px-3 py-1.5 text-sm"
                              >
                                {email}
                                <button
                                  type="button"
                                  onClick={() => removeCcEmail(email)}
                                  className="ml-1 hover:text-foreground"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 2: Customize */}
              {currentStep === 2 && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <Card className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Customize the budget presentation</h3>
                        <p className="text-muted-foreground">
                          Choose what information to show your client
                        </p>
                      </div>

                      {/* Custom Message */}
                      <div className="space-y-3">
                        <Label htmlFor="message" className="text-base">Personal Message (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Add a personal message to your client..."
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          rows={4}
                          className="resize-none text-base"
                        />
                      </div>

                      {/* Display Options */}
                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-base">Display Options</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          {/* Show Line Items */}
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label htmlFor="show-line-items" className="text-base font-medium cursor-pointer">
                                Show Line Items
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">Display individual items</p>
                            </div>
                            <Switch
                              id="show-line-items"
                              checked={showLineItems}
                              onCheckedChange={setShowLineItems}
                            />
                          </div>

                          {/* Show Room Summary */}
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label htmlFor="show-room-summary" className="text-base font-medium cursor-pointer">
                                Show Room Summary
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">Totals grouped by room</p>
                            </div>
                            <Switch
                              id="show-room-summary"
                              checked={showRoomSummary}
                              onCheckedChange={setShowRoomSummary}
                            />
                          </div>

                          {/* Show Markup */}
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label htmlFor="show-markup" className="text-base font-medium cursor-pointer">
                                Show Markup %
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">Display markup percentages</p>
                            </div>
                            <Switch
                              id="show-markup"
                              checked={showMarkup}
                              onCheckedChange={setShowMarkup}
                            />
                          </div>

                          {/* Show Shipping */}
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label htmlFor="show-shipping" className="text-base font-medium cursor-pointer">
                                Show Shipping
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">Include shipping costs</p>
                            </div>
                            <Switch
                              id="show-shipping"
                              checked={showShipping}
                              onCheckedChange={setShowShipping}
                            />
                          </div>

                          {/* Show Tax */}
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label htmlFor="show-tax" className="text-base font-medium cursor-pointer">
                                Show Tax
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">Display tax amounts</p>
                            </div>
                            <Switch
                              id="show-tax"
                              checked={showTax}
                              onCheckedChange={setShowTax}
                            />
                          </div>

                          {/* Include Notes */}
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label htmlFor="include-notes" className="text-base font-medium cursor-pointer">
                                Include Item Notes
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">Show additional details</p>
                            </div>
                            <Switch
                              id="include-notes"
                              checked={includeNotes}
                              onCheckedChange={setIncludeNotes}
                            />
                          </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="space-y-3 pt-4">
                          <Label htmlFor="cost-breakdown" className="text-base font-medium">Cost Breakdown Display</Label>
                          <Select value={costBreakdown} onValueChange={(value: any) => setCostBreakdown(value)}>
                            <SelectTrigger id="cost-breakdown" className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="detailed">
                                Detailed (Show all cost components)
                              </SelectItem>
                              <SelectItem value="summary">
                                Summary (Totals by room)
                              </SelectItem>
                              <SelectItem value="product-only">
                                Product Only (Hide markup, show tax & shipping at bottom)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 3: Review & Send */}
              {currentStep === 3 && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Summary */}
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Approval Summary</h3>
                      
                      <div className="space-y-4">
                        {/* Recipients */}
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Primary Recipients</div>
                          <div className="flex flex-wrap gap-2">
                            {primaryEmails.map((email) => (
                              <Badge key={email} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {email}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {ccEmails.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">CC Recipients</div>
                            <div className="flex flex-wrap gap-2">
                              {ccEmails.map((email) => (
                                <Badge key={email} variant="outline">
                                  {email}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Display Options */}
                        <div className="pt-4 border-t">
                          <div className="text-sm font-medium text-muted-foreground mb-3">Display Settings</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span>Line Items</span>
                              <Badge variant={showLineItems ? "default" : "outline"}>
                                {showLineItems ? "Shown" : "Hidden"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Room Summary</span>
                              <Badge variant={showRoomSummary ? "default" : "outline"}>
                                {showRoomSummary ? "Shown" : "Hidden"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Markup</span>
                              <Badge variant={showMarkup ? "default" : "outline"}>
                                {showMarkup ? "Shown" : "Hidden"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Breakdown</span>
                              <Badge variant="outline">{costBreakdown}</Badge>
                            </div>
                          </div>
                        </div>

                        {customMessage && (
                          <div className="pt-4 border-t">
                            <div className="text-sm font-medium text-muted-foreground mb-2">Personal Message</div>
                            <div className="text-sm p-3 bg-blue-50 border border-blue-200 rounded italic">
                              "{customMessage}"
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Warning */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Budget will be locked after approval</p>
                        <p>
                          Once your client approves this budget, it will be locked and cannot be edited. 
                          You'll need to create an interim budget for any changes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Preview */}
                  <div>
                    <div className="sticky top-0">
                      <div className="flex items-center gap-2 mb-4">
                        <Eye className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">Client Preview</h3>
                      </div>
                      
                      <Card className="p-6 space-y-4 bg-gray-50">
                        {/* Header */}
                        <div className="border-b pb-4">
                          <h4 className="font-bold text-xl">{budgetName}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{projectName}</p>
                        </div>

                        {/* Custom Message Preview */}
                        {customMessage && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm italic text-blue-900">{customMessage}</p>
                          </div>
                        )}

                        {/* Room Summary */}
                        {showRoomSummary && (
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm">Budget Summary by Room</h5>
                            <div className="space-y-1 text-xs">
                              {mockBudgetPreview.rooms.map((room) => (
                                <div key={room.name} className="flex justify-between py-2 border-b">
                                  <span className="text-muted-foreground">{room.name} ({room.items} items)</span>
                                  <span className="font-mono font-semibold">${room.total.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Line Items */}
                        {showLineItems && (
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm">
                              {costBreakdown === 'detailed' ? 'Detailed Line Items' : 
                               costBreakdown === 'summary' ? 'Summary View' : 'Products'}
                            </h5>
                            <div className="space-y-2 text-xs">
                              {mockBudgetPreview.lineItems.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-3 border">
                                  <div className="flex justify-between font-medium">
                                    <span>{item.name}</span>
                                    <span className="font-mono">${item.cost.toLocaleString()}</span>
                                  </div>
                                  {costBreakdown === 'detailed' && (
                                    <div className="mt-2 space-y-1 text-muted-foreground">
                                      {showMarkup && <div className="flex justify-between"><span>Markup ({item.markup}%)</span><span className="font-mono">+${Math.round(item.cost * item.markup / 100)}</span></div>}
                                      {showShipping && item.shipping > 0 && <div className="flex justify-between"><span>Shipping</span><span className="font-mono">+${item.shipping}</span></div>}
                                      {showTax && <div className="flex justify-between"><span>Tax</span><span className="font-mono">+${item.tax}</span></div>}
                                    </div>
                                  )}
                                  {includeNotes && (
                                    <p className="mt-2 text-muted-foreground italic text-[10px]">Custom specifications available upon request</p>
                                  )}
                                </div>
                              ))}
                              <p className="text-center text-muted-foreground py-2">+ more items...</p>
                            </div>
                          </div>
                        )}

                        {/* Totals */}
                        <div className="border-t pt-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-mono">${mockBudgetPreview.subtotal.toLocaleString()}</span>
                          </div>
                          {showShipping && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Shipping</span>
                              <span className="font-mono">${mockBudgetPreview.shipping.toLocaleString()}</span>
                            </div>
                          )}
                          {showTax && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tax</span>
                              <span className="font-mono">${mockBudgetPreview.tax.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-base border-t pt-3 mt-2">
                            <span>Grand Total</span>
                            <span className="font-mono text-primary">${mockBudgetPreview.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Approval Buttons Preview */}
                        <div className="border-t pt-4 space-y-2">
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm" disabled>
                            ✓ Approve Budget
                          </Button>
                          <Button className="w-full" variant="outline" size="sm" disabled>
                            Request Changes
                          </Button>
                        </div>
                      </Card>

                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        This is how your client will see the budget
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="border-t bg-card px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack} size="lg">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {currentStep < 3 ? (
                  <Button onClick={handleNext} size="lg">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSend}
                    size="lg"
                    className="bg-secondary hover:bg-secondary-hover text-white min-w-[200px]"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send for Approval
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}