const nextJest = require("next/jest");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.development" });

// factory function to create Jest configuration
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: ".",
});

const config = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFiles: [
    "<rootDir>/tests/jest.setup.ts", // Your custom setup file
    "dotenv/config", // Loads .env automatically
  ],
  // setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@infra/(.*)$": "<rootDir>/src/infra/$1",
  },
};

module.exports = createJestConfig(config);
