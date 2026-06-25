const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.session.user?.role;

    if (!userRole) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized — please login first'
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: `Forbidden — requires one of: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { requireRole };