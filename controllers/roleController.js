
const roleService = require('../services/roleService');

exports.createRole = async (req, res) => {
    try {
        const result = await roleService.createRole(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const result = await roleService.updateRole(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const result = await roleService.deleteRole(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.assignPermissions = async (req, res) => {
    try {
        const result = await roleService.assignPermissions(req.params.id, req.body.permissions);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.assignRoleToUser = async (req, res) => {
    try {
        const result = await roleService.assignRoleToUser(req.params.userId, req.params.roleId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
