const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

// Staff routes
router.route('/staff')
  .get(payrollController.getStaffList)
  .post(payrollController.createStaffMember);

router.route('/staff/:id/status')
  .patch(payrollController.updateStaffMemberStatus);

// Leave routes
router.route('/leaves')
  .get(payrollController.getLeaveRequestsList);

router.route('/staff/:staffId/leaves')
  .post(payrollController.createStaffLeaveRequest);

router.route('/leaves/:id')
  .patch(payrollController.updateLeaveRequestStatus);

// Payslip routes
router.route('/payslips')
  .get(payrollController.getPayslipsList);

router.route('/staff/:staffId/payslips')
  .post(payrollController.createStaffPayslip);

router.route('/payslips/:id')
  .patch(payrollController.updatePayslipStatus);

module.exports = router;
