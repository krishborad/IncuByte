module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  testMatch: ['**/tests/**/*.test.tsx', '**/tests/**/*.test.ts', '**/*.test.tsx', '**/*.test.ts'],
  verbose: true
};
