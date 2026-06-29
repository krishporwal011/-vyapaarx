'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Users, IndianRupee, ShoppingCart, Star, Search, Plus, Phone, Mail, MapPin, Loader2, X
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCustomers, useCreateCustomer } from '@/hooks/api/useCustomers';

const typeColors: Record<string, string> = {
  retail: 'bg-muted text-muted-foreground',
  wholesale: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  distributor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
};

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);
  
  const { data: response, isLoading } = useCustomers(page, 50);
  const customers = response?.data || [];

  const createCustomerMutation = useCreateCustomer();

  // Modals States
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [custType, setCustType] = useState<'retail' | 'wholesale' | 'distributor'>('wholesale');
  const [gstin, setGstin] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [address, setAddress] = useState('');
  
  const filtered = customers.filter(c =>
    (type === 'All' || c.type === type.toLowerCase()) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Customer Name is required');
      return;
    }
    createCustomerMutation.mutate({
      name,
      email: email || undefined,
      phone: phone || undefined,
      type: custType,
      gstin: gstin || undefined,
      state: state || undefined,
      city: city || undefined,
      street: address || undefined,
      tags: [],
      isActive: true,
    }, {
      onSuccess: () => {
        setAddModalOpen(false);
        // reset fields
        setName('');
        setEmail('');
        setPhone('');
        setCustType('wholesale');
        setGstin('');
        setState('Maharashtra');
        setCity('Mumbai');
        setAddress('');
      }
    });
  };

  return (
    <>
      <Topbar
        title="Customers"
        subtitle="Manage your customer base"
        action={{ label: 'Add Customer', onClick: () => setAddModalOpen(true), icon: Plus }}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Customers" value={isLoading ? "..." : String(response?.total || 0)} trend="neutral" icon={Users} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Revenue" value={isLoading ? "..." : "₹0"} trend="neutral" icon={IndianRupee} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={1} />
          <KpiCard label="Wholesale" value={isLoading ? "..." : String(customers.filter((c: any) => c.type === 'wholesale').length)} trend="neutral" icon={Star} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={2} />
          <KpiCard label="Distributors" value={isLoading ? "..." : String(customers.filter((c: any) => c.type === 'distributor').length)} trend="neutral" icon={ShoppingCart} iconBg="bg-teal-500/10" iconColor="text-teal-500" index={3} />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="pl-8 h-9 text-sm" />
          </div>
          <div className="flex gap-1">
            {['All', 'Retail', 'Wholesale', 'Distributor'].map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${type === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                {t}
              </button>
            ))}
          </div>
          <Button onClick={() => setAddModalOpen(true)} size="sm" className="h-9 brand-gradient text-white gap-1.5 ml-auto">
            <Plus className="h-3.5 w-3.5" />Add Customer
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Loading customers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border rounded-lg border-dashed">
            No customers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(c => (
              <Card key={c.id} className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="brand-gradient text-white font-bold text-sm">
                        {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm text-foreground">{c.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColors[c.type] || 'bg-muted'}`}>{c.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{c.phone || 'N/A'}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{c.city || 'N/A'}</div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Total Spend</p>
                      <p className="text-sm font-bold text-foreground">₹0</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Orders</p>
                      <p className="text-sm font-bold text-foreground">0</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* ADD CUSTOMER MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="bg-card border-border w-full max-w-md shadow-xl relative text-left">
            <button onClick={() => setAddModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
              <X className="h-4 w-4" />
            </button>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Add New Customer</CardTitle>
            </CardHeader>
            <form onSubmit={handleCreateCustomer}>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="cust-name">Customer Name</Label>
                    <Input id="cust-name" value={name} onChange={e => setName(e.target.value)} required placeholder="E.g. Priya Sharma" className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cust-email">Email Address</Label>
                    <Input id="cust-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="priya@example.com" className="h-9 text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="cust-phone">Phone Number</Label>
                    <Input id="cust-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cust-type">Customer Type</Label>
                    <select
                      id="cust-type"
                      value={custType}
                      onChange={e => setCustType(e.target.value as 'retail' | 'wholesale' | 'distributor')}
                      className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none"
                    >
                      <option value="wholesale">Wholesale Partner</option>
                      <option value="retail">Retail Client</option>
                      <option value="distributor">Distributor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="cust-gstin">GSTIN (Optional)</Label>
                    <Input id="cust-gstin" value={gstin} onChange={e => setGstin(e.target.value)} placeholder="27AAAAA0000A1Z1" className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cust-state">State / Place of Supply</Label>
                    <Input id="cust-state" value={state} onChange={e => setState(e.target.value)} placeholder="Maharashtra" className="h-9 text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="cust-city">City</Label>
                    <Input id="cust-city" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cust-address">Billing Address</Label>
                    <Input id="cust-address" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Corporate Park, Andheri" className="h-9 text-xs" />
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t border-border flex justify-end gap-2.5">
                <Button type="button" onClick={() => setAddModalOpen(false)} variant="outline" className="h-9 text-xs">Cancel</Button>
                <Button type="submit" disabled={createCustomerMutation.isPending} className="brand-gradient text-white text-xs h-9 font-semibold">
                  {createCustomerMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
