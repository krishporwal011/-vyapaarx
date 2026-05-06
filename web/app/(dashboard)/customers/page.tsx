'use client';

import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, IndianRupee, ShoppingCart, Star, Search, Plus, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCustomers } from '@/hooks/api/useCustomers';

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
  
  const filtered = customers.filter(c =>
    (type === 'All' || c.type === type.toLowerCase()) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Topbar title="Customers" subtitle="Manage your customer base" action={{ label: 'Add Customer', onClick: () => {} }} />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Customers" value={isLoading ? "..." : String(response?.total || 0)} trend="neutral" icon={Users} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Revenue" value="--" trend="neutral" icon={IndianRupee} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={1} />
          <KpiCard label="Wholesale" value="--" trend="neutral" icon={Star} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={2} />
          <KpiCard label="Distributors" value="--" trend="neutral" icon={ShoppingCart} iconBg="bg-teal-500/10" iconColor="text-teal-500" index={3} />
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
          <Button size="sm" className="h-9 brand-gradient text-white gap-1.5 ml-auto"><Plus className="h-3.5 w-3.5" />Add</Button>
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
    </>
  );
}
