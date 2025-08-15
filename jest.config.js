import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  preset: "ts-jest",
  verbose: true,
  testMatch: ["**/tests/**/**/*.test.ts"],
  // setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  setupFiles: ["<rootDir>/tests/jest.setup.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
};
