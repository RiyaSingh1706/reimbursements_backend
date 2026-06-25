const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { requirePermission } = require('../middlewares/role.middleware');
const { PERMISSIONS } = require('../constants/permission');

router.post(
  '/assign',
  isAuthenticated,
  requirePermission(PERMISSIONS.ASSIGN_ROLE),
  rolesController.assignRole.bind(rolesController)
);

module.exports = router;