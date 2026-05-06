'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Send, Bot, User, Sparkles, Loader2, RefreshCw, BarChart2, ShieldCheck, HelpCircle, ArrowRight, BookOpen, AlertCircle
} from 'lucide-react';

import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAiChat, ChatMessage } from '@/hooks/api/useAi';

// Basic markdown-to-html renderer to satisfy markdown-rendering with zero runtime dependencies and perfect types
function renderSimpleMarkdown(text: string) {
  let html = text;

  // Escape HTML entities to prevent XSS
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Convert Bold headers (### Header)
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-primary mt-4 mb-2">$1</h3>');
  
  // Convert Bold text (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
  
  // Convert Code snippets (`code`)
  html = html.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-muted text-xs font-mono rounded border text-rose-500 font-semibold">$1</code>');
  
  // Convert Bullet lists (- item)
  html = html.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc text-sm text-muted-foreground my-1">$1</li>');

  // Convert Tables
  // Simple table parsing for the advisor summaries
  if (html.includes('|')) {
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '<div class="overflow-x-auto my-3 border rounded-lg bg-card"><table class="w-full text-left border-collapse text-xs">';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml += '<thead>';
        }
        
        const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        
        if (line.includes('---') || line.includes(':---')) {
          tableHtml += '</thead><tbody>';
          continue;
        }

        tableHtml += '<tr class="border-b last:border-0 hover:bg-muted/50 transition-colors">';
        cells.forEach(cell => {
          const tag = !inTable || line.includes('Name') || line.includes('Invoice') ? 'th' : 'td';
          const padding = tag === 'th' ? 'p-2.5 font-bold bg-muted/30 text-muted-foreground' : 'p-2.5 text-muted-foreground';
          tableHtml += `<${tag} class="${padding}">${cell}</${tag}>`;
        });
        tableHtml += '</tr>';
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table></div>';
          lines[i] = tableHtml + '\n' + lines[i];
        }
      }
    }
    if (inTable) {
      tableHtml += '</tbody></table></div>';
      html = lines.join('\n') + tableHtml;
    } else {
      html = lines.join('\n');
    }
  }

  // Convert double newlines to paragraphs
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<div') || p.trim().startsWith('<li')) return p;
    return `<p class="text-sm text-muted-foreground leading-relaxed my-2">${p}</p>`;
  }).join('\n');

  return <div dangerouslySetInnerHTML={{ __html: html }} className="space-y-1" />;
}

const PRESET_QUERIES = [
  { label: 'Top Selling Products', query: 'What are my top-selling products this month?' },
  { label: 'Pending Receivables', query: 'Which customers have pending payments outstanding?' },
  { label: 'Summarize GST Collected', query: 'Show GST collected and tax liabilities breakdown' },
  { label: 'Inventory Stock Forecast', query: 'Predict low-stock inventory limits and reorder needs' },
];

