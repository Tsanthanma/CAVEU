const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token no proporcionado o inválido" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.uid = decoded.uid;
    next();
  } catch (error) {
    console.error("Token inválido:", error);
    res.status(401).json({ msg: "Token inválido" });
  }
};

module.exports = verifyToken;
