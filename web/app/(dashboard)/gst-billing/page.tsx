'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Receipt, IndianRupee, CheckCircle2, Clock, AlertCircle, Send, Download, FileText, Search, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useInvoices, useInvoiceAnalytics } from '@/hooks/api/useInvoices';
import { format, parseISO } from 'date-fns';

const statusMap: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  PAID: { label: 'Paid', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', Icon: CheckCircle2 },
  PARTIAL: { label: 'Partial', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', Icon: Clock },
  UNPAID: { label: 'Unpaid', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', Icon: AlertCircle },
};

export default function GstBillingPage() {
  const [search, setSearch] = useState('');
  
  const { data: response, isLoading } = useInvoices({ page: 1, limit: 100 });
  const { data: analytics, isLoading: loadingAnalytics } = useInvoiceAnalytics();

  const invoicesList = response?.data || [];
  const filtered = invoicesList.filter(
    (i) =>
      !search ||
      i.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalBilled = analytics?.totalSales || 0;
  const pending = analytics?.pendingPayments || 0;
  const collected = totalBilled - pending;
  const gstCollected = analytics?.gstCollected || 0;

  return (
    <>
      <Topbar title="GST Billing" subtitle="GST-compliant invoices with CGST / SGST / IGST" action={{ label: 'New Invoice', onClick: () => {} }} />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Invoiced" value={loadingAnalytics ? "..." : `₹${totalBilled.toLocaleString('en-IN')}`} trend="neutral" icon={IndianRupee} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Collected" value={loadingAnalytics ? "..." : `₹${collected.toLocaleString('en-IN')}`} trend="neutral" icon={CheckCircle2} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={1} />
          <KpiCard label="Pending" value={loadingAnalytics ? "..." : `₹${pending.toLocaleString('en-IN')}`} trend="neutral" icon={Clock} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={2} />
          <KpiCard label="GST Collected" value={loadingAnalytics ? "..." : `₹${gstCollected.toLocaleString('en-IN')}`} trend="neutral" icon={AlertCircle} iconBg="bg-rose-500/10" iconColor="text-rose-500" index={3} />
        </div>

        {/* GST Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'CGST Collected', value: `₹${(gstCollected / 2).toLocaleString('en-IN')}`, sub: 'Intra-state sales', color: 'bg-violet-500' },
            { label: 'SGST Collected', value: `₹${(gstCollected / 2).toLocaleString('en-IN')}`, sub: 'Intra-state sales', color: 'bg-teal-500' },
            { label: 'IGST Collected', value: `₹${(0).toLocaleString('en-IN')}`, sub: 'Inter-state sales', color: 'bg-amber-500' },
          ].map(g => (
            <Card key={g.label}>
              <CardContent className="p-4">
                <div className={`h-1.5 w-10 rounded-full ${g.color} mb-3`} />
                <p className="text-xs text-muted-foreground mb-1">{g.label}</p>
                <p className="font-display text-xl font-bold text-foreground">{loadingAnalytics ? "..." : g.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{g.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invoice Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base font-semibold">Invoices</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 h-8 w-40 text-xs" />
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Download className="h-3.5 w-3.5" />Export</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Invoice No.', 'Customer', 'GSTIN', 'Total', 'Tax Amount', 'Status', 'Due', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground text-xs">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                        Synchronizing real-time GST invoices...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-xs">
                        No invoices registered yet. Create your first invoice to initialize GST billing!
                      </td>
                    </tr>
                  ) : (
                    filtered.map(inv => {
                      const s = statusMap[inv.paymentStatus] || statusMap['UNPAID'];
                      return (
                        <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                           <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{inv.invoiceNumber}</td>
                           <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{inv.customer?.name || 'Walk-in Customer'}</td>
                           <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{inv.customer?.gstin || '—'}</td>
                           <td className="px-4 py-3 font-bold text-foreground">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                           <td className="px-4 py-3 text-muted-foreground">₹{inv.gstAmount.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.cls}`}>
                              <s.Icon className="h-2.5 w-2.5" />{s.label}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-xs whitespace-nowrap text-muted-foreground`}>
                            {inv.dueDate ? format(parseISO(inv.dueDate), 'MMM dd, yyyy') : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
