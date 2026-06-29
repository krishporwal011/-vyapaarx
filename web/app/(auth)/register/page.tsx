'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  Eye, EyeOff, Zap, ArrowRight, ArrowLeft, Loader2, Sparkles, User, Building, Phone, CheckCircle
} from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Please enter a valid business email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), 'Password must contain at least one uppercase letter')
    .refine((val) => /[a-z]/.test(val), 'Password must contain at least one lowercase letter')
    .refine((val) => /[0-9]/.test(val), 'Password must contain at least one number'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Multi-step Registration wizard states
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'staff'>('admin');

  const {
    register: registerField,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', phone: '', businessName: '', email: '', password: '', confirmPassword: '' },
  });

  const handleNextStep = async () => {
    // Validate Step 1 fields before advancing
    const isStep1Valid = await trigger(['name', 'email', 'password', 'confirmPassword']);
    if (isStep1Valid) {
      setStep(2);
    } else {
      toast.error('Please correct Step 1 errors');
    }
  };

  const onSubmit = async (data: RegisterValues) => {
    setIsSubmitting(true);
    try {
      await signup({ ...data, role: selectedRole });
    } catch (err: any) {
      console.error('[Registration Error]', err);
      const message = err.message === '{}' || !err.message ? 'Failed to create workspace' : err.message;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#080710] font-sans overflow-hidden text-slate-100">
      
      {/* LEFT PANEL - Premium Visual Mockup & Hero */}
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

        {/* Mock Onboarding Steps Preview */}
        <div className="relative flex flex-col items-center justify-center my-auto z-10 space-y-6 w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[340px] p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl" />
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1 mb-3">
              <Sparkles className="h-3 w-3 text-primary" /> Setup Progress
            </span>
            
            {/* Step Onboarding List Layout */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <span className="text-xs font-semibold text-slate-200">Personalize Account Profile</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${step === 2 ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}>2</div>
                <span className={`text-xs font-semibold ${step === 2 ? 'text-slate-200' : 'text-slate-500'}`}>Verify Business Workspace</span>
              </div>
            </div>
          </motion.div>

          {/* Secure ERP Cloud badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-xs"
          >
            <CheckCircle className="h-4 w-4" /> Cloud Database Encryption Active
          </motion.div>

        </div>

        {/* Footer info text */}
        <div className="relative z-10">
          <p className="text-xs text-slate-500 leading-relaxed">
            Create an enterprise cloud workspace, organize your inventory, and configure tax invoicing states instantly.
          </p>
        </div>

      </div>

      {/* RIGHT PANEL - Animated Multi-step Registration Card */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-[#09080F]">
        
        {/* Soft neon glowing mesh behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 z-10">
          
          {/* Onboarding progress bar indicator */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: step === 1 ? '50%' : '100%' }}
              transition={{ duration: 0.4 }}
              className="h-full brand-gradient"
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold font-display text-white">Create your VyapaarX account</h1>
                  <p className="text-sm text-slate-400">Step 1: Personal Profile Setup</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="Tanya Porwal"
                        className={`h-11 bg-slate-900/60 border-slate-800 text-white pl-10 focus:border-primary/50 focus:ring-primary/20 ${errors.name ? 'border-destructive' : ''}`}
                        {...registerField('name')}
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Business Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tanya@business.com"
                      className={`h-11 bg-slate-900/60 border-slate-800 text-white focus:border-primary/50 focus:ring-primary/20 ${errors.email ? 'border-destructive' : ''}`}
                      {...registerField('email')}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Secure Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        className={`h-11 bg-slate-900/60 border-slate-800 text-white pr-10 focus:border-primary/50 focus:ring-primary/20 ${errors.password ? 'border-destructive' : ''}`}
                        {...registerField('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`h-11 bg-slate-900/60 border-slate-800 text-white pr-10 focus:border-primary/50 focus:ring-primary/20 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                        {...registerField('confirmPassword')}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleNextStep}
                    type="button"
                    className="w-full h-11 brand-gradient text-white mt-2 font-semibold shadow-lg flex items-center justify-center gap-1"
                  >
                    Continue to Workspace <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-center text-sm text-slate-400">
                  Already registered?{' '}
                  <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold font-display text-white">Create your VyapaarX account</h1>
                  <p className="text-sm text-slate-400">Step 2: Workspace Setup & Role</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="businessName" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Business / Company Name</Label>
                    <div className="relative">
                      <Input
                        id="businessName"
                        placeholder="Vyapaar Trading Co."
                        className={`h-11 bg-slate-900/60 border-slate-800 text-white pl-10 focus:border-primary/50 focus:ring-primary/20 ${errors.businessName ? 'border-destructive' : ''}`}
                        {...registerField('businessName')}
                      />
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    </div>
                    {errors.businessName && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Phone (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        className={`h-11 bg-slate-900/60 border-slate-800 text-white pl-10 focus:border-primary/50 focus:ring-primary/20`}
                        {...registerField('phone')}
                      />
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    </div>
                  </div>

                  {/* Onboarding Role Selection Widgets */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Your Role</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('admin')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedRole === 'admin' ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}
                      >
                        <p className="text-xs font-bold">Admin/Owner</p>
                        <p className="text-[10px] text-slate-400 mt-1">Full dashboard setup control</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('staff')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedRole === 'staff' ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}
                      >
                        <p className="text-xs font-bold">Staff Member</p>
                        <p className="text-[10px] text-slate-400 mt-1">Record inventory only</p>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => setStep(1)}
                      type="button"
                      variant="outline"
                      className="h-11 border-slate-800 text-slate-300 bg-transparent flex items-center justify-center gap-1 px-4"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-11 brand-gradient text-white font-semibold shadow-lg"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Initialize Workspace'
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
