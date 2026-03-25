import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Lock,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Mock data - in production, this would be fetched via the token
const mockApprovalData = {
  projectName: 'Riverside Penthouse',
  budgetName: 'Budget v1.0 - Living Room & Kitchen',
  agencyName: 'Acme Design Studio',
  agencyLogo: null,
  designerName: 'Sarah Johnson',
  designerEmail: 'sarah@acmedesign.com',
  sentDate: new Date('2026-01-28'),
  customMessage: 'Hi John and Mary, I\'m excited to share this budget with you. I\'ve carefully selected each piece to match your vision for a modern, coastal aesthetic. Please review and let me know if you have any questions!',
  displayOptions: {
    showLineItems: true,
    showRoomSummary: true,
    costBreakdown: 'detailed',
    showMarkup: false,
    showShipping: true,
    showTax: true,
    includeNotes: false,
  },
  sections: [
    {
      id: '1',
      name: 'Living Room',
      items: [
        {
          id: '1',
          name: 'Westwood Sectional Sofa',
          description: 'Premium linen upholstery, deep seating',
          quantity: 1,
          unit: 'ea',
          netCost: 3200,
          markup: 40,
          clientCost: 4480,
          shipping: 150,
          tax: 387.60,
          total: 5017.60,
        },
        {
          id: '2',
          name: 'Marble Coffee Table',
          description: 'White Carrara marble, brass base',
          quantity: 1,
          unit: 'ea',
          netCost: 1800,
          markup: 40,
          clientCost: 2520,
          shipping: 100,
          tax: 218.40,
          total: 2838.40,
        },
        {
          id: '3',
          name: 'Area Rug - 9x12',
          description: 'Hand-woven wool, geometric pattern',
          quantity: 1,
          unit: 'ea',
          netCost: 2400,
          markup: 40,
          clientCost: 3360,
          shipping: 75,
          tax: 286.20,
          total: 3721.20,
        },
      ],
      subtotal: 10320,
      shipping: 325,
      tax: 892.20,
      total: 11537.20,
    },
    {
      id: '2',
      name: 'Kitchen',
      items: [
        {
          id: '4',
          name: 'Bar Stools (Set of 3)',
          description: 'Leather seat, metal frame',
          quantity: 1,
          unit: 'set',
          netCost: 900,
          markup: 40,
          clientCost: 1260,
          shipping: 50,
          tax: 109.20,
          total: 1419.20,
        },
        {
          id: '5',
          name: 'Pendant Lighting',
          description: 'Glass globe, brass finish',
          quantity: 3,
          unit: 'ea',
          netCost: 450,
          markup: 40,
          clientCost: 630,
          shipping: 30,
          tax: 54.60,
          total: 714.60,
        },
      ],
      subtotal: 1890,
      shipping: 80,
      tax: 163.80,
      total: 2133.80,
    },
  ],
  grandTotal: 13671.00,
  totalShipping: 405,
  totalTax: 1056.00,
};

export function CustomerApproval() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleApprove = () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setStatus('approved');
      setShowConfirmation(true);
      setIsSubmitting(false);
      toast.success('Budget approved successfully!');
    }, 1500);
  };

  const handleReject = () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!notes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setStatus('rejected');
      setShowConfirmation(true);
      setIsSubmitting(false);
      toast.success('Your feedback has been sent to the designer');
    }, 1500);
  };

  // Confirmation View
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {status === 'approved' ? (
                <>
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Budget Approved!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for approving the budget. {mockApprovalData.designerName} has been notified 
                    and will begin moving forward with your project.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-green-800">
                      <strong>Approved by:</strong> {customerName}
                    </p>
                    <p className="text-sm text-green-800 mt-1">
                      <strong>Date:</strong> {format(new Date(), 'MMMM d, yyyy h:mm a')}
                    </p>
                    <p className="text-sm text-green-800 mt-1">
                      <strong>Total Amount:</strong> ${mockApprovalData.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Feedback Sent</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your feedback has been sent to {mockApprovalData.designerName}. 
                    They will review your comments and send you a revised budget shortly.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6 text-left">
                    <p className="text-sm text-amber-800">
                      <strong>Your Comments:</strong>
                    </p>
                    <p className="text-sm text-amber-800 mt-2 whitespace-pre-wrap">
                      {notes}
                    </p>
                  </div>
                </>
              )}

              <div className="pt-6">
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your inbox.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Approval View
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              {mockApprovalData.agencyLogo ? (
                <img src={mockApprovalData.agencyLogo} alt={mockApprovalData.agencyName} className="h-10" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-[#319795] flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-foreground">{mockApprovalData.agencyName}</h1>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Budget Review & Approval
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Awaiting Your Approval
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{mockApprovalData.projectName}</CardTitle>
            <p className="text-lg text-muted-foreground">{mockApprovalData.budgetName}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Designer</div>
                  <div className="font-medium">{mockApprovalData.designerName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Sent Date</div>
                  <div className="font-medium">{format(mockApprovalData.sentDate, 'MMMM d, yyyy')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="font-medium text-lg">
                    ${mockApprovalData.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {mockApprovalData.customMessage && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">Message from your designer:</p>
                <p className="text-sm text-blue-800 whitespace-pre-wrap">{mockApprovalData.customMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget Details */}
        {mockApprovalData.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-lg">{section.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      {mockApprovalData.displayOptions.showShipping && (
                        <TableHead className="text-right">Shipping</TableHead>
                      )}
                      {mockApprovalData.displayOptions.showTax && (
                        <TableHead className="text-right">Tax</TableHead>
                      )}
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.clientCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                        {mockApprovalData.displayOptions.showShipping && (
                          <TableCell className="text-right">
                            ${item.shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                        )}
                        {mockApprovalData.displayOptions.showTax && (
                          <TableCell className="text-right">
                            ${item.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                        )}
                        <TableCell className="text-right font-medium">
                          ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Section Total */}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell colSpan={2}>{section.name} Total</TableCell>
                      <TableCell className="text-right">
                        ${section.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      {mockApprovalData.displayOptions.showShipping && (
                        <TableCell className="text-right">
                          ${section.shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                      )}
                      {mockApprovalData.displayOptions.showTax && (
                        <TableCell className="text-right">
                          ${section.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        ${section.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Grand Total */}
        <Card className="border-2 border-[#319795]">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold">
                  ${(mockApprovalData.grandTotal - mockApprovalData.totalShipping - mockApprovalData.totalTax).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {mockApprovalData.displayOptions.showShipping && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping & Handling</span>
                  <span>${mockApprovalData.totalShipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {mockApprovalData.displayOptions.showTax && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales Tax</span>
                  <span>${mockApprovalData.totalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-[#319795]">
                    ${mockApprovalData.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="customer-name">Your Name *</Label>
              <input
                id="customer-name"
                type="text"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#319795]"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Comments or Questions (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any comments, questions, or changes you'd like to discuss..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Legal Notice */}
            <div className="flex items-start gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                By approving this budget, you acknowledge that you have reviewed all items and costs, 
                and authorize {mockApprovalData.agencyName} to proceed with procurement and installation 
                as outlined. This approval constitutes a binding agreement.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Request Changes
              </Button>
              <Button
                onClick={handleApprove}
                className="flex-1 gap-2 bg-[#319795] hover:bg-[#2c7a7b] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Approve Budget
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-6">
          <p>Powered by Design SaaS</p>
          <p className="mt-1">
            Questions? Contact {mockApprovalData.designerName} at{' '}
            <a href={`mailto:${mockApprovalData.designerEmail}`} className="text-[#319795] hover:underline">
              {mockApprovalData.designerEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}