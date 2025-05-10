const db = require('../db/database');

const roomsController = {
    // Get all rooms with their images and utilities
    getAllRooms: async (req, res) => {
        try {
            const [rooms] = await db.query(`
        SELECT r.*, 
               GROUP_CONCAT(DISTINCT ri.image_url) as images,
               GROUP_CONCAT(DISTINCT u.name) as utilities,
               u2.full_name as landlord_name,
               u2.phone as landlord_phone
        FROM rooms r
        LEFT JOIN room_images ri ON r.id = ri.room_id
        LEFT JOIN room_utilities ru ON r.id = ru.room_id
        LEFT JOIN utilities u ON ru.utility_id = u.id
        LEFT JOIN users u2 ON r.landlord_id = u2.id
        WHERE r.is_visible = 1
        GROUP BY r.id
        ORDER BY r.created_at DESC
      `);

            // Format the response
            const formattedRooms = rooms.map(room => ({
                id: room.id,
                title: room.title,
                description: room.description,
                monthly_price: room.monthly_price,
                utilities_included: Boolean(room.utilities_included),
                address: room.address,
                location: {
                    latitude: room.latitude,
                    longitude: room.longitude
                },
                square_meters: room.square_meters,
                features: {
                    private_bathroom: Boolean(room.private_bathroom),
                    wifi: Boolean(room.wifi),
                    furnished: Boolean(room.furnished)
                },
                availability: {
                    from: room.available_from,
                    until: room.available_until
                },
                nearby_university: room.nearby_university,
                status: room.status,
                images: room.images ? room.images.split(',') : [],
                utilities: room.utilities ? room.utilities.split(',') : [],
                landlord: {
                    name: room.landlord_name,
                    phone: room.landlord_phone
                },
                created_at: room.created_at
            }));

            res.json(formattedRooms);
        } catch (error) {
            console.error('Error getting rooms:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get room by ID
    getRoomById: async (req, res) => {
        try {
            const [rooms] = await db.query(`
        SELECT r.*, 
               GROUP_CONCAT(DISTINCT ri.image_url) as images,
               GROUP_CONCAT(DISTINCT u.name) as utilities,
               u2.full_name as landlord_name,
               u2.phone as landlord_phone,
               u2.email as landlord_email
        FROM rooms r
        LEFT JOIN room_images ri ON r.id = ri.room_id
        LEFT JOIN room_utilities ru ON r.id = ru.room_id
        LEFT JOIN utilities u ON ru.utility_id = u.id
        LEFT JOIN users u2 ON r.landlord_id = u2.id
        WHERE r.id = ? AND r.is_visible = 1
        GROUP BY r.id
      `, [req.params.id]);

            if (rooms.length === 0) {
                return res.status(404).json({ error: 'Room not found' });
            }

            const room = {
                id: rooms[0].id,
                title: rooms[0].title,
                description: rooms[0].description,
                monthly_price: rooms[0].monthly_price,
                utilities_included: Boolean(rooms[0].utilities_included),
                address: rooms[0].address,
                location: {
                    latitude: rooms[0].latitude,
                    longitude: rooms[0].longitude
                },
                square_meters: rooms[0].square_meters,
                features: {
                    private_bathroom: Boolean(rooms[0].private_bathroom),
                    wifi: Boolean(rooms[0].wifi),
                    furnished: Boolean(rooms[0].furnished)
                },
                availability: {
                    from: rooms[0].available_from,
                    until: rooms[0].available_until
                },
                nearby_university: rooms[0].nearby_university,
                status: rooms[0].status,
                images: rooms[0].images ? rooms[0].images.split(',') : [],
                utilities: rooms[0].utilities ? rooms[0].utilities.split(',') : [],
                landlord: {
                    name: rooms[0].landlord_name,
                    phone: rooms[0].landlord_phone,
                    email: rooms[0].landlord_email
                },
                created_at: rooms[0].created_at
            };

            res.json(room);
        } catch (error) {
            console.error('Error getting room:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Create new room
    createRoom: async (req, res) => {
        const {
            title,
            description,
            monthly_price,
            utilities_included,
            address,
            latitude,
            longitude,
            square_meters,
            private_bathroom,
            wifi,
            furnished,
            available_from,
            available_until,
            nearby_university,
            landlord_id,
            images,
            utilities
        } = req.body;

        try {
            await db.beginTransaction();

            // Insert room
            const [result] = await db.query(
                `INSERT INTO rooms (
          title, description, monthly_price, utilities_included,
          address, latitude, longitude, square_meters,
          private_bathroom, wifi, furnished,
          available_from, available_until, nearby_university,
          landlord_id, status, is_visible
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', 1)`,
                [
                    title, description, monthly_price, utilities_included,
                    address, latitude, longitude, square_meters,
                    private_bathroom, wifi, furnished,
                    available_from, available_until, nearby_university,
                    landlord_id
                ]
            );

            const roomId = result.insertId;

            // Insert images if provided
            if (images && images.length > 0) {
                const imageValues = images.map((url, index) => [roomId, url, index + 1]);
                await db.query(
                    'INSERT INTO room_images (room_id, image_url, sort_order) VALUES ?',
                    [imageValues]
                );
            }

            // Insert utilities if provided
            if (utilities && utilities.length > 0) {
                const utilityValues = utilities.map(utilityId => [roomId, utilityId]);
                await db.query(
                    'INSERT INTO room_utilities (room_id, utility_id) VALUES ?',
                    [utilityValues]
                );
            }

            await db.commit();
            res.status(201).json({
                id: roomId,
                message: 'Room created successfully',
                room: {
                    id: roomId,
                    title,
                    monthly_price,
                    status: 'available'
                }
            });
        } catch (error) {
            await db.rollback();
            console.error('Error creating room:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete room by ID
    deleteRoom: async (req, res) => {
        try {
            const { id } = req.params;
            // Puedes hacer un borrado lógico o físico, aquí ejemplo físico:
            await db.query('DELETE FROM rooms WHERE id = ?', [id]);
            res.json({ message: 'Room deleted successfully' });
        } catch (error) {
            console.error('Error deleting room:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = roomsController; 