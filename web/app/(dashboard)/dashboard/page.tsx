'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, ShoppingCart, Package, Users,
  Receipt, AlertTriangle, ArrowUpRight, ArrowDownRight,
  CheckCircle2, Clock, Truck, IndianRupee, Activity, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAnalyticsOverview, useAnalyticsRevenue } from '@/hooks/api/useAnalytics';
import { useOrders } from '@/hooks/api/useOrders';
import { useProducts, useTopProducts } from '@/hooks/api/useProducts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#6c63ff', '#4ecdc4', '#ffb347', '#ff6b6b', '#a855f7'];

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  delivered: { label: 'Delivered', variant: 'default', icon: CheckCircle2 },
  processing: { label: 'Processing', variant: 'secondary', icon: Activity },
  shipped: { label: 'Shipped', variant: 'outline', icon: Truck },
  pending: { label: 'Pending', variant: 'outline', icon: Clock },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name === 'revenue' ? 'Revenue' : 'Orders'}: {p.name === 'revenue' ? '₹' : ''}{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: overview, isLoading: loadingOverview } = useAnalyticsOverview();
  const { data: revenueDaily, isLoading: loadingRevenue } = useAnalyticsRevenue(7);
  const { data: ordersData, isLoading: loadingOrders } = useOrders(1, 5);
  const { data: productsData, isLoading: loadingProducts } = useProducts(1, 50);
  const { data: topProducts, isLoading: loadingTopProducts } = useTopProducts();

  const recentOrdersList = ordersData?.data || [];
  const lowStockList = (productsData?.data || []).filter((p) => p.stock <= p.lowStockThreshold).slice(0, 5);

  const chartData = revenueDaily?.map((r) => ({
    day: r._id ? format(parseISO(r._id), 'E') : '',
    revenue: Number(r.revenue),
    orders: Number(r.orders),
  })) || [];

  const pieData = topProducts?.map((tp) => ({
    name: tp.name || 'Unknown',
    value: Number(tp.totalSold),
  })) || [];

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Welcome back, Tanya 👋  —  May 6, 2026"
        action={{ label: 'New Order', onClick: () => router.push('/sales/new') }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Revenue" value={loadingOverview ? "..." : `₹${overview?.totalRevenue?.toLocaleString('en-IN') || 0}`} change="+18.4%" trend="up" icon={IndianRupee} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Orders" value={loadingOverview ? "..." : String(overview?.totalOrders || 0)} change="+12.1%" trend="up" icon={ShoppingCart} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={1} />
          <KpiCard label="Products" value={loadingOverview ? "..." : String(overview?.totalProducts || 0)} change="Active" trend="neutral" icon={Package} iconBg="bg-teal-500/10" iconColor="text-teal-500" index={2} />
          <KpiCard label="Customers" value={loadingOverview ? "..." : String(overview?.totalCustomers || 0)} change="Total" trend="neutral" icon={Users} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={3} />
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <p className="text-sm text-muted-foreground flex-1">
              <span className="font-semibold text-amber-500">{overview?.lowStockCount || 0} products</span> are running low on stock
            </p>
            <Button size="sm" variant="ghost" className="h-6 text-xs text-amber-500 hover:bg-amber-500/10">View</Button>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3">
            <Receipt className="h-4 w-4 text-rose-500 shrink-0" />
            <p className="text-sm text-muted-foreground flex-1">
              <span className="font-semibold text-rose-500">{overview?.overdueInvoices || 0} invoices</span> are overdue and need attention
            </p>
            <Button size="sm" variant="ghost" className="h-6 text-xs text-rose-500 hover:bg-rose-500/10">Review</Button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="xl:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </div>
                <Tabs defaultValue="week">
                  <TabsList className="h-7">
                    <TabsTrigger value="week" className="text-xs px-2 h-6">Week</TabsTrigger>
                    <TabsTrigger value="month" className="text-xs px-2 h-6">Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={45} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6c63ff" strokeWidth={2} fill="url(#revGrad)" />
                  <Area type="monotone" dataKey="orders" stroke="#f43f5e" strokeWidth={2} fill="url(#expGrad)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-violet-500" />Revenue
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />Orders
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Top Products</CardTitle>
              <CardDescription>By quantity sold</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTopProducts ? (
                 <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : pieData.length === 0 ? (
                 <div className="text-center py-10 text-muted-foreground text-sm">No sales yet</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={72} paddingAngle={3} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: any) => [`${v}`, 'Sold']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 space-y-1.5">
                    {pieData.map((c, i) => (
                      <div key={c.name} className="flex items-center gap-2 text-xs">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="flex-1 text-muted-foreground truncate">{c.name}</span>
                        <span className="font-semibold text-foreground">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          {/* Recent Orders */}
          <Card className="xl:col-span-3">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary gap-1">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" /></td></tr>
                  ) : recentOrdersList.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No recent orders</td></tr>
                  ) : recentOrdersList.map((o) => {
                    const s = statusConfig[o.status] || { label: o.status, variant: 'outline', icon: Activity };
                    return (
                      <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-mono text-xs font-semibold text-foreground">{o.orderNumber}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{o.customer?.name || 'Unknown'}</td>
                        <td className="px-4 py-3 font-bold text-foreground">₹{o.total.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <Badge variant={s.variant} className="text-[10px] gap-1">
                            <s.icon className="h-2.5 w-2.5" />
                            {s.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Low Stock */}
          <Card className="xl:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
                <Badge variant="destructive" className="text-xs">12 items</Badge>
              </div>
              <CardDescription>Products below threshold</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingProducts ? (
                <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : lowStockList.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">All products are well stocked!</div>
              ) : lowStockList.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground truncate pr-2">{item.name}</span>
                    <span className="text-rose-500 font-bold shrink-0">{item.stock} left</span>
                  </div>
                  <Progress value={(item.stock / Math.max(item.stock, item.lowStockThreshold * 3)) * 100} className="h-1.5 bg-muted [&>div]:bg-rose-500" />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full h-8 text-xs mt-2">
                View all low stock items
              </Button>
            </CardContent>
          </Card>
        </div>

      </main>
    </>
  );
}
