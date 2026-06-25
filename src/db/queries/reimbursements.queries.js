const { db } = require('../../config/db');
const { reimbursements, reimbursementApprovals, employeeManagers } = require('../schema/index');
const { eq, and, inArray } = require('drizzle-orm');
const { APPROVAL_STATUS } = require('../../constants/approvalStatus');

const createReimbursement = async ({ empId, title, description, amount }) => {
  const result = await db
    .insert(reimbursements)
    .values({
      emp_id: empId,
      title,
      description,
      amount,
      rm_approval_status: APPROVAL_STATUS.PENDING,
      ape_approval_status: APPROVAL_STATUS.PENDING
    })
    .returning();
  return result[0];
};

const findReimbursementById = async (id) => {
  const result = await db
    .select()
    .from(reimbursements)
    .where(eq(reimbursements.id, id))
    .limit(1);
  return result[0] || null;
};

const findReimbursementsByEmpId = async (empId) => {
  return await db
    .select()
    .from(reimbursements)
    .where(eq(reimbursements.emp_id, empId));
};

const findPendingReimbursementsByRmId = async (rmId) => {
  const assignments = await db
    .select()
    .from(employeeManagers)
    .where(eq(employeeManagers.rm_id, rmId));

  if (!assignments.length) return [];

  const empIds = assignments.map((a) => a.emp_id);

  return await db
    .select()
    .from(reimbursements)
    .where(
      and(
        inArray(reimbursements.emp_id, empIds),
        eq(reimbursements.rm_approval_status, APPROVAL_STATUS.PENDING)
      )
    );
};

const findReimbursementsPendingAtApe = async () => {
  return await db
    .select()
    .from(reimbursements)
    .where(
      and(
        eq(reimbursements.rm_approval_status, APPROVAL_STATUS.APPROVED),
        eq(reimbursements.ape_approval_status, APPROVAL_STATUS.PENDING)
      )
    );
};

const findReimbursementsApprovedByApe = async () => {
  return await db
    .select()
    .from(reimbursements)
    .where(
      eq(reimbursements.ape_approval_status, APPROVAL_STATUS.APPROVED)
    );
};

const updateRmApprovalStatus = async (reimbursementId, status) => {
  const result = await db
    .update(reimbursements)
    .set({ rm_approval_status: status, updated_at: new Date() })
    .where(eq(reimbursements.id, reimbursementId))
    .returning();
  return result[0];
};

const updateApeApprovalStatus = async (reimbursementId, status) => {
  const result = await db
    .update(reimbursements)
    .set({ ape_approval_status: status, updated_at: new Date() })
    .where(eq(reimbursements.id, reimbursementId))
    .returning();
  return result[0];
};

const logApprovalAction = async ({ reimbursementId, approverId, approverRole, status }) => {
  const result = await db
    .insert(reimbursementApprovals)
    .values({
      reimbursement_id: reimbursementId,
      approver_id: approverId,
      approver_role: approverRole,
      status
    })
    .returning();
  return result[0];
};

module.exports = {
  createReimbursement,
  findReimbursementById,
  findReimbursementsByEmpId,
  findPendingReimbursementsByRmId,
  findReimbursementsPendingAtApe,
  findReimbursementsApprovedByApe,
  updateRmApprovalStatus,
  updateApeApprovalStatus,
  logApprovalAction
};