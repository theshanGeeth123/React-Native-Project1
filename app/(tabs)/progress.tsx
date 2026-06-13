import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/study/ProgressBar';
import { colors } from '@/constants/theme';
import { useStudyPlanner } from '@/lib/study-planner';
import { formatDuration } from '@/lib/utils';

const SafeAreaView = styled(RNSafeAreaView);
const MAX_DAILY_MINUTES = 180;

export default function ProgressScreen() {
  const planner = useStudyPlanner();

  if (!planner.isReady) {
    return (
      <SafeAreaView className="screen">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const totalTasks = planner.tasks.length;
  const completion = planner.overallCompletion;
  const totalHours = Math.floor(planner.totalFocusMinutes / 60);
  const totalMinutes = planner.totalFocusMinutes % 60;

  const getCourseProgress = (course: Course) => {
    const courseTasks = planner.tasks.filter((task) => task.course === course.title);
    if (!courseTasks.length) return 0;
    return Math.round(courseTasks.reduce((sum, task) => sum + task.progress, 0) / courseTasks.length);
  };

  return (
    <SafeAreaView className="screen">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 132 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="screen-content">
          <Text className="page-title">Progress</Text>
          <Text className="page-subtitle">
            Your progress updates from completed tasks and local focus logs.
          </Text>

          <View className="mt-6 rounded-3xl bg-accent p-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-sans-extrabold uppercase text-white/70">Focus score</Text>
                <Text className="mt-2 text-5xl font-sans-extrabold text-white">{completion}%</Text>
              </View>
              <View className="size-16 items-center justify-center rounded-3xl bg-white/20">
                <Ionicons name="trending-up-outline" size={34} color="white" />
              </View>
            </View>
            <Text className="mt-4 text-base font-sans-semibold leading-6 text-white/80">
              {planner.completedTasks.length} of {totalTasks} tasks completed. You logged {totalHours}h {totalMinutes}m focus time this week.
            </Text>
            <View className="mt-5 h-3 overflow-hidden rounded-full bg-white/20">
              <View className="h-full rounded-full bg-white" style={{ width: `${completion}%` }} />
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            <View className="flex-1 rounded-3xl border border-border bg-card p-4">
              <Ionicons name="checkmark-done-outline" size={26} color={colors.accent} />
              <Text className="mt-3 text-2xl font-sans-extrabold text-primary">{planner.completedTasks.length}</Text>
              <Text className="text-sm font-sans-bold text-muted-foreground">Completed</Text>
            </View>
            <View className="flex-1 rounded-3xl border border-border bg-card p-4">
              <Ionicons name="flame-outline" size={26} color={colors.accent} />
              <Text className="mt-3 text-2xl font-sans-extrabold text-primary">{formatDuration(planner.totalFocusMinutes)}</Text>
              <Text className="text-sm font-sans-bold text-muted-foreground">Weekly focus</Text>
            </View>
          </View>

          <View className="my-5 flex-row items-center justify-between">
            <Text className="text-2xl font-sans-extrabold text-primary">Weekly focus</Text>
            <Text className="text-sm font-sans-bold text-muted-foreground">Last 7 days</Text>
          </View>

          <View className="rounded-3xl border border-border bg-card p-4">
            <View className="flex-row items-end justify-between gap-2">
              {planner.weeklyFocus.map((item) => {
                const height = Math.max(24, (item.minutes / MAX_DAILY_MINUTES) * 130);
                const isToday = item.date === planner.todayKey;
                return (
                  <View key={item.date} className="flex-1 items-center gap-2">
                    <View className="h-36 justify-end">
                      <View
                        className="w-8 rounded-full"
                        style={{
                          height,
                          backgroundColor: isToday ? colors.accent : colors.accentSoft,
                        }}
                      />
                    </View>
                    <Text className="text-xs font-sans-extrabold text-primary">{item.day}</Text>
                    <Text className="text-xs font-sans-bold text-muted-foreground">{item.minutes}m</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="my-5 flex-row items-center justify-between">
            <Text className="text-2xl font-sans-extrabold text-primary">Subject progress</Text>
          </View>
          <View className="gap-3">
            {planner.courses.map((course) => {
              const progress = getCourseProgress(course);
              const taskCount = planner.tasks.filter((task) => task.course === course.title).length;
              return (
                <View key={course.id} className="rounded-3xl border border-border bg-card p-4">
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="min-w-0 flex-1">
                      <Text className="text-lg font-sans-extrabold text-primary" numberOfLines={1}>
                        {course.title}
                      </Text>
                      <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                        {taskCount} task{taskCount === 1 ? '' : 's'} planned
                      </Text>
                    </View>
                    <Text className="text-lg font-sans-extrabold text-primary">{progress}%</Text>
                  </View>
                  <ProgressBar value={progress} color={colors.accent} />
                </View>
              );
            })}
          </View>

          <View className="my-5 flex-row items-center justify-between">
            <Text className="text-2xl font-sans-extrabold text-primary">Achievements</Text>
          </View>
          <View className="gap-3">
            {planner.achievements.map((achievement) => (
              <View
                key={achievement.id}
                className={`flex-row gap-4 rounded-3xl border p-4 ${achievement.unlocked ? 'border-border bg-card' : 'border-border bg-card/60'}`}
              >
                <View className={`size-14 items-center justify-center rounded-2xl ${achievement.unlocked ? 'bg-accent' : 'bg-muted'}`}>
                  <Ionicons
                    name={achievement.icon as keyof typeof Ionicons.glyphMap}
                    size={26}
                    color={achievement.unlocked ? 'white' : colors.mutedForeground}
                  />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-lg font-sans-extrabold text-primary">{achievement.title}</Text>
                  <Text className="mt-1 text-sm font-sans-semibold leading-5 text-muted-foreground">
                    {achievement.caption}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="my-5 flex-row items-center justify-between">
            <Text className="text-2xl font-sans-extrabold text-primary">Manual focus</Text>
          </View>
          <View className="flex-row gap-3">
            {[15, 30, 60].map((minutes) => (
              <Pressable
                key={minutes}
                className="flex-1 items-center rounded-3xl bg-primary px-3 py-4"
                onPress={() => planner.logFocus(minutes, `${minutes}m progress log`)}
              >
                <Text className="text-lg font-sans-extrabold text-white">+{minutes}m</Text>
                <Text className="mt-1 text-xs font-sans-bold text-white/70">Add focus</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
