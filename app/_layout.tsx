import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import SplashScreen from '@/screens/Splash';
import { AuthProvider, useAuth } from '@/context/AuthContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoading, isOnboardingCompleted } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'profile';

    console.log('Navigation check:', {
      isOnboardingCompleted,
      currentSegment: segments[0],
      inAuthGroup,
    });

    if (!isOnboardingCompleted && inAuthGroup) {
      // Redirect to onboarding if not completed
      console.log('Redirecting to onboarding...');
      router.replace('/onboarding');
    } else if (isOnboardingCompleted && segments[0] === 'onboarding') {
      // Redirect to home if onboarding already completed
      console.log('Redirecting to home...');
      router.replace('/(tabs)');
    }
  }, [isOnboardingCompleted, segments, isLoading]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ 
          title: 'Profile',
          headerStyle: { backgroundColor: '#495E57' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
