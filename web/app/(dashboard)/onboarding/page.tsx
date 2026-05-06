'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronRight, Landmark, Building, Users, Package, FileText, Check, AlertCircle } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  desc: string;
  completed: boolean;
  type: 'BUSINESS' | 'GST' | 'PRODUCT' | 'SUPPLIER' | 'STAFF' | 'FINALIZE';
}

export default function OnboardingPage() {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { id: 1, title: 'Business Profile', desc: 'Configure company name and base currency.', completed: false, type: 'BUSINESS' },
    { id: 2, title: 'GSTIN Registry', desc: 'Provide compliance GSTIN registry number.', completed: false, type: 'GST' },
    { id: 3, title: 'Initial Catalog', desc: 'Add your first warehouse item/product.', completed: false, type: 'PRODUCT' },
    { id: 4, title: 'Supplier Registry', desc: 'Onboard your primary wholesale distributor.', completed: false, type: 'SUPPLIER' },
    { id: 5, title: 'Staff Clearances', desc: 'Invite administrators and sales managers.', completed: false, type: 'STAFF' },
    { id: 6, title: 'Publish Ledger', desc: 'Generate your initial workspace invoice.', completed: false, type: 'FINALIZE' },
  ]);

  const [activeStepId, setActiveStepId] = useState(1);

  // Form States
  const [businessName, setBusinessName] = useState('');
  const [currency, setCurrency] = useState('INR (₹)');
  const [gstin, setGstin] = useState('');
  const [stateOrigin, setStateOrigin] = useState('Maharashtra');
  const [firstProduct, setFirstProduct] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [firstSupplier, setFirstSupplier] = useState('');
  const [supplierGstin, setSupplierGstin] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState('Manager');

  const handleStepComplete = (id: number) => {
    // Validate current step before completing
    if (id === 1 && !businessName.trim()) {
      toast.error('Please enter your Business Name to proceed');
      return;
    }
    if (id === 2 && (!gstin.trim() || gstin.length < 15)) {
      toast.error('Please enter a valid 15-digit GSTIN');
      return;
    }
    if (id === 3 && !firstProduct.trim()) {
      toast.error('Please enter your first Product Name');
      return;
    }
    if (id === 4 && !firstSupplier.trim()) {
      toast.error('Please enter your first Supplier Name');
      return;
    }
    if (id === 5 && !staffEmail.trim()) {
      toast.error('Please enter a staff email address');
      return;
    }

    setSteps(prev => prev.map(s => s.id === id ? { ...s, completed: true } : s));
    toast.success(`Completed Step ${id}: ${steps.find(s => s.id === id)?.title}!`);
    if (id < steps.length) {
      setActiveStepId(id + 1);
    }
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <>
      <Topbar
        title="Workspace Onboarding"
        subtitle="Complete your primary business setup wizard to initialize compliant GST ledgers"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* PROGRESS TRACKER */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Workspace Setup Progress</h3>
                <p className="text-xs text-muted-foreground">Complete all setup parameters to start publishing GSTR compliance reports.</p>
              </div>
              <Badge className="text-xs bg-primary/20 text-primary font-bold">{progressPercent}% Completed</Badge>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: STEP CHECKLIST LINKS */}
          <div className="lg:col-span-4 space-y-3">
            {steps.map(s => {
              const isActive = s.id === activeStepId;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStepId(s.id)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-primary/5 border-primary shadow-sm'
                      : s.completed
                      ? 'bg-muted/10 border-border opacity-85'
                      : 'bg-card border-border hover:bg-muted/5'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <p className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {s.id}. {s.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{s.desc}</p>
                  </div>
                  {s.completed ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: INTERACTIVE SETUP FORMS */}
          <div className="lg:col-span-8">
            <Card className="bg-card border-border shadow-sm min-h-[380px] flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                {activeStepId === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Building className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Business Profile Setup</h4>
                        <p className="text-[10px] text-muted-foreground">Configure the core profile identifiers for your organization.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Registered Business Name</label>
                        <Input
                          placeholder="E.g., Mehta Wholesale Co."
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Base Currency</label>
                        <Input
                          placeholder="INR (₹)"
                          value={currency}
                          onChange={e => setCurrency(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStepId === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Landmark className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">GSTIN Registry</h4>
                        <p className="text-[10px] text-muted-foreground">Compliance parameters for automated CGST, SGST, & IGST routing.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Business GSTIN (15-Digit)</label>
                        <Input
                          placeholder="E.g., 27AAAAA1111A1Z1"
                          maxLength={15}
                          value={gstin}
                          onChange={e => setGstin(e.target.value.toUpperCase())}
                          className="h-9 text-xs uppercase"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">State of Origin</label>
                        <Input
                          placeholder="Maharashtra"
                          value={stateOrigin}
                          onChange={e => setStateOrigin(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStepId === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Add First Product</h4>
                        <p className="text-[10px] text-muted-foreground">Populate your warehouse catalog with an initial compliance item.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Product Item Name</label>
                        <Input
                          placeholder="E.g., HD Monitor"
                          value={firstProduct}
                          onChange={e => setFirstProduct(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">HSN Code</label>
                        <Input
                          placeholder="E.g., HSN8471"
                          value={hsnCode}
                          onChange={e => setHsnCode(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStepId === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Onboard First Supplier</h4>
                        <p className="text-[10px] text-muted-foreground">Configure profiles for your primary raw material distributor.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Supplier Name</label>
                        <Input
                          placeholder="E.g., Intel Distributors"
                          value={firstSupplier}
                          onChange={e => setFirstSupplier(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Supplier GSTIN (Optional)</label>
                        <Input
                          placeholder="E.g., 27BBBBB2222B2Z2"
                          maxLength={15}
                          value={supplierGstin}
                          onChange={e => setSupplierGstin(e.target.value.toUpperCase())}
                          className="h-9 text-xs uppercase"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStepId === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Invite Staff Clearances</h4>
                        <p className="text-[10px] text-muted-foreground">Authorize daily workers and managers to publish invoices.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Staff Email Address</label>
                        <Input
                          type="email"
                          placeholder="staff@mehtawholesale.com"
                          value={staffEmail}
                          onChange={e => setStaffEmail(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Assigned RBAC Role</label>
                        <select
                          value={staffRole}
                          onChange={e => setStaffRole(e.target.value)}
                          className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:border-primary focus:outline-none"
                        >
                          <option value="Manager">Manager</option>
                          <option value="Staff">Warehouse Staff</option>
                          <option value="Accountant">Accountant</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStepId === 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Publish Initial Ledger</h4>
                        <p className="text-[10px] text-muted-foreground">Final step: initialize GSTR compliance database tables.</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/20 border border-border flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">Workspace ready for deployment</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">By clicking complete below, you authorize the VyapaarX framework to securely activate tax calculations for state: {stateOrigin}.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION FOOTER */}
              <div className="p-5 border-t border-border flex items-center justify-between">
                <Button
                  onClick={() => setActiveStepId(prev => Math.max(1, prev - 1))}
                  disabled={activeStepId === 1}
                  variant="outline"
                  className="h-9 text-xs px-4"
                >
                  Previous
                </Button>
                {activeStepId === 6 ? (
                  <Button
                    onClick={() => {
                      toast.success('Workspace fully onboarded and published!');
                      window.location.href = '/dashboard';
                    }}
                    className="brand-gradient text-white font-bold text-xs h-9 px-5"
                  >
                    Complete Onboarding
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleStepComplete(activeStepId)}
                    className="brand-gradient text-white font-bold text-xs h-9 px-5 flex items-center gap-1.5"
                  >
                    Save & Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

            </Card>
          </div>

        </div>

      </main>
    </>
  );
}