export default function AiAccountantPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I am your **VyapaarX AI Accountant**.\n\nI have secure live access to your PostgreSQL database. Ask me anything about your products, sales collections, pending invoices, or GST tax liabilities!",
    },
  ]);

  const chatMutation = useAiChat();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat end
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Append User Message optimistically
    const updatedHistory: ChatMessage[] = [...history, { role: 'user', content: messageText }];
    setHistory(updatedHistory);
    setInput('');

    try {
      // Trigger AI Chat call
      const aiReply = await chatMutation.mutateAsync({
        message: messageText,
        history: updatedHistory.filter(m => m.role !== 'system'),
      });

      // Append Assistant response
      setHistory([...updatedHistory, { role: 'assistant', content: aiReply }]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'AI Assistant failed to respond');
      setHistory([...updatedHistory, { role: 'assistant', content: '⚠️ **Error**: Failed to retrieve AI analysis. Please check your network and try again.' }]);
    }
  };

  const handleClearHistory = () => {
    setHistory([
      {
        role: 'assistant',
        content: "Hello! I am your **VyapaarX AI Accountant**.\n\nI have secure live access to your PostgreSQL database. Ask me anything about your products, sales collections, pending invoices, or GST tax liabilities!",
      },
    ]);
    toast.success('Chat memory cleared');
  };

  return (
    <>
      <Topbar
        title="AI Accountant"
        subtitle="Conversational business intelligence integrated with your live database ledger"
        action={{ label: 'Clear Memory', onClick: handleClearHistory, icon: RefreshCw }}
      />
      <main className="flex-1 overflow-hidden p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Main Chat Stream Area */}
        <Card className="flex-1 flex flex-col h-[calc(100vh-140px)] border-border bg-card overflow-hidden">
          <CardHeader className="border-b bg-muted/10 flex flex-row items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <div>
                <CardTitle className="text-sm font-semibold">Live ERP Consultation</CardTitle>
                <CardDescription className="text-[10px]">Contextual memory active • Mathematical synthesis</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] gap-1 font-semibold py-0.5">
              <ShieldCheck className="h-3 w-3" /> Secure DB Access
            </Badge>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center border ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 border-border text-primary'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className={`p-3.5 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary/10 border border-primary/20 text-foreground rounded-tr-none'
                    : 'bg-muted/40 border border-border text-foreground rounded-tl-none'
                }`}>
                  {renderSimpleMarkdown(msg.content)}
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex gap-3 max-w-[85%] animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted shrink-0 flex items-center justify-center border border-border">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                </div>
                <div className="p-3 bg-muted/30 border rounded-2xl rounded-tl-none space-y-1.5">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    VyapaarX Accountant is analyzing live PostgreSQL aggregates...
                  </p>
                  <div className="flex gap-1 pt-1">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-75" />
                    <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-150" />
                    <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Preset Suggested Prompts Panel */}
          {history.length <= 1 && (
            <div className="px-4 py-2 bg-muted/10 border-t border-border flex flex-wrap gap-1.5">
              {PRESET_QUERIES.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.query)}
                  className="px-2.5 py-1.5 rounded-lg border bg-card text-[11px] font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  {p.label} <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {/* Form Input Bar */}
          <div className="p-3 border-t bg-muted/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about sales velocity, stock levels, or GST liabilities..."
                disabled={chatMutation.isPending}
                className="h-10 text-sm flex-1 bg-card border-border pr-10"
              />
              <Button
                type="submit"
                disabled={chatMutation.isPending || !input.trim()}
                className="h-10 px-4 brand-gradient text-white gap-1 font-semibold"
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </Button>
            </form>
          </div>
        </Card>

        {/* Informational Guidance Sidebar Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" /> Supported Scope
              </CardTitle>
              <CardDescription className="text-[10px]">What you can ask the accountant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-1 text-xs">
              <div className="border-l-2 border-primary/20 pl-2">
                <p className="font-semibold text-foreground">Top Sales</p>
                <p className="text-muted-foreground">"Show me my top-selling items this month"</p>
              </div>
              <div className="border-l-2 border-primary/20 pl-2">
                <p className="font-semibold text-foreground">Unpaid Receivables</p>
                <p className="text-muted-foreground">"Which customers have pending payments?"</p>
              </div>
              <div className="border-l-2 border-primary/20 pl-2">
                <p className="font-semibold text-foreground">GST Compliance</p>
                <p className="text-muted-foreground">"Show GST collected this quarter"</p>
              </div>
              <div className="border-l-2 border-primary/20 pl-2">
                <p className="font-semibold text-foreground">Inventory Replenishment</p>
                <p className="text-muted-foreground">"Predict low stock inventory forecasting"</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse" /> Precision Advisory
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Every insight generated by VyapaarX is backed directly by live PostgreSQL ledger aggregations. In contrast to standard chat assistants, numbers are calculated mathematically to guarantee compliance accuracy.
            </CardContent>
          </Card>
        </div>

      </main>
    </>
  );
}
