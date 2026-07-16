/** Jest configuration for Expo + React Native Testing Library. */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated|react-native-gesture-handler))',
  ],
  testMatch: ['**/src/tests/**/*.test.ts', '**/src/tests/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/engine/**/*.ts',
    'src/utils/**/*.ts',
    'src/storage/**/*.ts',
    '!src/**/*.d.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
