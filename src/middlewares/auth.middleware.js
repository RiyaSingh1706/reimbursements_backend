const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized — please login first'
    });
  }
  next();
};

module.exports = { isAuthenticated };