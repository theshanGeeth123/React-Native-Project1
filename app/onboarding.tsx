import { AUTH_ROUTES } from '@/lib/auth';
import { type Href, Link } from 'expo-router';
import { styled } from 'nativewind';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="screen">
      <View className="flex-1 justify-center px-5">
        <View className="auth-logo-mark mb-6">
          <Text className="auth-logo-mark-text">B</Text>
        </View>

        <Text className="text-4xl font-sans-extrabold leading-10 text-primary">
          Study planning that feels calm, focused, and clear.
        </Text>
        <Text className="mt-4 text-base font-sans-medium leading-6 text-muted-foreground">
          Organize courses, deadlines, focus blocks, and progress insights with one simple blue planner.
        </Text>

        <Link href={AUTH_ROUTES.signUp as Href} asChild>
          <Pressable className="mt-8 rounded-2xl bg-accent py-4">
            <Text className="text-center text-base font-sans-extrabold text-white">
              Create account
            </Text>
          </Pressable>
        </Link>

        <Link href={AUTH_ROUTES.signIn as Href} asChild>
          <Pressable className="mt-3 rounded-2xl border border-border bg-card py-4">
            <Text className="text-center text-base font-sans-extrabold text-accent">
              I already have an account
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
