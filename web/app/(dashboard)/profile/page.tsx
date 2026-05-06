'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/global/LanguageSwitcher';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User, Building2, Shield, Bell, Key, Laptop, Calendar, Globe, Save, CheckCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { t } = useLanguage();
  const [name, setName] = useState('Karan Mehta');
  const [email, setEmail] = useState('karan.mehta@vyapaarx.com');
  const [phone, setPhone] = useState('9876543210');
  const [gstin, setGstin] = useState('27AAAAA1111A1Z1');
  const [company, setCompany] = useState('Karan Mehta Electronics Ltd.');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile credentials updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Account password updated securely!');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-[#09080F] px-6 py-3.5 text-left">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile Settings
          </h2>
          <p className="text-[11px] text-muted-foreground">Manage your personal credentials, GSTINs, and workspace details.</p>
        </div>
        <LanguageSwitcher />
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: USER INFO CARD */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="h-20 w-20 mx-auto border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">KM</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-bold text-white">{name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Admin • Owner</p>
                </div>
                <div className="pt-3 border-t border-border/30 text-left space-y-2 text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>GSTIN Code:</span>
                    <span className="font-mono text-slate-200">{gstin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Workspace:</span>
                    <span className="text-slate-200 truncate">{company}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTOR MODULES LOG */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Session Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-[11px] text-muted-foreground">
                <div className="flex gap-2.5 items-center">
                  <Laptop className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-200">Chrome (macOS) • Current</p>
                    <p className="text-[10px] text-muted-foreground">IP: 103.45.23.1 • Pune, India</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: EDIT FIELDS & CREDITORS FORM */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Business & Contact Details</CardTitle>
                <CardDescription>Update your wholesale trade designations and government registration references.</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Full Name</label>
                      <Input value={name} onChange={e => setName(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Email Address</label>
                      <Input value={email} onChange={e => setEmail(e.target.value)} className="h-9 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Phone Number</label>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">GSTIN Code</label>
                      <Input value={gstin} onChange={e => setGstin(e.target.value)} className="h-9 text-xs uppercase" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Registered Trade Enterprise</label>
                    <Input value={company} onChange={e => setCompany(e.target.value)} className="h-9 text-xs" />
                  </div>
                </CardContent>
                <div className="p-4 border-t border-border flex justify-end">
                  <Button type="submit" className="brand-gradient text-white text-xs h-9 font-semibold flex items-center gap-1.5">
                    <Save className="h-4 w-4" /> Save Details
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Change Password Security</CardTitle>
                <CardDescription>Revise account authentication credentials securely.</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">New Password</label>
                      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Confirm New Password</label>
                      <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-9 text-xs" />
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t border-border flex justify-end">
                  <Button type="submit" className="brand-gradient text-white text-xs h-9 font-semibold flex items-center gap-1.5">
                    <Key className="h-4 w-4" /> Change Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>

        </div>
      </main>
    </>
  );
}
