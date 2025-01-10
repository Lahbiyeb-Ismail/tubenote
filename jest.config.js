module.exports = {
  projects: [
    "<rootDir>/apps/server/jest.config.js",
    // '<rootDir>/apps/client/jest.config.js',
    // '<rootDir>/packages/shared/jest.config.js'
  ],
  collectCoverageFrom: [
    "<rootDir>/apps/**/*.{ts,tsx}",
    "<rootDir>/packages/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
};
