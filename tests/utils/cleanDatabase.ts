import db from "@infra/config/database";

export async function cleanDatabase() {
  await db.query({
    text: "drop schema IF EXISTS public cascade; create schema public;",
  });
}