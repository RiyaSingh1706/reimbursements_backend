const { APPROVAL_STATUS } = require('../../../constants/approvalStatus');

class ReimbursementResponseDto {
  constructor({ title, description, amount, rm_approval_status, ape_approval_status }) {
    this.title = title;
    this.description = description;
    this.amount = amount;
    this.status = this._deriveStatus(rm_approval_status, ape_approval_status);
  }

  _deriveStatus(rmStatus, apeStatus) {
    if (rmStatus === APPROVAL_STATUS.REJECTED || apeStatus === APPROVAL_STATUS.REJECTED) {
      return APPROVAL_STATUS.REJECTED;
    }
    if (rmStatus === APPROVAL_STATUS.APPROVED && apeStatus === APPROVAL_STATUS.APPROVED) {
      return APPROVAL_STATUS.APPROVED;
    }
    return APPROVAL_STATUS.PENDING;
  }
}
ush
module.exports = { ReimbursementResponseDto };