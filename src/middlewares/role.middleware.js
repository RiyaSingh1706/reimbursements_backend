const requirePermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized — please login first'
      });
    }

    if (!permission.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden — you do not have permission to perform this action'
      });
    }

    next();
  };
};

module.exports = { requirePermission };