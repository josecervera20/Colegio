// Importar el módulo jsonwebtoken para verificar tokens JWT
const jwt = require("jsonwebtoken");

// Middleware para verificar la validez del token JWT
const verificarToken = (req, res, next) => {
  // Obtener el encabezado Authorization de la solicitud
  const authHeader = req.headers["authorization"];

  // Extraer el token (el formato esperado es "Bearer TOKEN")
  const token = authHeader && authHeader.split(" ")[1];

  // Si no hay token, devolver estado 401 (no autorizado)
  if (token == null) return res.sendStatus(401);

  // Verificar el token usando la clave secreta
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Si el token no es válido, devolver 403 (prohibido)

    // Si el token es válido, guardar la info del usuario en el objeto request
    req.user = user;

    // Continuar con la siguiente función en la cadena de middlewares o ruta
    next();
  });
};

// Exportar el middleware para ser usado en rutas protegidas
module.exports = { verificarToken };
