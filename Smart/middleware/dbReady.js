const mongoose = require('mongoose');

module.exports = function(req, res, next) {
  // 1 = connected
  if (mongoose.connection.readyState === 1) return next();

  return res.status(503).json({
    success: false,
    message: 'Database not ready',
    readyState: mongoose.connection.readyState
  });
};
