'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Bell, Mail, MessageSquare, Send, Sparkles, Sliders, Play, RotateCcw, Search, Check, AlertCircle, RefreshCw
} from 'lucide-react';

interface OutboundLog {
  id: string;
  recipient: string;
  channel: 'WhatsApp' | 'Email';
  templateName: string;
  status: 'Delivered' | 'Queued' | 'Failed';
  timestamp: string;
}

export default function CommunicationsPage() {
  const [logs, setLogs] = useState<OutboundLog[]>([
    { id: 'LOG01', recipient: 'Tanya Porwal (tanya@vyapaarx.com)', channel: 'Email', templateName: 'Monthly Profit & Loss Report', status: 'Delivered', timestamp: '2026-05-06 11:30' },
    { id: 'LOG02', recipient: '+91 98765 43210 (Karan Mehta)', channel: 'WhatsApp', templateName: 'Overdue Payment Alert', status: 'Delivered', timestamp: '2026-05-06 10:15' },
    { id: 'LOG03', recipient: 'Sneha Patel (sneha@vyapaarx.com)', channel: 'Email', templateName: 'Attendance Reminder', status: 'Queued', timestamp: '2026-05-06 13:00' },
    { id: 'LOG04', recipient: '+91 96012 34567 (Rohan Sharma)', channel: 'WhatsApp', templateName: 'Shift Timings Allocation', status: 'Failed', timestamp: '2026-05-05 18:45' },
  ]);

  const [triggers, setTriggers] = useState({
    invoiceWhatsApp: true,
    overdueEmail: true,
    staffAttendanceWhatsApp: false,
    aiWeeklyReportEmail: true,
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [template, setTemplate] = useState({
    subject: 'Action Required: Payment Overdue for {{invoice_number}}',
    body: 'Dear {{customer_name}},\n\nThis is a friendly reminder that payment for invoice {{invoice_number}} totaling ₹{{invoice_amount}} was due on {{due_date}}.\n\nPlease complete the payout at your earliest convenience to maintain active credit limits.\n\nWarm regards,\nFinance Desk, VyapaarX',
  });

  const handleToggleTrigger = (key: keyof typeof triggers) => {
    setTriggers(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Updated automation triggers!');
  };

  const handleAiGenerateTemplate = () => {
    if (!aiPrompt) {
      toast.error('Please describe your target template criteria first');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setTemplate({
        subject: '⚠️ Attention Needed: Outstanding Dues Notice',
        body: `Dear {{customer_name}},\n\nOur records indicate a pending invoice balance of ₹{{invoice_amount}} under reference {{invoice_number}}.\n\nKindly process the settlement via bank dispatch or UPI code as soon as possible to avoid temporary account halts.\n\nBest wishes,\nAccounts Desk, VyapaarX`,
      });
      setIsGenerating(false);
      setAiPrompt('');
      toast.success('AI successfully drafted a professional custom reminder template!');
    }, 1500);
  };

  const handleDispatchCampaign = () => {
    toast.success('Synthesized custom template and queued outbound campaign!');
    const newLog: OutboundLog = {
      id: `LOG0${logs.length + 1}`,
      recipient: 'All Overdue Customers (Automated Campaign)',
      channel: 'Email',
      templateName: template.subject,
      status: 'Queued',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setLogs([newLog, ...logs]);
  };

  return (
    <>
      <Topbar
        title="Campaigns & Automation Room"
        subtitle="Configure automated Nodemailer emails, Twilio WhatsApp alerts, and AI copywriting triggers"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* UPPER ROW: AUTOMATION TOGGLES & AI DRAFER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SMART AUTOMATION TRIGGERS */}
          <Card className="bg-card border-border shadow-sm lg:col-span-5 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" /> Core Automation Pipelines
                </CardTitle>
                <CardDescription>Activate rule-based automated WhatsApp and Email dispatch workflows.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/5 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-green-400" /> WhatsApp Invoice Delivery</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Send invoice PDFs instantly to clients on creation.</p>
                  </div>
                  <Switch checked={triggers.invoiceWhatsApp} onCheckedChange={() => handleToggleTrigger('invoiceWhatsApp')} />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/5 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-primary" /> Overdue Email Escalations</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Automatically email clients when invoice exceeds due date.</p>
                  </div>
                  <Switch checked={triggers.overdueEmail} onCheckedChange={() => handleToggleTrigger('overdueEmail')} />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/5 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-green-400" /> Attendance Shifts Alerts</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Ping WhatsApp reminders to staff for allocated shifts.</p>
                  </div>
                  <Switch checked={triggers.staffAttendanceWhatsApp} onCheckedChange={() => handleToggleTrigger('staffAttendanceWhatsApp')} />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/5 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-primary" /> AI Financial Reports digest</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Mail quarterly profit ledger reports and cash analysis.</p>
                  </div>
                  <Switch checked={triggers.aiWeeklyReportEmail} onCheckedChange={() => handleToggleTrigger('aiWeeklyReportEmail')} />
                </div>
              </CardContent>
            </div>
          </Card>

          {/* AI COPYWRITING ASSISTANT */}
          <Card className="bg-[#0C0B14] border-primary/20 shadow-lg shadow-primary/5 lg:col-span-7 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" /> AI Template Copywriting Architect
                </CardTitle>
                <CardDescription>Leverage AI models to generate high-conversion payment requests or follow-ups in plain English.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Explain campaign intent</label>
                  <Textarea
                    placeholder="E.g., Write a highly urgent overdue payment warning requesting settlement of invoice to avoid credit limits hold..."
                    value={aiPrompt}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAiPrompt(e.target.value)}
                    className="min-h-[80px] text-xs bg-muted/10 border-primary/10 focus-visible:ring-primary"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <Button
                    onClick={handleAiGenerateTemplate}
                    disabled={isGenerating}
                    className="brand-gradient text-white font-semibold text-xs h-8 px-4"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" /> Structuring copywriting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1.5" /> Draft Custom Template
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

        </div>

        {/* TEMPLATE EDITOR & DYNAMIC PREVIEW PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* TEMPLATE FORM FIELDS */}
          <Card className="bg-card border-border shadow-sm lg:col-span-6 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" /> active Template Editor
                </CardTitle>
                <CardDescription>Manually fine-tune email template body parameters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Subject Line</label>
                  <Input
                    value={template.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplate({ ...template, subject: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Message Body</label>
                  <Textarea
                    value={template.body}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTemplate({ ...template, body: e.target.value })}
                    className="min-h-[160px] text-xs"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button onClick={handleDispatchCampaign} className="brand-gradient text-white font-semibold text-xs h-9 px-5">
                    <Send className="h-3 w-3 mr-1.5" /> Dispatch Automated Campaign
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* DYNAMIC CARD RENDERING PREVIEW */}
          <Card className="bg-[#050408] border-border shadow-sm lg:col-span-6 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Play className="h-3.5 w-3.5 text-primary" /> Live Renders Preview
                </CardTitle>
                <CardDescription>Demonstrates how the placeholders resolve inside client-side notifications.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 space-y-3 shadow-md">
                  <div className="border-b border-border/40 pb-2 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground">To: <span className="text-white">karan@mehtaco.in</span></p>
                      <p className="text-xs font-bold text-white mt-1">
                        {template.subject.replace('{{invoice_number}}', 'INV-2026-0003')}
                      </p>
                    </div>
                    <Badge className="text-[9px] bg-primary/20 text-primary border-primary/20">Email Preview</Badge>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                    {template.body
                      .replace('{{customer_name}}', 'Karan Mehta')
                      .replace('{{invoice_number}}', 'INV-2026-0003')
                      .replace('{{invoice_amount}}', '45,000')
                      .replace('{{due_date}}', 'May 10, 2026')}
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>

        </div>

        {/* OUTBOUND CAMPAIGN DELIVERY LEDGER LOGS */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" /> Communication Ledger Logs
            </CardTitle>
            <CardDescription>Comprehensive ledger monitoring automated WhatsApp & Email receipts.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Recipient</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Pipeline Channel</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Dispatched Template</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Status</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map(l => (
                    <tr key={l.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-3 text-xs font-semibold text-foreground">{l.recipient}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[9px] font-bold">
                          {l.channel}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-slate-300 truncate max-w-[200px]">{l.templateName}</td>
                      <td className="p-3">
                        <Badge
                          variant={l.status === 'Delivered' ? 'default' : l.status === 'Queued' ? 'secondary' : 'destructive'}
                          className="text-[9px] font-bold"
                        >
                          {l.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground text-right">{l.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </main>
    </>
  );
}
