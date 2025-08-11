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
    },

    // Obtener solicitudes de reserva de las habitaciones del landlord
    getLandlordRequests: async (req, res) => {
        try {
            const landlordId = req.user.id;
            const [rows] = await db.query(
                `SELECT b.*, u.full_name as student_name, u.email as student_email, u.phone as student_phone, r.title as room_title, r.address as room_address, r.monthly_price
                 FROM bookings b
                 JOIN rooms r ON b.room_id = r.id
                 JOIN users u ON b.user_id = u.id
                 WHERE r.landlord_id = ? AND b.status = 'pending'
                 ORDER BY b.created_at DESC`, [landlordId]
            );
            const formatted = rows.map(r => ({
                id: r.id,
                startDate: r.start_date,
                endDate: r.end_date,
                status: r.status,
                message: r.message,
                student: {
                    name: r.student_name,
                    email: r.student_email,
                    phone: r.student_phone
                },
                room: {
                    id: r.room_id,
                    title: r.room_title,
                    address: r.room_address,
                    price: r.monthly_price
                }
            }));
            res.json(formatted);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener solicitudes', error: error.message });
        }
    },

    // Aprobar solicitud de reserva
    approveRequest: async (req, res) => {
        try {
            const landlordId = req.user.id;
            const bookingId = req.params.id;
            // Verifica que la reserva sea de una habitación del landlord
            const [rows] = await db.query(
                'SELECT b.* FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.id = ? AND r.landlord_id = ?',
                [bookingId, landlordId]
            );
            if (rows.length === 0) {
                return res.status(403).json({ message: 'No autorizado para aprobar esta solicitud' });
            }
            await db.query('UPDATE bookings SET status = "approved" WHERE id = ?', [bookingId]);
            res.json({ message: 'Solicitud aprobada correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al aprobar solicitud', error: error.message });
        }
    },

    // Rechazar solicitud de reserva
    rejectRequest: async (req, res) => {
        try {
            const landlordId = req.user.id;
            const bookingId = req.params.id;
            // Verifica que la reserva sea de una habitación del landlord
            const [rows] = await db.query(
                'SELECT b.* FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.id = ? AND r.landlord_id = ?',
                [bookingId, landlordId]
            );
            if (rows.length === 0) {
                return res.status(403).json({ message: 'No autorizado para rechazar esta solicitud' });
            }
            await db.query('UPDATE bookings SET status = "rejected" WHERE id = ?', [bookingId]);
            res.json({ message: 'Solicitud rechazada correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al rechazar solicitud', error: error.message });
        }
    },

    // Listar reservas de las habitaciones del landlord
    getLandlordReservations: async (req, res) => {
        try {
            const landlordId = req.user.id;
            const [rows] = await db.query(
                `SELECT b.*, u.full_name as student_name, u.email as student_email, u.phone as student_phone, r.title as room_title, r.address as room_address, r.monthly_price
                 FROM bookings b
                 JOIN rooms r ON b.room_id = r.id
                 JOIN users u ON b.user_id = u.id
                 WHERE r.landlord_id = ?
                 ORDER BY b.start_date DESC`, [landlordId]
            );
            const formatted = rows.map(r => ({
                id: r.id,
                startDate: r.start_date,
                endDate: r.end_date,
                status: r.status,
                student: {
                    name: r.student_name,
                    email: r.student_email,
                    phone: r.student_phone
                },
                room: {
                    id: r.room_id,
                    title: r.room_title,
                    address: r.room_address,
                    price: r.monthly_price
                }
            }));
            res.json(formatted);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener reservas del landlord', error: error.message });
        }
    },

    // Crear reserva (student)
    createReservation: async (req, res) => {
        try {
            const userId = req.user.id;
            const { room_id, start_date, end_date, message } = req.body;
            // Puedes agregar validaciones aquí (fechas, disponibilidad, etc.)
            const [result] = await db.query(
                'INSERT INTO bookings (room_id, user_id, start_date, end_date, status, message) VALUES (?, ?, ?, ?, ?, ?)',
                [room_id, userId, start_date, end_date, 'pending', message || null]
            );
            res.status(201).json({ message: 'Reserva creada correctamente', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear reserva', error: error.message });
        }
    },

    // Aquí puedes añadir más métodos: crear, cancelar, etc.
};

module.exports = reservationsController;