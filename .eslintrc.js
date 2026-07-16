// ESLint (legacy config) using eslint-config-expo.
module.exports = {
  root: true,
  extends: ['expo'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.expo/',
    'coverage/',
    'assets/',
    'babel.config.js',
    'jest.config.js',
    'jest.setup.js',
  ],
  rules: {
    'no-console': 'off',
  },
};
