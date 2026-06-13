import { Ionicons } from '@expo/vector-icons';
import { AUTH_ROUTES } from '@/lib/auth';
import { useStudyPlanner } from '@/lib/study-planner';
import { getInitials } from '@/lib/utils';
import { useClerk, useUser } from '@clerk/expo';
import { type Href, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/components/study/ProfileAvatar';
import { colors } from '@/constants/theme';

const SafeAreaView = styled(RNSafeAreaView);

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const planner = useStudyPlanner();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = user?.primaryEmailAddress?.emailAddress || 'No email connected';
  const name = useMemo(() => user?.fullName || user?.firstName || email.split('@')[0] || 'Student', [email, user]);
  const initials = getInitials(name || email);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);

    try {
      await signOut();
      router.replace(AUTH_ROUTES.signIn as Href);
    } catch {
      setError('Could not sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleResetPlanner = () => {
    Alert.alert(
      'Reset planner?',
      'This will replace your local tasks, subjects, and focus logs with fresh sample data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: planner.resetPlanner },
      ],
    );
  };

  return (
    <SafeAreaView className="screen">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 132 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="screen-content">
          <Text className="page-title">Settings</Text>
          <Text className="page-subtitle">
            Manage your account and local study data.
          </Text>

          <View className="mt-6 rounded-3xl border border-border bg-card p-5">
            <View className="flex-row items-center gap-4">
              <ProfileAvatar initials={initials} size="lg" />
              <View className="min-w-0 flex-1">
                <Text className="text-xs font-sans-extrabold uppercase text-muted-foreground">
                  Signed in as
                </Text>
                <Text className="mt-2 text-2xl font-sans-extrabold text-primary" numberOfLines={1}>
                  {name}
                </Text>
                <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground" numberOfLines={1}>
                  {email}
                </Text>
              </View>
            </View>

            {error ? (
              <Text className="mt-4 text-sm font-sans-semibold text-destructive">{error}</Text>
            ) : null}
          </View>

          <View className="mt-6 rounded-3xl bg-accent p-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-sans-extrabold uppercase text-white/70">Local storage</Text>
                <Text className="mt-2 text-3xl font-sans-extrabold text-white">Offline first</Text>
              </View>
              <View className="size-14 items-center justify-center rounded-2xl bg-white/20">
                <Ionicons name="phone-portrait-outline" size={30} color="white" />
              </View>
            </View>
            <Text className="mt-3 text-base font-sans-semibold leading-6 text-white/80">
              Your tasks, subjects, and focus logs are saved on this device only. No database is connected.
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <View className="flex-row items-center justify-between gap-4 rounded-3xl border border-border bg-card p-4">
              <View className="min-w-0 flex-1">
                <Text className="text-base font-sans-extrabold text-primary">Tasks saved</Text>
                <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                  Active and completed study tasks
                </Text>
              </View>
              <View className="rounded-full bg-muted px-4 py-2">
                <Text className="text-xs font-sans-extrabold text-primary">{planner.tasks.length}</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-4 rounded-3xl border border-border bg-card p-4">
              <View className="min-w-0 flex-1">
                <Text className="text-base font-sans-extrabold text-primary">Subjects</Text>
                <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                  Modules in your local planner
                </Text>
              </View>
              <View className="rounded-full bg-muted px-4 py-2">
                <Text className="text-xs font-sans-extrabold text-primary">{planner.courses.length}</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-4 rounded-3xl border border-border bg-card p-4">
              <View className="min-w-0 flex-1">
                <Text className="text-base font-sans-extrabold text-primary">Focus logs</Text>
                <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                  Manual focus blocks stored locally
                </Text>
              </View>
              <View className="rounded-full bg-muted px-4 py-2">
                <Text className="text-xs font-sans-extrabold text-primary">{planner.focusLogs.length}</Text>
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 py-4"
            onPress={handleResetPlanner}
          >
            <Ionicons name="refresh-outline" size={20} color={colors.destructive} />
            <Text className="font-sans-extrabold text-destructive">Reset local planner</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: isSigningOut, disabled: isSigningOut }}
            className="mt-3 flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4"
            disabled={isSigningOut}
            onPress={handleSignOut}
          >
            {isSigningOut ? <ActivityIndicator color="#EEF6FF" size="small" /> : <Ionicons name="log-out-outline" size={20} color="#EEF6FF" />}
            <Text className="font-sans-extrabold text-background">
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
