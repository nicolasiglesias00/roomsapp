const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const contractsController = require('../controllers/contractsController');

// Obtener todos los contratos del usuario autenticado
router.get('/mine', protect, contractsController.getMyContracts);

// Descargar un contrato concreto (opcional, si quieres servir el PDF desde backend)
// router.get('/:id/download', protect, contractsController.downloadContract);

// (Opcional) Firmar un contrato
// router.post('/:id/sign', protect, contractsController.signContract);

// (Opcional) Crear un contrato (normalmente lo haría el backend tras una reserva)
// router.post('/', protect, contractsController.createContract);

// (Opcional) Eliminar un contrato (solo si tiene sentido en tu lógica)
// router.delete('/:id', protect, contractsController.deleteContract);

module.exports = router;