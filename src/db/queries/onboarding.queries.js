const { db } = require('../../config/db');
const { users } = require('../schema/index');
const { eq } = require('drizzle-orm');

const findUserByEmail = async (email) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] || null;
};

const findUserById = async (id) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] || null;
};

const createUser = async ({ name, email, password_hash }) => {
  const result = await db
    .insert(users)
    .values({ name, email, password_hash, role: 'EMP' })
    .returning();
  return result[0];
};

module.exports = { findUserByEmail, findUserById, createUser };