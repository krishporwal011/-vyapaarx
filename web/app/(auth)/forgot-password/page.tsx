'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(email);
    } catch (err) {
      console.error('[Forgot Password Error]', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#080710] font-sans overflow-hidden text-slate-100">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 border-r border-slate-800/40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0A15] to-[#050409] overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-violet-600/25 blur-[120px] pointer-events-none" />
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-500 shadow shrink-0">
            <Zap className="h-4.5 w-4.5 text-white" fill="white" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white">Vyapaar</span>
            <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">X</span>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center my-auto z-10 space-y-6 w-full">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-xs">
            <CheckCircle className="h-4 w-4" /> Automated Password Recovery Active
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-500">
            Forgot your password? Enter your business email, and we will send a password reset link to recover access to your secure workspace.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-[#09080F]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 z-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">Recover Password</h1>
            <p className="text-sm text-slate-400">Enter your email and we'll send a password reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Business Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@business.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-11 bg-slate-900/60 border-slate-800 text-white placeholder-slate-500"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-11 brand-gradient text-white font-semibold flex items-center justify-center gap-1.5">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
            </Button>
            
            <Link href="/login" className="block text-center text-xs text-slate-400 hover:underline">
              Back to Login
            </Link>
          </form>
        </div>
      </div>

    </div>
  );
}
