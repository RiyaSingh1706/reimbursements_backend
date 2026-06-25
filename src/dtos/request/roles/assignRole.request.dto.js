const { ROLES } = require('../../../constants/roles');

class AssignRoleRequestDto {
  constructor({ userId, role }) {
    this.userId = userId;
    this.role = role;
  }

  validate() {
    if (!this.userId || !this.role) {
      throw { status: 400, message: 'userId and role are required' };
    }
    if (!Object.values(ROLES).includes(this.role)) {
      throw { status: 400, message: `role must be one of: ${Object.values(ROLES).join(', ')}` };
    }
  }
}

module.exports = { AssignRoleRequestDto };