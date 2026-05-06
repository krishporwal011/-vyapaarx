'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/global/LanguageSwitcher';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart, Search, Plus, Phone, MapPin, X, Check, Landmark, Edit2, Trash2, Receipt, Printer, FileText, Download, Calendar
} from 'lucide-react';

interface SaleOrder {
  id: string;
  customer: string;
  phone: string;
  gstNumber: string;
  itemsCount: number;
  subtotal: number;
  discount: number;
  amount: number;
  gst: number;
  gstRate: number;
  hsnCode: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paymentMethod: string;
  date: string;
  notes?: string;
}

export default function SalesPage() {
  const { t } = useLanguage();

  const [sales, setSales] = useState<SaleOrder[]>([
    { id: 'VX-48291', customer: 'Priya Sharma', phone: '9876543210', gstNumber: '27AAAAA1111A1Z1', itemsCount: 3, subtotal: 10500, discount: 0, amount: 12400, gst: 1900, gstRate: 18, hsnCode: 'HSN8471', status: 'PAID', paymentMethod: 'UPI POS', date: 'May 6', notes: 'Instant checkout clearance' },
    { id: 'VX-48292', customer: 'Rahul Verma', phone: '9123456789', gstNumber: '24BBBBB2222B2Z2', itemsCount: 1, subtotal: 7400, discount: 0, amount: 8750, gst: 1350, gstRate: 18, hsnCode: 'HSN8517', status: 'PENDING', paymentMethod: 'Razorpay', date: 'May 6' },
    { id: 'VX-48293', customer: 'Anjali Mehta', phone: '8877665544', gstNumber: '07CCCCC3333C3Z3', itemsCount: 5, subtotal: 26500, discount: 500, amount: 31200, gst: 4700, gstRate: 18, hsnCode: 'HSN8471', status: 'PAID', paymentMethod: 'Bank Transfer', date: 'May 5' },
    { id: 'VX-48294', customer: 'Suresh Kumar', phone: '9988776655', gstNumber: '08DDDDD4444D4Z4', itemsCount: 2, subtotal: 4800, discount: 100, amount: 5600, gst: 800, gstRate: 18, hsnCode: 'HSN8528', status: 'OVERDUE', paymentMethod: 'Cash', date: 'May 5' }
  ]);

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>('VX-48291');

  // Form Fields
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [customerInput, setCustomerInput] = useState('Walk-In Client');
  const [productInput, setProductInput] = useState('Ultra HD Monitor');
  const [qtyInput, setQtyInput] = useState('1');
  const [rateInput, setRateInput] = useState('24500');
  const [discountInput, setDiscountInput] = useState('0');
  const [gstRateInput, setGstRateInput] = useState('18');
  const [paymentInput, setPaymentInput] = useState('UPI POS');
  const [notesInput, setNotesInput] = useState('');

  // Live Calculations
  const calcSubtotal = (Number(qtyInput) || 0) * (Number(rateInput) || 0);
  const calcGst = Math.round(calcSubtotal * (Number(gstRateInput) / 100));
  const calcTotal = calcSubtotal + calcGst - (Number(discountInput) || 0);

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInput.trim()) {
      toast.error('Customer field is required');
      return;
    }
    const newSale: SaleOrder = {
      id: `VX-${Math.floor(48000 + Math.random() * 999)}`,
      customer: customerInput,
      phone: '9999999999',
      gstNumber: '27AAAAA1111A1Z1',
      itemsCount: Number(qtyInput) || 1,
      subtotal: calcSubtotal,
      discount: Number(discountInput) || 0,
      amount: calcTotal,
      gst: calcGst,
      gstRate: Number(gstRateInput),
      hsnCode: 'HSN8471',
      status: 'PENDING',
      paymentMethod: paymentInput,
      date: 'May 6',
      notes: notesInput
    };
    setSales([newSale, ...sales]);
    setSelectedSaleId(newSale.id);
    setAddModalOpen(false);
    toast.success(t.saleSuccess);
  };

  const handleExportLedger = () => {
    toast.success('Sales ledger exported successfully as CSV!');
  };

  const filtered = sales.filter(s => {
    const matchesSearch = s.customer.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search);
    const matchesTab = activeTab === 'ALL' || s.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const selectedSale = sales.find(s => s.id === selectedSaleId) || null;

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-[#09080F] px-6 py-3.5 text-left">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" /> {t.title}
          </h2>
          <p className="text-[11px] text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* GLOBAL SEGMENTED SWITCHER */}
          <LanguageSwitcher />
          <Button onClick={handleExportLedger} variant="outline" size="sm" className="h-8 text-xs text-slate-300">
            <Download className="h-3.5 w-3.5 mr-1" /> Export
          </Button>
          <Button onClick={() => setAddModalOpen(true)} size="sm" className="brand-gradient text-white text-xs h-8">
            <Plus className="h-4 w-4 mr-1" /> {t.addSale}
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-left bg-[#09080F]">

        {/* LEFT PANEL */}
        <div className="lg:col-span-4 border-r border-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlace}
                className="pl-8 h-9 text-xs"
              />
            </div>
            <div className="flex gap-1">
              <button onClick={() => setActiveTab('ALL')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'ALL' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.all}</button>
              <button onClick={() => setActiveTab('PAID')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'PAID' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.paid}</button>
              <button onClick={() => setActiveTab('PENDING')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'PENDING' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.pending}</button>
              <button onClick={() => setActiveTab('OVERDUE')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'OVERDUE' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.overdue}</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <ShoppingCart className="h-10 w-10 text-border mx-auto stroke-1" />
                <p className="text-xs font-bold text-slate-300">{t.emptyTitle}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{t.emptyDesc}</p>
                <Button onClick={() => setAddModalOpen(true)} size="sm" className="brand-gradient text-white text-[10px] h-7">{t.addSale}</Button>
              </div>
            ) : (
              filtered.map(s => {
                const isSelected = s.id === selectedSaleId;
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
                        <span className="text-xs font-bold text-foreground">{s.customer}</span>
                        <Badge variant="outline" className="text-[9px] font-mono leading-none">{s.id}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {s.date} • {s.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">₹{s.amount.toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-muted-foreground">{s.itemsCount} Items</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-8 overflow-y-auto p-6 bg-[#050408]/20 flex flex-col justify-between">
          {selectedSale ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Receipt className="h-5.5 w-5.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{t.details} ({selectedSale.id})</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> GSTIN: {selectedSale.gstNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Printer className="h-3.5 w-3.5" /> {t.print}</Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><FileText className="h-3.5 w-3.5" /> {t.download}</Button>
                  <Badge className="text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/20">
                    {t.paid}
                  </Badge>
                </div>
              </div>

              <Card className="bg-[#0A0912] border border-border overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="flex justify-between border-b border-border pb-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">VyapaarX Technologies</h4>
                      <p className="text-[10px] text-muted-foreground">GSTIN: 27AAAAA0000A1Z1 • Maharashtra</p>
                      <p className="text-[10px] text-muted-foreground">Bank: HDFC Bank • Acc: 502000XXXX • IFSC: HDFC00001</p>
                    </div>
                    <div className="text-right space-y-1">
                      <h3 className="text-sm font-bold text-primary uppercase">Tax Invoice</h3>
                      <p className="text-[10px] text-white">Date: {selectedSale.date}</p>
                      <p className="text-[10px] text-white">No: {selectedSale.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-border pb-4 text-[10px]">
                    <div>
                      <p className="text-muted-foreground uppercase font-bold tracking-wider mb-1">Billed To (Party):</p>
                      <p className="font-bold text-white">{selectedSale.customer}</p>
                      <p className="text-muted-foreground">Phone: {selectedSale.phone}</p>
                      <p className="text-muted-foreground">GSTIN: {selectedSale.gstNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground uppercase font-bold tracking-wider mb-1">Place of Supply:</p>
                      <p className="font-bold text-white">Maharashtra (State Code: 27)</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border pb-2 text-muted-foreground font-bold">
                          <th className="pb-2">Product Description</th>
                          <th className="pb-2">HSN</th>
                          <th className="pb-2">Qty</th>
                          <th className="pb-2">Unit Price</th>
                          <th className="pb-2">GST Rate</th>
                          <th className="pb-2 text-right">Net Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-white">
                        <tr className="py-2">
                          <td className="py-2.5 font-semibold">Bulk Inventory Supplies</td>
                          <td className="py-2.5 font-mono">{selectedSale.hsnCode}</td>
                          <td className="py-2.5">{selectedSale.itemsCount} pcs</td>
                          <td className="py-2.5">₹{(selectedSale.subtotal / selectedSale.itemsCount).toLocaleString('en-IN')}</td>
                          <td className="py-2.5">{selectedSale.gstRate}% GST</td>
                          <td className="py-2.5 text-right font-bold">₹{selectedSale.subtotal.toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">{t.breakdown}</p>
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
                          <td className="p-2">₹{(selectedSale.gst / 2).toLocaleString('en-IN')}</td>
                          <td className="p-2">₹{(selectedSale.gst / 2).toLocaleString('en-IN')}</td>
                          <td className="p-2 text-right font-bold text-white">₹{selectedSale.gst.toLocaleString('en-IN')}</td>
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
                        <span className="text-muted-foreground">{t.subtotal}:</span>
                        <span className="font-bold text-white">₹{selectedSale.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>GST Tax:</span>
                        <span>+ ₹{selectedSale.gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white border-t border-border/30 pt-1">
                        <span>{t.totalValue}:</span>
                        <span className="text-primary text-xs">₹{selectedSale.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-24 space-y-3">
              <ShoppingCart className="h-12 w-12 mx-auto text-border stroke-1" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.noSale}</h4>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed">{t.selectHint}</p>
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
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">{t.quickAdd}</CardTitle>
            </CardHeader>
            <form onSubmit={handleCreateSale}>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.customer}</label>
                  <Input value={customerInput} onChange={e => setCustomerInput(e.target.value)} placeholder="E.g., Priya Sharma" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.product}</label>
                  <Input value={productInput} onChange={e => setProductInput(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.qty}</label>
                    <Input type="number" value={qtyInput} onChange={e => setQtyInput(e.target.value)} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.rate}</label>
                    <Input type="number" value={rateInput} onChange={e => setRateInput(e.target.value)} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.discount}</label>
                    <Input type="number" value={discountInput} onChange={e => setDiscountInput(e.target.value)} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.gstRate}</label>
                    <select value={gstRateInput} onChange={e => setGstRateInput(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.paymentType}</label>
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
                    <span>{t.subtotal}:</span>
                    <span>₹{calcSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t.calcGst} ({gstRateInput}%):</span>
                    <span>+ ₹{calcGst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white border-t border-border/30 pt-1">
                    <span>{t.total}:</span>
                    <span className="text-primary text-sm">₹{calcTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t border-border flex justify-end gap-2.5">
                <Button type="button" onClick={() => setAddModalOpen(false)} variant="outline" className="h-9 text-xs">Cancel</Button>
                <Button type="submit" className="brand-gradient text-white text-xs h-9 font-semibold">{t.save}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
