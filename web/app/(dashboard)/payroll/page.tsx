'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard, Calendar, Clock, Sparkles, Check, X, FileText, Download, Plus, ChevronRight, UserPlus
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  name: string;
  role: string;
  type: 'Sick' | 'Casual' | 'Unpaid';
  dates: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Payslip {
  id: string;
  name: string;
  role: string;
  baseSalary: number;
  overtimeHours: number;
  deductions: number;
  bonus: number;
  totalPay: number;
  status: 'Paid' | 'Processing';
}

interface Shift {
  id: string;
  name: string;
  role: string;
  shift: string;
  attendancePct: string;
}

export default function PayrollPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    baseSalary: '',
    shift: 'Morning Shift (9AM - 6PM)',
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.role || !staffForm.baseSalary) {
      toast.error('Please fill in all staff registration details');
      return;
    }

    const base = Number(staffForm.baseSalary);
    const newPayslip: Payslip = {
      id: `PAY0${payslips.length + 1}`,
      name: staffForm.name,
      role: staffForm.role,
      baseSalary: base,
      overtimeHours: 0,
      deductions: 0,
      bonus: 0,
      totalPay: base,
      status: 'Processing',
    };

    const newShift: Shift = {
      id: `S${shifts.length + 1}`,
      name: staffForm.name,
      role: staffForm.role,
      shift: staffForm.shift,
      attendancePct: '100%',
    };

    // Optionally create a sick leave mock request for the new employee to showcase workflow
    const newLeave: LeaveRequest = {
      id: `LR0${leaves.length + 1}`,
      name: staffForm.name,
      role: staffForm.role,
      type: 'Sick',
      dates: 'May 08 - May 09',
      days: 2,
      status: 'Pending',
    };

    setPayslips([...payslips, newPayslip]);
    setShifts([...shifts, newShift]);
    setLeaves([...leaves, newLeave]);

    setStaffForm({
      name: '',
      role: '',
      baseSalary: '',
      shift: 'Morning Shift (9AM - 6PM)',
    });
    setShowAddStaff(false);
    toast.success(`Registered employee "${staffForm.name}" successfully!`);
  };

  const handleLeaveDecision = (id: string, decision: 'Approved' | 'Rejected') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: decision } : l));
    toast.success(`Leave request ${decision.toLowerCase()} successfully!`);
  };

  const handlePaySalary = (id: string) => {
    setPayslips(prev => prev.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
    toast.success(`Dispatched payslip payment successfully!`);
  };

  return (
    <>
      <Topbar
        title="Payroll & HR Center"
        subtitle="Manage attendance-based payroll sheets, leave requests, and shift schedules"
        action={{ label: 'Register Staff', onClick: () => setShowAddStaff(!showAddStaff), icon: UserPlus }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">
        
        {/* ADD STAFF FORM */}
        <AnimatePresence>
          {showAddStaff && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-[#0C0B14] border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" /> Register New Employee
                  </CardTitle>
                  <CardDescription>Input employee profile details to compute dynamic monthly payroll sheets.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Full Name</label>
                      <Input placeholder="E.g. Karan Mehta" value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Designation Role</label>
                      <Input placeholder="E.g. Accountant" value={staffForm.role} onChange={e => setStaffForm({ ...staffForm, role: e.target.value })} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Base Salary (₹)</label>
                      <Input type="number" placeholder="50000" value={staffForm.baseSalary} onChange={e => setStaffForm({ ...staffForm, baseSalary: e.target.value })} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Allocated Shift</label>
                      <select value={staffForm.shift} onChange={e => setStaffForm({ ...staffForm, shift: e.target.value })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm text-foreground">
                        <option value="Morning Shift (9AM - 6PM)">Morning Shift (9AM - 6PM)</option>
                        <option value="Evening Shift (2PM - 11PM)">Evening Shift (2PM - 11PM)</option>
                      </select>
                    </div>
                    <div className="col-span-1 md:col-span-4 flex justify-end gap-2 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setShowAddStaff(false)} className="text-xs h-9">Cancel</Button>
                      <Button type="submit" className="brand-gradient text-white font-semibold text-xs h-9 px-4">Register Employee</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UPPER DOUBLE SECTION: LEAVES & SHIFTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEAVE MANAGEMENT REQUESTS */}
          <Card className="bg-card border-border shadow-sm lg:col-span-7 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Leave Requests Roster
                </CardTitle>
                <CardDescription>Review and approve employee time-off requests.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {leaves.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      No active leave requests. Awaiting employee submissions.
                    </div>
                  ) : (
                    leaves.map(l => (
                      <div key={l.id} className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {l.name.split(' ').map(w => w[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{l.name} <span className="text-[10px] text-muted-foreground">({l.role})</span></p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{l.dates} • <span className="text-primary font-medium">{l.days} {l.days === 1 ? 'day' : 'days'}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] font-bold">{l.type}</Badge>
                          {l.status === 'Pending' ? (
                            <div className="flex gap-1">
                              <Button size="sm" onClick={() => handleLeaveDecision(l.id, 'Approved')} className="h-6 px-2 text-[9px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
                                <Check className="h-3 w-3 mr-0.5" /> App
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleLeaveDecision(l.id, 'Rejected')} className="h-6 px-2 text-[9px] text-rose-500 hover:bg-rose-500/10 border-rose-500/20 font-bold">
                                <X className="h-3 w-3 mr-0.5" /> Rej
                              </Button>
                            </div>
                          ) : (
                            <Badge variant={l.status === 'Approved' ? 'default' : 'secondary'} className="text-[9px] font-bold">
                              {l.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* SHIFT TIMINGS & ROSTER SCHEDULE */}
          <Card className="bg-card border-border shadow-sm lg:col-span-5 flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Active Shift Schedule
                </CardTitle>
                <CardDescription>Review active shift allocations and attendance scores.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {shifts.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      No shift rosters registered. Add employees to allocate shift schedules automatically.
                    </div>
                  ) : (
                    shifts.map(s => (
                      <div key={s.id} className="p-3.5 flex items-center justify-between hover:bg-muted/5 transition-colors">
                        <div>
                          <p className="text-xs font-semibold text-foreground">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{s.shift}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">Score:</span>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold">{s.attendancePct}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </div>
          </Card>

        </div>

        {/* ATTENDANCE-BASED PAYROLL CALCULATOR SPREADSHEET */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" /> Dynamic Monthly Payroll Sheet
            </CardTitle>
            <CardDescription>Attendance-based gross payroll accounting with overtime & deductions.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Employee</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Base Salary</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Overtime (Hrs)</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Deductions</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Bonus</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Net Payable</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider text-right">Roster Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payslips.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-muted-foreground">
                        No employees registered inside the payroll system yet. Click "Register Staff" to initialize monthly accounts!
                      </td>
                    </tr>
                  ) : (
                    payslips.map(p => (
                      <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-3">
                          <p className="text-xs font-semibold text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.role}</p>
                        </td>
                        <td className="p-3 text-xs font-medium text-foreground">₹{p.baseSalary.toLocaleString()}</td>
                        <td className="p-3 text-xs text-foreground font-semibold">{p.overtimeHours} hrs</td>
                        <td className="p-3 text-xs text-rose-500 font-semibold">-₹{p.deductions.toLocaleString()}</td>
                        <td className="p-3 text-xs text-emerald-400 font-semibold">+₹{p.bonus.toLocaleString()}</td>
                        <td className="p-3 text-xs font-bold text-foreground">₹{p.totalPay.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2 items-center">
                            <Badge variant={p.status === 'Paid' ? 'default' : 'secondary'} className="text-[9px] font-bold py-0.5">{p.status}</Badge>
                            {p.status !== 'Paid' ? (
                              <Button size="sm" onClick={() => handlePaySalary(p.id)} className="h-6 px-2 text-[9px] brand-gradient text-white font-bold">
                                Pay Out
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloaded ${p.name}'s PDF Payslip!`)} className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </main>
    </>
  );
}
