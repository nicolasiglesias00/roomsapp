const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

// Get all rooms
router.get('/', roomsController.getAllRooms);

// Get room by ID
router.get('/:id', roomsController.getRoomById);

// Create new room
router.post('/', roomsController.createRoom);

// Delete room
router.delete('/:id', roomsController.deleteRoom);

module.exports = router; 