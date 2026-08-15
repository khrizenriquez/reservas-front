export default {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/jest/**/*.test.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "lib/format.js",
    "lib/reservationPolicy.js",
  ],
  coverageDirectory: "coverage/jest",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
