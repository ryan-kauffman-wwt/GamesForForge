module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/whack-a-mole/whack-a-mole.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
