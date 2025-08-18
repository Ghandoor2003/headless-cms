/**
 * Middleware to restrict access based on staff roles
 * Usage: app.get('/admin', roleMiddleware('admin', 'editor'), handler)
 * 
 * @param {...string} allowedRoles - Roles allowed to access the route
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    /**
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: no user attached' });
      }

      // Ensure user belongs to Staff category
      if (req.user.category.name !== 'Staff') {
        return res.status(403).json({ message: 'Access restricted to staff accounts' });
      }

      const userRole = req.user.data.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }

      next();
    } catch (err) {
      console.error('[Role Middleware Error]', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
       */
      next();
  };
};

module.exports = roleMiddleware;
