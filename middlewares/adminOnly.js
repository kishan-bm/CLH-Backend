module.exports = (req, res, next) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Admin access only' });
    }
    next();
  };
  