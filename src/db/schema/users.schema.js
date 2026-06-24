const { pgTable, uuid, varchar, timestamp, pgEnum } = require('drizzle-orm/pg-core');

const roleEnum = pgEnum('role', ['EMP', 'RM', 'APE', 'CFO']);

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('EMP'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

module.exports = { users, roleEnum };