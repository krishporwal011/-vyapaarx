const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

// Staff CRUD
const getStaff = async (userId) => {
  return await prisma.staff.findMany({
    where: { userId },
    orderBy: { name: 'asc' }
  });
};

const createStaff = async (userId, data) => {
  const { name, email, phone, role, department, salary, shift, address } = data;

  if (!name || !email || !phone || !role) {
    throw new AppError('Name, email, phone, and role are required', 400);
  }

  return await prisma.staff.create({
    data: {
      userId,
      name,
      email,
      phone,
      role,
      department: department || 'Logistics',
      salary: salary ? parseFloat(salary) : 30000,
      shift: shift || 'Morning',
      address: address || null
    }
  });
};

const updateStaffStatus = async (userId, staffId, status) => {
  const staff = await prisma.staff.findFirst({
    where: { id: staffId, userId }
  });

  if (!staff) {
    throw new AppError('Staff member not found', 404);
  }

  return await prisma.staff.update({
    where: { id: staffId },
    data: { status }
  });
};

// Leave Requests
const getLeaveRequests = async (userId) => {
  return await prisma.leaveRequest.findMany({
    where: {
      staff: { userId }
    },
    include: {
      staff: {
        select: { id: true, name: true, role: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const createLeaveRequest = async (userId, staffId, data) => {
  const { type, dates, days } = data;

  const staff = await prisma.staff.findFirst({
    where: { id: staffId, userId }
  });

  if (!staff) {
    throw new AppError('Staff member not found', 404);
  }

  return await prisma.leaveRequest.create({
    data: {
      staffId,
      type,
      dates,
      days: parseInt(days)
    }
  });
};

const updateLeaveStatus = async (userId, leaveId, status) => {
  const leave = await prisma.leaveRequest.findFirst({
    where: {
      id: leaveId,
      staff: { userId }
    }
  });

  if (!leave) {
    throw new AppError('Leave request not found', 404);
  }

  return await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status }
  });
};

// Payslips
const getPayslips = async (userId) => {
  return await prisma.payslip.findMany({
    where: {
      staff: { userId }
    },
    include: {
      staff: {
        select: { id: true, name: true, role: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const createPayslip = async (userId, staffId, data) => {
  const { baseSalary, overtimeHours, deductions, bonus } = data;

  const staff = await prisma.staff.findFirst({
    where: { id: staffId, userId }
  });

  if (!staff) {
    throw new AppError('Staff member not found', 404);
  }

  const base = parseFloat(baseSalary || staff.salary);
  const ot = parseFloat(overtimeHours || 0);
  const ded = parseFloat(deductions || 0);
  const bon = parseFloat(bonus || 0);
  const totalPay = base + ot + bon - ded;

  return await prisma.payslip.create({
    data: {
      staffId,
      baseSalary: base,
      overtimeHours: ot,
      deductions: ded,
      bonus: bon,
      totalPay,
      status: 'Processing'
    }
  });
};

const updatePayslipStatus = async (userId, payslipId, status) => {
  const payslip = await prisma.payslip.findFirst({
    where: {
      id: payslipId,
      staff: { userId }
    }
  });

  if (!payslip) {
    throw new AppError('Payslip not found', 404);
  }

  return await prisma.payslip.update({
    where: { id: payslipId },
    data: { status }
  });
};

module.exports = {
  getStaff,
  createStaff,
  updateStaffStatus,
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
  getPayslips,
  createPayslip,
  updatePayslipStatus
};
