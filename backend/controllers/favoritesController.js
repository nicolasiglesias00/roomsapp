// backend/controllers/reservationsController.js
const db = require('../db/database');

const favoritesController = {
    // Obtener todas las reservas del usuario autenticado
    getMyFavorites: async (req, res) => {
        try {
            const userId = req.user.id;
            const [rows] = await db.query(
                `SELECT f.id, f.room_id, r.title as room_title, r.monthly_price, 
                        (SELECT image_url FROM room_images WHERE room_id = r.id ORDER BY sort_order ASC LIMIT 1) as room_image
                 FROM favorites f
                 JOIN rooms r ON f.room_id = r.id
                 WHERE f.user_id = ?`, [userId]
            );

            // Formatear la respuesta para dejarla preparada para el futuro
            const formatted = rows.map(r => ({
                id: r.id,
                room: {
                    id: r.room_id,
                    title: r.room_title,
                    monthly_price: r.monthly_price,
                    image: r.room_image
                }
            }));

            res.json(formatted);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener favoritos', error: error.message });
        }
    },

    // Añadir una habitación a favoritos
    addFavorite: async (req, res) => {
        try {
            const userId = req.user.id;
            const roomId = req.params.roomId;

            // Evita duplicados gracias a la clave única, pero puedes comprobarlo antes si quieres
            await db.query(
                'INSERT IGNORE INTO favorites (user_id, room_id) VALUES (?, ?)',
                [userId, roomId]
            );

            res.status(201).json({ message: 'Habitación añadida a favoritos' });
        } catch (error) {
            res.status(500).json({ message: 'Error al añadir favorito', error: error.message });
        }
    },

    // Quitar una habitación de favoritos
    removeFavorite: async (req, res) => {
        try {
            const userId = req.user.id;
            const roomId = req.params.roomId;

            await db.query(
                'DELETE FROM favorites WHERE user_id = ? AND room_id = ?',
                [userId, roomId]
            );

            res.json({ message: 'Habitación eliminada de favoritos' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar favorito', error: error.message });
        }
    }

};

module.exports = favoritesController;