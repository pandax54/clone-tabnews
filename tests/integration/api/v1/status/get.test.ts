
test("GET to /api/v1/status should return 200", async () => {
  console.log('BASE_URL:', process.env.BASE_URL)
  const response = await fetch(`${process.env.BASE_URL}/api/v1/status`);

  const body = await response.json()

  expect(response.status).toBe(200);

  expect(body.updated_at).toBeDefined()
  expect(body.updated_at).toBe(new Date(body.updated_at).toISOString())

  expect(body.dependencies.database.version).toBeDefined()
  // expect(body.dependencies.database.version).toMatch(/PostgreSQL/);
  expect(typeof body.dependencies.database.version).toBe('string')

  expect(body.dependencies.database.max_connections).toBeDefined()
  expect(typeof body.dependencies.database.max_connections).toBe('number')

  expect(body.dependencies.database.opened_connections).toBeDefined()
  expect(body.dependencies.database.opened_connections).toBeGreaterThan(0)
  expect(typeof body.dependencies.database.opened_connections).toBe('number')
});
