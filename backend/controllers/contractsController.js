const db = require('../db/database');

const contractsController = {
    // Obtener todos los contratos del usuario autenticado
    getMyContracts: async (req, res) => {
        try {
            const userId = req.user.id;
            const [rows] = await db.query(
                `SELECT c.*, b.room_id, r.title as room_title
                 FROM contracts c
                 JOIN bookings b ON c.booking_id = b.id
                 JOIN rooms r ON b.room_id = r.id
                 WHERE c.user_id = ?
                 ORDER BY c.created_at DESC`, [userId]
            );

            // Formatear la respuesta
            const formatted = rows.map(c => ({
                id: c.id,
                contract_name: c.contract_name,
                booking_id: c.booking_id,
                room: {
                    id: c.room_id,
                    title: c.room_title
                },
                pdf_file: c.pdf_file,
                created_at: c.created_at,
                is_signed: !!c.is_signed
            }));

            res.json(formatted);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener contratos', error: error.message });
        }
    },

    // Aquí puedes añadir más métodos: crear, firmar, eliminar, etc.
};

module.exports = contractsController;