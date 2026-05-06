'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Package } from 'lucide-react';

const monthlyRevenue = [
  { month: 'Jan', revenue: 280000, profit: 98000 },
  { month: 'Feb', revenue: 310000, profit: 116250 },
  { month: 'Mar', revenue: 275000, profit: 96250 },
  { month: 'Apr', revenue: 390000, profit: 156000 },
  { month: 'May', revenue: 458000, profit: 190875 },
];

const ordersByStatus = [
  { month: 'Jan', delivered: 100, pending: 15, cancelled: 9 },
  { month: 'Feb', delivered: 118, pending: 12, cancelled: 8 },
  { month: 'Mar', delivered: 95, pending: 10, cancelled: 7 },
  { month: 'Apr', delivered: 145, pending: 14, cancelled: 8 },
  { month: 'May', delivered: 172, pending: 18, cancelled: 6 },
];

const categoryShare = [
  { name: 'Apparel', value: 42 },
  { name: 'Decor', value: 22 },
  { name: 'Food', value: 19 },
  { name: 'Accessories', value: 11 },
  { name: 'Art', value: 6 },
];

const COLORS = ['#6c63ff', '#4ecdc4', '#ffb347', '#ff6b6b', '#a855f7'];

const topProducts = [
  { name: 'Banarasi Silk Saree', revenue: 432000 },
  { name: 'Cotton Kurta Set', revenue: 284000 },
  { name: 'Brass Ganesha Idol', revenue: 228000 },
  { name: 'Organic Spice Hamper', revenue: 94000 },
  { name: 'Jute Bag Pack', revenue: 78400 },
];

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
  return (
    <>
      <Topbar title="Analytics" subtitle="Business insights and performance metrics" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Revenue (May)" value="₹4,58,000" change="+17.4%" trend="up" icon={IndianRupee} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Orders (May)" value="196" change="+17.4%" trend="up" icon={ShoppingCart} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={1} />
          <KpiCard label="Avg Order Value" value="₹2,337" change="+2.1%" trend="up" icon={TrendingUp} iconBg="bg-teal-500/10" iconColor="text-teal-500" index={2} />
          <KpiCard label="Return Rate" value="2.4%" change="-0.8%" trend="up" icon={TrendingDown} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={3} />
        </div>

        {/* Revenue + Profit Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue & Profit Trend</CardTitle>
            <CardDescription>5-month overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.25} /><stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6c63ff" strokeWidth={2} fill="url(#revG)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#22c55e" strokeWidth={2} fill="url(#profG)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-1">
              {[['#6c63ff', 'Revenue'], ['#22c55e', 'Profit']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Orders Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Orders Breakdown</CardTitle>
              <CardDescription>By status per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ordersByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="delivered" name="Delivered" fill="#22c55e" radius={[3, 3, 0, 0]} stackId="a" />
                  <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[3, 3, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-3 mt-2">
                {[['#22c55e', 'Delivered'], ['#f59e0b', 'Pending'], ['#ef4444', 'Cancelled']].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="h-2 w-2 rounded-full" style={{ background: c }} />{l}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Category Distribution</CardTitle>
              <CardDescription>Revenue share by category</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-6 items-center">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={categoryShare} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                    {categoryShare.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {categoryShare.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                    <span className="flex-1 text-muted-foreground">{c.name}</span>
                    <span className="font-bold text-foreground">{c.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Products by Revenue</CardTitle>
            <CardDescription>This month's best performers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={140} />
                <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#6c63ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </main>
    </>
  );
}
