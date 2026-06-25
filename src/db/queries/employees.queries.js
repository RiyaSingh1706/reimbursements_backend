const { db } = require('../../config/db');
const { users, employeeManagers } = require('../schema/index');
const { eq, inArray } = require('drizzle-orm');
const { ROLES } = require('../../constants/roles');

const findUserById = async (id) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] || null;
};

const findAllByRoles = async (roles) => {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    })
    .from(users)
    .where(inArray(users.role, roles));
};

const findEmpsByRmId = async (rmId) => {
  const assignments = await db
    .select()
    .from(employeeManagers)
    .where(eq(employeeManagers.rm_id, rmId));

  if (!assignments.length) return [];

  const empIds = assignments.map((a) => a.emp_id);

  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    })
    .from(users)
    .where(inArray(users.id, empIds));
};

const assignEmployeeToRm = async (empId, rmId) => {
  const result = await db
    .insert(employeeManagers)
    .values({ emp_id: empId, rm_id: rmId })
    .returning();
  return result[0];
};

const removeEmployeeFromRm = async (empId, rmId) => {
  const result = await db
    .delete(employeeManagers)
    .where(
      eq(employeeManagers.emp_id, empId),
      eq(employeeManagers.rm_id, rmId)
    )
    .returning();
  return result[0];
};

const findAssignment = async (empId, rmId) => {
  const result = await db
    .select()
    .from(employeeManagers)
    .where(
      eq(employeeManagers.emp_id, empId),
      eq(employeeManagers.rm_id, rmId)
    )
    .limit(1);
  return result[0] || null;
};

module.exports = {
  findUserById,
  findAllByRoles,
  findEmpsByRmId,
  assignEmployeeToRm,
  removeEmployeeFromRm,
  findAssignment
};