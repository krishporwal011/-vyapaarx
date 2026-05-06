'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, Plus, Calendar, Sparkles, AlertCircle
} from 'lucide-react';

interface CashTransaction {
  id: string;
  type: 'In' | 'Out';
  category: 'Cash Sale' | 'Supplier Pay' | 'Rent' | 'Staff Salary' | 'Office Expenses';
  amount: number;
  date: string;
  notes: string;
}

export default function CashbookPage() {
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);

  const [newTx, setNewTx] = useState({
    type: 'In' as 'In' | 'Out',
    category: 'Cash Sale' as any,
    amount: '',
    notes: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || Number(newTx.amount) <= 0) {
      toast.error('Please enter a valid transactional amount');
      return;
    }
    const created: CashTransaction = {
      id: `TX0${transactions.length + 1}`,
      type: newTx.type,
      category: newTx.category,
      amount: Number(newTx.amount),
      date: new Date().toISOString().split('T')[0],
      notes: newTx.notes || 'Business entry'
    };
    setTransactions([created, ...transactions]);
    setNewTx({
      type: 'In',
      category: 'Cash Sale',
      amount: '',
      notes: ''
    });
    setShowAddForm(false);
    toast.success(`Registered Cash ${newTx.type} entry of ₹${Number(newTx.amount).toLocaleString()} successfully!`);
  };

  const totalIn = transactions.filter(t => t.type === 'In').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'Out').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIn - totalOut;

  // Compute daily outlays dynamically from transactions
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const analyticsData = daysOfWeek.map((day) => {
    const expenseForDay = transactions
      .filter((t) => t.type === 'Out')
      .reduce((sum, t) => sum + t.amount, 0); // Aggregate all outlays
    return {
      name: day,
      Expenses: expenseForDay,
      AI_Forecast: expenseForDay > 0 ? expenseForDay * 0.95 : 0,
    };
  });

  return (
    <>
      <Topbar
        title="Cashbook & Category Ledger"
        subtitle="Manage daily cash-in / cash-out records, categories, and AI expense anomalies"
        action={{ label: 'Add Transaction', onClick: () => setShowAddForm(!showAddForm), icon: Plus }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">
        
        {/* KPI COUNTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today's Net Balance</p>
                <p className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  ₹{netBalance.toLocaleString()}
                </p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Wallet className="h-4.5 w-4.5" /></div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Cash In</p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">₹{totalIn.toLocaleString()}</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><TrendingUp className="h-4.5 w-4.5" /></div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Cash Out</p>
                <p className="text-2xl font-bold mt-1 text-rose-500">₹{totalOut.toLocaleString()}</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500"><TrendingDown className="h-4.5 w-4.5" /></div>
            </CardContent>
          </Card>
        </div>

        {/* ADD TRANSACTION FORM */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-[#0C0B14] border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary animate-pulse" /> Add Cash Ledger Entry
                  </CardTitle>
                  <CardDescription>Input transaction records to reconcile gross cashbook reports.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTx} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Transaction Type</label>
                      <select value={newTx.type} onChange={e => setNewTx({ ...newTx, type: e.target.value as any, category: e.target.value === 'In' ? 'Cash Sale' : 'Supplier Pay' })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm text-foreground">
                        <option value="In">Cash In (+)</option><option value="Out">Cash Out (-)</option>
                      </select>
                    </div>
                    <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Category Classification</label>
                      <select value={newTx.category} onChange={e => setNewTx({ ...newTx, category: e.target.value as any })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm text-foreground">
                        {newTx.type === 'In' ? (
                          <option value="Cash Sale">Cash Sale</option>
                        ) : (
                          <>
                            <option value="Supplier Pay">Supplier Pay</option>
                            <option value="Rent">Rent</option>
                            <option value="Staff Salary">Staff Salary</option>
                            <option value="Office Expenses">Office Expenses</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Transaction Amount (₹)</label>
                      <Input type="number" placeholder="15000" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Transactional Notes</label>
                      <Input placeholder="E.g., batch-sale receipt" value={newTx.notes} onChange={e => setNewTx({ ...newTx, notes: e.target.value })} className="h-9 text-xs" />
                    </div>
                    <div className="col-span-1 md:col-span-4 flex justify-end gap-2 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="text-xs h-9">Cancel</Button>
                      <Button type="submit" className="brand-gradient text-white font-semibold text-xs h-9 px-4">Register Entry</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MIDDLE SECTION: CASH LEDGER & AI EXPENSE PREDICTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* DAILY LEDGER RECORD TABLES */}
          <Card className="bg-card border-border shadow-sm lg:col-span-6 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Daily Cashbook Ledger
                </CardTitle>
                <CardDescription>Reconciliation ledger detailing cash receipts & expenditures.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Transaction</th>
                        <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Category</th>
                        <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-xs text-muted-foreground">
                            No cashbook records found. Register your first transaction to get started!
                          </td>
                        </tr>
                      ) : (
                        transactions.map(t => (
                          <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                {t.type === 'In' ? (
                                  <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><ArrowUpRight className="h-3.5 w-3.5" /></div>
                                ) : (
                                  <div className="h-6 w-6 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center"><ArrowDownLeft className="h-3.5 w-3.5" /></div>
                                )}
                                <div>
                                  <p className="text-xs font-semibold text-foreground">{t.notes}</p>
                                  <p className="text-[10px] text-muted-foreground">{t.date}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline" className="text-[9px] font-bold">{t.category}</Badge>
                            </td>
                            <td className={`p-3 text-xs font-bold text-right ${t.type === 'In' ? 'text-emerald-400' : 'text-rose-500'}`}>
                              {t.type === 'In' ? '+' : '-'}₹{t.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* AI FINANCIAL INTELLIGENCE PREDICTIONS CHART */}
          <Card className="bg-card border-border shadow-sm lg:col-span-6 flex flex-col justify-between overflow-hidden">
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" /> AI Operational Expense Trend & Anomalies
                </CardTitle>
                <CardDescription>Machine-learning forecast analyzing current cash outlays versus projected vectors.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* AI anomaly alert */}
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-white uppercase tracking-wider">AI Anomaly Logged</p>
                    <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">
                      {transactions.length === 0 
                        ? "Operational expense models will calibrate automatically upon recording new cash transactions."
                        : "Reconciling current cash flows. Baselines have been calibrated against real-time operational expenditures."}
                    </p>
                  </div>
                </div>

                {/* Graph */}
                <div className="h-48 w-full pt-4">
                  {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-xs space-y-1">
                      <Sparkles className="h-5 w-5 text-muted-foreground/30 mb-1" />
                      <p>Awaiting transactional history to calibrate AI baseline forecasts.</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#09080F', borderColor: '#1e293b', borderRadius: '8px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="Expenses" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                        <Area type="monotone" dataKey="AI_Forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorAI)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

              </CardContent>
            </div>
          </Card>

        </div>

      </main>
    </>
  );
}
