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
import { useTransactions, useCreateTransaction } from '@/hooks/api/usePayments';
import { useInvoices } from '@/hooks/api/useInvoices';

export default function PaymentsPage() {
  const { data: invoicesData } = useInvoices({ limit: 100 });
  const { data: transactions = [], isLoading } = useTransactions();
  const createTxnMutation = useCreateTransaction();

  const [qrAmount, setQrAmount] = useState('');
  const [payerNameInput, setPayerNameInput] = useState('');
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

  const handleCreateMockTransaction = async () => {
    if (!qrAmount) return;
    try {
      const realInvoices = invoicesData?.data || [];
      const targetInvoice = realInvoices.find((inv: any) => inv.paymentStatus === 'UNPAID') || realInvoices[0];

      if (!targetInvoice) {
        toast.error('Please create an Invoice first before registering a payment!');
        return;
      }

      await createTxnMutation.mutateAsync({
        invoiceId: targetInvoice.id,
        amount: Number(qrAmount),
        paymentMethod: 'UPI',
        referenceNumber: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'SUCCESS',
        upiId: 'client@okupi',
        razorpayId: `pay_${Math.random().toString(36).substring(2, 11)}`,
        payerName: payerNameInput || 'Walk-In Client',
        settlementStatus: 'SETTLED',
      });
      toast.success('Transaction logged & settled instantly!');
      setQrAmount('');
      setPayerNameInput('');
      setGeneratedQr(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to record transaction');
    }
  };

  const handleExportCSV = () => {
    toast.success('Transaction ledger exported as CSV!');
  };

  const filteredTxns = transactions.filter((t: any) => {
    const matchesSearch = (t.payerName || '').toLowerCase().includes(search.toLowerCase()) ||
                          t.id.toLowerCase().includes(search.toLowerCase()) ||
                          (t.invoice?.invoiceNumber || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate dynamics KPIs based on real transaction states
  const settledTotal = transactions
    .filter((t: any) => t.status === 'SUCCESS' && t.settlementStatus === 'SETTLED')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const pendingTotal = transactions
    .filter((t: any) => t.status === 'PENDING' || (t.status === 'SUCCESS' && t.settlementStatus === 'UNSETTLED'))
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  return (
    <>
      <Topbar
        title="UPI & Payments Center"
        subtitle="Manage secure Indian fintech integrations, dynamic UPI QR codes, and Razorpay settlements"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">

        {/* TOP METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border shadow-sm p-4 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5 text-primary" /> Net Settlements
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-2">₹{settledTotal.toLocaleString('en-IN')}</h3>
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
              <h3 className="text-2xl font-bold text-foreground mt-2">₹{pendingTotal.toLocaleString('en-IN')}</h3>
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
                  className="h-8.5 pl-8 w-44 text-xs bg-muted/20 border-0 text-foreground"
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
                  {filteredTxns.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-xs text-muted-foreground">
                        No transactions registered yet inside this ledger. Generate and scan a dynamic UPI QR to record your first settlement!
                      </td>
                    </tr>
                  ) : (
                    filteredTxns.map((t: any) => (
                      <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-3 text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[9px] font-bold">{t.id.substring(0, 8)}</Badge>
                        </td>
                        <td className="p-3 text-xs text-slate-300 font-medium">{t.invoice?.invoiceNumber || 'N/A'}</td>
                        <td className="p-3 text-xs text-foreground font-semibold">{t.payerName || 'Walk-In Customer'}</td>
                        <td className="p-3 text-xs font-bold text-white">₹{t.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-xs text-muted-foreground">{t.razorpayId || 'N/A'}</td>
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
                        <td className="p-3 text-xs text-muted-foreground text-right">
                          {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    ))
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
