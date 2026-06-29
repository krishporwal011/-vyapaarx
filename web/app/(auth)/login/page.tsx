'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  Eye, EyeOff, Zap, ArrowRight, Loader2, Sparkles, CheckCircle
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid business email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: typeof window !== 'undefined' ? localStorage.getItem('remembered_email') || '' : '',
      password: '',
    },
  });

  // Handle auto-populate email on mount if remembered
  useState(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('remembered_email');
      if (email) {
        setRememberMe(true);
      }
    }
  });

  const onSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem('remembered_email', data.email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      await login(data);
    } catch (err: any) {
      console.error('[Login Error]', err);
      // Detailed error messages based on Supabase code/message
      let errMsg = err.message || 'Authentication failed';
      if (errMsg.includes('Invalid login credentials')) {
        errMsg = 'Incorrect email or password. Please try again.';
      } else if (errMsg.includes('Email not confirmed')) {
        errMsg = 'Your email address is not verified yet. Please check your inbox.';
      } else if (errMsg === '{}') {
        errMsg = 'Failed to connect to authentication server. Please check your connection.';
      }
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#080710] font-sans overflow-hidden text-slate-100">
      
      {/* LEFT PANEL - Premium Visual Storytelling Section */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 border-r border-slate-800/40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0A15] to-[#050409] overflow-hidden">
        
        {/* Neon blurred background mesh graphics */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-violet-600/25 blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-5 w-80 h-80 rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] shrink-0">
            <Zap className="h-4.5 w-4.5 text-white" fill="white" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white">Vyapaar</span>
            <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">X</span>
          </div>
        </div>

        {/* Floating ERP Analytics mockup widgets */}
        <div className="relative flex flex-col items-center justify-center my-auto z-10 space-y-6 w-full">
          
          {/* Main Simulated Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-[340px] p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-300" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" /> Live Cashflow Velocity
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-400 text-[10px] border-0 py-0.5">
                +24.8% MoM
              </Badge>
            </div>
            <p className="text-2xl font-bold text-white font-display">₹12,48,200</p>
            
            {/* Embedded Micro Chart Graphics */}
            <div className="h-14 flex items-end gap-1.5 mt-4">
              {[40, 55, 35, 70, 60, 85, 95].map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                  className={`w-full rounded-t-sm ${idx === 6 ? 'bg-primary shadow-[0_0_12px_rgba(139,92,246,0.5)]' : 'bg-slate-700'}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Mini Floating Secondary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-[280px] p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/50 backdrop-blur-md shadow-lg flex items-center gap-3 self-start hover:border-emerald-500/20 transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">GSTR-1 Status</p>
              <p className="text-xs font-semibold text-white">Tax Returns Fully Reconciled</p>
            </div>
          </motion.div>

        </div>

        {/* Footer info text */}
        <div className="relative z-10">
          <p className="text-xs text-slate-500 leading-relaxed">
            Enterprise-grade compliance logistics, real-time GST tax calculations, and AI-driven predictive forecasting models tailored for Indian business owners.
          </p>
        </div>

      </div>

      {/* RIGHT PANEL - Authentic Modern Sleek Auth Card panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-[#09080F]">
        
        {/* Soft neon glowing mesh behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 z-10">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-display text-white tracking-tight">Sign in to VyapaarX</h1>
              <p className="text-sm text-slate-400">Unlock your digital business ledger and analytics</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@business.com"
                  className={`h-11 bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus:border-primary/50 focus:ring-primary/20 ${errors.email ? 'border-destructive focus:ring-destructive' : ''}`}
                  {...registerField('email')}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`h-11 bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 pr-10 focus:border-primary/50 focus:ring-primary/20 ${errors.password ? 'border-destructive focus:ring-destructive' : ''}`}
                    {...registerField('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900/60 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                  <Label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer font-medium select-none">
                    Remember Me
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 brand-gradient text-white mt-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400">
              New to VyapaarX?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Create free account
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
