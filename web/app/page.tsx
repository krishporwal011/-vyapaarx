'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap, Receipt, Package, Users, ArrowRight, CheckCircle2, ChevronDown,
  Bot, ShieldCheck, HelpCircle, Star, LineChart, BarChart3, Lock, Send, Menu, X, Landmark, MessageSquare, Briefcase, Sparkles
} from 'lucide-react';

const REAL_FEATURES = [
  {
    icon: Receipt,
    title: 'GST Billing & Invoicing',
    desc: 'Professional state-compliant GST invoices (CGST, SGST, IGST) ready to share with customers in one click.',
    badge: 'Tax Ready'
  },
  {
    icon: Package,
    title: 'Inventory & Stock Vault',
    desc: 'Monitor stock levels in real time, configure low-stock alerts, and track item movements across warehouses.',
    badge: 'Live Tracking'
  },
  {
    icon: Users,
    title: 'Supplier & Party Ledger',
    desc: 'Keep complete history of purchase logs, credit limits, and outstanding payments to suppliers.',
    badge: 'Ledgers'
  },
  {
    icon: Briefcase,
    title: 'Staff & Attendance Desk',
    desc: 'A simple daily attendance tracker for workers, with automated shift times and leave managers.',
    badge: 'Operations'
  },
  {
    icon: Landmark,
    title: 'Cashbook & Expense Ledger',
    desc: 'Maintain daily cash-in and cash-out entries, track overhead expenses, and reconcile bank ledgers.',
    badge: 'Finances'
  },
  {
    icon: Bot,
    title: 'Practical AI Accountant',
    desc: 'Query your live catalog data in plain human language to quickly identify unpaid balances or tax sums.',
    badge: 'AI Assistant'
  },
];

const FAQS = [
  {
    q: 'Does VyapaarX support state-wise GST calculations?',
    a: 'Yes. VyapaarX automatically detects billing states to apply CGST + SGST for intrastate transactions or IGST for interstate transactions instantly.',
  },
  {
    q: 'Can I manage staff attendance and daily wages here?',
    a: 'Absolutely. The Operations module includes an interactive staff attendance registry, leave approval panel, and payroll calculator.',
  },
  {
    q: 'How does the AI Accountant query data securely?',
    a: 'The AI Accountant operates entirely inside a secure, read-only layer of your database, translating natural business questions into accurate metrics.',
  },
  {
    q: 'Can I export my data to Excel or PDF?',
    a: 'Yes, all ledgers, invoices, cashbooks, and customer lists can be downloaded in professional Excel or print-ready PDF formats.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh Mehta',
    role: 'Owner, Mehta Wholesalers',
    location: 'Mumbai, Maharashtra',
    text: 'VyapaarX transformed our manual invoicing completely. The state-wise GST split saves us hours of accountant fees every single month. Highly recommended!',
    rating: 5
  },
  {
    name: 'Siddharth Patel',
    role: 'Director, BlueOcean Distributors',
    location: 'Ahmedabad, Gujarat',
    text: 'The inventory tracking is simple and real. No complex ERP jargon. The low stock notification enables us to restock with suppliers before depletions.',
    rating: 5
  },
  {
    name: 'Anjali Sharma',
    role: 'Manager, Kraft Retail Outlet',
    location: 'New Delhi',
    text: 'Staff attendance and payroll management used to require separate files. Having them directly integrated into our sales ledger is incredibly practical.',
    rating: 5
  }
];

