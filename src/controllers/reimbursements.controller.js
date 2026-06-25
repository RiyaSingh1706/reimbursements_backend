const reimbursementsService = require('../services/reimbursements.service');
const { ReimbursementResponseDto } = require('../dtos/response/reimbursements/reimbursementList.response.dto');

class ReimbursementsController {
  async createReimbursement(req, res, next) {
    try {
      const reimbursement = await reimbursementsService.createReimbursement(req.body, req.user);
      return res.status(201).json({
        status: 'success',
        message: 'Reimbursement raised successfully',
        data: { reimbursement: new ReimbursementResponseDto(reimbursement) }
      });
    } catch (err) {
      next(err);
    }
  }

  async listReimbursements(req, res, next) {
    try {
      const reimbursements = await reimbursementsService.listReimbursements(req.user);
      const data = reimbursements.map((r) => new ReimbursementResponseDto(r));
      return res.status(200).json({
        status: 'success',
        data: { reimbursements: data }
      });
    } catch (err) {
      next(err);
    }
  }

  async listReimbursementsByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const reimbursements = await reimbursementsService.listReimbursementsByUserId(userId, req.user);
      const data = reimbursements.map((r) => new ReimbursementResponseDto(r));
      return res.status(200).json({
        status: 'success',
        data: { reimbursements: data }
      });
    } catch (err) {
      next(err);
    }
  }

  async updateReimbursement(req, res, next) {
    try {
      const reimbursement = await reimbursementsService.updateReimbursement(req.body, req.user);
      return res.status(200).json({
        status: 'success',
        message: 'Reimbursement updated successfully',
        data: { reimbursement: new ReimbursementResponseDto(reimbursement) }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReimbursementsController();