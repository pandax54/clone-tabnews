import { Client } from "pg";

async function query(input: { text: string; values?: Array<any> }) {
  const { text, values } = input;
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    port: parseInt(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    ssl:
      process.env.NODE_ENV !== "production"
        ? false
        : {
            rejectUnauthorized: false,
          },
  });

  try {
    await client.connect();

    const test = await client.query("SELECT 1 + 1 as sum;");
    if (test.rows[0].sum !== 2) throw new Error("Database not connected.");

    const result = await client.query(text, values);

    return result;
  } catch (error) {
    return;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
  getPostgresVersion: async () => {
    // const result = await query("SELECT version();");
    // return result.rows[0].version;
    const result = await query({ text: "SHOW server_version;" });
    return result.rows[0].server_version;
  },
  getMaxConnections: async () => {
    const result = await query({ text: "SHOW max_connections;" });
    return parseInt(result.rows[0].max_connections);
  },
  getOpenedConnections: async (databaseName: string) => {
    const result = await query({
      text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1 and state = 'active';",
      values: [databaseName],
    });
    // const result = await query("SELECT count(*) FROM pg_stat_activity WHERE state = 'active';");
    // SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db'
    // pg_stat_activity -> tempo real
    // pg_stat_database
    return parseInt(result.rows[0].count);
  },
};
