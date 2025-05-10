const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const favoritesController = require('../controllers/favoritesController');

// Obtener todas las habitaciones favoritas del usuario autenticado
router.get('/mine', protect, favoritesController.getMyFavorites);

// Añadir una habitación a favoritos
router.post('/:roomId', protect, favoritesController.addFavorite);

// Quitar una habitación de favoritos
router.delete('/:roomId', protect, favoritesController.removeFavorite);

// (Opcional) Obtener un favorito concreto por su id (no suele ser necesario)
// router.get('/:id', protect, favoritesController.getFavoriteById);

module.exports = router;