const { asyncHandler } = require('../middleware/errorHandler');
const payrollService = require('../services/payroll.service');

// Staff Controllers
const getStaffList = asyncHandler(async (req, res) => {
  const staff = await payrollService.getStaff(req.user._id);
  res.json({ success: true, data: staff });
});

const createStaffMember = asyncHandler(async (req, res) => {
  const staff = await payrollService.createStaff(req.user._id, req.body);
  res.status(201).json({ success: true, data: staff });
});

const updateStaffMemberStatus = asyncHandler(async (req, res) => {
  const staff = await payrollService.updateStaffStatus(req.user._id, req.params.id, req.body.status);
  res.json({ success: true, data: staff });
});

// Leave Controllers
const getLeaveRequestsList = asyncHandler(async (req, res) => {
  const leaves = await payrollService.getLeaveRequests(req.user._id);
  res.json({ success: true, data: leaves });
});

const createStaffLeaveRequest = asyncHandler(async (req, res) => {
  const leave = await payrollService.createLeaveRequest(req.user._id, req.params.staffId, req.body);
  res.status(201).json({ success: true, data: leave });
});

const updateLeaveRequestStatus = asyncHandler(async (req, res) => {
  const leave = await payrollService.updateLeaveStatus(req.user._id, req.params.id, req.body.status);
  res.json({ success: true, data: leave });
});

// Payslip Controllers
const getPayslipsList = asyncHandler(async (req, res) => {
  const payslips = await payrollService.getPayslips(req.user._id);
  res.json({ success: true, data: payslips });
});

const createStaffPayslip = asyncHandler(async (req, res) => {
  const payslip = await payrollService.createPayslip(req.user._id, req.params.staffId, req.body);
  res.status(201).json({ success: true, data: payslip });
});

const updatePayslipStatus = asyncHandler(async (req, res) => {
  const payslip = await payrollService.updatePayslipStatus(req.user._id, req.params.id, req.body.status);
  res.json({ success: true, data: payslip });
});

module.exports = {
  getStaffList,
  createStaffMember,
  updateStaffMemberStatus,
  getLeaveRequestsList,
  createStaffLeaveRequest,
  updateLeaveRequestStatus,
  getPayslipsList,
  createStaffPayslip,
  updatePayslipStatus
};
