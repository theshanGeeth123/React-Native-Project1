import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/expo';
import { type Href, Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, components } from '@/constants/theme';

const tabBar = components.tabBar;

const tabScreens = [
  { name: 'index', title: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'planner', title: 'Planner', icon: 'calendar-outline', activeIcon: 'calendar' },
  { name: 'progress', title: 'Progress', icon: 'stats-chart-outline', activeIcon: 'stats-chart' },
  { name: 'settings', title: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
] as const;

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/signIn" as Href} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: colors.primary,
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
      }}
    >
      {tabScreens.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <View className="size-12 items-center justify-center rounded-full" style={{ backgroundColor: focused ? colors.card : 'transparent' }}>
                <Ionicons
                  name={(focused ? tab.activeIcon : tab.icon) as keyof typeof Ionicons.glyphMap}
                  size={23}
                  color={focused ? colors.accent : colors.card}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
