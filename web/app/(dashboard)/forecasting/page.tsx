'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  TrendingUp, AlertTriangle, RefreshCcw, Loader2, ArrowLeft, BarChart2, CheckCircle, HelpCircle, Inbox, HelpCircle as HelpIcon, Calendar, ArrowUpRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import { useAiForecasts } from '@/hooks/api/useAi';

export default function ForecastingPage() {
  const router = useRouter();
  const { data: forecasts, isLoading, isError, refetch } = useAiForecasts();

  const lowStock = forecasts?.lowStockPredictions || [];
  const deadInventory = forecasts?.deadInventory || [];
  const fastMoving = forecasts?.fastMoving || [];

  const handleTriggerReorder = (prodName: string, reorderQty: number) => {
    toast.success(`Purchase Reorder for ${reorderQty} pcs of "${prodName}" triggered successfully!`);
  };

  // Safe SSR chart rendering
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Topbar
        title="Predictive Forecasting"
        subtitle="AI-driven inventory analytics, stock exhaustion warnings, and smart reordering recommendations"
        action={{ label: 'Recalculate Models', onClick: () => { refetch(); toast.success('Forecasting models updated'); }, icon: RefreshCcw }}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p className="text-sm">Running predictive algorithms on stock movement logs...</p>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card className="border-destructive">
            <CardContent className="flex flex-col items-center justify-center py-20 text-destructive">
              <AlertTriangle className="h-8 w-8 mb-4" />
              <p className="text-sm font-semibold">Failed to process forecasting models</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Visual Stock Depletion Velocity Chart */}
            {isMounted && lowStock.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Stock Depletion Velocity Predictions</CardTitle>
                  <CardDescription>Estimated days remaining before stock exhausts based on current sales velocity</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lowStock.slice(0, 8)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="sku" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis label={{ value: 'Days to Exhaust', angle: -90, position: 'insideLeft', offset: -5, fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                      <Legend />
                      <ReferenceLine y={15} stroke="red" strokeDasharray="3 3" label={{ value: 'Critical Limit (15 days)', fill: 'red', fontSize: 10, position: 'top' }} />
                      <Bar dataKey="daysToEmpty" name="Days to Exhaust" fill="rgb(139, 92, 246)" radius={[4, 4, 0, 0]} maxBarSize={45} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Smart Summaries Grids */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* Dead Stock Warning Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-rose-500">
                    <AlertTriangle className="h-4 w-4 animate-pulse" /> Dead Inventory Detections
                  </CardTitle>
                  <CardDescription className="text-[11px]">Products holding capital with zero sales movement</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {deadInventory.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                      <CheckCircle className="h-6 w-6 text-emerald-500 mb-2" />
                      <p className="text-xs">No dead stock detected. All items are moving healthy!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {deadInventory.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                          <div>
                            <p className="text-xs font-semibold text-foreground">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</p>
                          </div>
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-0 font-semibold text-[10px]">
                            {item.currentStock} pcs stalled
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Fast Moving Velocity Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-emerald-500">
                    <TrendingUp className="h-4 w-4" /> Fast-Moving Inventory (Velocity)
                  </CardTitle>
                  <CardDescription className="text-[11px]">SaaS products representing your main income drivers</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {fastMoving.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                      <Inbox className="h-6 w-6 text-muted-foreground/40 mb-2" />
                      <p className="text-xs">Establish more sales to log high velocity drivers.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fastMoving.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                          <div>
                            <p className="text-xs font-semibold text-foreground">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-foreground">{item.quantitySold} sold</span>
                            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Smart Reordering Recommendation Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Stock Exhaustion & Reorder limits</CardTitle>
                <CardDescription>Predictive stock levels and recommended purchase replenishment plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU / Name</TableHead>
                        <TableHead className="text-center">Current Stock</TableHead>
                        <TableHead className="text-center">Min Threshold</TableHead>
                        <TableHead className="text-center">Monthly Sales</TableHead>
                        <TableHead className="text-center">Days to Empty</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStock.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm">{p.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">SKU: {p.sku}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold text-xs">{p.currentStock} pcs</TableCell>
                          <TableCell className="text-center text-xs text-muted-foreground">{p.threshold} pcs</TableCell>
                          <TableCell className="text-center text-xs font-mono">{p.monthlyVelocity.toFixed(1)} sold/mo</TableCell>
                          <TableCell className="text-center">
                            <span className={`text-xs font-semibold ${p.daysToEmpty <= 15 ? 'text-rose-500 font-bold animate-pulse' : p.daysToEmpty <= 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {p.daysToEmpty === 999 ? 'No sales' : `${p.daysToEmpty} days`}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={
                              p.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-600 border-0 font-bold' :
                              p.status === 'WARNING' ? 'bg-amber-500/10 text-amber-600 border-0 font-bold' :
                              'bg-emerald-500/10 text-emerald-600 border-0 font-bold'
                            }>
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {p.recommendedReorder > 0 ? (
                              <Button
                                onClick={() => handleTriggerReorder(p.name, p.recommendedReorder)}
                                size="sm"
                                className="h-8 text-[11px] brand-gradient text-white font-semibold"
                              >
                                Reorder {p.recommendedReorder} pcs
                              </Button>
                            ) : (
                              <span className="text-[11px] text-muted-foreground italic">Optimal</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

      </main>
    </>
  );
}
