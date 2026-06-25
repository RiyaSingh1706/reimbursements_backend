const { db } = require('../../config/db');
const { users } = require('../schema/index');
const { eq } = require('drizzle-orm');

const findUserById = async (id) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] || null;
};

const updateUserRole = async (userId, role) => {
  const result = await db
    .update(users)
    .set({ role, updated_at: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return result[0];
};

module.exports = { findUserById, updateUserRole };