export default function MarketingLandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Chat Simulation States
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Hello! Ask me simple business questions like "Which invoices are unpaid?" or "Show GSTR summaries".' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Your live ledger shows total unpaid customer receivables of ₹2,15,400 across 2 pending invoices (INV-2026-0003, INV-2026-0004).";
      if (userMsg.toLowerCase().includes('stock') || userMsg.toLowerCase().includes('inventory')) {
        reply = "Alert: Stock for 'Ultra HD Monitor' is at 12 units (Low-Stock limit: 15). Recommended to reorder from 'Intel Suppliers'.";
      } else if (userMsg.toLowerCase().includes('tax') || userMsg.toLowerCase().includes('gst')) {
        reply = "Quarterly GSTR-1 preparation is ready: CGST collected: ₹54,000, SGST collected: ₹54,000. Total liability calculated: ₹1,08,000.";
      }
      setChatHistory(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#09080F] text-slate-100 font-sans selection:bg-primary selection:text-white">
      
      {/* SOLID PROFESSIONAL GLASS NAVBAR */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#09080F]/90 backdrop-blur-md border-slate-800/80 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4.5 w-4.5 text-white" fill="white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">Vyapaar<span className="text-primary">X</span></span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflows" className="hover:text-white transition-colors">Workflows</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Customers</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Button asChild size="sm" className="bg-primary text-white font-bold rounded-lg px-4 hover:opacity-90 transition-opacity">
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-400 hover:text-white">
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0A0912] border-b border-slate-800 px-6 py-4 space-y-4 text-sm font-semibold"
            >
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-400">Features</a>
              <a href="#workflows" onClick={() => setMobileMenuOpen(false)} className="block text-slate-400">Workflows</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-slate-400">Customers</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-slate-400">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-slate-400">FAQs</a>
              <div className="pt-2 flex flex-col gap-3">
                <Button asChild variant="outline" className="border-slate-800 text-slate-300 bg-transparent w-full">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary text-white w-full">
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1">
              Simple Business Software
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Billing, Inventory & Staff. <br />
              <span className="text-primary">Simplified for Growth.</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
              Maintain professional GST compliant invoices, track stock depletions, record staff daily attendance, and access smart ledger insights in one clean, human-designed dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild className="bg-primary text-white font-bold h-11 px-6 rounded-lg shadow-sm hover:opacity-95 transition-all text-xs flex items-center gap-1.5">
                <Link href="/register">Start Free Workspace <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-800 text-slate-300 bg-transparent h-11 px-5 rounded-lg hover:bg-slate-900/50 hover:text-white transition-all text-xs">
                <Link href="/login">Watch Demo</Link>
              </Button>
            </div>
          </div>

          {/* REAL PRODUCT MOCKUP CARD */}
          <div className="lg:col-span-6 w-full rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 md:p-5 shadow-lg">
            <div className="w-full rounded-lg border border-slate-800 bg-[#0C0B15] overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/10">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">VyapaarX Live Ledger</span>
                <Badge className="text-[9px] bg-primary/10 text-primary border-primary/20">Operational</Badge>
              </div>
              <div className="p-5 space-y-4 text-left">
                <div className="flex justify-between items-start border-b border-slate-800/60 pb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoices Ledger (This Month)</p>
                    <p className="text-2xl font-bold text-white mt-1">₹4,82,500</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-500/20 bg-emerald-500/5 font-bold">100% Tax Compliant</Badge>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">INV-2026-0003</p>
                      <p className="text-[10px] text-slate-400">Karan Mehta Co. (Maharashtra)</p>
                    </div>
                    <Badge className="text-[9px] bg-primary/20 text-primary">₹45,000</Badge>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">INV-2026-0004</p>
                      <p className="text-[10px] text-slate-400">Tanya Enterprises (Gujarat)</p>
                    </div>
                    <Badge className="text-[9px] bg-primary/20 text-primary">₹1,12,000</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-8 bg-slate-900/10 border-y border-slate-800/60 text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-6 text-slate-400 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
            <span>Used by Wholesalers, Retailers & Distributors</span>
          </div>
          <div>Invoices Processed: <span className="text-white">₹8.4M+</span></div>
          <div>GST Statements Generated: <span className="text-white">12,400+</span></div>
          <div>Active SME Onboarded: <span className="text-white">1,500+ across India</span></div>
        </div>
      </section>

      {/* CORE BUSINESS FEATURES */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">
            SaaS Features
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Everything needed to run operations</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm">
            Avoid complex, confusing interfaces. Our tools are designed specifically to be intuitive and trustworthy for growing businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REAL_FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900/20 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 text-left"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-800">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-bold border-slate-800">{f.badge}</Badge>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* REAL WORKFLOW TIMELINE */}
      <section id="workflows" className="py-20 bg-slate-900/10 border-t border-slate-800/60 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">
              Workflows
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">A complete billing ledger in 3 simple steps</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              No long learning curves. Set up and dispatch your first GST compliant invoice in less than 60 seconds.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start">
                <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-xs font-bold text-white">Create GST Invoice</p>
                  <p className="text-[11px] text-slate-400">Fill client billing state, add items from your inventory, and calculate automated tax rates.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-xs font-bold text-white">Track Roster & Renders</p>
                  <p className="text-[11px] text-slate-400">Mark staff attendance shifts, configure pay limits, and track supplier receipts.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-xs font-bold text-white">Dispatch Over WhatsApp</p>
                  <p className="text-[11px] text-slate-400">Share instant automated messages to clients with outstanding balances to clear credit limits.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/20 border border-slate-800/85 rounded-xl p-4 md:p-5 text-left">
            <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Compliance Invoice Preview</p>
                <p className="text-[10px] text-slate-500">CGST/SGST Split: Active</p>
              </div>
              <Badge className="text-[9px] bg-primary/20 text-primary">INV-2026-0003</Badge>
            </div>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span>Customer Party:</span>
                <span className="text-white font-bold">Karan Mehta Co. (Pune)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span>Items:</span>
                <span className="text-white font-bold">2x HD Monitor (₹20,000 each)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/40 pb-2">
                <span>Tax Breakdown:</span>
                <span className="text-white">CGST (9%): ₹1,800 | SGST (9%): ₹1,800</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-white">
                <span>Total Amount Due:</span>
                <span className="text-primary text-sm">₹43,600</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STAFF & PAYROLL SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 w-full rounded-xl bg-slate-900/30 border border-slate-800/80 p-4 md:p-5 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Daily Attendance logger</span>
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Tanya Porwal</p>
                  <p className="text-[10px] text-slate-400">Account Administrator</p>
                </div>
                <Badge className="text-[9px] bg-green-500/15 text-green-400 font-bold border-green-500/10">Present</Badge>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Rohan Sharma</p>
                  <p className="text-[10px] text-slate-400">Warehouse Staff</p>
                </div>
                <Badge className="text-[9px] bg-amber-500/15 text-amber-400 font-bold border-amber-500/10">Late (09:45 AM)</Badge>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-left">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">
              Operations & Payroll
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Manage staff attendance & daily salary payouts</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Track attendance shifts directly on your dashboard. Calculate daily wages, track payroll status, and approve leave requests without complicated spreadsheets.
            </p>
          </div>

        </div>
      </section>

      {/* PRACTICAL AI ACCOUNTANT SECTION */}
      <section className="py-20 bg-slate-900/10 border-t border-slate-800/60 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">
              AI Accountant
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">Your practical digital assistant, always on call</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Get direct database summaries in natural language. Identify outstanding debtor amounts or monthly GST collections immediately.
            </p>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Plain English bookkeeping queries</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Low stock alerts and depletions predictions</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Secure read-only database metrics</p>
            </div>
          </div>

          {/* Chat Assistant Simulating Card */}
          <div className="lg:col-span-7 bg-[#0C0B15] border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col h-[360px] overflow-hidden text-left relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-bold text-white">AI accountant assistant</p>
                  <p className="text-[10px] text-slate-500">Secure Database Read-Only Access</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-bold">Safe</Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center border text-[10px] font-bold shrink-0 ${msg.role === 'user' ? 'bg-primary border-primary text-white' : 'bg-slate-800 border-slate-700 text-primary'}`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className={`p-3 rounded-lg text-[11px] leading-relaxed ${msg.role === 'user' ? 'bg-primary/10 text-slate-100 border border-primary/20' : 'bg-slate-900/60 border border-slate-800 text-slate-300'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[80%] animate-pulse">
                  <div className="h-7 w-7 rounded-full bg-slate-850 border border-slate-800 text-primary flex items-center justify-center text-xs">AI</div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-500">Calculating ledger ratios...</div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="mt-4 flex gap-2 pt-3 border-t border-slate-800/60">
              <Input
                placeholder="Type: 'Show GSTR tax summaries' or 'Which invoices are unpaid?'"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="h-10 text-xs bg-slate-900/40 border-slate-800 text-white placeholder-slate-600"
              />
              <Button type="submit" size="sm" className="bg-primary text-white font-semibold px-4">
                Send
              </Button>
            </form>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">
            Testimonials
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Trusted by business owners like you</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-slate-900/10 text-left flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed italic mb-5">"{t.text}"</p>
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xs font-bold text-white">{t.name}</p>
                <p className="text-[10px] text-slate-500">{t.role} — {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIMPLE PRICING */}
      <section id="pricing" className="py-20 bg-slate-900/10 border-t border-slate-800/60 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">
              Pricing Plans
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Transparent plans. Cancel anytime.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="bg-[#0C0B15] border-slate-800 p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Starter Plan</p>
                <p className="text-2xl font-bold text-white mt-2">₹0</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Free Forever</p>
                <div className="space-y-3 mt-6 text-xs text-slate-300 text-left">
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Manual invoice generation</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Core inventory storage</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 1 active ledger account</p>
                </div>
              </div>
              <Button asChild className="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold h-10">
                <Link href="/register">Get Started</Link>
              </Button>
            </Card>

            <Card className="bg-[#0C0B15] border-primary/30 p-5 flex flex-col justify-between relative shadow-lg">
              <div className="absolute top-0 right-0 bg-primary text-white text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-bl">Popular</div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-primary">Business Suite</p>
                <p className="text-2xl font-bold text-white mt-2">₹1,499</p>
                <p className="text-[10px] text-slate-500 mt-0.5">per month</p>
                <div className="space-y-3 mt-6 text-xs text-slate-300 text-left">
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> State-wise automated GST splits</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> GSTR-1 compliant reporting</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> AI Accountant custom prompts</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Multi-user staff clearance</p>
                </div>
              </div>
              <Button asChild className="w-full mt-8 bg-primary hover:opacity-90 text-white font-bold h-10">
                <Link href="/register">Upgrade Workspace</Link>
              </Button>
            </Card>

            <Card className="bg-[#0C0B15] border-slate-800 p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Enterprise</p>
                <p className="text-2xl font-bold text-white mt-2">₹4,999</p>
                <p className="text-[10px] text-slate-500 mt-0.5">per month</p>
                <div className="space-y-3 mt-6 text-xs text-slate-300 text-left">
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Infinite AI Accountant tokens</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Multi-warehouse allocations</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Custom SLA support</p>
                </div>
              </div>
              <Button asChild className="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold h-10">
                <Link href="/register">Contact Sales</Link>
              </Button>
            </Card>

          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider">
            FAQ
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 text-left">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-slate-800/80 rounded-lg bg-[#0C0B15] overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-xs font-bold text-white hover:text-primary transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${activeFaq === idx ? 'transform rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-[11px] text-slate-400 leading-relaxed border-t border-slate-850 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-500 font-semibold">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-slate-400">VyapaarX Technologies</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">GSTR Guidelines</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
