const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

function isAdmin(req, res, next) {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
}

module.exports = { authenticate, isAdmin };
