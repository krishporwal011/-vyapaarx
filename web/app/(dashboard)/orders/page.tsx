'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, CheckCircle2, Clock, Truck, XCircle, ShoppingCart, Activity, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useOrders } from '@/hooks/api/useOrders';

const statusMap: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  delivered: { label: 'Delivered', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', Icon: CheckCircle2 },
  processing: { label: 'Processing', cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', Icon: Activity },
  shipped: { label: 'Shipped', cls: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', Icon: Truck },
  pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', Icon: Clock },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', Icon: XCircle },
  confirmed: { label: 'Confirmed', cls: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', Icon: CheckCircle2 },
};

const paymentMap: Record<string, { label: string; cls: string }> = {
  paid: { label: 'Paid', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  unpaid: { label: 'Unpaid', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  partial: { label: 'Partial', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
};

const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useOrders(page, 50);
  const orders = response?.data || [];

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'All' || o.status === activeTab.toLowerCase();
    const customerName = o.customer?.name || '';
    const matchSearch = customerName.toLowerCase().includes(search.toLowerCase()) || o.orderNumber.includes(search);
    return matchTab && matchSearch;
  });

  return (
    <>
      <Topbar title="Orders" subtitle="Track and manage customer orders" action={{ label: 'New Order', onClick: () => {} }} />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Orders" value={isLoading ? "..." : String(response?.total || 0)} trend="neutral" icon={ShoppingCart} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Pending" value="--" trend="neutral" icon={Clock} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={1} />
          <KpiCard label="Shipped" value="--" trend="neutral" icon={Truck} iconBg="bg-teal-500/10" iconColor="text-teal-500" index={2} />
          <KpiCard label="Delivered" value="--" trend="neutral" icon={CheckCircle2} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={3} />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-base font-semibold flex-1">All Orders</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 h-8 w-48 text-xs" />
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Filter className="h-3.5 w-3.5" />Filter</Button>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {tabs.map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                  {t}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Payment', 'Date', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                        Loading orders...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        No orders found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(o => {
                      const s = statusMap[o.status] || { label: o.status, cls: 'bg-muted text-foreground', Icon: Activity };
                      const p = paymentMap[o.paymentStatus] || { label: o.paymentStatus, cls: 'bg-muted text-foreground' };
                      const itemsCount = o.items ? o.items.length : 0;
                      return (
                        <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{o.orderNumber}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{o.customer?.name || 'Unknown'}</td>
                          <td className="px-4 py-3 text-muted-foreground">{itemsCount}</td>
                          <td className="px-4 py-3 font-bold text-foreground">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.cls}`}>
                              {s.Icon && <s.Icon className="h-2.5 w-2.5" />}{s.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.cls}`}>{p.label}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-6 text-xs">View</Button></td>
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
