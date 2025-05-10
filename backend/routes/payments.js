const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentsController = require('../controllers/paymentsController');

// Obtener todos los pagos del usuario autenticado
router.get('/mine', protect, paymentsController.getMyPayments);

// (Opcional) Obtener un pago concreto por su id
// router.get('/:id', protect, paymentsController.getPaymentById);

module.exports = router;