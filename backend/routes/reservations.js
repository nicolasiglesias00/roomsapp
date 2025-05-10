const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const reservationsController = require('../controllers/reservationsController');

// Obtener todas las reservas del usuario autenticado
router.get('/mine', protect, reservationsController.getMyReservations);

// Obtener una reserva concreta por su id
router.get('/:id', protect, reservationsController.getReservationById);

// (Opcional) Obtener todas las reservas (solo para admin)
// router.get('/', protect, reservationsController.getAllReservations);

module.exports = router;