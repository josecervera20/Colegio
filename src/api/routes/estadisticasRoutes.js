const express = require("express");
const router = express.Router();
const estadisticasController = require("../controllers/estadisticasController");
const authMiddleware = require("../middleware/authMiddleware");

// Rutas protegidas para obtener estadísticas
router.get(
  "/entradas-por-dia",
  authMiddleware.verificarToken,
  estadisticasController.getEntradasPorDia
);
router.get(
  "/tipos-visitante",
  authMiddleware.verificarToken,
  estadisticasController.getTiposVisitante
);
router.get(
  "/departamentos-visitados",
  authMiddleware.verificarToken,
  estadisticasController.getDepartamentosVisitados
);

module.exports = router;
