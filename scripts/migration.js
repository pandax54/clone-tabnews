const { Pool } = require('pg');
const migrate = require('node-pg-migrate').default;
require('dotenv').config({ path: '.env.development' });

const path = require('path');

const dryRun = process.argv[2] === 'true';

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('Starting migrations...');
  console.log('Database URL:', databaseUrl.replace(/:[^:]*@/, ':***@')); // Hide password

  try {
    const migrations = await migrate({
      databaseUrl: databaseUrl,
      migrationsTable: 'pgmigrations',
      dir: path.join(__dirname, '..', 'src', 'database', 'migrations'),
      direction: 'up',
      dryRun: dryRun,
      verbose: true,
      createSchema: true,
      createMigrationsSchema: true
    });

    console.log('Migrations completed successfully:', migrations);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
