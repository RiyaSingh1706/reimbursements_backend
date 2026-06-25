const employeesService = require('../services/employees.service');
const { EmployeeResponseDto } = require('../dtos/request/employees/employeeList.response.dto');

class EmployeesController {
  async listEmployees(req, res, next) {
    try {
      const employees = await employeesService.listEmployees(req.user);
      const data = employees.map((emp) => new EmployeeResponseDto(emp));
      return res.status(200).json({
        status: 'success',
        data: { users: data }
      });
    } catch (err) {
      next(err);
    }
  }

  async assignEmployee(req, res, next) {
    try {
      await employeesService.assignEmployee(req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Employee assigned to RM successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async removeEmployee(req, res, next) {
    try {
      await employeesService.removeEmployee(req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Employee removed from RM successfully'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EmployeesController();