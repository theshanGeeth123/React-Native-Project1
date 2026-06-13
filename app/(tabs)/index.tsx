import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

import { ListHeading } from '@/components/ListHeading';
import { ProfileAvatar } from '@/components/study/ProfileAvatar';
import { StatCard } from '@/components/study/StatCard';
import { StudyTaskCard } from '@/components/study/StudyTaskCard';
import { TaskEditorModal } from '@/components/study/TaskEditorModal';
import { colors } from '@/constants/theme';
import { useStudyPlanner } from '@/lib/study-planner';
import { formatDuration, getInitials } from '@/lib/utils';

const SafeAreaView = styled(RNSafeAreaView);

export default function HomeScreen() {
  const { user } = useUser();
  const planner = useStudyPlanner();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);

  const displayName = useMemo(() => {
    const emailName = user?.primaryEmailAddress?.emailAddress?.split('@')[0];
    return user?.firstName || user?.fullName || emailName || 'Student';
  }, [user]);

  const initials = getInitials(displayName);
  const nextTask = planner.activeTasks[0];
  const priorityCount = planner.activeTasks.filter((task) => task.priority === 'high').length;

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: StudyTask) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  if (!planner.isReady) {
    return (
      <SafeAreaView className="screen">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent} size="large" />
          <Text className="mt-4 text-sm font-sans-semibold text-muted-foreground">Loading your planner...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="screen">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 132 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="screen-content">
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <ProfileAvatar initials={initials} />
              <View>
                <Text className="text-xs font-sans-extrabold uppercase text-muted-foreground">
                  {planner.displayDate}
                </Text>
                <Text className="text-2xl font-sans-extrabold text-primary" numberOfLines={1}>
                  Hi, {displayName}
                </Text>
              </View>
            </View>

            <Pressable className="size-12 items-center justify-center rounded-2xl bg-card shadow-sm" onPress={handleOpenNewTask}>
              <Ionicons name="add" size={26} color={colors.accent} />
            </Pressable>
          </View>

          <View className="overflow-hidden rounded-3xl bg-accent p-6">
            <View className="flex-row items-center justify-between">
              <View className="rounded-full bg-white/20 px-4 py-2">
                <Text className="text-xs font-sans-extrabold uppercase text-white">Today focus</Text>
              </View>
              <Ionicons name="school-outline" size={30} color="white" />
            </View>

            <Text className="mt-5 text-4xl font-sans-extrabold leading-10 text-white">
              {nextTask ? 'Start with your next study block.' : 'Your study day is clear.'}
            </Text>
            <Text className="mt-3 text-base font-sans-semibold leading-6 text-white/80">
              {nextTask
                ? `${nextTask.title} • ${formatDuration(nextTask.durationMinutes)} • ${priorityCount} high priority task${priorityCount === 1 ? '' : 's'}.`
                : 'Add a task to build a focused study schedule for today.'}
            </Text>

            <View className="mt-6 flex-row items-center gap-3">
              <Pressable className="rounded-full bg-white px-5 py-3" onPress={handleOpenNewTask}>
                <Text className="text-sm font-sans-extrabold text-accent">Add task</Text>
              </Pressable>
              <Pressable className="rounded-full bg-white/20 px-5 py-3" onPress={() => planner.logFocus(25, 'Quick focus block')}>
                <Text className="text-sm font-sans-extrabold text-white">Log 25m</Text>
              </Pressable>
            </View>
          </View>

          <ListHeading title="Overview" />
          <FlatList
            data={planner.stats}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <StatCard stat={item} />}
          />

          <ListHeading title="Today's tasks" actionLabel="Add" onPress={handleOpenNewTask} />
          <View className="gap-3">
            {(planner.todayTasks.length ? planner.todayTasks : planner.activeTasks.slice(0, 3)).map((task) => (
              <StudyTaskCard
                key={task.id}
                task={task}
                onToggleComplete={planner.toggleTaskComplete}
                onStart={planner.startTask}
                onProgress={planner.increaseTaskProgress}
                onEdit={handleEditTask}
                onDelete={planner.deleteTask}
              />
            ))}
            {!planner.activeTasks.length ? (
              <View className="rounded-3xl border border-border bg-card p-6">
                <Ionicons name="sparkles-outline" size={30} color={colors.accent} />
                <Text className="mt-3 text-xl font-sans-extrabold text-primary">No active tasks</Text>
                <Text className="mt-2 text-sm font-sans-semibold leading-5 text-muted-foreground">
                  Your planner is clean. Add a study task to continue building progress.
                </Text>
                <Pressable className="mt-4 rounded-2xl bg-accent py-3" onPress={handleOpenNewTask}>
                  <Text className="text-center text-sm font-sans-extrabold text-white">Create first task</Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          <ListHeading title="Quick focus" />
          <View className="flex-row gap-3">
            {[15, 25, 45, 60].map((minutes) => (
              <Pressable
                key={minutes}
                className="flex-1 items-center rounded-3xl border border-border bg-card px-2 py-4"
                onPress={() => planner.logFocus(minutes, `${minutes}m focus block`)}
              >
                <Text className="text-lg font-sans-extrabold text-primary">{minutes}m</Text>
                <Text className="mt-1 text-xs font-sans-bold text-muted-foreground">Log</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <TaskEditorModal
        visible={isTaskModalOpen}
        courses={planner.courses}
        initialTask={editingTask}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={(draft) => {
          if (editingTask) {
            planner.updateTask(editingTask.id, draft);
          } else {
            planner.createTask(draft);
          }
        }}
      />
    </SafeAreaView>
  );
}
