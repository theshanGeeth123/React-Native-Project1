import '@/global.css';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StudyPlannerProvider } from '@/lib/study-planner';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidPublishableKey = Boolean(publishableKey?.startsWith('pk_'));

function MissingClerkKeyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      <StatusBar style="dark" />
      <View className="flex-1 items-center justify-center">
        <View className="auth-logo-mark mb-5">
          <Text className="auth-logo-mark-text">B</Text>
        </View>
        <Text className="text-center text-3xl font-sans-extrabold text-primary">
          Add your Clerk key
        </Text>
        <Text className="mt-3 max-w-80 text-center text-base font-sans-medium leading-6 text-muted-foreground">
          Create a .env file from .env.example and add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to enable secure sign in and sign up.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!hasValidPublishableKey) {
    return <MissingClerkKeyScreen />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <StudyPlannerProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
        </Stack>
      </StudyPlannerProvider>
    </ClerkProvider>
  );
}
