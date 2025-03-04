
const Role = require('../models/Role');
const User = require('../models/User');

exports.createRole = async ({ name, permissions }) => {
    const role = new Role({ name, permissions });
    await role.save();
    return 'Role created';
};

exports.updateRole = async (id, data) => {
    await Role.findByIdAndUpdate(id, data);
    return 'Role updated';
};

exports.deleteRole = async (id) => {
    await Role.findByIdAndDelete(id);
    return 'Role deleted';
};

exports.assignPermissions = async (roleId, permissions) => {
    const role = await Role.findById(roleId);
    if (!role) throw new Error('Role not found');
    role.permissions = permissions;
    await role.save();
    return 'Permissions assigned';
};

exports.assignRoleToUser = async (userId, roleId) => {
    const user = await User.findById(userId);
    const role = await Role.findById(roleId);
    if (!user || !role) throw new Error('User or Role not found');
    user.roles.push(role);
    await user.save();
    return 'Role assigned to user';
};
