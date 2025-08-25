import db from '@database/config/database';

export async function cleanDatabase() {
  try {
    await db.query({
      text: 'drop schema IF EXISTS public cascade; create schema public;'
    });

    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('Failed to clean database:', error);
    throw error;
  }
}

export async function setupTestDatabase() {
  // Run any setup migrations or seed data
  await cleanDatabase();

  // await runMigrations();
}
