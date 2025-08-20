import db from "@infra/config/database";
import fs from "node:fs/promises";
import path from "node:path";
import { cleanDatabase } from "tests/utils/cleanDatabase";

beforeAll(cleanDatabase);

test("POST to /api/v1/migrations should return 201 and execute all pending migrations", async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/v1/migrations`, {
    method: "POST",
  });

  // how many migrations exists inside migrations folder
  const folders = await fs.readdir(path.join("src", "infra", "migrations"));

  const body = await res.json();

  const executedMigrations = await db.query({
    text: "SELECT count(*) FROM public.pgmigrations",
  });

  expect(parseInt(executedMigrations.rows[0].count)).toBe(
    body.migrations.length,
  );

  expect(res.status).toBe(201);
  expect(body).toHaveProperty("method", "POST");
  expect(body.migrations.length).toBe(folders.length);
});

test("POST to /api/v1/migrations should return 200 and empty migrations array when no pending migrations", async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/v1/migrations`, {
    method: "POST",
  });

  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toHaveProperty("method", "POST");
  expect(body.migrations.length).toBe(0);
});
