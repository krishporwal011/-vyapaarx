'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Plus, Trash2, Calendar, MapPin, Building2, Loader2, ArrowLeft, Info, HelpCircle
} from 'lucide-react';

import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

import { useCustomers } from '@/hooks/api/useCustomers';
import { useProducts } from '@/hooks/api/useProducts';
import { useCreateInvoice } from '@/hooks/api/useInvoices';

interface InvoiceLineItem {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  gstRate: number;
  hsnCode: string;
}

export default function NewInvoicePage() {
  const router = useRouter();

  // Load Customers & Products
  const { data: customerRes, isLoading: loadingCust } = useCustomers(1, 100);
  const { data: productRes, isLoading: loadingProd } = useProducts(1, 100);
  const createMutation = useCreateInvoice();

  const customers = customerRes?.data || [];
  const products = productRes?.data || [];

  // Form Fields
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'UNPAID' | 'PAID' | 'PARTIAL'>('UNPAID');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CARD'>('CASH');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  
  // Line Items List
  const [items, setItems] = useState<InvoiceLineItem[]>([
    { productId: '', quantity: 1, price: 0, discount: 0, gstRate: 18, hsnCode: '' }
  ]);

  // Live Calculated Values
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Recalculate totals dynamically
  useEffect(() => {
    let currentSubtotal = 0;
    let currentGst = 0;
    let currentCgst = 0;
    let currentSgst = 0;
    let currentIgst = 0;

    const customer = customers.find(c => c.id === selectedCustomerId);
    // Determine state routing (assume intrastate/CGST-SGST if customer or state missing)
    const isIntrastate = !customer || !customer.state || customer.state.trim().toLowerCase() === 'maharashtra'; // Hardcoded state match helper

    items.forEach(item => {
      const discountedPrice = item.price * (1 - item.discount / 100);
      const lineTotal = discountedPrice * item.quantity;
      const lineGst = lineTotal * (item.gstRate / 100);

      currentSubtotal += lineTotal;
      currentGst += lineGst;

      if (isIntrastate) {
        currentCgst += lineGst / 2;
        currentSgst += lineGst / 2;
      } else {
        currentIgst += lineGst;
      }
    });

    setSubtotal(currentSubtotal);
    setGstAmount(currentGst);
    setCgst(currentCgst);
    setSgst(currentSgst);
    setIgst(currentIgst);
    setTotalAmount(currentSubtotal + currentGst);
  }, [items, selectedCustomerId, customers]);

  // Add Item Row
  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0, discount: 0, gstRate: 18, hsnCode: '' }]);
  };

  // Remove Item Row
  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Handle Item Field Change
  const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...items];
    
    if (field === 'productId') {
      const prod = products.find(p => p.id === value);
      updated[index] = {
        productId: value,
        price: prod?.price || 0,
        quantity: 1,
        discount: 0,
        gstRate: prod?.gstRate || 18,
        hsnCode: `HSN-${Math.floor(1000 + Math.random() * 9000)}`,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    
    setItems(updated);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    const invalidItem = items.some(item => !item.productId || item.quantity <= 0 || item.price <= 0);
    if (invalidItem) {
      toast.error('Please fill out all line items with valid quantities and prices');
      return;
    }

    const loadToast = toast.loading('Creating wholesale invoice...');
    try {
      await createMutation.mutateAsync({
        customerId: selectedCustomerId,
        paymentStatus,
        paymentMethod: paymentStatus === 'UNPAID' ? null : paymentMethod,
        dueDate: dueDate || null,
        notes: notes || null,
        items,
        status: 'sent',
      });
      toast.success('GST Invoice created successfully', { id: loadToast });
      router.push('/invoices');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong', { id: loadToast });
    }
  };

  return (
    <>
      <Topbar
        title="New Invoice"
        subtitle="Issue a new GST-compliant B2B or B2C tax invoice"
        action={{ label: 'Back to Directory', onClick: () => router.push('/invoices'), icon: ArrowLeft }}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Customer & Payment Setup */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Buyer & Logistics Profile</CardTitle>
                <CardDescription>Select customer partner and record details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="customer">Customer Partner</Label>
                    <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingCust ? 'Loading customers...' : 'Select Customer'} />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name} ({c.state || 'India'})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Payment Status</Label>
                    <Select onValueChange={(val: any) => setPaymentStatus(val)} value={paymentStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNPAID">Unpaid</SelectItem>
                        <SelectItem value="PAID">Paid In Full</SelectItem>
                        <SelectItem value="PARTIAL">Partial Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {paymentStatus !== 'UNPAID' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <Label>Payment Method</Label>
                      <Select onValueChange={(val: any) => setPaymentMethod(val)} value={paymentMethod}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="UPI">UPI Transfer</SelectItem>
                          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                          <SelectItem value="CARD">Credit/Debit Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes">Invoice Notes / T&C</Label>
                  <Input id="notes" placeholder="Goods once sold will not be taken back." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Calculations Breakdown Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tax Invoice Total</CardTitle>
                <CardDescription>Live real-time calculations preview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xs text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xs text-muted-foreground">GST collected</span>
                  <span className="text-sm font-semibold">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                {cgst > 0 && (
                  <div className="flex justify-between items-center border-b pb-1 text-xs text-muted-foreground">
                    <span>CGST (9%)</span>
                    <span>₹{cgst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {sgst > 0 && (
                  <div className="flex justify-between items-center border-b pb-1 text-xs text-muted-foreground">
                    <span>SGST (9%)</span>
                    <span>₹{sgst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {igst > 0 && (
                  <div className="flex justify-between items-center border-b pb-1 text-xs text-muted-foreground">
                    <span>IGST (18%)</span>
                    <span>₹{igst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 text-primary font-bold">
                  <span className="text-sm uppercase tracking-wide">Grand Total</span>
                  <span className="text-xl font-display">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <Button type="submit" className="w-full h-10 brand-gradient text-white mt-4 font-semibold">Create & Issue Invoice</Button>
              </CardContent>
            </Card>

          </div>

          {/* Line Items Grid Builder */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-base font-semibold">Product Line Items</CardTitle>
                <CardDescription>Add, modify, or remove products included in this tax invoice</CardDescription>
              </div>
              <Button type="button" size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={handleAddItem}>
                <Plus className="h-3 w-3" /> Add Product Line
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b pb-3 last:border-0 last:pb-0">
                  <div className="md:col-span-3 space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">Select Product</Label>
                    <Select
                      onValueChange={(val) => handleItemChange(index, 'productId', val)}
                      value={item.productId}
                    >
                      <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder={loadingProd ? 'Loading...' : 'Choose product'} />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">Price (₹)</Label>
                    <Input
                      type="number"
                      value={item.price || ''}
                      onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1.5 md:col-span-1 space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity || ''}
                      onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value, 10) || 1)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1.5 md:col-span-1 space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">Disc %</Label>
                    <Input
                      type="number"
                      value={item.discount || ''}
                      onChange={e => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">GST %</Label>
                    <Select
                      onValueChange={(val) => handleItemChange(index, 'gstRate', parseFloat(val))}
                      value={String(item.gstRate)}
                    >
                      <SelectTrigger className="w-full h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% Exempt</SelectItem>
                        <SelectItem value="5">5% SGST+CGST</SelectItem>
                        <SelectItem value="12">12% Luxury</SelectItem>
                        <SelectItem value="18">18% Standard</SelectItem>
                        <SelectItem value="28">28% High Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">HSN Code</Label>
                    <Input
                      value={item.hsnCode}
                      onChange={e => handleItemChange(index, 'hsnCode', e.target.value)}
                      className="h-9 text-sm font-mono text-muted-foreground"
                    />
                  </div>
                  <div className="md:col-span-1 text-right pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground shrink-0"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </form>
      </main>
    </>
  );
}
