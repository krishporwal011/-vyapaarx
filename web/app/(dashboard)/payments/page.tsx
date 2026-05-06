'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard, QrCode, ArrowUpDown, Search, FileText, Check, AlertCircle, RefreshCw, Landmark, ExternalLink
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  upiId: string;
  razorpayId: string;
  invoiceId: string;
  payerName: string;
  settlementStatus: 'SETTLED' | 'UNSETTLED';
  createdAt: string;
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-9021',
      amount: 45000,
      status: 'SUCCESS',
      upiId: 'karan@okhdfcbank',
      razorpayId: 'pay_Nod123XyZ',
      invoiceId: 'INV-2026-0003',
      payerName: 'Karan Mehta Co.',
      settlementStatus: 'SETTLED',
      createdAt: '2026-05-06 10:30'
    },
    {
      id: 'TXN-9022',
      amount: 112000,
      status: 'PENDING',
      upiId: 'tanya@okaxis',
      razorpayId: 'pay_Ope456AbC',
      invoiceId: 'INV-2026-0004',
      payerName: 'Tanya Enterprises',
      settlementStatus: 'UNSETTLED',
      createdAt: '2026-05-06 11:15'
    },
    {
      id: 'TXN-9023',
      amount: 8500,
      status: 'FAILED',
      upiId: 'rohan@okicici',
      razorpayId: 'pay_Fail789Qwe',
      invoiceId: 'INV-2026-0005',
      payerName: 'Rohan Sharma',
      settlementStatus: 'UNSETTLED',
      createdAt: '2026-05-05 18:45'
    }
  ]);

  const [qrAmount, setQrAmount] = useState('5000');
  const [payerNameInput, setPayerNameInput] = useState('Walk-In Client');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [generatedQr, setGeneratedQr] = useState<string | null>(null);

  // Search/Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');

  const handleGenerateQr = () => {
    if (!qrAmount || isNaN(Number(qrAmount)) || Number(qrAmount) <= 0) {
      toast.error('Please enter a valid billing amount');
      return;
    }
    setIsGeneratingQr(true);
    setGeneratedQr(null);
    setTimeout(() => {
      // Dynamic simulated UPI deep-link QR code payload
      const upiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=vyapaarx@okaxis&pn=VyapaarX%20SME&am=${qrAmount}&cu=INR`;
      setGeneratedQr(upiUrl);
      setIsGeneratingQr(false);
      toast.success('Dynamic UPI billing QR code generated successfully!');
    }, 1000);
  };

  const handleCreateMockTransaction = () => {
    if (!qrAmount) return;
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: Number(qrAmount),
      status: 'SUCCESS',
      upiId: 'client@okupi',
      razorpayId: `pay_${Math.random().toString(36).substring(2, 11)}`,
      invoiceId: `INV-2026-000${transactions.length + 3}`,
      payerName: payerNameInput || 'Walk-In Client',
      settlementStatus: 'SETTLED',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setTransactions([newTxn, ...transactions]);
    toast.success('Transaction logged & settled instantly!');
  };

  const handleExportCSV = () => {
    toast.success('Transaction ledger exported as CSV!');
  };

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.payerName.toLowerCase().includes(search.toLowerCase()) ||
                          t.id.toLowerCase().includes(search.toLowerCase()) ||
                          t.invoiceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Topbar
        title="UPI & Payments Center"
        subtitle="Manage secure Indian fintech integrations, dynamic UPI QR codes, and Razorpay settlements"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* TOP METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border shadow-sm p-4 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5 text-primary" /> Net Settlements
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-2">₹1,57,000</h3>
            </div>
            <p className="text-[9px] text-emerald-400 font-semibold mt-1">100% processed payouts</p>
          </Card>

          <Card className="bg-card border-border shadow-sm p-4 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-primary" /> Active UPI QR ID
              </p>
              <h3 className="text-lg font-bold text-foreground mt-2.5 truncate">vyapaarx@okaxis</h3>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1">Ready for point-of-sale scanning</p>
          </Card>

          <Card className="bg-card border-border shadow-sm p-4 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-primary" /> Razorpay Mid Code
              </p>
              <h3 className="text-lg font-bold text-foreground mt-2.5">MID-2026-XP</h3>
            </div>
            <p className="text-[9px] text-emerald-400 font-semibold mt-1">Gateway API: Live</p>
          </Card>

          <Card className="bg-card border-border shadow-sm p-4 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 text-primary animate-pulse" /> Pending Clearings
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-2">₹1,12,000</h3>
            </div>
            <p className="text-[9px] text-amber-500 font-semibold mt-1">Processing via HDFC settlement</p>
          </Card>
        </div>

        {/* MIDDLE SECTION: UPI QR GENERATOR & QUICK BILLING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* DYNAMIC QR BILLING FORM */}
          <Card className="bg-card border-border shadow-sm lg:col-span-5 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-primary" /> Dynamic UPI QR Generator
                </CardTitle>
                <CardDescription>Generate an instant QR code with custom billing values for retail point-of-sale collections.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Payer Name</label>
                  <Input
                    placeholder="E.g., Karan Mehta Co."
                    value={payerNameInput}
                    onChange={e => setPayerNameInput(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Billing Amount (INR)</label>
                  <Input
                    type="number"
                    placeholder="E.g., 5000"
                    value={qrAmount}
                    onChange={e => setQrAmount(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    onClick={handleGenerateQr}
                    disabled={isGeneratingQr}
                    className="brand-gradient text-white font-semibold text-xs h-9 flex-1"
                  >
                    {isGeneratingQr ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Calculating taxes...
                      </>
                    ) : (
                      <>
                        <QrCode className="h-3.5 w-3.5 mr-1.5" /> Generate UPI QR
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* QR IMAGE OUTPUT RENDERS */}
          <Card className="bg-[#050408] border-border shadow-sm lg:col-span-7 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Live Dynamic POS QR
                </CardTitle>
                <CardDescription>Customer scans this code to settle bills directly into vyapaarx@okaxis via GPay/PhonePe.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6 min-h-[220px]">
                {generatedQr ? (
                  <div className="text-center space-y-4">
                    <div className="p-3 bg-white rounded-xl inline-block border border-primary/20 shadow-md">
                      <img src={generatedQr} alt="UPI QR" className="h-[140px] w-[140px]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">₹{qrAmount} INR</p>
                      <p className="text-[10px] text-muted-foreground">Payer: <span className="text-slate-200">{payerNameInput}</span></p>
                    </div>
                    <Button onClick={handleCreateMockTransaction} size="sm" className="brand-gradient text-white text-[10px] font-bold h-7 px-3">
                      <Check className="h-3 w-3 mr-1" /> Mock Payer Settlement
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-xs space-y-2">
                    <QrCode className="h-10 w-10 mx-auto text-border stroke-1" />
                    <p>Enter billing specs on the left and click Generate.</p>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>

        </div>

        {/* PAYMENT LEDGERS AND FILTERABLE LOGS */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Indian Fintech Transactions Ledger
              </CardTitle>
              <CardDescription>Audit trails of all Razorpay gateways and UPI POS scans with settlement tracking.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search ledger..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-8.5 pl-8 w-44 text-xs bg-muted/20 border-0"
                />
              </div>
              <Button onClick={handleExportCSV} variant="outline" className="h-8.5 text-xs text-slate-300">
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Transaction ID</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Invoice Code</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Payer Party Name</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Amount</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Dispatched Gateway ID</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Gateway Status</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Settlement</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider text-right">Dispatched At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTxns.map(t => (
                    <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-3 text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] font-bold">{t.id}</Badge>
                      </td>
                      <td className="p-3 text-xs text-slate-300 font-medium">{t.invoiceId}</td>
                      <td className="p-3 text-xs text-foreground font-semibold">{t.payerName}</td>
                      <td className="p-3 text-xs font-bold text-white">₹{t.amount.toLocaleString()}</td>
                      <td className="p-3 text-xs text-muted-foreground">{t.razorpayId}</td>
                      <td className="p-3">
                        <Badge
                          variant={t.status === 'SUCCESS' ? 'default' : t.status === 'PENDING' ? 'secondary' : 'destructive'}
                          className="text-[9px] font-bold"
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold ${
                            t.settlementStatus === 'SETTLED' ? 'text-green-400 border-green-500/20 bg-green-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                          }`}
                        >
                          {t.settlementStatus}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground text-right">{t.createdAt}</td>
                    </tr>
                  ))}
                  {filteredTxns.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-xs text-muted-foreground">No matches found inside this ledger portfolio.</td>
                    </tr>
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
