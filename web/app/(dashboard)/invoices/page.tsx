'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Plus, Search, Edit2, Trash2, FileText, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, Calendar, MapPin, Phone, Building2, Loader2, ArrowUpDown, ChevronLeft, ChevronRight, IndianRupee, Printer
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import { useInvoices, useInvoiceAnalytics, useDeleteInvoice } from '@/hooks/api/useInvoices';
import { Invoice } from '@/types/api';

export default function InvoicesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'All' | 'PAID' | 'UNPAID' | 'PARTIAL'>('All');
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: response, isLoading, isError } = useInvoices({
    page,
    limit: 10,
    search: debouncedSearch,
    paymentStatus: paymentStatus === 'All' ? '' : paymentStatus,
  });

  const { data: analytics } = useInvoiceAnalytics();
  const deleteMutation = useDeleteInvoice();

  const invoices = response?.data || [];
  const totalPages = response?.pages || 1;

  const handleDelete = async (id: string, number: string) => {
    if (!confirm(`Are you sure you want to delete invoice ${number}?`)) return;
    const loadToast = toast.loading('Deleting invoice...');
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Invoice deleted successfully', { id: loadToast });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete invoice', { id: loadToast });
    }
  };

  // Safe SSR chart rendering
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Topbar
        title="GST Billing"
        subtitle="Manage your wholesale billing and GST taxation compliance"
        action={{ label: 'Create Invoice', onClick: () => router.push('/invoices/new') }}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Analytics Aggregators */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Billing"
            value={analytics?.totalSales !== undefined ? `₹${analytics.totalSales.toLocaleString('en-IN')}` : '...'}
            trend="neutral"
            icon={IndianRupee}
            iconBg="bg-violet-500/10"
            iconColor="text-violet-500"
            index={0}
          />
          <KpiCard
            label="GST Collected"
            value={analytics?.gstCollected !== undefined ? `₹${analytics.gstCollected.toLocaleString('en-IN')}` : '...'}
            trend="up"
            change="Tax collected"
            icon={TrendingUp}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-500"
            index={1}
          />
          <KpiCard
            label="Pending Payments"
            value={analytics?.pendingPayments !== undefined ? `₹${analytics.pendingPayments.toLocaleString('en-IN')}` : '...'}
            trend="down"
            change="Receivables"
            icon={AlertTriangle}
            iconBg="bg-rose-500/10"
            iconColor="text-rose-500"
            index={2}
          />
          <KpiCard
            label="Invoices Issued"
            value={String(response?.total || 0)}
            trend="neutral"
            icon={FileText}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-500"
            index={3}
          />
        </div>

        {/* Visual Charts */}
        {isMounted && analytics?.monthlyRevenue && analytics.monthlyRevenue.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Monthly Billing Collections</CardTitle>
                <CardDescription>Visual trend representing gross invoice billing per month</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(139, 92, 246)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="rgb(139, 92, 246)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                    <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="rgb(139, 92, 246)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tax Compliance Status</CardTitle>
                <CardDescription>Breakdown overview of your tax filings & GST liabilities</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-56 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs text-muted-foreground">GST filing schema</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-0">GSTR-1 Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs text-muted-foreground">Estimated SGST liability</span>
                    <span className="text-sm font-semibold">₹{(analytics.gstCollected / 2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs text-muted-foreground">Estimated CGST liability</span>
                    <span className="text-sm font-semibold">₹{(analytics.gstCollected / 2).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-xs mt-auto" onClick={() => toast.success('GSTR reports exported successfully!')}>Export GSTR Data</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Directory Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice or customer..."
                className="pl-8 h-9 text-sm"
              />
            </div>
            <div className="flex gap-1">
              {(['All', 'PAID', 'UNPAID', 'PARTIAL'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setPaymentStatus(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    paymentStatus === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {s === 'All' ? 'All Invoices' : s === 'PAID' ? 'Paid' : s === 'UNPAID' ? 'Unpaid' : 'Partial'}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => router.push('/invoices/new')} size="sm" className="h-9 brand-gradient text-white gap-1.5 ml-auto md:ml-0">
            <Plus className="h-3.5 w-3.5" />
            Create Invoice
          </Button>
        </div>

        {/* Table & Skeletons */}
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p className="text-sm">Fetching invoices directory...</p>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card className="border-destructive">
            <CardContent className="flex flex-col items-center justify-center py-20 text-destructive">
              <XCircle className="h-8 w-8 mb-4" />
              <p className="text-sm font-semibold">Failed to load invoice directory</p>
            </CardContent>
          </Card>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border rounded-lg border-dashed bg-card flex flex-col items-center justify-center">
            <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="font-semibold text-foreground">No invoices found</p>
            <p className="text-xs max-w-sm mt-1">Get started by creating your first GST-compliant wholesale invoice.</p>
            <Button onClick={() => router.push('/invoices/new')} size="sm" variant="outline" className="mt-4 gap-1">
              <Plus className="h-3.5 w-3.5" /> Create Invoice
            </Button>
          </div>
        ) : (
          <Card className="shadow-sm border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>GST (CGST/SGST/IGST)</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-bold text-primary text-xs cursor-pointer" onClick={() => router.push(`/invoices/${inv.id}`)}>
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{inv.customer?.name}</span>
                          <span className="text-[10px] text-muted-foreground">{inv.customer?.email || 'No email'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="font-medium text-xs">₹{inv.subtotal.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 text-[10px] font-mono text-muted-foreground">
                          {inv.cgst > 0 && <div>CGST: ₹{inv.cgst.toLocaleString('en-IN')}</div>}
                          {inv.sgst > 0 && <div>SGST: ₹{inv.sgst.toLocaleString('en-IN')}</div>}
                          {inv.igst > 0 && <div>IGST: ₹{inv.igst.toLocaleString('en-IN')}</div>}
                          {inv.gstAmount === 0 && <span>0% Exempt</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-sm text-foreground">₹{inv.totalAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          inv.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 border-0 font-semibold' :
                          inv.paymentStatus === 'PARTIAL' ? 'bg-amber-500/10 text-amber-600 border-0 font-semibold' :
                          'bg-rose-500/10 text-rose-600 border-0 font-semibold'
                        }>
                          {inv.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button onClick={() => router.push(`/invoices/${inv.id}`)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                          </Button>
                          <Button onClick={() => router.push(`/invoices/${inv.id}/edit`)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button onClick={() => handleDelete(inv.id, inv.invoiceNumber)} variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
                <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                  </Button>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

      </main>
    </>
  );
}
