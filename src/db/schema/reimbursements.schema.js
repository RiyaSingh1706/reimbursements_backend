const { pgTable, uuid, varchar, numeric, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users.schema');

const approvalStatusEnum = pgEnum('approval_status', ['PENDING', 'APPROVED', 'REJECTED']);

const reimbursements = pgTable('reimbursements', {
  id: uuid('id').primaryKey().defaultRandom(),
  emp_id: uuid('emp_id')
    .notNull()
    .references(() => users.id, { onDelete: 'CASCADE' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  rm_approval_status: approvalStatusEnum('rm_approval_status')
    .notNull()
    .default('PENDING'),
  ape_approval_status: approvalStatusEnum('ape_approval_status')
    .notNull()
    .default('PENDING'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

module.exports = { reimbursements, approvalStatusEnum };