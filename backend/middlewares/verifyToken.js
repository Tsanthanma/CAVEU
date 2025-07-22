const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ msg: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id; // importante para `usuarioId`
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = verifyToken;
