const rolesService = require('../services/roles.service');

class RolesController {
  async assignRole(req, res, next) {
    try {
      const updated = await rolesService.assignRole(req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Role assigned successfully',
        data: {
          userId: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RolesController();