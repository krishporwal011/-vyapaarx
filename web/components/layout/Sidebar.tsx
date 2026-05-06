'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard, Package, ShoppingCart, TrendingUp,
  Receipt, Users, Truck, BarChart3, Settings,
  ChevronRight, Zap, Sparkles, Eye, Bell, Sun, Moon, Languages
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);

  const getInitials = (name?: string) => {
    if (!name) return 'VX';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const navGroups = [
    {
      label: t.navOverview,
      items: [
        { href: '/dashboard', icon: LayoutDashboard, label: t.navDashboard },
        { href: '/analytics', icon: BarChart3, label: t.navAnalytics },
      ],
    },
    {
      label: t.navCommerce,
      items: [
        { href: '/inventory', icon: Package, label: t.navInventory, badge: '12' },
        { href: '/sales', icon: ShoppingCart, label: t.navSales },
        { href: '/purchases', icon: TrendingUp, label: t.navPurchases },
        { href: '/gst-billing', icon: Receipt, label: t.navGstBilling },
        { href: '/payments', icon: Receipt, label: t.navPayments },
      ],
    },
    {
      label: t.navAiIntel,
      items: [
        { href: '/ai-accountant', icon: Sparkles, label: t.navAiAccountant },
        { href: '/forecasting', icon: Eye, label: t.navForecasting },
      ],
    },
    {
      label: t.navOpsHr,
      items: [
        { href: '/staff', icon: Users, label: t.navStaff },
        { href: '/payroll', icon: Receipt, label: t.navPayroll },
        { href: '/cashbook', icon: TrendingUp, label: t.navCashbook },
        { href: '/communications', icon: Bell, label: t.navCommunications },
      ],
    },
    {
      label: t.navContacts,
      items: [
        { href: '/customers', icon: Users, label: t.navCustomers },
        { href: '/suppliers', icon: Truck, label: t.navSuppliers },
      ],
    },
    {
      label: t.navSystem,
      items: [
        { href: '/settings', icon: Settings, label: t.navSettings },
      ],
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex h-full w-[240px] flex-col border-r border-border bg-card">
      
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient shrink-0">
          <Zap className="h-4 w-4 text-white" fill="white" />
        </div>
        <div>
          <span className="font-display text-base font-bold text-foreground">Vyapaar</span>
          <span className="font-display text-base font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">X</span>
        </div>
      </div>

      {/* Navigation List */}
      <ScrollArea className="flex-1 px-3 py-4">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-4 text-left">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.label}
            </p>
            {(group.items as any[]).map(({ href, icon: Icon, label, badge }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150 mb-0.5',
                    active
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', active && 'text-primary')} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">{badge}</Badge>
                  )}
                  {active && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
                </Link>
              );
            })}
            {gi < navGroups.length - 1 && <Separator className="mt-3 mb-1 opacity-50" />}
          </div>
        ))}
      </ScrollArea>

      {/* QUICK SETTINGS SUB-WIDGET */}
      <div className="px-3 pb-2 border-t border-border/40 pt-3 space-y-2 text-left bg-muted/10">
        <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
          <span>Quick Controls</span>
        </div>
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><Languages className="h-3.5 w-3.5 text-slate-400" /> Lang</span>
          <div className="flex bg-card rounded border border-border/50 p-0.5 text-[9px] font-bold">
            <button onClick={() => setLanguage('EN')} className={`px-1.5 py-0.5 rounded ${language === 'EN' ? 'bg-primary text-white' : 'text-slate-400'}`}>EN</button>
            <button onClick={() => setLanguage('HI')} className={`px-1.5 py-0.5 rounded ${language === 'HI' ? 'bg-primary text-white' : 'text-slate-400'}`}>हिंदी</button>
            <button onClick={() => setLanguage('HN')} className={`px-1.5 py-0.5 rounded ${language === 'HN' ? 'bg-primary text-white' : 'text-slate-400'}`}>HN</button>
          </div>
        </div>
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><Moon className="h-3.5 w-3.5 text-slate-400" /> Dark Mode</span>
          <button onClick={() => setDarkMode(!darkMode)} className="h-5 w-9 bg-card border border-border rounded-full relative p-0.5 transition-colors">
            <div className={`h-3.5 w-3.5 bg-primary rounded-full transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* User Footer Shortcut to Profile Page */}
      <div className="shrink-0 border-t border-border p-3 text-left">
        <Link href="/profile" className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-accent cursor-pointer transition-colors">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {getInitials(user?.name || 'Karan Mehta')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name || 'Karan Mehta'}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{user?.role || 'admin'}</p>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
