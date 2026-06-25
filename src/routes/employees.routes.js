const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { requirePermission } = require('../middlewares/role.middleware');
const { PERMISSIONS } = require('../constants/permissions');

router.get(
  '/',
  isAuthenticated,
  requirePermission(PERMISSIONS.VIEW_EMPLOYEES),
  employeesController.listEmployees.bind(employeesController)
);

router.post(
  '/assign',
  isAuthenticated,
  requirePermission(PERMISSIONS.ASSIGN_EMPLOYEE),
  employeesController.assignEmployee.bind(employeesController)
);

router.delete(
  '/assign',
  isAuthenticated,
  requirePermission(PERMISSIONS.REMOVE_EMPLOYEE),
  employeesController.removeEmployee.bind(employeesController)
);

module.exports = router;