export default {
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/config/(.*)$": "<rootDir>/src/config/$1",
    "^@/middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@/modules/auth/(.*)$": "<rootDir>/src/modules/auth/$1",
    "^@/modules/note/(.*)$": "<rootDir>/src/modules/note/$1",
    "^@/modules/user/(.*)$": "<rootDir>/src/modules/user/$1",
    "^@/modules/video/(.*)$": "<rootDir>/src/modules/video/$1",
    "^@/modules/shared/api-errors/(.*)$":
      "<rootDir>/src/modules/shared/api-errors/$1",
    "^@/modules/shared/config/(.*)$": "<rootDir>/src/modules/shared/config/$1",
    "^@/modules/shared/constants/(.*)$":
      "<rootDir>/src/modules/shared/constants/$1",
    "^@/modules/shared/dtos/(.*)$": "<rootDir>/src/modules/shared/dtos/$1",
    "^@/modules/shared/schemas/(.*)$":
      "<rootDir>/src/modules/shared/schemas/$1",
    "^@/modules/shared/services/(.*)$":
      "<rootDir>/src/modules/shared/services/$1",
    "^@/modules/shared/types/(.*)$": "<rootDir>/src/modules/shared/types/$1",
    "^@/modules/shared/utils/(.*)$": "<rootDir>/src/modules/shared/utils/$1",
    "^@/templates/(.*)$": "<rootDir>/src/templates/$1",
  },
  testEnvironment: "node",
};
