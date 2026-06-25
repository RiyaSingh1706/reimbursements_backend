const { findUserById, updateUserRole } = require('../db/queries/roles.queries');
const { AssignRoleRequestDto } = require('../dtos/request/roles/assignRole.request.dto');
const { ROLES } = require('../constants/roles');

class RolesService {
  async assignRole(body) {
    const dto = new AssignRoleRequestDto(body);
    dto.validate();

    const user = await findUserById(dto.userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // CFO role cannot be assigned — it is seeded only
    if (dto.role === ROLES.CFO) {
      throw { status: 400, message: 'CFO role cannot be assigned manually' };
    }

    const updated = await updateUserRole(dto.userId, dto.role);
    return updated;
  }
}

module.exports = new RolesService();