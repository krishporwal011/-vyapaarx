'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users, UserCheck, UserX, Clock, Search, Plus, Filter, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Manager' | 'Accountant' | 'Inventory Operator' | 'Staff';
  department: string;
  salary: number;
  joiningDate: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  shift: 'Morning' | 'Evening';
  address: string;
}

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff' as any,
    department: 'Logistics',
    salary: 30000,
    shift: 'Morning' as any,
    address: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleStatusChange = (id: string, newStatus: 'Present' | 'Absent' | 'Late' | 'Leave') => {
    setStaff(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    toast.success(`Marked ${staff.find(m => m.id === id)?.name} as ${newStatus}`);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.phone) {
      toast.error('Please fulfill all critical staff fields');
      return;
    }
    const created: StaffMember = {
      id: `EMP00${staff.length + 1}`,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      department: newStaff.department,
      salary: Number(newStaff.salary),
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Present',
      shift: newStaff.shift,
      address: newStaff.address || 'India'
    };
    setStaff([...staff, created]);
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      role: 'Staff',
      department: 'Logistics',
      salary: 30000,
      shift: 'Morning',
      address: ''
    });
    setShowAddForm(false);
    toast.success('Successfully hired new staff member!');
  };

  const filteredStaff = staff.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || m.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const totalStaff = staff.length;
  const presentToday = staff.filter(m => m.status === 'Present' || m.status === 'Late').length;
  const lateToday = staff.filter(m => m.status === 'Late').length;
  const absentToday = staff.filter(m => m.status === 'Absent' || m.status === 'Leave').length;

  return (
    <>
      <Topbar
        title="Staff Management"
        subtitle="Track employee directory and daily attendance metrics"
        action={{ label: 'Hire New Staff', onClick: () => setShowAddForm(!showAddForm), icon: Plus }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-[#09080F]">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{totalStaff}</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Users className="h-4.5 w-4.5" /></div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">{presentToday}</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><UserCheck className="h-4.5 w-4.5" /></div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Late Arrivals</p>
                <p className="text-2xl font-bold mt-1 text-amber-500">{lateToday}</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Clock className="h-4.5 w-4.5" /></div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Absent / Leave</p>
                <p className="text-2xl font-bold mt-1 text-rose-500">{absentToday}</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500"><UserX className="h-4.5 w-4.5" /></div>
            </CardContent>
          </Card>
        </div>

        {/* HIRE NEW STAFF MODAL DRAWER FORM */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-[#0C0B14] border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary animate-pulse" /> Hire New Staff Member
                  </CardTitle>
                  <CardDescription>Populate details to generate employee ID and setup attendance rosters.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddStaffSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1"><Label className="text-xs">Full Name</Label><Input placeholder="Tanya Porwal" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} className="h-9 text-xs text-foreground" /></div>
                    <div className="space-y-1"><Label className="text-xs">Email Address</Label><Input type="email" placeholder="tanya@vyapaarx.com" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} className="h-9 text-xs text-foreground" /></div>
                    <div className="space-y-1"><Label className="text-xs">Phone Number</Label><Input placeholder="+91 98765 43210" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} className="h-9 text-xs text-foreground" /></div>
                    <div className="space-y-1"><Label className="text-xs">Baseline Salary (₹)</Label><Input type="number" placeholder="45000" value={newStaff.salary} onChange={e => setNewStaff({ ...newStaff, salary: Number(e.target.value) })} className="h-9 text-xs text-foreground" /></div>
                    
                    <div className="space-y-1"><Label className="text-xs">Operational Role</Label>
                      <select value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value as any })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm text-foreground bg-card">
                        <option value="Staff">Staff</option><option value="Manager">Manager</option><option value="Accountant">Accountant</option><option value="Inventory Operator">Inventory Operator</option>
                      </select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Department</Label><Input placeholder="Logistics" value={newStaff.department} onChange={e => setNewStaff({ ...newStaff, department: e.target.value })} className="h-9 text-xs text-foreground" /></div>
                    <div className="space-y-1"><Label className="text-xs">Shift Timing</Label>
                      <select value={newStaff.shift} onChange={e => setNewStaff({ ...newStaff, shift: e.target.value as any })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm text-foreground bg-card">
                        <option value="Morning">Morning Shift</option><option value="Evening">Evening Shift</option>
                      </select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Residential Address</Label><Input placeholder="Mumbai, MH" value={newStaff.address} onChange={e => setNewStaff({ ...newStaff, address: e.target.value })} className="h-9 text-xs text-foreground" /></div>
                    
                    <div className="col-span-1 md:col-span-4 pt-2 flex justify-end gap-2">
                      <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="text-xs h-9">Cancel</Button>
                      <Button type="submit" className="brand-gradient text-white font-semibold text-xs h-9 px-4">Register Roster</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FILTER BAR */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80 flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search staff ID or name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-xs w-full bg-muted/20 border-0 text-foreground"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {['All', 'Manager', 'Accountant', 'Inventory Operator', 'Staff'].map(role => (
                <Button
                  key={role}
                  variant={selectedRole === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                  className="text-[10px] h-7 px-3.5 font-semibold"
                >
                  {role}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* STAFF LIST TABLE WITH DAILY ATTENDANCE TOGGLE */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Employee</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Department</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Shift</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Salary</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Status</th>
                    <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider text-right">Daily Attendance Log</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground">
                        No active employees hired yet. Click "Hire New Staff" to setup employee directory attendance registries!
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map(m => (
                      <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full brand-gradient flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                              {m.name.split(' ').map(w => w[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">{m.name}</p>
                              <p className="text-[10px] text-muted-foreground">{m.id} • {m.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="text-xs text-foreground font-medium">{m.department}</p>
                          <p className="text-[10px] text-muted-foreground">{m.joiningDate}</p>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-[10px]">{m.shift}</Badge>
                        </td>
                        <td className="p-3 text-xs font-semibold text-foreground">
                          ₹{m.salary.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant={m.status === 'Present' ? 'default' : m.status === 'Late' ? 'secondary' : 'destructive'}
                            className="text-[9px] font-bold"
                          >
                            {m.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex gap-1 justify-end">
                            {(['Present', 'Late', 'Absent', 'Leave'] as const).map(st => (
                              <Button
                                key={st}
                                size="sm"
                                variant={m.status === st ? 'default' : 'outline'}
                                onClick={() => handleStatusChange(m.id, st)}
                                className={`text-[9px] h-6 px-2 font-bold ${
                                  m.status === st && st === 'Present' ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500' :
                                  m.status === st && st === 'Late' ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-black' :
                                  m.status === st && st === 'Absent' ? 'bg-rose-500 hover:bg-rose-600 border-rose-500' : ''
                                }`}
                              >
                                {st}
                              </Button>
                            ))}
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

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-[10px] font-bold uppercase tracking-widest text-muted-foreground ${className}`}>{children}</label>;
}
