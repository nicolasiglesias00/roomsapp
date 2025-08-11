const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const reservationsController = require('../controllers/reservationsController');

// Obtener todas las reservas del usuario autenticado
router.get('/mine', protect, reservationsController.getMyReservations);

// Obtener una reserva concreta por su id
router.get('/:id', protect, reservationsController.getReservationById);

// Landlord: obtener solicitudes de reserva de sus habitaciones
router.get('/landlord-requests', protect, authorize('landlord'), reservationsController.getLandlordRequests);

// Landlord: aprobar/rechazar solicitud
router.put('/:id/approve', protect, authorize('landlord'), reservationsController.approveRequest);
router.put('/:id/reject', protect, authorize('landlord'), reservationsController.rejectRequest);

// Landlord: listar reservas de sus habitaciones
router.get('/landlord', protect, authorize('landlord'), reservationsController.getLandlordReservations);

// Student: crear reserva
router.post('/', protect, authorize('student'), reservationsController.createReservation);

// (Opcional) Obtener todas las reservas (solo para admin)
// router.get('/', protect, reservationsController.getAllReservations);

module.exports = router;