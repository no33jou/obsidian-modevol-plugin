module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^.+\\.vue$": "<rootDir>/tests/mocks/vueMock.js"
  }
};

