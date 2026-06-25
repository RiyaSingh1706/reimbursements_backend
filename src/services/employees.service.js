const {
  findUserById,
  findAllByRoles,
  findEmpsByRmId,
  assignEmployeeToRm,
  removeEmployeeFromRm,
  findAssignment
} = require('../db/queries/employees.queries');
const { AssignEmployeeRequestDto } = require('../dtos/request/employees/assignEmployee.request.dto');
const { ROLES } = require('../constants/roles');

class EmployeesService {
  async listEmployees(requestingUser) {
    const { role, id } = requestingUser;

    if (role === ROLES.RM) {
      return await findEmpsByRmId(id);
    }

    if (role === ROLES.APE) {
      return await findAllByRoles([ROLES.EMP, ROLES.RM]);
    }

    if (role === ROLES.CFO) {
      return await findAllByRoles([ROLES.EMP, ROLES.RM, ROLES.APE]);
    }

    throw { status: 403, message: 'Forbidden' };
  }

  async assignEmployee(body) {
    const dto = new AssignEmployeeRequestDto(body);
    dto.validate();

    const emp = await findUserById(dto.empId);
    if (!emp || emp.role !== ROLES.EMP) {
      throw { status: 400, message: 'empId must belong to a valid EMP' };
    }

    const rm = await findUserById(dto.rmId);
    if (!rm || rm.role !== ROLES.RM) {
      throw { status: 400, message: 'rmId must belong to a valid RM' };
    }

    const existing = await findAssignment(dto.empId, dto.rmId);
    if (existing) {
      throw { status: 409, message: 'Employee is already assigned to this RM' };
    }

    return await assignEmployeeToRm(dto.empId, dto.rmId);
  }

  async removeEmployee(body) {
    const dto = new AssignEmployeeRequestDto(body);
    dto.validate();

    const existing = await findAssignment(dto.empId, dto.rmId);
    if (!existing) {
      throw { status: 404, message: 'Assignment not found' };
    }

    return await removeEmployeeFromRm(dto.empId, dto.rmId);
  }
}

module.exports = new EmployeesService();