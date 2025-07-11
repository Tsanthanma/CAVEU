// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token)
    return res.status(401).json({ msg: "No hay token. Acceso denegado." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};

module.exports = authMiddleware;
