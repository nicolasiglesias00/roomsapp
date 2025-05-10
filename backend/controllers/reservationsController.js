// backend/controllers/reservationsController.js
const db = require('../db/database');

const reservationsController = {
    // Obtener todas las reservas del usuario autenticado
    getMyReservations: async (req, res) => {
        try {
            const userId = req.user.id;
            const [rows] = await db.query(
                `SELECT b.*, 
                        rm.title as room_title, 
                        rm.monthly_price, 
                        (SELECT image_url FROM room_images WHERE room_id = rm.id ORDER BY sort_order ASC LIMIT 1) as room_image
                 FROM bookings b
                 JOIN rooms rm ON b.room_id = rm.id
                 WHERE b.user_id = ?
                 ORDER BY b.start_date DESC`, [userId]
            );

            // Formatear la respuesta para dejarla preparada para el futuro
            const formatted = rows.map(r => ({
                id: r.id,
                start_date: r.start_date,
                end_date: r.end_date,
                status: r.status,
                room: {
                    id: r.room_id,
                    title: r.room_title,
                    monthly_price: r.monthly_price,
                    image: r.room_image
                }
            }));

            res.json(formatted);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
        }
    },

    // Obtener una reserva por su ID (preparado para el futuro)
    getReservationById: async (req, res) => {
        try {
            const reservationId = req.params.id;
            const [rows] = await db.query(
                `SELECT r.*, 
                        rm.title as room_title, 
                        rm.monthly_price, 
                        (SELECT image_url FROM room_images WHERE room_id = rm.id ORDER BY sort_order ASC LIMIT 1) as room_image
                 FROM bookings b
                 JOIN rooms rm ON b.room_id = rm.id
                 WHERE b.id = ?`, [reservationId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Reserva no encontrada' });
            }

            const r = rows[0];
            const formatted = {
                id: r.id,
                start_date: r.start_date,
                end_date: r.end_date,
                status: r.status,
                room: {
                    id: r.room_id,
                    title: r.room_title,
                    monthly_price: r.monthly_price,
                    image: r.room_image
                }
            };

            res.json(formatted);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la reserva', error: error.message });
        }
    }

    // Aquí puedes añadir más métodos: crear, cancelar, etc.
};

module.exports = reservationsController;