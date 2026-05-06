'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Truck, IndianRupee, ShoppingBag, Package, Search, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useState } from 'react';

const purchases = [
  { id: 'PO-10291', supplier: 'Rajesh Textiles', items: 5, amount: 84000, status: 'received', date: 'May 5' },
  { id: 'PO-10292', supplier: 'Mumbai Spice Co.', items: 12, amount: 36500, status: 'pending', date: 'May 5' },
  { id: 'PO-10293', supplier: 'Brass Craft India', items: 8, amount: 112000, status: 'in_transit', date: 'May 4' },
  { id: 'PO-10294', supplier: 'Jute Exports Ltd.', items: 3, amount: 22000, status: 'received', date: 'May 4' },
  { id: 'PO-10295', supplier: 'Silk House Banaras', items: 6, amount: 195000, status: 'pending', date: 'May 3' },
  { id: 'PO-10296', supplier: 'Artisan Collective', items: 10, amount: 67000, status: 'cancelled', date: 'May 2' },
];

const topSuppliers = [
  { name: 'Rajesh Textiles', spent: 840000, orders: 24, fill: 84 },
  { name: 'Silk House Banaras', spent: 620000, orders: 12, fill: 62 },
  { name: 'Brass Craft India', spent: 448000, orders: 18, fill: 45 },
  { name: 'Mumbai Spice Co.', spent: 292000, orders: 30, fill: 29 },
];

const statusMap: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  received: { label: 'Received', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', Icon: CheckCircle2 },
  in_transit: { label: 'In Transit', cls: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', Icon: Truck },
  pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', Icon: Clock },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', Icon: XCircle },
};

export default function PurchasesPage() {
  const [search, setSearch] = useState('');
  const filtered = purchases.filter(p => !search || p.supplier.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search));

  return (
    <>
      <Topbar title="Purchases" subtitle="Manage purchase orders and suppliers" action={{ label: 'New PO', onClick: () => {} }} />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Spend" value="₹22.0L" change="-4.2%" trend="down" icon={IndianRupee} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Purchase Orders" value="148" change="+8" trend="up" icon={ShoppingBag} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={1} />
          <KpiCard label="Pending Orders" value="34" trend="neutral" icon={Clock} iconBg="bg-rose-500/10" iconColor="text-rose-500" index={2} />
          <KpiCard label="Active Suppliers" value="42" change="+3" trend="up" icon={Truck} iconBg="bg-teal-500/10" iconColor="text-teal-500" index={3} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* PO Table */}
          <Card className="xl:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold">Purchase Orders</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 h-8 w-40 text-xs" />
                  </div>
                  <Button size="sm" className="h-8 text-xs brand-gradient text-white"><Plus className="h-3.5 w-3.5" />New PO</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {['PO ID', 'Supplier', 'Items', 'Amount', 'Status', 'Date', ''].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => {
                      const s = statusMap[p.status];
                      return (
                        <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{p.id}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{p.supplier}</td>
                          <td className="px-4 py-3 text-muted-foreground">{p.items}</td>
                          <td className="px-4 py-3 font-bold text-foreground">₹{p.amount.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.cls}`}>
                              <s.Icon className="h-2.5 w-2.5" />{s.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{p.date}</td>
                          <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-6 text-xs">View</Button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top Suppliers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Top Suppliers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {topSuppliers.map((s, i) => (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{s.name}</span>
                    <span className="text-muted-foreground">{s.orders} orders</span>
                  </div>
                  <Progress value={s.fill} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground">₹{s.spent.toLocaleString('en-IN')} total</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
