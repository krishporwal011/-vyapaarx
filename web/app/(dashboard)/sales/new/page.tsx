'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { useProducts } from '@/hooks/api/useProducts';
import { useCustomers } from '@/hooks/api/useCustomers';
import { useCreateOrder } from '@/hooks/api/useOrders';
import { ArrowLeft, Save, IndianRupee, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewSalesOrderPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const { data: productsData, isLoading: loadingProducts } = useProducts(1, 100);
  const { data: customersData, isLoading: loadingCustomers } = useCustomers(1, 100);
  const createOrderMutation = useCreateOrder();

  const productsList = productsData?.data || [];
  const customersList = customersData?.data || [];

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [rate, setRate] = useState(0);
  const [gstRate, setGstRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  // Update rate & GST when product is selected
  useEffect(() => {
    if (selectedProductId) {
      const prod = productsList.find(p => p.id === selectedProductId);
      if (prod) {
        setRate(prod.price || 0);
        setGstRate(prod.gstRate || 18);
      }
    }
  }, [selectedProductId, productsList]);

  const subtotal = quantity * rate;
  const calculatedGst = (subtotal * gstRate) / 100;
  const total = subtotal + calculatedGst - discount;

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      toast.error('Please select a customer party');
      return;
    }
    if (!selectedProductId) {
      toast.error('Please select an item product');
      return;
    }
    if (quantity <= 0) {
      toast.error('Quantity must be greater than zero');
      return;
    }
    if (rate <= 0) {
      toast.error('Rate must be greater than zero');
      return;
    }

    createOrderMutation.mutate({
      customer: selectedCustomerId,
      items: [
        {
          product: selectedProductId,
          quantity,
          price: rate,
          tax: calculatedGst
        }
      ],
      totalAmount: total,
      taxAmount: calculatedGst,
      status: 'pending',
      paymentStatus: 'unpaid'
    }, {
      onSuccess: () => {
        router.push('/sales');
      }
    });
  };

  const isLoadingData = loadingProducts || loadingCustomers;

  return (
    <>
      <div className="flex items-center gap-3 border-b border-border bg-[#09080F] px-6 py-4 text-left shrink-0">
        <Link href="/sales">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-base font-bold text-foreground">Create New Sales Order</h2>
          <p className="text-[11px] text-muted-foreground">Draft a new wholesale bill with dynamic tax computations.</p>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">
        {isLoadingData ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSaveOrder} className="max-w-3xl mx-auto space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Party & Product Details</CardTitle>
                <CardDescription>Select the purchaser party and specify items with wholesale rates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.customer}</label>
                    <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Customer Party" />
                      </SelectTrigger>
                      <SelectContent>
                        {customersList.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</SelectItem>
                        ))}
                        {customersList.length === 0 && (
                          <SelectItem value="none" disabled>No customers registered</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.product}</label>
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Item Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {productsList.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</SelectItem>
                        ))}
                        {productsList.length === 0 && (
                          <SelectItem value="none" disabled>No products cataloged</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.qty}</label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.rate}</label>
                    <Input
                      type="number"
                      min="0"
                      value={rate}
                      onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.gstRate}</label>
                    <Select value={String(gstRate)} onValueChange={(val) => setGstRate(parseInt(val))}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="GST %" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% Exempt</SelectItem>
                        <SelectItem value="5">5% GST</SelectItem>
                        <SelectItem value="12">12% GST</SelectItem>
                        <SelectItem value="18">18% GST</SelectItem>
                        <SelectItem value="28">28% GST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.discount}</label>
                    <Input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.notes}</label>
                  <Textarea
                    placeholder="Add optional notes or terms here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px] text-xs resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FINANCIAL SUMMARY */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Invoice Calculations Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t.subtotal}:</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.calcGst} (SGST + CGST Split):</span>
                  <span className="font-semibold text-white">₹{calculatedGst.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Discount Applied:</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="border-t border-border/40 pt-3 flex justify-between text-sm font-bold text-primary">
                  <span>{t.total}:</span>
                  <span className="flex items-center"><IndianRupee className="h-3.5 w-3.5" /> {total.toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Link href="/sales">
                <Button type="button" variant="outline" className="h-9 text-xs font-semibold">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={createOrderMutation.isPending} className="brand-gradient text-white text-xs h-9 font-semibold flex items-center gap-1.5">
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> {t.save}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
