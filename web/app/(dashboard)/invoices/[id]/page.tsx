'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Printer, ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle, Building2, MapPin, Phone, Mail, FileText
} from 'lucide-react';

import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import { useInvoice, useDeleteInvoice } from '@/hooks/api/useInvoices';

export default function InvoiceDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: invoice, isLoading, isError } = useInvoice(id);
  const deleteMutation = useDeleteInvoice();

  const handleDelete = async () => {
    if (!confirm('Are you absolutely sure you want to delete this invoice?')) return;
    const loadToast = toast.loading('Deleting invoice...');
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Invoice deleted successfully', { id: loadToast });
      router.push('/invoices');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete invoice', { id: loadToast });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="text-sm">Retrieving invoice ledger...</p>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-destructive">
        <XCircle className="h-8 w-8 mb-4" />
        <p className="text-sm font-semibold">Failed to load invoice details</p>
        <Button onClick={() => router.push('/invoices')} className="mt-4" variant="outline">Back to Directory</Button>
      </div>
    );
  }

  return (
    <>
      {/* Hide controls on Print */}
      <div className="print:hidden">
        <Topbar
          title={`Invoice ${invoice.invoiceNumber}`}
          subtitle="View and print GST tax invoice records"
          action={{ label: 'Print Invoice', onClick: handlePrint, icon: Printer }}
        />
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:overflow-visible">
        
        {/* Print-friendly controls header */}
        <div className="flex justify-between items-center print:hidden border-b pb-4">
          <Button onClick={() => router.push('/invoices')} variant="outline" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to List
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/invoices/${id}/edit`)} variant="outline" size="sm" className="text-xs">
              Edit Invoice
            </Button>
            <Button onClick={handleDelete} variant="destructive" size="sm" className="text-xs">
              Delete Record
            </Button>
            <Button onClick={handlePrint} size="sm" className="brand-gradient text-white text-xs gap-1">
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <Card className="max-w-4xl mx-auto shadow-md print:shadow-none print:border-0 print:max-w-full">
          <CardContent className="p-8 space-y-8 print:p-0">
            
            {/* Seller & Invoice Title Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold font-display text-primary uppercase tracking-wide">Vyapaar X</h1>
                <p className="text-xs text-muted-foreground mt-1">Wholesale & Supply Chain Solutions</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <MapPin className="h-3 w-3" /> Mumbai, Maharashtra, India
                </div>
              </div>
              <div className="text-left md:text-right">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold tracking-widest text-xs py-1 px-3 mb-2">TAX INVOICE</Badge>
                <p className="text-sm font-semibold text-foreground">Invoice: <span className="font-mono text-primary">{invoice.invoiceNumber}</span></p>
                <p className="text-xs text-muted-foreground">Date: {new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {invoice.dueDate && (
                  <p className="text-xs text-muted-foreground">Due Date: {new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                )}
              </div>
            </div>

            {/* Buyer vs Consignee Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-6">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Billed To (Buyer)</p>
                <p className="text-base font-bold text-foreground">{invoice.customer?.name}</p>
                <div className="space-y-1 mt-2 text-xs text-muted-foreground">
                  {invoice.customer?.email && <p className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {invoice.customer.email}</p>}
                  <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> State: {invoice.customer?.state || 'Maharashtra'}</p>
                </div>
              </div>
              {invoice.supplier && (
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Supplied From (Vendor)</p>
                  <p className="text-base font-bold text-foreground">{invoice.supplier.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Code: <span className="font-mono">{invoice.supplier.supplierCode}</span></p>
                </div>
              )}
            </div>

            {/* Products Table with HSN & GST */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>SKU / Name</TableHead>
                    <TableHead className="text-center">HSN</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-center">Disc</TableHead>
                    <TableHead className="text-center">GST Rate</TableHead>
                    <TableHead className="text-right">Total (Inc. GST)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items?.map((item) => (
                    <TableRow key={item.id} className="border-b last:border-0 hover:bg-transparent">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{item.product?.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">SKU: {item.product?.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">{item.hsnCode || 'N/A'}</TableCell>
                      <TableCell className="text-right text-xs">₹{item.price.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-center text-xs">{item.quantity}</TableCell>
                      <TableCell className="text-center text-xs">{item.discount}%</TableCell>
                      <TableCell className="text-center text-xs font-mono">{item.gstRate}%</TableCell>
                      <TableCell className="text-right font-bold text-xs">₹{item.total.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals & Tax Breakdowns */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch pt-4 gap-6">
              <div className="max-w-md space-y-2">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Internal Notes & Terms</p>
                <p className="text-xs text-muted-foreground italic">{invoice.notes || 'No terms or conditions added to this invoice.'}</p>
                
                {invoice.paymentStatus === 'PAID' && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-500/10 p-2 rounded-md border-0 w-max mt-4 animate-fade-in">
                    <CheckCircle className="h-4 w-4" /> Paid in Full via {invoice.paymentMethod || 'CASH'}
                  </div>
                )}
              </div>
              <div className="w-full md:w-80 space-y-2 text-right">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Gross Subtotal</span>
                  <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground border-b pb-2">
                  <span>Gross GST</span>
                  <span>₹{invoice.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                {invoice.cgst > 0 && (
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>CGST (9%)</span>
                    <span>₹{invoice.cgst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {invoice.sgst > 0 && (
                  <div className="flex justify-between text-[11px] text-muted-foreground border-b pb-2">
                    <span>SGST (9%)</span>
                    <span>₹{invoice.sgst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {invoice.igst > 0 && (
                  <div className="flex justify-between text-[11px] text-muted-foreground border-b pb-2">
                    <span>IGST (18%)</span>
                    <span>₹{invoice.igst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-primary pt-1">
                  <span>Grand Total</span>
                  <span className="font-display">₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer stamp placeholder */}
            <div className="hidden print:flex flex-col items-end pt-12 text-xs text-muted-foreground">
              <div className="w-48 border-t border-muted-foreground/30 pt-1 text-center font-semibold">Authorized Signatory</div>
              <p className="text-[10px] text-center w-48 mt-1">Thank you for your business!</p>
            </div>

          </CardContent>
        </Card>

      </main>

      {/* Global CSS for Print-friendliness */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          main, main * {
            visibility: visible;
          }
          main {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
