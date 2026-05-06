'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, IndianRupee, CheckCircle2, Clock, AlertCircle, Send, Download, FileText, Search, Plus } from 'lucide-react';
import { useState } from 'react';

const invoices = [
  { id: 'INV-2026-0491', customer: 'Priya Sharma', gstin: '27AAPFY1234F1Z6', subtotal: 12400, cgst: 354, sgst: 354, igst: 0, total: 13108, status: 'paid', date: 'May 1', due: 'May 15' },
  { id: 'INV-2026-0492', customer: 'Rahul Verma', gstin: '', subtotal: 8750, cgst: 525, sgst: 525, igst: 0, total: 9800, status: 'sent', date: 'May 2', due: 'May 16' },
  { id: 'INV-2026-0493', customer: 'Anjali Mehta', gstin: '24AAPAN1234G1Z5', subtotal: 31200, cgst: 0, sgst: 0, igst: 3744, total: 34944, status: 'overdue', date: 'Apr 20', due: 'May 4' },
  { id: 'INV-2026-0494', customer: 'Suresh Kumar', gstin: '', subtotal: 5600, cgst: 336, sgst: 336, igst: 0, total: 6272, status: 'draft', date: 'May 5', due: 'May 19' },
  { id: 'INV-2026-0495', customer: 'Meena Iyer', gstin: '33AAPMI1234H1Z4', subtotal: 18900, cgst: 0, sgst: 0, igst: 2268, total: 21168, status: 'paid', date: 'Apr 28', due: 'May 12' },
];

const statusMap: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  paid: { label: 'Paid', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', Icon: CheckCircle2 },
  sent: { label: 'Sent', cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', Icon: Send },
  draft: { label: 'Draft', cls: 'bg-muted text-muted-foreground', Icon: FileText },
  overdue: { label: 'Overdue', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', Icon: AlertCircle },
};

export default function GstBillingPage() {
  const [search, setSearch] = useState('');
  const filtered = invoices.filter(i => !search || i.customer.toLowerCase().includes(search.toLowerCase()) || i.id.includes(search));

  return (
    <>
      <Topbar title="GST Billing" subtitle="GST-compliant invoices with CGST / SGST / IGST" action={{ label: 'New Invoice', onClick: () => {} }} />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Invoiced" value="₹3.82L" change="+14%" trend="up" icon={IndianRupee} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Collected" value="₹2.46L" change="+9%" trend="up" icon={CheckCircle2} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={1} />
          <KpiCard label="Pending" value="₹97,272" trend="neutral" icon={Clock} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={2} />
          <KpiCard label="Overdue" value="₹34,944" trend="down" icon={AlertCircle} iconBg="bg-rose-500/10" iconColor="text-rose-500" index={3} />
        </div>

        {/* GST Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'CGST Collected', value: '₹18,540', sub: 'Intra-state sales', color: 'bg-violet-500' },
            { label: 'SGST Collected', value: '₹18,540', sub: 'Intra-state sales', color: 'bg-teal-500' },
            { label: 'IGST Collected', value: '₹12,024', sub: 'Inter-state sales', color: 'bg-amber-500' },
          ].map(g => (
            <Card key={g.label}>
              <CardContent className="p-4">
                <div className={`h-1.5 w-10 rounded-full ${g.color} mb-3`} />
                <p className="text-xs text-muted-foreground mb-1">{g.label}</p>
                <p className="font-display text-xl font-bold text-foreground">{g.value}</p>
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
                <Button size="sm" className="h-8 text-xs brand-gradient text-white"><Plus className="h-3.5 w-3.5" />New</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Invoice No.', 'Customer', 'GSTIN', 'Subtotal', 'CGST', 'SGST', 'IGST', 'Total', 'Status', 'Due', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inv => {
                    const s = statusMap[inv.status];
                    return (
                      <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{inv.id}</td>
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{inv.customer}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{inv.gstin || '—'}</td>
                        <td className="px-4 py-3 text-foreground">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-muted-foreground">{inv.cgst ? `₹${inv.cgst}` : '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{inv.sgst ? `₹${inv.sgst}` : '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{inv.igst ? `₹${inv.igst}` : '—'}</td>
                        <td className="px-4 py-3 font-bold text-foreground">₹{inv.total.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.cls}`}>
                            <s.Icon className="h-2.5 w-2.5" />{s.label}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-xs whitespace-nowrap ${inv.status === 'overdue' ? 'text-rose-500 font-semibold' : 'text-muted-foreground'}`}>{inv.due}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                            {inv.status === 'draft' && <Button variant="ghost" size="icon" className="h-6 w-6"><Send className="h-3 w-3" /></Button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
