'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/global/LanguageSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart, Search, Plus, Phone, MapPin, X, Check, Receipt, Printer, FileText, Download, Calendar, Loader2
} from 'lucide-react';
import { useOrders, useCreateOrder } from '@/hooks/api/useOrders';
import { useCustomers } from '@/hooks/api/useCustomers';
import { useProducts } from '@/hooks/api/useProducts';

export default function SalesPage() {
  const { t } = useLanguage();

  // API Hooks
  const { data: ordersRes, isLoading } = useOrders(1, 100);
  const { data: customerRes } = useCustomers(1, 100);
  const { data: productRes } = useProducts(1, 100);
  const createOrderMutation = useCreateOrder();

  const orders = ordersRes?.data || [];
  const customers = customerRes?.data || [];
  const products = productRes?.data || [];

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  // Form Fields
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qtyInput, setQtyInput] = useState('1');
  const [rateInput, setRateInput] = useState('');
  const [discountInput, setDiscountInput] = useState('0');
  const [gstRateInput, setGstRateInput] = useState('18');
  const [paymentInput, setPaymentInput] = useState('UPI POS');
  const [notesInput, setNotesInput] = useState('');

  // Live Calculations
  const calcSubtotal = (Number(qtyInput) || 0) * (Number(rateInput) || 0);
  const calcGst = Math.round(calcSubtotal * (Number(gstRateInput) / 100));
  const calcTotal = calcSubtotal + calcGst - (Number(discountInput) || 0);

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      toast.error('Customer is required');
      return;
    }
    if (!selectedProductId) {
      toast.error('Product is required');
      return;
    }
    if (Number(qtyInput) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (Number(rateInput) <= 0) {
      toast.error('Please enter a valid price/rate');
      return;
    }

    const selectedProduct = products.find(p => p.id === selectedProductId);

    try {
      const newOrder = await createOrderMutation.mutateAsync({
        customer: selectedCustomerId,
        items: [
          {
            product: selectedProductId,
            quantity: Number(qtyInput),
            price: Number(rateInput),
            tax: calcGst,
            gstRate: Number(gstRateInput)
          }
        ],
        totalAmount: calcTotal,
        taxAmount: calcGst,
        status: 'pending',
        paymentStatus: paymentInput.toLowerCase().includes('cash') || paymentInput.toLowerCase().includes('upi') ? 'paid' : 'unpaid'
      });

      if (newOrder) {
        setSelectedSaleId(newOrder.id);
      }
      setAddModalOpen(false);
      
      // Reset fields
      setSelectedCustomerId('');
      setSelectedProductId('');
      setQtyInput('1');
      setRateInput('');
      setDiscountInput('0');
      setNotesInput('');
    } catch (err) {
      // Error handles in react-query hook toast notifications
    }
  };

  const handleExportLedger = () => {
    if (orders.length === 0) {
      toast.error('No sales data to export');
      return;
    }
    const headers = ['Order Number', 'Customer', 'Date', 'Payment Status', 'Status', 'Total (INR)'];
    const rows = orders.map(s => [
      s.orderNumber,
      s.customer?.name || 'Walk-in Customer',
      new Date(s.createdAt).toLocaleDateString('en-IN'),
      s.paymentStatus,
      s.status,
      s.total
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Sales ledger exported successfully as CSV!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const filtered = orders.filter(s => {
    const customerName = s.customer?.name || 'Walk-in Customer';
    const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase()) || s.orderNumber.includes(search);
    
    let matchesTab = true;
    if (activeTab === 'PAID') {
      matchesTab = s.paymentStatus.toUpperCase() === 'PAID';
    } else if (activeTab === 'PENDING') {
      matchesTab = s.paymentStatus.toUpperCase() === 'UNPAID' || s.paymentStatus.toUpperCase() === 'PARTIAL';
    } else if (activeTab === 'OVERDUE') {
      matchesTab = (s.status as string) === 'overdue';
    }

    return matchesSearch && matchesTab;
  });

  // Default selection
  useEffect(() => {
    if (!selectedSaleId && filtered.length > 0) {
      setSelectedSaleId(filtered[0].id);
    }
  }, [filtered, selectedSaleId]);

  const selectedSale = orders.find(s => s.id === selectedSaleId) || null;

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-[#09080F] px-6 py-3.5 text-left print:hidden">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" /> {t.title || 'Sales & Orders'}
          </h2>
          <p className="text-[11px] text-muted-foreground">{t.subtitle || 'Monitor real-time customer sales invoices and order dispatch registries'}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <Button onClick={handleExportLedger} variant="outline" size="sm" className="h-8 text-xs text-slate-300">
            <Download className="h-3.5 w-3.5 mr-1" /> Export
          </Button>
          <Button onClick={() => setAddModalOpen(true)} size="sm" className="brand-gradient text-white text-xs h-8">
            <Plus className="h-4 w-4 mr-1" /> {t.addSale || 'New Sale Order'}
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-left bg-[#09080F]">

        {/* LEFT PANEL */}
        <div className="lg:col-span-4 border-r border-border flex flex-col overflow-hidden print:hidden">
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlace || 'Search sale registries...'}
                className="pl-8 h-9 text-xs"
              />
            </div>
            <div className="flex gap-1">
              <button onClick={() => setActiveTab('ALL')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'ALL' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.all || 'All'}</button>
              <button onClick={() => setActiveTab('PAID')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'PAID' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.paid || 'Paid'}</button>
              <button onClick={() => setActiveTab('PENDING')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'PENDING' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.pending || 'Pending'}</button>
              <button onClick={() => setActiveTab('OVERDUE')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'OVERDUE' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.overdue || 'Overdue'}</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                <p className="text-xs text-muted-foreground">Loading sales data...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <ShoppingCart className="h-10 w-10 text-border mx-auto stroke-1" />
                <p className="text-xs font-bold text-slate-300">{t.emptyTitle || 'No sales orders logged'}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{t.emptyDesc || 'Handoff counter sales or log a wholesale order to get started'}</p>
                <Button onClick={() => setAddModalOpen(true)} size="sm" className="brand-gradient text-white text-[10px] h-7">{t.addSale || 'New Sale Order'}</Button>
              </div>
            ) : (
              filtered.map(s => {
                const isSelected = s.id === selectedSaleId;
                const itemsCount = s.items?.reduce((sum: number, it: any) => sum + it.quantity, 0) || 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSaleId(s.id)}
                    className={`w-full p-4 text-left transition-all flex justify-between items-center ${
                      isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/10'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground">{s.customer?.name || 'Walk-in Customer'}</span>
                        <Badge variant="outline" className="text-[9px] font-mono leading-none">{s.orderNumber}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(s.createdAt).toLocaleDateString('en-IN')} • {s.paymentMethod || 'UPI POS'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">₹{s.total.toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-muted-foreground">{itemsCount} Units</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-8 overflow-y-auto p-6 bg-[#050408]/20 flex flex-col justify-between print:w-full print:p-0">
          {selectedSale ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3 print:hidden">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Receipt className="h-5.5 w-5.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{t.details || 'Tax Invoice Detail'} ({selectedSale.orderNumber})</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> Supply Place: {selectedSale.customer?.state || 'Maharashtra'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handlePrint} variant="outline" size="sm" className="h-8 text-xs gap-1"><Printer className="h-3.5 w-3.5" /> {t.print || 'Print'}</Button>
                  <Button onClick={handleDownload} variant="outline" size="sm" className="h-8 text-xs gap-1"><FileText className="h-3.5 w-3.5" /> {t.download || 'Download'}</Button>
                  <Badge className={`text-[10px] font-bold ${
                    selectedSale.paymentStatus.toLowerCase() === 'paid'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  }`}>
                    {selectedSale.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Card id="invoice-print-area" className="bg-[#0A0912] border border-border overflow-hidden print:bg-white print:text-black">
                <CardContent className="p-6 space-y-6">
                  <div className="flex justify-between border-b border-border pb-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">VyapaarX Corporate Billings</h4>
                      <p className="text-[10px] text-muted-foreground">GSTIN: 27AAAAA0000A1Z1 • Maharashtra</p>
                      <p className="text-[10px] text-muted-foreground">Bank: HDFC Bank • Acc: 502000XXXX • IFSC: HDFC00001</p>
                    </div>
                    <div className="text-right space-y-1">
                      <h3 className="text-sm font-bold text-primary uppercase">Tax Invoice</h3>
                      <p className="text-[10px] text-white">Date: {new Date(selectedSale.createdAt).toLocaleDateString('en-IN')}</p>
                      <p className="text-[10px] text-white">No: {selectedSale.orderNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-border pb-4 text-[10px]">
                    <div>
                      <p className="text-muted-foreground uppercase font-bold tracking-wider mb-1">Billed To (Party):</p>
                      <p className="font-bold text-white">{selectedSale.customer?.name || 'Walk-in Customer'}</p>
                      <p className="text-muted-foreground">Phone: {selectedSale.customer?.phone || '--'}</p>
                      <p className="text-muted-foreground">GSTIN: {selectedSale.customer?.gstin || '--'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground uppercase font-bold tracking-wider mb-1">Place of Supply:</p>
                      <p className="font-bold text-white">{selectedSale.customer?.state || 'Maharashtra'} (State Code: 27)</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border pb-2 text-muted-foreground font-bold">
                          <th className="pb-2">Product Description</th>
                          <th className="pb-2">HSN Code</th>
                          <th className="pb-2">Qty</th>
                          <th className="pb-2">Unit Price</th>
                          <th className="pb-2">GST Rate</th>
                          <th className="pb-2 text-right">Net Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-white">
                        {(selectedSale.items || []).map((it: any) => (
                          <tr key={it.id} className="py-2">
                            <td className="py-2.5 font-semibold">{it.product?.name || it.name || 'Bulk Supply'}</td>
                            <td className="py-2.5 font-mono">{it.product?.sku || 'HSN8471'}</td>
                            <td className="py-2.5">{it.quantity} pcs</td>
                            <td className="py-2.5">₹{it.price.toLocaleString('en-IN')}</td>
                            <td className="py-2.5">{it.gstRate || 18}%</td>
                            <td className="py-2.5 text-right font-bold">₹{it.total.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">{t.breakdown || 'Tax Breakdown'}</p>
                    <table className="w-full text-[9px] text-left border border-border">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border text-muted-foreground">
                          <th className="p-2">Tax Rate</th>
                          <th className="p-2">CGST (9%)</th>
                          <th className="p-2">SGST (9%)</th>
                          <th className="p-2 text-right">Total Tax Settle</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-slate-300">
                          <td className="p-2">18.00% GST</td>
                          <td className="p-2">₹{(selectedSale.gstAmount / 2).toLocaleString('en-IN')}</td>
                          <td className="p-2">₹{(selectedSale.gstAmount / 2).toLocaleString('en-IN')}</td>
                          <td className="p-2 text-right font-bold text-white">₹{selectedSale.gstAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-end border-t border-border pt-4">
                    <div className="text-[9px] text-muted-foreground max-w-xs">
                      <p className="font-bold text-slate-300 mb-1">Declaration:</p>
                      <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                    </div>
                    <div className="text-right text-[10px] space-y-1 w-44">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.subtotal || 'Subtotal'}:</span>
                        <span className="font-bold text-white">₹{selectedSale.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>GST Tax:</span>
                        <span>+ ₹{selectedSale.gstAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white border-t border-border/30 pt-1">
                        <span>{t.totalValue || 'Total'}:</span>
                        <span className="text-primary text-xs">₹{selectedSale.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-24 space-y-3">
              <ShoppingCart className="h-12 w-12 mx-auto text-border stroke-1" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.noSale || 'No order selected'}</h4>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed">{t.selectHint || 'Click any transaction on the left panel to pull up detailed breakdown'}</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="bg-card border-border w-full max-w-md shadow-xl relative text-left">
            <button onClick={() => setAddModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
              <X className="h-4 w-4" />
            </button>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">{t.quickAdd || 'Add New Sale Order'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleCreateSale}>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.customer || 'Customer'}</label>
                  <select
                    value={selectedCustomerId}
                    onChange={e => setSelectedCustomerId(e.target.value)}
                    className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.product || 'Product'}</label>
                  <select
                    value={selectedProductId}
                    onChange={e => {
                      setSelectedProductId(e.target.value);
                      const prod = products.find(p => p.id === e.target.value);
                      if (prod) {
                        setRateInput(String(prod.price));
                        setGstRateInput(String(prod.gstRate));
                      }
                    }}
                    className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none"
                  >
                    <option value="">Select Product</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.qty || 'Qty'}</label>
                    <Input type="number" value={qtyInput} onChange={e => setQtyInput(e.target.value)} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.rate || 'Rate'}</label>
                    <Input type="number" value={rateInput} onChange={e => setRateInput(e.target.value)} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.discount || 'Discount (₹)'}</label>
                    <Input type="number" value={discountInput} onChange={e => setDiscountInput(e.target.value)} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.gstRate || 'GST Rate'}</label>
                    <select value={gstRateInput} onChange={e => setGstRateInput(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.paymentType || 'Payment Type'}</label>
                    <select value={paymentInput} onChange={e => setPaymentInput(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                      <option value="UPI POS">UPI POS</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-[#0A0912] border border-border rounded-lg space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span>{t.subtotal || 'Subtotal'}:</span>
                    <span>₹{calcSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST Tax ({gstRateInput}%):</span>
                    <span>+ ₹{calcGst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white border-t border-border/30 pt-1">
                    <span>{t.total || 'Total'}:</span>
                    <span className="text-primary text-sm">₹{calcTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t border-border flex justify-end gap-2.5">
                <Button type="button" onClick={() => setAddModalOpen(false)} variant="outline" className="h-9 text-xs">Cancel</Button>
                <Button type="submit" disabled={createOrderMutation.isPending} className="brand-gradient text-white text-xs h-9 font-semibold">
                  {createOrderMutation.isPending ? 'Saving...' : t.save || 'Save'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* Custom Print Style Sheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          main, div, nav, header, section {
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }
          #invoice-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            border: none !important;
            box-shadow: none !important;
            padding: 20px !important;
          }
          #invoice-print-area * {
            color: black !important;
            background: transparent !important;
            border-color: #e5e7eb !important;
          }
          #invoice-print-area th {
            color: #374151 !important;
          }
        }
      `}} />
    </>
  );
}
