const rbacAuthMiddleware = (allowedRoles = []) => {
  //middleware.rbac
  return (req, res, next) => {
    try {
      const user = req.user;

      // Check if user and role exist
      if (!user || !user.role) {
        return res.status(401).json({ message: 'Unauthorized: No role found' });
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: You don\'t have access' });
      }

      // Role is valid, continue
      next();
    } catch (err) {
      console.error('RBAC Middleware Error:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = rbacAuthMiddleware;
