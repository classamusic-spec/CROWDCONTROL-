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
    // Node tooling scripts run via tsx/node and are validated by execution,
    // not by the RN-focused app lint/typecheck config.
    'scripts/',
    'babel.config.js',
    'jest.config.js',
    'jest.setup.js',
  ],
  rules: {
    'no-console': 'off',
  },
};
