const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate Socket.io connections
exports.authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.token;

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.userId = user._id.toString();
            socket.user = user;
            next();
        } catch (error) {
            return next(new Error('Authentication error: Invalid token'));
        }
    } catch (error) {
        next(new Error('Authentication error'));
    }
};

