const express = require('express');
const router = express.Router();
const roomsController = require('../backend/controllers/roomsController');

// Get all rooms
router.get('/', roomsController.getAllRooms);

// Get room by ID
router.get('/:id', roomsController.getRoomById);

// Create new room
router.post('/', roomsController.createRoom);

module.exports = router; 