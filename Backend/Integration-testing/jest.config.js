module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testDb.js'],
  testMatch: ['/tests//*.test.js'],
  collectCoverageFrom: [
    '/*.js',
    '!/node_modules/',
    '!/tests/',
    '!jest.config.js',
    '!server.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: './test-report/index.html',
        pageTitle: 'Todo App Test Report',
        includeFailureMsg: true,
        includeSuiteFailure: true
      }
    ]
  ],
  testTimeout: 10000
};