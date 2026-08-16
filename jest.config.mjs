import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./"
});

export default createJestConfig({
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/app/layout.js",
    "scripts/contract/**/*.cjs"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom"
});
