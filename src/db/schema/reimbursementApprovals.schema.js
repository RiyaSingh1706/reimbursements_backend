const { pgTable, uuid, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users.schema');
const { reimbursements } = require('./reimbursements.schema');

const approverRoleEnum = pgEnum('approver_role', ['RM', 'APE', 'CFO']);
const approvalActionEnum = pgEnum('approval_action', ['APPROVED', 'REJECTED']);

const reimbursementApprovals = pgTable('reimbursement_approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  reimbursement_id: uuid('reimbursement_id')
    .notNull()
    .references(() => reimbursements.id, { onDelete: 'CASCADE' }),
  approver_id: uuid('approver_id')
    .notNull()
    .references(() => users.id, { onDelete: 'CASCADE' }),
  approver_role: approverRoleEnum('approver_role').notNull(),
  status: approvalActionEnum('status').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

module.exports = { reimbursementApprovals, approverRoleEnum, approvalActionEnum };