import type { NextApiRequest, NextApiResponse } from "next";
import runningMigration, { RunnerOption } from "node-pg-migrate";
import path from "node:path";
import database from "@infra/config/database";

interface MigrationResponse {
  method: string;
  migrations?: any[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MigrationResponse>,
) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(req.method || "")) {
    return res.status(405).json({
      method: req.method || "UNKNOWN",
      error: "Method not allowed",
    });
  }

  const dbClient = await database.getNewClient();

  const migrationOptions: RunnerOption = {
    dir: path.join("src", "infra", "migrations"),
    dbClient: dbClient,
    direction: "up" as const,
    dryRun: req.method === "GET", // GET = dry run, POST = actual migration
    databaseUrl: process.env.DATABASE_URL,
    migrationsTable: "pgmigrations",
    schema: "public",
    verbose: true,
    log: console.log,
  };

  try {
    const migrations = await runningMigration(migrationOptions);

    if (req.method === "POST") {
      if (migrations.length > 0) {
        return res.status(201).json({
          method: req.method,
          migrations,
        });
      }
    }

    return res.status(200).json({
      method: req.method as string,
      migrations,
    });
  } catch (error) {
    console.error("Migration error:", error);

    res.status(500).json({
      method: req.method || "UNKNOWN",
      error: error instanceof Error ? error.message : "Unknown migration error",
    });
  } finally {
    await dbClient.end()
  }
}
