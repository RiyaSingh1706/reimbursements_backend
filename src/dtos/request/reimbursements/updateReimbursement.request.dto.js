const { APPROVAL_STATUS } = require('../../../constants/approvalStatus');

class UpdateReimbursementRequestDto {
  constructor({ reimbursementId, status }) {
    this.reimbursementId = reimbursementId;
    this.status = status;
  }

  validate() {
    if (!this.reimbursementId || !this.status) {
      throw { status: 400, message: 'reimbursementId and status are required' };
    }
    const allowed = [APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.REJECTED];
    if (!allowed.includes(this.status)) {
      throw { status: 400, message: 'status must be APPROVED or REJECTED' };
    }
  }
}

module.exports = { UpdateReimbursementRequestDto };