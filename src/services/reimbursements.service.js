const {
  createReimbursement,
  findReimbursementById,
  findReimbursementsByEmpId,
  findPendingReimbursementsByRmId,
  findReimbursementsPendingAtApe,
  findReimbursementsApprovedByApe,
  updateRmApprovalStatus,
  updateApeApprovalStatus,
  logApprovalAction
} = require('../db/queries/reimbursements.queries');
const { CreateReimbursementRequestDto } = require('../dtos/request/reimbursements/createReimbursement.request.dto');
const { UpdateReimbursementRequestDto } = require('../dtos/request/reimbursements/updateReimbursement.request.dto');
const { ROLES } = require('../constants/roles');
const { APPROVAL_STATUS } = require('../constants/approvalStatus');

class ReimbursementsService {
  async createReimbursement(body, requestingUser) {
    const dto = new CreateReimbursementRequestDto(body);
    dto.validate();

    return await createReimbursement({
      empId: requestingUser.id,
      title: dto.title,
      description: dto.description,
      amount: dto.amount
    });
  }

  async listReimbursements(requestingUser) {
    const { role, id } = requestingUser;

    if (role === ROLES.EMP) {
      return await findReimbursementsByEmpId(id);
    }

    if (role === ROLES.RM) {
      return await findPendingReimbursementsByRmId(id);
    }

    if (role === ROLES.APE) {
      return await findReimbursementsPendingAtApe();
    }

    if (role === ROLES.CFO) {
      return await findReimbursementsApprovedByApe();
    }

    throw { status: 403, message: 'Forbidden' };
  }

  async listReimbursementsByUserId(targetUserId, requestingUser) {
    const { role, id: requesterId } = requestingUser;

    // target must exist and be an EMP
    const targetReimbursements = await findReimbursementsByEmpId(targetUserId);

    // RM can only see their own subordinates
    if (role === ROLES.RM) {
      const { findAssignment } = require('../db/queries/employees.queries');
      const assignment = await findAssignment(targetUserId, requesterId);
      if (!assignment) {
        throw { status: 403, message: 'Forbidden — this EMP is not your subordinate' };
      }
    }

    return targetReimbursements;
  }

  async updateReimbursement(body, requestingUser) {
    const dto = new UpdateReimbursementRequestDto(body);
    dto.validate();

    const reimbursement = await findReimbursementById(dto.reimbursementId);
    if (!reimbursement) {
      throw { status: 404, message: 'Reimbursement not found' };
    }

    const { role, id: approverId } = requestingUser;

    // once rejected by anyone — cannot be updated again
    if (
      reimbursement.rm_approval_status === APPROVAL_STATUS.REJECTED ||
      reimbursement.ape_approval_status === APPROVAL_STATUS.REJECTED
    ) {
      throw { status: 400, message: 'Reimbursement has already been rejected' };
    }

    if (role === ROLES.RM) {
      if (reimbursement.rm_approval_status !== APPROVAL_STATUS.PENDING) {
        throw { status: 400, message: 'Reimbursement already actioned by RM' };
      }
      await updateRmApprovalStatus(dto.reimbursementId, dto.status);
    }

    if (role === ROLES.APE || role === ROLES.CFO) {
      if (reimbursement.ape_approval_status !== APPROVAL_STATUS.PENDING) {
        throw { status: 400, message: 'Reimbursement already actioned at APE level' };
      }
      await updateApeApprovalStatus(dto.reimbursementId, dto.status);
    }

    // log the action
    await logApprovalAction({
      reimbursementId: dto.reimbursementId,
      approverId,
      approverRole: role,
      status: dto.status
    });

    return await findReimbursementById(dto.reimbursementId);
  }
}

module.exports = new ReimbursementsService();