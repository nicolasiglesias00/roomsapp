const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        // Verificar si existe el token en los headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Obtener el usuario del token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'No autorizado - Usuario no encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'No autorizado - Token inválido' });
    }
};

// Middleware para verificar el rol de usuario
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'No autorizado - No tienes permiso para acceder a este recurso'
            });
        }
        next();
    };
};

module.exports = { protect, authorize }; 