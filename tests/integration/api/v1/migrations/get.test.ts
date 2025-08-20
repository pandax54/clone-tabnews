import { cleanDatabase } from "tests/utils/cleanDatabase"

beforeAll(cleanDatabase)
test('GET to /api/v1/migrations should return 200', async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/v1/migrations`)

  const body = await res.json()
  
  expect(res.status).toBe(200)
  expect(body).toHaveProperty('method', "GET")
})
