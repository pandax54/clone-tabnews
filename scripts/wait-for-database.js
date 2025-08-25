const { exec } = require('node:child_process');

function checkPostgresConnection() {
  exec('docker exec database-1 pg_isready --host localhost', handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (error) {
      process.stdout.write(
        '\n\n❌ Error checking Postgres status, retrying...\n'
      );
      process.stdout.write(stderr);
      setTimeout(checkPostgresConnection, 200);
      return;
    }

    if (stdout.includes('accepting connections')) {
      process.stdout.write('\n\n🟢 Postgres database is ready!\n');
      return;
    }

    process.stdout.write('.');
    setTimeout(waitForit, 200);
  }
}

process.stdout.write('\n\n🔴 Waiting for Postgres database to be ready...\n');
checkPostgresConnection();
