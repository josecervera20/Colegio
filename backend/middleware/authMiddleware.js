const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // No hay token

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user; // Guardar la información del usuario en la request
    next(); // Pasar al siguiente middleware o ruta
  });
};

module.exports = { verificarToken };