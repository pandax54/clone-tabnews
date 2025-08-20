import { Client } from "pg";

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5431"),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    // connectionString: process.env.DATABASE_URL,
    ssl: getSslValues(),
  });
  await client.connect();
  return client;
}

async function query(input: { text: string; values?: Array<any> }) {
  const { text, values } = input;
  let client: Client | undefined;
  try {
    client = await getNewClient()

    const test = await client.query("SELECT 1 + 1 as sum;");
    if (test.rows[0].sum !== 2) throw new Error("Database not connected.");

    const result = await client.query(text, values);

    return result;
  } catch (error) {
    throw error;
  } finally {
    await client?.end();
  }
}

export default {
  query: query,
  getNewClient,
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

function getSslValues() {
  if (process.env.POSTGRES_CA) {
    return {
      // for self-assign certificate
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production"
    ? true //{ rejectUnauthorized: false,}
    : false;
}
