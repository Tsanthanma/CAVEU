const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. Obtenemos el header completo de autorización
  const authHeader = req.headers['authorization'];

  // 2. Verificamos que exista y tenga el formato correcto "Bearer token"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ msg: 'Acceso denegado: Token no proporcionado o con formato incorrecto.' });
  }

  // 3. Extraemos SOLO el token, quitando la palabra "Bearer " del inicio
  const token = authHeader.split(' ')[1];

  try {
    // 4. Ahora verificamos el token limpio
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token inválido o expirado.' });
  }
};

module.exports = verifyToken;