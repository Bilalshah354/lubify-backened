const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

module.exports = (requiredPermissions = []) => {
    return async (req, res, next) => {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).send('Access denied. No token provided.');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Fetch user with roles
            const user = await User.findById(req.user.id).populate('roles');

            // Gather user's permissions
            const userPermissions = new Set();
            for (const role of user.roles) {
                for (const permission of role.permissions) {
                    userPermissions.add(permission);
                }
            }

            // Check if user has all required permissions
            const hasPermission = requiredPermissions.every(perm => userPermissions.has(perm));

            if (!hasPermission) {
                return res.status(403).send('Access denied. Insufficient permissions.');
            }

            next();
        } catch (err) {
            res.status(400).send('Invalid token');
        }
    }
};