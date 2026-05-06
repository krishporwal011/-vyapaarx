'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Truck, IndianRupee, ShoppingBag, Clock, Search, Plus, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useInvoices } from '@/hooks/api/useInvoices';
import { useSuppliers, useSupplierAnalytics } from '@/hooks/api/useSuppliers';
import { format, parseISO } from 'date-fns';

const statusMap: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  PAID: { label: 'Received', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', Icon: CheckCircle2 },
  PARTIAL: { label: 'Partial', cls: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', Icon: Truck },
  UNPAID: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', Icon: Clock },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', Icon: XCircle },
};

export default function PurchasesPage() {
  const [search, setSearch] = useState('');
  
  const { data: invoicesData, isLoading: loadingInvoices } = useInvoices({ limit: 100 });
  const { data: suppliersData, isLoading: loadingSuppliers } = useSuppliers({ limit: 100 });
  const { data: supplierAnalytics, isLoading: loadingAnalytics } = useSupplierAnalytics();

  const purchaseInvoices = invoicesData?.data?.filter((inv) => inv.supplierId) || [];
  const totalSpend = purchaseInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingOrdersCount = purchaseInvoices.filter(
    (inv) => inv.paymentStatus === 'UNPAID' || inv.paymentStatus === 'PARTIAL'
  ).length;

  const activeSuppliersCount = supplierAnalytics?.active || suppliersData?.total || 0;

  // Filter purchase orders
  const filteredPO = purchaseInvoices.filter(
    (po) =>
      !search ||
      po.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.supplier?.name.toLowerCase().includes(search.toLowerCase())
  );

  // Compute top suppliers by spend
  const supplierSpendMap: Record<string, { spent: number; orders: number; name: string }> = {};
  purchaseInvoices.forEach((inv) => {
    if (inv.supplier) {
      const sName = inv.supplier.name;
      if (!supplierSpendMap[sName]) {
        supplierSpendMap[sName] = { spent: 0, orders: 0, name: sName };
      }
      supplierSpendMap[sName].spent += inv.totalAmount;
      supplierSpendMap[sName].orders += 1;
    }
  });

  const maxSpend = Math.max(...Object.values(supplierSpendMap).map((s) => s.spent), 1);
  const topSuppliersList = Object.values(supplierSpendMap)
    .sort((a, b) => b.spent - a.spent)
    .map((s) => ({
      ...s,
      fill: Math.round((s.spent / maxSpend) * 100),
    }))
    .slice(0, 4);

  const isLoading = loadingInvoices || loadingSuppliers || loadingAnalytics;

  return (
    <>
      <Topbar title="Purchases" subtitle="Real-time purchase orders and supplier trade logs" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground">Synchronizing supplier purchase ledger...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard label="Total Spend" value={`₹${totalSpend.toLocaleString('en-IN')}`} change="Purchase Ledger" trend="neutral" icon={IndianRupee} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
              <KpiCard label="Purchase Orders" value={String(purchaseInvoices.length)} change="Real POs" trend="neutral" icon={ShoppingBag} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={1} />
              <KpiCard label="Pending Orders" value={String(pendingOrdersCount)} change="Awaiting Action" trend="neutral" icon={Clock} iconBg="bg-rose-500/10" iconColor="text-rose-500" index={2} />
              <KpiCard label="Active Suppliers" value={String(activeSuppliersCount)} change="Verified Suppliers" trend="neutral" icon={Truck} iconBg="bg-teal-500/10" iconColor="text-teal-500" index={3} />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {/* PO Table */}
              <Card className="xl:col-span-2 bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-semibold text-white">Purchase Orders</CardTitle>
                      <CardDescription>Chronological list of supplier transactions</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-8 h-8 w-40 text-xs bg-muted/20 border-border" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredPO.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                      <ShoppingBag className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-xs">No purchase orders recorded yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            {['PO ID', 'Supplier', 'Amount', 'Status', 'Date', ''].map((h) => (
                              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPO.map((p) => {
                            const s = statusMap[p.paymentStatus] || statusMap.UNPAID;
                            return (
                              <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{p.invoiceNumber}</td>
                                <td className="px-4 py-3 font-medium text-foreground">{p.supplier?.name || 'Unknown'}</td>
                                <td className="px-4 py-3 font-bold text-foreground">₹{p.totalAmount.toLocaleString('en-IN')}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.cls}`}>
                                    <s.Icon className="h-2.5 w-2.5" />{s.label}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{format(parseISO(p.createdAt), 'MMM dd, yyyy')}</td>
                                <td className="px-4 py-3">
                                  <Button variant="ghost" size="sm" className="h-6 text-xs text-primary hover:text-primary/80">View</Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Suppliers */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-white">Top Suppliers</CardTitle>
                  <CardDescription>Suppliers by cumulative order values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {topSuppliersList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                      <Truck className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-xs">No suppliers ranked yet</p>
                    </div>
                  ) : (
                    topSuppliersList.map((s) => (
                      <div key={s.name} className="space-y-1.5 text-left">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">{s.name}</span>
                          <span className="text-muted-foreground">{s.orders} orders</span>
                        </div>
                        <Progress value={s.fill} className="h-1.5" />
                        <p className="text-[11px] text-muted-foreground">₹{s.spent.toLocaleString('en-IN')} total</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </>
  );
}
