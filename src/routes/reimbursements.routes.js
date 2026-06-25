const express = require('express');
const router = express.Router();
const reimbursementsController = require('../controllers/reimbursements.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { requirePermission } = require('../middlewares/role.middleware');
const { PERMISSIONS } = require('../constants/permission');

router.post(
  '/',
  isAuthenticated,
  requirePermission(PERMISSIONS.CREATE_REIMBURSEMENT),
  reimbursementsController.createReimbursement.bind(reimbursementsController)
);

router.get(
  '/',
  isAuthenticated,
  requirePermission(PERMISSIONS.VIEW_REIMBURSEMENTS),
  reimbursementsController.listReimbursements.bind(reimbursementsController)
);

router.get(
  '/:userId',
  isAuthenticated,
  requirePermission(PERMISSIONS.VIEW_REIMBURSEMENT_BY_USER),
  reimbursementsController.listReimbursementsByUserId.bind(reimbursementsController)
);

router.patch(
  '/',
  isAuthenticated,
  requirePermission(PERMISSIONS.UPDATE_REIMBURSEMENT),
  reimbursementsController.updateReimbursement.bind(reimbursementsController)
);

module.exports = router;