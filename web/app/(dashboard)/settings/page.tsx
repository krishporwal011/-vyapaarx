'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User, Building2, Bell, Shield, Palette, Camera, Users, CreditCard, Sparkles, Plus, Trash2, Mail, CheckCircle, ArrowRight, Loader2
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  // Multi-tenant SaaS team collaboration states
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Tanya Porwal', email: 'tanya@vyapaarx.com', role: 'Owner', status: 'Active' },
    { id: '2', name: 'Karan Mehta', email: 'karan@mehtaco.in', role: 'Manager', status: 'Active' },
    { id: '3', name: 'Sneha Patel', email: 'sneha@vyapaarx.com', role: 'Staff', status: 'Pending Invitation' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Manager' | 'Staff'>('Staff');

  // Subscription SaaS billing states
  const [currentPlan, setCurrentPlan] = useState<'Starter' | 'Business Suite' | 'Enterprise Cloud'>('Business Suite');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    const newMember = {
      id: String(teamMembers.length + 1),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending Invitation',
    };
    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    toast.success(`Invitation successfully dispatched to ${inviteEmail}`);
  };

  const handleUpgradePlan = (plan: 'Starter' | 'Business Suite' | 'Enterprise Cloud') => {
    if (plan === currentPlan) {
      toast.error('You are already subscribed to this tier');
      return;
    }
    setIsUpgrading(true);
    toast.success(`Redirecting to secure payment checkout gateway...`);
    setTimeout(() => {
      setCurrentPlan(plan);
      setIsUpgrading(false);
      toast.success(`Workspace successfully updated to ${plan}!`);
    }, 1500);
  };

  return (
    <>
      <Topbar title="Settings" subtitle="Manage account and preferences" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6 h-9">
              <TabsTrigger value="profile" className="text-xs gap-1.5"><User className="h-3.5 w-3.5" />Profile</TabsTrigger>
              <TabsTrigger value="business" className="text-xs gap-1.5"><Building2 className="h-3.5 w-3.5" />Business</TabsTrigger>
              <TabsTrigger value="team" className="text-xs gap-1.5"><Users className="h-3.5 w-3.5" />Team</TabsTrigger>
              <TabsTrigger value="billing" className="text-xs gap-1.5"><CreditCard className="h-3.5 w-3.5" />Workspace & Billing</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs gap-1.5"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
              <TabsTrigger value="security" className="text-xs gap-1.5"><Shield className="h-3.5 w-3.5" />Security</TabsTrigger>
              <TabsTrigger value="appearance" className="text-xs gap-1.5"><Palette className="h-3.5 w-3.5" />Appearance</TabsTrigger>
            </TabsList>

            {/* Profile */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-5">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="brand-gradient text-white text-xl font-bold">TP</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="gap-2"><Camera className="h-3.5 w-3.5" />Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs">Full Name</Label><Input defaultValue="Tanya Porwal" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input defaultValue="tanya@vyapaarx.com" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input defaultValue="+91 98765 43210" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Role</Label><Input defaultValue="Admin" disabled className="opacity-60" /></div>
                  </div>
                  <Button className="brand-gradient text-white">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business */}
            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>This information appears on your invoices and documents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs">Business Name</Label><Input defaultValue="Vyapaar X Enterprises" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">GSTIN</Label><Input defaultValue="27AAPVY1234F1Z5" className="font-mono" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">PAN</Label><Input defaultValue="AAPVY1234F" className="font-mono" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Business Type</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                        <option>Private Limited</option><option>LLP</option><option>Proprietorship</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 col-span-2"><Label className="text-xs">Registered Address</Label><Input defaultValue="123 Vyapaar Nagar, Mumbai, Maharashtra 400001" /></div>
                  </div>
                  <Button className="brand-gradient text-white">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle><CardDescription>Choose what you want to be notified about.</CardDescription></CardHeader>
                <CardContent className="space-y-5">
                  {[
                    { label: 'New Orders', desc: 'Get notified when a new order is placed', defaultOn: true },
                    { label: 'Low Stock Alerts', desc: 'Alert when products fall below threshold', defaultOn: true },
                    { label: 'Invoice Overdue', desc: 'Remind when invoices are past due date', defaultOn: true },
                    { label: 'Payment Received', desc: 'Notify when a payment is received', defaultOn: false },
                    { label: 'Weekly Report', desc: 'Receive weekly business summary email', defaultOn: false },
                  ].map(n => (
                    <div key={n.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{n.label}</p>
                        <p className="text-xs text-muted-foreground">{n.desc}</p>
                      </div>
                      <Switch defaultChecked={n.defaultOn} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader><CardTitle>Security Settings</CardTitle><CardDescription>Keep your account safe and secure.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5"><Label className="text-xs">Current Password</Label><Input type="password" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">New Password</Label><Input type="password" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Confirm Password</Label><Input type="password" /></div>
                  <Button className="brand-gradient text-white">Update Password</Button>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Customize how VyapaarX looks.</CardDescription></CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className="text-xs mb-3 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'system'].map(t => (
                        <button key={t} onClick={() => setTheme(t)}
                          className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors capitalize text-sm font-medium
                            ${theme === t ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-muted-foreground'}`}>
                          <div className={`h-8 w-8 rounded-full ${t === 'dark' ? 'bg-slate-800' : t === 'light' ? 'bg-gray-100 border border-gray-200' : 'bg-gradient-to-br from-gray-100 to-slate-800'}`} />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Collaboration */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>Invite team members and manage role-based permissions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Invite form */}
                  <form onSubmit={handleInviteSubmit} className="p-4 rounded-xl border border-border bg-muted/25 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" /> Invite New Member
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="member@business.com"
                          value={inviteEmail}
                          onChange={e => setInviteEmail(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="w-full sm:w-40">
                        <select
                          value={inviteRole}
                          onChange={e => setInviteRole(e.target.value as any)}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
                        >
                          <option value="Manager">Manager</option>
                          <option value="Staff">Staff</option>
                        </select>
                      </div>
                      <Button type="submit" size="sm" className="h-9 px-4 brand-gradient text-white font-semibold">
                        <Plus className="h-4 w-4 mr-1" /> Send Invite
                      </Button>
                    </div>
                  </form>

                  <Separator />

                  {/* Members list */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workspace Members ({teamMembers.length})</p>
                    <div className="space-y-2">
                      {teamMembers.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">{m.name.slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-semibold">{m.name}</p>
                              <p className="text-[10px] text-muted-foreground">{m.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] border-primary/20 bg-primary/5 text-primary font-semibold py-0.5">{m.role}</Badge>
                            <Badge variant={m.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] font-semibold py-0.5">{m.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workspace & Billing */}
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Workspace & Billing</CardTitle>
                  <CardDescription>Manage subscription plans, billing periods, and workspace limits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Active Plan info */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" /> Active Plan
                      </span>
                      <p className="text-lg font-bold text-foreground mt-1">{currentPlan}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Workspace billing isolates all invoices, products, and AI credits.</p>
                    </div>
                    <Badge className="bg-primary text-white font-semibold self-start sm:self-center">Active</Badge>
                  </div>

                  <Separator />

                  {/* Usage tracking */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Usage Tracker</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg border border-border bg-muted/10">
                        <p className="text-[10px] uppercase text-muted-foreground font-bold font-semibold">Invoices issued</p>
                        <p className="text-base font-bold text-foreground mt-1">12 / 100</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-muted/10">
                        <p className="text-[10px] uppercase text-muted-foreground font-bold font-semibold">Active Products</p>
                        <p className="text-base font-bold text-foreground mt-1">45 / Unlimited</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border bg-muted/10">
                        <p className="text-[10px] uppercase text-muted-foreground font-bold font-semibold">AI tokens used</p>
                        <p className="text-base font-bold text-foreground mt-1">4 / 50</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Upgrade plans options */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SaaS Upgrade Options</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { name: 'Starter', price: '₹0', features: 'Basic ledger, 1 Seat' },
                        { name: 'Business Suite', price: '₹1,499', features: 'State GST, GSTR-1, 5 Seats' },
                        { name: 'Enterprise Cloud', price: '₹4,999', features: 'Infinite AI, Forecasting, 50 Seats' },
                      ].map(plan => (
                        <div key={plan.name} className={`p-4 rounded-xl border flex flex-col justify-between ${currentPlan === plan.name ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                          <div>
                            <p className="text-xs font-bold text-foreground">{plan.name}</p>
                            <p className="text-lg font-bold text-primary mt-1">{plan.price}</p>
                            <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">{plan.features}</p>
                          </div>
                          <Button
                            onClick={() => handleUpgradePlan(plan.name as any)}
                            disabled={isUpgrading}
                            variant={currentPlan === plan.name ? 'outline' : 'default'}
                            className={`w-full mt-4 h-8 text-xs font-semibold ${currentPlan === plan.name ? 'border-primary/20 text-primary hover:bg-primary/5' : 'brand-gradient text-white'}`}
                          >
                            {isUpgrading && currentPlan !== plan.name ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : currentPlan === plan.name ? (
                              'Current Plan'
                            ) : (
                              'Switch Plan'
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
