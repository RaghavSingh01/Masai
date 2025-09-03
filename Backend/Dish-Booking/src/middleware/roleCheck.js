const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

const checkOwnership = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.role === 'user') {
    req.checkOwnership = true;
    return next();
  }

  if (req.user.role === 'chef') {
    req.checkChefAccess = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied'
  });
};

module.exports = {
  authorize,
  checkOwnership
};