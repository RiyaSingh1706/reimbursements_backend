const { db } = require('../../config/db');
const { users } = require('../schema/index');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seedCFO() {
  try {
    const password_hash = await bcrypt.hash('CFO#ORG@April2026', 10);

    await db.insert(users).values({
      name: 'CFO',
      email: 'cfo@org.com',
      password_hash,
      role: 'CFO'
    }).onConflictDoNothing(); // safe to run multiple times

    console.log('CFO seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedCFO();