const { pgTable, uuid, timestamp, primaryKey } = require('drizzle-orm/pg-core');
const { users } = require('./users.schema');

const employeeManagers = pgTable('employee_managers', {
  emp_id: uuid('emp_id')
    .notNull()
    .references(() => users.id, { onDelete: 'CASCADE' }),
  rm_id: uuid('rm_id')
    .notNull()
    .references(() => users.id, { onDelete: 'CASCADE' }),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  pk: primaryKey({ columns: [table.emp_id, table.rm_id] })
}));

module.exports = { employeeManagers };