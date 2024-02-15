const Role = require('../models/User/everyoneRoleSchema');


const hasRole = (...requiredRoles) => {
    return async (req, res, next) => {
        try {
            console.log(requiredRoles, req.user.role)
            // assuming the user object has a role field containing the roleId
            const role = await Role.findById(req.user.role);
            
            if (!role) {
                return res.status(403).json({ status: 'error', message: 'Role does not exist' });
            }
            console.log(role.roleName)
            if (!requiredRoles.includes(role.roleName)) {
                return res.status(403).json({ status:'error',message: 'Access Denied: Insufficient Permissions' });
            }
            
            // if user has one of the required roles, allow them to continue
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = hasRole;