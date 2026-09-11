module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'ResponsableReseau' && req.user.role !== 'AdministrateurReseau') {
    return res.status(403).json({ message: "Only ResponsableReseau or Admin can access this resource" });
  }

  next();
};