const nextJest = require('next/jest');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.development' });

// factory function to create Jest configuration
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: '.'
});

const config = {
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFiles: [
    '<rootDir>/tests/jest.setup.ts',
    'dotenv/config' // Loads .env automatically
  ],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1'
  }
};

module.exports = createJestConfig(config);
