import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from '@/hooks/AppState';
import { palette } from '@/data/theme';

// Keep the native splash visible until the JS is ready to draw the animated
// splash — this prevents any white flash between the two.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hand off from native splash to our animated splash on the first frame.
    const t = setTimeout(() => void SplashScreen.hideAsync(), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.primaryNavy }}>
      <SafeAreaProvider>
        <AppStateProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: palette.primaryNavy },
              animation: 'fade',
            }}
          />
        </AppStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
