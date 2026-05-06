'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Search, Bell, Plus, LogOut, User, Settings, Building2, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void; icon?: React.ElementType };
}

export function Topbar({ title, subtitle, action }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [activeWorkspace, setActiveWorkspace] = useState('Vyapaar X (Main)');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vyapaarx_active_workspace');
      if (stored) setActiveWorkspace(stored);
    }
  }, []);

  const [alerts, setAlerts] = useState([
    { id: 1, text: 'Low stock: 24-inch monitors drop below 5 units', category: 'Inventory', priority: 'High', unread: true },
    { id: 2, text: 'Invoice INV-2026-0003 overdue by ₹45,000', category: 'Overdue', priority: 'High', unread: true },
    { id: 3, text: 'AI Accountant: Profit grew 14% this quarter', category: 'AI Insights', priority: 'Low', unread: true },
  ]);

  const unreadCount = alerts.filter(a => a.unread).length;

  const getInitials = (name?: string) => {
    if (!name) return 'VX';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSwitchWorkspace = (name: string) => {
    setActiveWorkspace(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vyapaarx_active_workspace', name);
    }
    toast.success(`Switched to workspace: ${name}`);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6 shrink-0 text-left">
      {/* Left: title */}
      <div>
        <h1 className="font-display text-lg font-bold text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Workspace Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border bg-muted/25 hover:bg-muted/50 text-xs text-foreground font-semibold px-2.5 cursor-pointer">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span>{activeWorkspace}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Workspace</div>
            <DropdownMenuItem
              className={`cursor-pointer font-medium ${activeWorkspace === 'Vyapaar X (Main)' ? 'bg-primary/5 text-primary' : 'hover:text-foreground'}`}
              onClick={() => handleSwitchWorkspace('Vyapaar X (Main)')}
            >
              <Building2 className="mr-2 h-3.5 w-3.5" /> Vyapaar X (Main)
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer font-medium ${activeWorkspace === 'Vyapaar Trading (Delhi)' ? 'bg-primary/5 text-primary' : 'hover:text-foreground'}`}
              onClick={() => handleSwitchWorkspace('Vyapaar Trading (Delhi)')}
            >
              <Building2 className="mr-2 h-3.5 w-3.5" /> Vyapaar Trading (Delhi)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer font-medium text-primary" onClick={() => {
              toast.success('Opening Company Creation Wizard...');
            }}>
              <Plus className="mr-2 h-3.5 w-3.5" /> Create New Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-8 w-52 pl-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 cursor-pointer">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-[#0C0B14] border-primary/20 p-2 text-foreground">
            <div className="flex items-center justify-between px-2.5 py-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notification Center</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  className="h-5 px-1.5 text-[9px] text-primary hover:text-primary/80 font-bold"
                  onClick={() => {
                    setAlerts(prev => prev.map(a => ({ ...a, unread: false })));
                    toast.success('Marked all notifications as read!');
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator className="bg-border/50" />
            <div className="max-h-60 overflow-y-auto space-y-1 py-1">
              {alerts.map(a => (
                <DropdownMenuItem
                  key={a.id}
                  className={`p-2 rounded-lg flex flex-col items-start gap-1 cursor-pointer transition-colors ${
                    a.unread ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/10'
                  }`}
                  onClick={() => {
                    setAlerts(prev => prev.map(item => item.id === a.id ? { ...item, unread: false } : item));
                    toast.success('Notification marked as read');
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <Badge variant={a.priority === 'High' ? 'destructive' : 'secondary'} className="text-[8px] px-1 py-0 font-bold">
                      {a.category}
                    </Badge>
                    {a.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-medium">{a.text}</p>
                </DropdownMenuItem>
              ))}
              {alerts.length === 0 && (
                <div className="p-4 text-center text-[10px] text-muted-foreground">All caught up! No notifications.</div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Action CTA */}
        {action && (
          <Button
            size="sm"
            className="h-8 gap-1.5 brand-gradient text-white shadow-none hover:opacity-90 transition-opacity cursor-pointer"
            onClick={action.onClick}
          >
            {action.icon ? <action.icon className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {action.label}
          </Button>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full cursor-pointer">
              <div className="h-7 w-7 rounded-full brand-gradient flex items-center justify-center text-[11px] font-bold text-white">
                {getInitials(user?.name)}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-semibold truncate">{user?.name || 'User Account'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@vyapaarx.com'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
