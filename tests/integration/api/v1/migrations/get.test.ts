import { cleanDatabase } from "tests/utils/cleanDatabase";

beforeAll(cleanDatabase);

test("GET to /api/v1/migrations should return 200", async () => {
  console.log('=== Test Environment Info ===');
  console.log('process.env.BASE_URL:', process.env.BASE_URL);
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL ? '***defined***' : 'undefined');

  const res = await fetch(`${process.env.BASE_URL}/api/v1/migrations`);

  console.log('=== Response Info ===');
  console.log('Status:', res.status);
  console.log('Status Text:', res.statusText);
  console.log('Headers:', Object.fromEntries(res.headers.entries()));

  const body = await res.json();
  console.log('=== Response Body ===');
  console.log('Body:', JSON.stringify(body, null, 2));

  // If the status is not 200, show the error details
  if (res.status !== 200) {
    console.error('=== Error Details ===');
    console.error('Expected status 200, got:', res.status);
    console.error('Error message:', body.error);
    
    // Fail the test with detailed error information
    throw new Error(`Expected status 200, got ${res.status}. Error: ${body.error || 'Unknown error'}`);
  }

  expect(res.status).toBe(200);
  expect(body).toHaveProperty("method", "GET");
  expect(body).toHaveProperty("migrations");
  expect(Array.isArray(body.migrations)).toBe(true);
});