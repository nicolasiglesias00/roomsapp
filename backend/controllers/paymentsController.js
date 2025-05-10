const db = require('../db/database');

const paymentsController = {
    // Obtener todos los pagos del usuario autenticado
    getMyPayments: async (req, res) => {
        try {
            const userId = req.user.id;
            // Suponiendo que la relación entre bookings y users es bookings.student_id = users.id
            const [rows] = await db.query(
                `SELECT p.*, b.id as booking_id
                 FROM payments p
                 JOIN bookings b ON p.booking_id = b.id
                 WHERE b.user_id = ?
                 ORDER BY p.paid_at ASC`, [userId]
            );

            // Formatear la respuesta si lo deseas
            const formatted = rows.map(p => ({
                id: p.id,
                booking_id: p.booking_id,
                amount: p.amount,
                status: p.status,
                paid_at: p.paid_at,
                payment_title: p.payment_title,
                payment_method: p.payment_method, // <-- asegúrate del nombre
                stripe_session_id: p.stripe_session_id  // <-- asegúrate del nombre
            }));

            res.json(formatted);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener pagos', error: error.message });
        }
    },

    // (Opcional) Obtener un pago concreto por su id
    // getPaymentById: async (req, res) => { ... }
};

module.exports = paymentsController;