/* eslint-disable */
// Test environment setup: mock native modules that Jest can't run.

// Gesture Handler jest setup
require('react-native-gesture-handler/jestSetup');

// Reanimated mock (v3)
try {
  require('react-native-reanimated').setUpTests?.();
} catch (e) {
  // no-op if not needed
}

// Silence the native animation helper warning under jest
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Haptics is a no-op in tests
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));
