import type { NextApiRequest, NextApiResponse } from "next";
import runningMigration, { RunnerOption } from "node-pg-migrate";
import path from "node:path";
import fs from "node:fs";
import database from "@database/config/database";

interface MigrationResponse {
  method: string;
  migrations?: any[];
  error?: string;
}

// Function to find the correct migrations directory
function findMigrationsDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), "src", "database", "migrations"),
    path.join(process.cwd(), "database", "migrations"),
    path.join(process.cwd(), "migrations"),
    path.join("src", "database", "migrations"),
    path.join("database", "migrations"),
    "migrations"
  ];

  console.log("Looking for migrations directory...");
  console.log("Current working directory:", process.cwd());

  for (const dirPath of possiblePaths) {
    try {
      console.log(`Checking path: ${dirPath}`);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath);
        console.log(`Found migrations directory at: ${dirPath}`);
        console.log(`Migration files in directory:`, files);
        return dirPath;
      }
    } catch (error) {
      console.log(`Path ${dirPath} check failed:`, error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(`Migrations directory not found. Checked paths: ${possiblePaths.join(", ")}`);
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

  let dbClient;
  try {
    // Debug logging
    console.log("=== Migration Handler Debug Info ===");
    console.log("Method:", req.method);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "***defined***" : "undefined");
    console.log("Current working directory:", process.cwd());

    dbClient = await database.getNewClient();
    console.log("Database client obtained successfully");

    // Find the migrations directory
    const migrationsDir = findMigrationsDir();
    console.log("Using migrations directory:", migrationsDir);

    const migrationOptions: RunnerOption = {
      dir: migrationsDir,
      dbClient: dbClient,
      direction: "up" as const,
      dryRun: req.method === "GET", // GET = dry run, POST = actual migration
      databaseUrl: process.env.DATABASE_URL,
      migrationsTable: "pgmigrations",
      schema: "public",
      verbose: true,
      log: console.log,
    };

    console.log("Running migration with options:", {
      ...migrationOptions,
      dbClient: "***client***",
      databaseUrl: "***url***"
    });

    const migrations = await runningMigration(migrationOptions);
    console.log("Migration completed, found migrations:", migrations.length);

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
    console.error("=== Migration Error Details ===");
    console.error("Error:", error);
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");

    res.status(500).json({
      method: req.method || "UNKNOWN",
      error: error instanceof Error ? error.message : "Unknown migration error",
    });
  } finally {
    if (dbClient) {
      try {
        await dbClient.end();
        console.log("Database client closed successfully");
      } catch (closeError) {
        console.error("Error closing database client:", closeError);
      }
    }
  }
}