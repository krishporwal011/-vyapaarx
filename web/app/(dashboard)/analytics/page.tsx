'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Loader2, Package } from 'lucide-react';
import { useAnalyticsOverview, useAnalyticsRevenue } from '@/hooks/api/useAnalytics';
import { useProducts, useTopProducts } from '@/hooks/api/useProducts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#6c63ff', '#4ecdc4', '#ffb347', '#ff6b6b', '#a855f7'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.name.toLowerCase().includes('revenue') || p.name.toLowerCase().includes('profit') ? `₹${Number(p.value).toLocaleString('en-IN')}` : p.value}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: overview, isLoading: loadingOverview } = useAnalyticsOverview();
  const { data: revenueDaily, isLoading: loadingRevenue } = useAnalyticsRevenue(30);
  const { data: productsData, isLoading: loadingProducts } = useProducts(1, 100);
  const { data: topProducts, isLoading: loadingTopProducts } = useTopProducts();

  const totalRevenue = overview?.totalRevenue || 0;
  const totalOrders = overview?.totalOrders || 0;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockCount = overview?.lowStockCount || 0;

  // Real revenue trends
  const chartData = revenueDaily?.map((r) => ({
    month: r._id ? format(parseISO(r._id), 'MMM dd') : '',
    revenue: Number(r.revenue || 0),
    profit: Number(r.revenue || 0) * 0.35, // 35% estimated average business margin
  })) || [];

  // Real top products
  const topProductsData = topProducts?.map((tp) => ({
    name: tp.name || 'Unknown Item',
    revenue: Number(tp.revenue || 0),
  })) || [];

  // Real category breakdown computed from products
  const products = productsData?.data || [];
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    if (p.category) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
  });
  const totalProductsCount = products.length;
  const categoryShare = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    value: totalProductsCount > 0 ? Math.round((count / totalProductsCount) * 100) : 0,
  })).slice(0, 5);

  const isLoading = loadingOverview || loadingRevenue || loadingProducts || loadingTopProducts;

  return (
    <>
      <Topbar title="Analytics" subtitle="Real-time business insights from your PostgreSQL ledger" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground">Aggregating live business ledger...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} change="Live Ledger" trend="neutral" icon={IndianRupee} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
              <KpiCard label="Orders Filled" value={String(totalOrders)} change="Live Orders" trend="neutral" icon={ShoppingCart} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={1} />
              <KpiCard label="Avg Order Value" value={`₹${aov.toLocaleString('en-IN')}`} change="AOV" trend="neutral" icon={TrendingUp} iconBg="bg-teal-500/10" iconColor="text-teal-500" index={2} />
              <KpiCard label="Low Stock Alert" value={String(lowStockCount)} change="Replenish Needed" trend="neutral" icon={Package} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={3} />
            </div>

            {/* Revenue & Profit Trend */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-white">Revenue & Profit Trend</CardTitle>
                <CardDescription>Daily ledger activity (30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-xs text-muted-foreground">No sales orders recorded yet</p>
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="profG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} width={60} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6c63ff" strokeWidth={2} fill="url(#revG)" />
                        <Area type="monotone" dataKey="profit" name="Profit" stroke="#22c55e" strokeWidth={2} fill="url(#profG)" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-2">
                      {[['#6c63ff', 'Revenue'], ['#22c55e', 'Profit']].map(([c, l]) => (
                        <div key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="h-2 w-2 rounded-full" style={{ background: c }} />
                          {l}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {/* Category Breakdown */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-white">Category Distribution</CardTitle>
                  <CardDescription>Product inventory catalog weight</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-6 items-center">
                  {categoryShare.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center w-full">
                      <p className="text-xs text-muted-foreground">No active products with categories</p>
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="50%" height={180}>
                        <PieChart>
                          <Pie data={categoryShare} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                            {categoryShare.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 flex-1">
                        {categoryShare.map((c, i) => (
                          <div key={c.name} className="flex items-center gap-2 text-xs">
                            <div className="h-2 w-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="flex-1 text-muted-foreground">{c.name}</span>
                            <span className="font-bold text-foreground">{c.value}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-white">Top Products by Revenue</CardTitle>
                  <CardDescription>Active ledger contributors</CardDescription>
                </CardHeader>
                <CardContent>
                  {topProductsData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center w-full">
                      <p className="text-xs text-muted-foreground">No product transactions recorded</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={topProductsData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={100} />
                        <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="revenue" fill="#6c63ff" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
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
