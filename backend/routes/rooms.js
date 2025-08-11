const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');
const { protect, authorize } = require('../middleware/auth');

// Get all rooms (público)
router.get('/', roomsController.getAllRooms);

// Get rooms of the logged-in landlord (DEBE ir ANTES de /:id)
router.get('/landlord', protect, authorize('landlord'), roomsController.getMyRooms);

// Get room by ID (público)
router.get('/:id', roomsController.getRoomById);

// Create new room (solo landlord)
router.post('/', protect, authorize('landlord'), roomsController.createRoom);

// Update room (solo landlord dueño)
router.put('/:id', protect, authorize('landlord'), roomsController.updateRoom);

// Delete room (solo landlord dueño)
router.delete('/:id', protect, authorize('landlord'), roomsController.deleteRoom);

module.exports = router; 