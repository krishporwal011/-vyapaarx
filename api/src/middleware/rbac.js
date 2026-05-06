/**
 * Role-Based Access Control (RBAC) Middleware for VyapaarX ERP.
 * Roles:
 * - admin: Unlimited access to all configurations, user management, and financials.
 * - accountant: Full access to invoices, GST billing, tax records, payments, and reporting.
 * - employee: View access to everything; create access to products, orders, and clients. Restricted from payouts & delete operations.
 * - viewer: Read-only access to help with dashboards or compliance auditing.
 */

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication token is missing or invalid.',
      });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : 'viewer';

    if (allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Forbidden. Role '${req.user.role}' does not have permission to perform this action.`,
    });
  };
};

module.exports = {
  authorizeRoles,
};
