import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { getBudgetById } from '@/app/data/mockData';
import { ArrowLeft, ChevronDown, ChevronRight, CheckSquare, Square, Lock, Send, CheckCircle2, Plus, X, Mail, UserCheck, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type SummaryLocation = 'top' | 'bottom';
type LineItemDisplay = 'expanded' | 'collapsed';

interface EmailRecipient {
  email: string;
  exists: boolean;
  needsInvitation: boolean;
}

// Mock function to check if user exists in the system
const checkUserExists = (email: string): boolean => {
  // In real implementation, this would be an API call
  // For demo, emails ending with @client.com are "existing users"
  return email.endsWith('@client.com') || email.endsWith('@customer.com');
};

export function BudgetPreview() {
  const { budgetId } = useParams();
  const budget = getBudgetById(budgetId!);

  // View Options State
  const [showRoomNames, setShowRoomNames] = useState(true);
  const [showRoomSubtotals, setShowRoomSubtotals] = useState(true);
  const [showTotalAmount, setShowTotalAmount] = useState(true);
  const [showLineItems, setShowLineItems] = useState(true);
  const [allowSuggestedItems, setAllowSuggestedItems] = useState(false);
  const [lineItemDisplay, setLineItemDisplay] = useState<LineItemDisplay>('expanded');
  const [summaryLocation, setSummaryLocation] = useState<SummaryLocation>('top');
  const [showQuantity, setShowQuantity] = useState(true);
  const [showItemCost, setShowItemCost] = useState(true);
  const [showTotalCost, setShowTotalCost] = useState(true);
  const [showShipping, setShowShipping] = useState(true);
  const [showOther, setShowOther] = useState(true);
  const [showTax, setShowTax] = useState(true);
  const [clientReviewByRoom, setClientReviewByRoom] = useState(false);

  // Collapsible sections state (for preview)
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});

  // Suggested items state (for preview checkboxes)
  const [suggestedItemsState, setSuggestedItemsState] = useState<Record<string, boolean>>({});

  // Approval state
  const [internalApprovalDone, setInternalApprovalDone] = useState(false);

  // Email recipients state
  const [primaryRecipients, setPrimaryRecipients] = useState<EmailRecipient[]>([]);
  const [ccRecipients, setCcRecipients] = useState<EmailRecipient[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newCcEmail, setNewCcEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  if (!budget) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">Budget not found</h3>
          <p className="text-muted-foreground mb-4">The budget you're looking for doesn't exist.</p>
          <Link to="/budgets">
            <Button variant="outline">Back to Budgets</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Group items by room
  const itemsByRoom = budget.lineItems.reduce((acc, item) => {
    if (!acc[item.room]) acc[item.room] = [];
    acc[item.room].push(item);
    return acc;
  }, {} as Record<string, typeof budget.lineItems>);

  const toggleRoom = (room: string) => {
    setExpandedRooms(prev => ({
      ...prev,
      [room]: !prev[room]
    }));
  };

  const toggleSuggestedItem = (itemId: string) => {
    setSuggestedItemsState(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Calculate totals
  const calculateRoomTotal = (items: typeof budget.lineItems) => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  // Mock approval functions
  const handleSendForInternalApproval = () => {
    // In production, this would trigger the internal approval workflow
    console.log('Sending for internal approval...');
    setInternalApprovalDone(true);
    toast.success('Sent for internal approval');
  };

  const handleSendForClientApproval = () => {
    if (primaryRecipients.length === 0) {
      toast.error('Please add at least one recipient email');
      return;
    }

    const newUsers = primaryRecipients.filter(r => r.needsInvitation);
    const existingUsers = primaryRecipients.filter(r => r.exists);

    // In production, this would trigger the client approval workflow
    if (newUsers.length > 0) {
      toast.success(`Invitations sent to ${newUsers.length} new user(s)`);
    }
    if (existingUsers.length > 0) {
      toast.success(`Budget sent to ${existingUsers.length} existing user(s)`);
    }
  };

  // Email management functions
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

    if (primaryRecipients.some(r => r.email === newEmail)) {
      toast.error('This email is already added');
      return;
    }

    const exists = checkUserExists(newEmail);
    const recipient: EmailRecipient = {
      email: newEmail,
      exists,
      needsInvitation: !exists
    };

    setPrimaryRecipients([...primaryRecipients, recipient]);
    setNewEmail('');

    if (!exists) {
      toast.info(`${newEmail} will be invited to sign up and approve the budget`);
    } else {
      toast.success(`${newEmail} added successfully`);
    }
  };

  const addCcEmail = () => {
    if (!newCcEmail.trim()) return;
    
    if (!validateEmail(newCcEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (ccRecipients.some(r => r.email === newCcEmail)) {
      toast.error('This email is already added');
      return;
    }

    const exists = checkUserExists(newCcEmail);
    const recipient: EmailRecipient = {
      email: newCcEmail,
      exists,
      needsInvitation: !exists
    };

    setCcRecipients([...ccRecipients, recipient]);
    setNewCcEmail('');
  };

  const removePrimaryEmail = (email: string) => {
    setPrimaryRecipients(primaryRecipients.filter(r => r.email !== email));
  };

  const removeCcEmail = (email: string) => {
    setCcRecipients(ccRecipients.filter(r => r.email !== email));
  };

  // Summary Component
  const SummarySection = () => (
    <div className="p-6 rounded-lg border-2 border-brand-primary bg-muted/30 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-brand-primary">Budget Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-mono font-semibold">${budget.subtotal.toLocaleString()}</span>
        </div>
        {showShipping && (
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="font-mono font-semibold">${budget.totalShipping.toLocaleString()}</span>
          </div>
        )}
        {showOther && (
          <div className="flex justify-between text-sm">
            <span>Other Costs</span>
            <span className="font-mono font-semibold">${budget.totalOther.toLocaleString()}</span>
          </div>
        )}
        {showTax && (
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span className="font-mono font-semibold">${budget.totalTax.toLocaleString()}</span>
          </div>
        )}
        {showTotalAmount && (
          <>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-brand-primary">Total Investment</span>
              <span className="font-mono text-brand-primary">${budget.grandTotal.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-6 max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={`/projects/${budget.projectId}/budgets/${budgetId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Budget
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Project Scope Review</h1>
                <p className="text-sm text-muted-foreground">
                  Budget #{budget.version} • {budget.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSendForInternalApproval}
                disabled={internalApprovalDone}
              >
                {internalApprovalDone ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-success" />
                    Internal Approved
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send for Internal Approval
                  </>
                )}
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleSendForClientApproval}
                disabled={!internalApprovalDone}
                className="gap-2"
              >
                {!internalApprovalDone && <Lock className="h-4 w-4" />}
                <Send className="h-4 w-4" />
                Send for Client Approval
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Split View Content */}
      <div className="grid grid-cols-12 gap-6 p-6 max-w-[1800px] mx-auto">
        {/* Left Panel - View Options */}
        <div className="col-span-4 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-secondary rounded"></span>
              View Options
            </h2>

            {/* Display Options */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Display Options
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="room-names" className="text-sm cursor-pointer">
                    Room Names
                  </Label>
                  <Switch
                    id="room-names"
                    checked={showRoomNames}
                    onCheckedChange={setShowRoomNames}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="room-subtotals" className="text-sm cursor-pointer">
                    Room Subtotals
                  </Label>
                  <Switch
                    id="room-subtotals"
                    checked={showRoomSubtotals}
                    onCheckedChange={setShowRoomSubtotals}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="total-amount" className="text-sm cursor-pointer">
                    Total Amount
                  </Label>
                  <Switch
                    id="total-amount"
                    checked={showTotalAmount}
                    onCheckedChange={setShowTotalAmount}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="line-items" className="text-sm cursor-pointer">
                    Line Items
                  </Label>
                  <Switch
                    id="line-items"
                    checked={showLineItems}
                    onCheckedChange={setShowLineItems}
                  />
                </div>

                {showLineItems && (
                  <div className="ml-6 pl-4 border-l-2 border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="suggested-items" className="text-sm cursor-pointer">
                        Allow Suggested Items?
                      </Label>
                      <Switch
                        id="suggested-items"
                        checked={allowSuggestedItems}
                        onCheckedChange={setAllowSuggestedItems}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Shows checkboxes for optional items clients can approve
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="line-item-display" className="text-sm">
                        Line Item Display
                      </Label>
                      <Select value={lineItemDisplay} onValueChange={(value: LineItemDisplay) => setLineItemDisplay(value)}>
                        <SelectTrigger id="line-item-display">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expanded">Expanded</SelectItem>
                          <SelectItem value="collapsed">Collapsed</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Default state when client opens
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Summary Options */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Summary Options
              </h3>

              <div className="space-y-2">
                <Label htmlFor="summary-location" className="text-sm">
                  Location
                </Label>
                <Select value={summaryLocation} onValueChange={(value: SummaryLocation) => setSummaryLocation(value)}>
                  <SelectTrigger id="summary-location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Line Item Detail Options */}
            {showLineItems && (
              <>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Line Item Detail
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-quantity" className="text-sm cursor-pointer">
                        Quantity
                      </Label>
                      <Switch
                        id="show-quantity"
                        checked={showQuantity}
                        onCheckedChange={setShowQuantity}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-item-cost" className="text-sm cursor-pointer">
                        Item Cost
                      </Label>
                      <Switch
                        id="show-item-cost"
                        checked={showItemCost}
                        onCheckedChange={setShowItemCost}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-total-cost" className="text-sm cursor-pointer">
                        Total Cost
                      </Label>
                      <Switch
                        id="show-total-cost"
                        checked={showTotalCost}
                        onCheckedChange={setShowTotalCost}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-shipping" className="text-sm cursor-pointer">
                        Shipping
                      </Label>
                      <Switch
                        id="show-shipping"
                        checked={showShipping}
                        onCheckedChange={setShowShipping}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-other" className="text-sm cursor-pointer">
                        Other
                      </Label>
                      <Switch
                        id="show-other"
                        checked={showOther}
                        onCheckedChange={setShowOther}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-tax" className="text-sm cursor-pointer">
                        Tax
                      </Label>
                      <Switch
                        id="show-tax"
                        checked={showTax}
                        onCheckedChange={setShowTax}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />
              </>
            )}

            {/* Client Review Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Client Review
              </h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="review-by-room" className="text-sm cursor-pointer">
                  Review by Room?
                </Label>
                <Switch
                  id="review-by-room"
                  checked={clientReviewByRoom}
                  onCheckedChange={setClientReviewByRoom}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {clientReviewByRoom 
                  ? 'Client can approve room-by-room' 
                  : 'Client approves entire project at once'}
              </p>
            </div>
          </Card>

          {/* Review & Send Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-primary rounded"></span>
              Review & Send
            </h2>

            {/* Primary Recipients */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-brand-primary" />
                <Label className="text-sm font-semibold">Client Recipients</Label>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Who can approve or reject this budget
              </p>
              
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="client@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPrimaryEmail()}
                  className="text-sm"
                />
                <Button 
                  type="button" 
                  onClick={addPrimaryEmail}
                  size="sm"
                  variant="secondary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Recipients List */}
              {primaryRecipients.length > 0 && (
                <div className="space-y-2 mt-3">
                  {primaryRecipients.map((recipient) => (
                    <div 
                      key={recipient.email} 
                      className={`flex items-center justify-between p-2 rounded-lg border text-sm ${
                        recipient.exists 
                          ? 'bg-emerald-50 border-emerald-200' 
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 ${
                          recipient.exists ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}>
                          {recipient.exists ? (
                            <UserCheck className="h-3.5 w-3.5 text-white" />
                          ) : (
                            <UserPlus className="h-3.5 w-3.5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{recipient.email}</div>
                          <div className={`text-xs ${recipient.exists ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {recipient.exists ? 'Active user' : 'Will be invited'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePrimaryEmail(recipient.email)}
                          className="h-6 w-6 rounded hover:bg-white/50 flex items-center justify-center transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Stats */}
                  {primaryRecipients.filter(r => r.needsInvitation).length > 0 && (
                    <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg mt-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        New users will receive an invitation to sign up before approving.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* CC Recipients */}
            <div className="space-y-3 mb-6">
              <Label className="text-sm font-semibold">CC (Optional)</Label>
              <p className="text-xs text-muted-foreground">
                Copy others for visibility only
              </p>
              
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="teammate@email.com"
                  value={newCcEmail}
                  onChange={(e) => setNewCcEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCcEmail()}
                  className="text-sm"
                />
                <Button 
                  type="button" 
                  onClick={addCcEmail}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {ccRecipients.length > 0 && (
                <div className="space-y-2 mt-3">
                  {ccRecipients.map((recipient) => (
                    <div 
                      key={recipient.email} 
                      className="flex items-center justify-between p-2 rounded-lg border bg-muted/30 text-sm"
                    >
                      <span className="flex-1 truncate text-sm">{recipient.email}</span>
                      <button
                        type="button"
                        onClick={() => removeCcEmail(recipient.email)}
                        className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Custom Message */}
            <div className="space-y-3">
              <Label htmlFor="custom-message" className="text-sm font-semibold">
                Personal Message (Optional)
              </Label>
              <Textarea
                id="custom-message"
                placeholder="Add a personal note to accompany this budget..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This message will appear at the top of the budget preview
              </p>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 text-xs text-blue-900">
                <p className="font-medium mb-1">Preview updates in real-time</p>
                <p className="text-blue-700">
                  Changes to view options are immediately reflected in the preview. 
                  Review carefully before sending for approval.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="col-span-8">
          <Card className="p-8 min-h-[800px] shadow-elevated">
            {/* Preview Document */}
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-brand-primary">
                <div className="text-2xl font-bold text-brand-primary mb-2">
                  YOUR DESIGN FIRM
                </div>
                <h1 className="text-3xl font-bold mb-3 text-brand-primary">
                  Budget Proposal
                </h1>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Prepared for Client Name</p>
                  <p>Project Address</p>
                  <p className="text-xs">
                    Date: {budget.createdAt.toLocaleDateString()} • Version: {budget.version}
                  </p>
                </div>
              </div>

              {/* Custom Message (if provided) */}
              {customMessage && (
                <div className="mb-6 p-4 bg-brand-secondary/10 border-l-4 border-brand-secondary rounded">
                  <p className="text-sm whitespace-pre-wrap">{customMessage}</p>
                </div>
              )}

              {/* Summary at Top */}
              {summaryLocation === 'top' && <SummarySection />}

              {/* Room Sections */}
              {showLineItems && Object.entries(itemsByRoom).map(([room, items]) => {
                const isExpanded = lineItemDisplay === 'expanded' || expandedRooms[room];
                
                return (
                  <div key={room} className="mb-8">
                    {/* Room Header */}
                    {showRoomNames && (
                      <div 
                        className="flex items-center justify-between mb-4 pb-2 border-b border-brand-secondary cursor-pointer group"
                        onClick={() => toggleRoom(room)}
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-brand-secondary" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-brand-secondary" />
                          )}
                          <h2 className="text-xl font-semibold text-foreground group-hover:text-brand-secondary transition-colors">
                            {room}
                          </h2>
                        </div>
                        {showRoomSubtotals && (
                          <span className="font-mono font-semibold text-brand-primary">
                            ${calculateRoomTotal(items).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Line Items Table */}
                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr className="text-left">
                              {allowSuggestedItems && (
                                <th className="py-2 px-3 w-10"></th>
                              )}
                              <th className="py-2 px-3 font-semibold">Item</th>
                              {showQuantity && (
                                <th className="py-2 px-3 text-center font-semibold">Qty</th>
                              )}
                              {showItemCost && (
                                <th className="py-2 px-3 text-right font-semibold">Unit Price</th>
                              )}
                              {showTotalCost && (
                                <th className="py-2 px-3 text-right font-semibold">Total</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {items.map((item) => (
                              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                {allowSuggestedItems && (
                                  <td className="py-3 px-3">
                                    <button
                                      onClick={() => toggleSuggestedItem(item.id)}
                                      className="text-brand-secondary hover:text-brand-primary transition-colors"
                                    >
                                      {suggestedItemsState[item.id] ? (
                                        <CheckSquare className="h-5 w-5" />
                                      ) : (
                                        <Square className="h-5 w-5" />
                                      )}
                                    </button>
                                  </td>
                                )}
                                <td className="py-3 px-3">
                                  <div>
                                    <div className="font-medium">{item.itemName}</div>
                                    <div className="text-xs text-muted-foreground">{item.details}</div>
                                  </div>
                                </td>
                                {showQuantity && (
                                  <td className="py-3 px-3 text-center">{item.quantity}</td>
                                )}
                                {showItemCost && (
                                  <td className="py-3 px-3 text-right font-mono">
                                    ${(item.total / item.quantity).toLocaleString()}
                                  </td>
                                )}
                                {showTotalCost && (
                                  <td className="py-3 px-3 text-right font-mono font-semibold">
                                    ${item.total.toLocaleString()}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Room Approval (if enabled) */}
                    {clientReviewByRoom && isExpanded && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Approve {room}?</span>
                          <Button size="sm" variant="outline">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve Room
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Summary at Bottom */}
              {summaryLocation === 'bottom' && <SummarySection />}

              {/* Approval Section */}
              {!clientReviewByRoom && (
                <div className="mt-12 pt-6 border-t-2 border-brand-primary">
                  <div className="bg-muted/30 p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4">Budget Approval</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please review all items carefully and approve this budget to proceed.
                    </p>
                    <div className="flex gap-3">
                      <Button size="lg" className="flex-1 bg-success hover:bg-success/90 text-white">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Approve Budget
                      </Button>
                      <Button size="lg" variant="outline" className="flex-1">
                        Request Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}