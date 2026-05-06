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
  Users, Search, Plus, Phone, MapPin, X, Check, Landmark, Edit2, Trash2, Receipt
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  phone: string;
  gstNumber: string;
  state: string;
  balance: number;
  status: 'ACTIVE' | 'INACTIVE';
  city: string;
}

export default function SuppliersPage() {
  const { t } = useLanguage();

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'SUP-001', name: 'Intel Semiconductors', phone: '9876543210', gstNumber: '27AAAAA1111A1Z1', state: 'Maharashtra', balance: 45000, status: 'ACTIVE', city: 'Pune' },
    { id: 'SUP-002', name: 'Krishna Logistics Ltd.', phone: '9123456789', gstNumber: '24BBBBB2222B2Z2', state: 'Gujarat', balance: 112000, status: 'ACTIVE', city: 'Surat' },
    { id: 'SUP-003', name: 'Apex Accessories Corp.', phone: '8877665544', gstNumber: '07CCCCC3333C3Z3', state: 'New Delhi', balance: 0, status: 'INACTIVE', city: 'Noida' }
  ]);

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [selectedSupId, setSelectedSupId] = useState<string | null>('SUP-001');

  // Form Fields
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [gstInput, setGstInput] = useState('');
  const [stateInput, setStateInput] = useState('Maharashtra');

  // Transaction quick form fields
  const [paymentAmount, setPaymentAmount] = useState('5000');
  const [payMethod, setPayMethod] = useState<'CASH' | 'UPI'>('CASH');

  const selectedSupplier = suppliers.find(s => s.id === selectedSupId) || null;

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error('Supplier name is required');
      return;
    }
    const newSup: Supplier = {
      id: `SUP-00${suppliers.length + 1}`,
      name: nameInput,
      phone: phoneInput || '9999999999',
      gstNumber: gstInput || '27XXXXX1111X1Z1',
      state: stateInput,
      balance: 0,
      status: 'ACTIVE',
      city: 'Mumbai'
    };
    setSuppliers([...suppliers, newSup]);
    setSelectedSupId(newSup.id);
    setAddModalOpen(false);
    toast.success(t.paymentSuccess);
  };

  const handleRecordPayout = () => {
    if (!paymentAmount || isNaN(Number(paymentAmount))) {
      toast.error('Enter valid amount');
      return;
    }
    setSuppliers(prev => prev.map(s => s.id === selectedSupId ? { ...s, balance: Math.max(0, s.balance - Number(paymentAmount)) } : s));
    toast.success(t.paymentSuccess);
  };

  const filtered = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search);
    const matchesTab = activeTab === 'ALL' || s.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-[#09080F] px-6 py-3.5 text-left">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> {t.title}
          </h2>
          <p className="text-[11px] text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* GLOBAL SEGMENTED SWITCHER */}
          <LanguageSwitcher />
          <Button onClick={() => setAddModalOpen(true)} size="sm" className="brand-gradient text-white text-xs h-8">
            <Plus className="h-4 w-4 mr-1" /> {t.addSupplier}
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
              <button onClick={() => setActiveTab('ACTIVE')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'ACTIVE' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.active}</button>
              <button onClick={() => setActiveTab('INACTIVE')} className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${activeTab === 'INACTIVE' ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground'}`}>{t.inactive}</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Users className="h-10 w-10 text-border mx-auto stroke-1" />
                <p className="text-xs font-bold text-slate-300">{t.emptyTitle}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{t.emptyDesc}</p>
                <Button onClick={() => setAddModalOpen(true)} size="sm" className="brand-gradient text-white text-[10px] h-7">{t.addSupplier}</Button>
              </div>
            ) : (
              filtered.map(s => {
                const isSelected = s.id === selectedSupId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSupId(s.id)}
                    className={`w-full p-4 text-left transition-all flex justify-between items-center ${
                      isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/10'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {s.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">₹{s.balance.toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-muted-foreground uppercase">{t.pendingBalance}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-8 overflow-y-auto p-6 bg-[#050408]/20 flex flex-col justify-between">
          {selectedSupplier ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Users className="h-5.5 w-5.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{selectedSupplier.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {selectedSupplier.city}, {selectedSupplier.state}
                    </p>
                  </div>
                </div>
                <Badge className="text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/20">
                  {t.active}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">{t.pendingBalance}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h4 className="text-3xl font-bold text-white">₹{selectedSupplier.balance.toLocaleString('en-IN')}</h4>
                    <div className="space-y-2 text-[11px] text-muted-foreground">
                      <div className="flex justify-between">
                        <span>GSTIN Code:</span>
                        <span className="font-mono text-slate-300">{selectedSupplier.gstNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State:</span>
                        <span className="text-slate-300">{selectedSupplier.state}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">{t.savePayment}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-muted-foreground">Payout Amount (INR)</label>
                      <Input
                        type="number"
                        value={paymentAmount}
                        onChange={e => setPaymentAmount(e.target.value)}
                        className="h-8.5 text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPayMethod('CASH')}
                        className={`flex-1 h-8.5 text-[10px] font-bold rounded-lg border transition-all ${
                          payMethod === 'CASH' ? 'bg-primary/5 border-primary text-primary' : 'bg-transparent border-border text-slate-400'
                        }`}
                      >
                        {t.cash}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod('UPI')}
                        className={`flex-1 h-8.5 text-[10px] font-bold rounded-lg border transition-all ${
                          payMethod === 'UPI' ? 'bg-primary/5 border-primary text-primary' : 'bg-transparent border-border text-slate-400'
                        }`}
                      >
                        {t.upi}
                      </button>
                    </div>
                    <Button onClick={handleRecordPayout} size="sm" className="w-full brand-gradient text-white text-[10px] font-bold h-8.5">
                      {t.savePayment}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">Audit Statement Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground">Transaction ID</th>
                        <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground">Type</th>
                        <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground">Method</th>
                        <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground">Debit Amount</th>
                        <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground text-right">Logged At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      <tr className="hover:bg-muted/10">
                        <td className="p-3 font-mono text-muted-foreground">TXN-7729</td>
                        <td className="p-3"><Badge className="text-[9px] bg-primary/20 text-primary">Bill Paid</Badge></td>
                        <td className="p-3 text-slate-300">UPI Payout</td>
                        <td className="p-3 font-bold text-white">₹15,000</td>
                        <td className="p-3 text-muted-foreground text-right">2026-05-06 12:45</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-24 space-y-3">
              <Users className="h-12 w-12 mx-auto text-border stroke-1" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.noSupplier}</h4>
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
            <form onSubmit={handleAddSupplier}>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.name}</label>
                  <Input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="E.g., Intel Semiconductors" className="h-9 text-xs" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.phone}</label>
                    <Input value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="E.g., 9876543210" className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.gst}</label>
                    <Input value={gstInput} onChange={e => setGstInput(e.target.value)} placeholder="E.g., 27AAAAA1111A1Z1" className="h-9 text-xs uppercase" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.state}</label>
                  <Input value={stateInput} onChange={e => setStateInput(e.target.value)} className="h-9 text-xs" />
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
