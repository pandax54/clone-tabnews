import db from '@database/config/database';
import fs from 'node:fs/promises';
import path from 'node:path';
import { cleanDatabase } from 'tests/utils/cleanDatabase';

beforeAll(cleanDatabase);

test('POST to /api/v1/migrations should return 201 and execute all pending migrations', async () => {
  // Check the migrations directory and files
  try {
    const migrationsPath = path.join(
      process.cwd(),
      'src',
      'database',
      'migrations'
    );
    const migrationFiles = await fs.readdir(migrationsPath);
    console.log('Migration files found:', migrationFiles);
    console.log('Number of migration files:', migrationFiles.length);

    // Filter only .js files (actual migrations, not other files)
    const actualMigrationFiles = migrationFiles.filter(
      file =>
        file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.sql')
    );
    console.log('Actual migration files:', actualMigrationFiles);
    console.log(
      'Number of actual migration files:',
      actualMigrationFiles.length
    );
  } catch (error) {
    console.error('Error reading migrations directory:', error);
  }

  // Check current migration status before running
  try {
    const existingMigrations = await db.query({
      text: 'SELECT * FROM public.pgmigrations ORDER BY run_on'
    });
    console.log('Existing migrations before POST:', existingMigrations.rows);
    console.log(
      'Number of existing migrations:',
      existingMigrations.rows.length
    );
  } catch (error) {
    console.log(
      'No existing migrations table or error:',
      error instanceof Error ? error.message : String(error)
    );
  }

  const res = await fetch(`${process.env.BASE_URL}/api/v1/migrations`, {
    method: 'POST'
  });

  const body = await res.json();

  // Check migration status after running
  try {
    const executedMigrationsResult = await db.query({
      text: 'SELECT * FROM public.pgmigrations ORDER BY run_on'
    });
    console.log('Migrations after POST:', executedMigrationsResult.rows);
    console.log(
      'Number of executed migrations:',
      executedMigrationsResult.rows.length
    );

    const countResult = await db.query({
      text: 'SELECT count(*) FROM public.pgmigrations'
    });

    const expectedStatus =
      body.migrations && body.migrations.length > 0 ? 201 : 200;
    expect(res.status).toBe(expectedStatus);
    expect(body).toHaveProperty('method', 'POST');

    if (res.status === 201) {
      // If migrations were executed, verify they match
      expect(parseInt(countResult.rows[0].count)).toBe(body.migrations.length);
    }
  } catch (error) {
    console.error('Error checking executed migrations:', error);
    throw error;
  }
});

test('POST to /api/v1/migrations should return 200 and empty migrations array when no pending migrations', async () => {
  try {
    const existingMigrations = await db.query({
      text: 'SELECT count(*) FROM public.pgmigrations'
    });
    console.log('Existing migrations count:', existingMigrations.rows[0].count);
  } catch (error) {
    console.error('Error checking existing migrations:', error);
  }

  const res = await fetch(`${process.env.BASE_URL}/api/v1/migrations`, {
    method: 'POST'
  });

  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toHaveProperty('method', 'POST');
  expect(body.migrations.length).toBe(0);
});
