import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/study/CourseCard';
import { CourseEditorModal } from '@/components/study/CourseEditorModal';
import { StudyTaskCard } from '@/components/study/StudyTaskCard';
import { TaskEditorModal } from '@/components/study/TaskEditorModal';
import { colors } from '@/constants/theme';
import { useStudyPlanner } from '@/lib/study-planner';

const SafeAreaView = styled(RNSafeAreaView);

type FilterKey = 'all' | 'today' | 'active' | 'completed';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

export default function PlannerScreen() {
  const planner = useStudyPlanner();
  const [filter, setFilter] = useState<FilterKey>('active');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);

  const filteredTasks = useMemo(() => {
    if (filter === 'today') return planner.tasks.filter((task) => task.dueDate === planner.todayKey);
    if (filter === 'active') return planner.activeTasks;
    if (filter === 'completed') return planner.completedTasks;
    return planner.tasks;
  }, [filter, planner.activeTasks, planner.completedTasks, planner.tasks, planner.todayKey]);

  const highPriorityCount = planner.activeTasks.filter((task) => task.priority === 'high').length;

  const getCourseProgress = (course: Course) => {
    const courseTasks = planner.tasks.filter((task) => task.course === course.title);
    if (!courseTasks.length) return 0;
    return Math.round(courseTasks.reduce((sum, task) => sum + task.progress, 0) / courseTasks.length);
  };

  const getCourseTaskCount = (course: Course) => planner.tasks.filter((task) => task.course === course.title).length;

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  if (!planner.isReady) {
    return (
      <SafeAreaView className="screen">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent} size="large" />
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
          <View className="flex-row items-start justify-between gap-4">
            <View className="min-w-0 flex-1">
              <Text className="page-title">Study Planner</Text>
              <Text className="page-subtitle">
                Create subjects, plan tasks, track progress, and keep everything saved locally.
              </Text>
            </View>
            <Pressable className="size-12 items-center justify-center rounded-2xl bg-accent" onPress={handleOpenNewTask}>
              <Ionicons name="add" size={28} color="white" />
            </Pressable>
          </View>

          <View className="mt-6 rounded-3xl bg-primary p-6">
            <Text className="text-sm font-sans-extrabold uppercase text-white/70">This week</Text>
            <Text className="mt-2 text-4xl font-sans-extrabold text-white">
              {highPriorityCount} urgent
            </Text>
            <Text className="mt-2 text-base font-sans-semibold leading-6 text-white/75">
              {planner.overdueTasks.length
                ? `${planner.overdueTasks.length} overdue task${planner.overdueTasks.length === 1 ? '' : 's'} need attention.`
                : 'Everything is on schedule. Keep logging focus blocks.'}
            </Text>
            <View className="mt-5 flex-row gap-3">
              <Pressable className="rounded-full bg-white px-5 py-3" onPress={handleOpenNewTask}>
                <Text className="text-sm font-sans-extrabold text-primary">New task</Text>
              </Pressable>
              <Pressable className="rounded-full bg-white/15 px-5 py-3" onPress={() => setIsCourseModalOpen(true)}>
                <Text className="text-sm font-sans-extrabold text-white">New subject</Text>
              </Pressable>
            </View>
          </View>

          <View className="my-6 flex-row gap-2">
            {filters.map((item) => (
              <Pressable
                key={item.key}
                className={`rounded-full px-4 py-3 ${filter === item.key ? 'bg-accent' : 'bg-card'}`}
                onPress={() => setFilter(item.key)}
              >
                <Text className={`text-sm font-sans-extrabold ${filter === item.key ? 'text-white' : 'text-primary'}`}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-2xl font-sans-extrabold text-primary">Tasks</Text>
            <Text className="text-sm font-sans-bold text-muted-foreground">{filteredTasks.length} shown</Text>
          </View>

          <View className="gap-3">
            {filteredTasks.map((task) => (
              <StudyTaskCard
                key={task.id}
                task={task}
                onToggleComplete={planner.toggleTaskComplete}
                onStart={planner.startTask}
                onProgress={planner.increaseTaskProgress}
                onEdit={(selectedTask) => {
                  setEditingTask(selectedTask);
                  setIsTaskModalOpen(true);
                }}
                onDelete={planner.deleteTask}
              />
            ))}

            {!filteredTasks.length ? (
              <View className="items-center rounded-3xl border border-border bg-card p-8">
                <Ionicons name="calendar-clear-outline" size={36} color={colors.accent} />
                <Text className="mt-4 text-xl font-sans-extrabold text-primary">No tasks here</Text>
                <Text className="mt-2 text-center text-sm font-sans-semibold leading-5 text-muted-foreground">
                  Change the filter or add a new task to your local study planner.
                </Text>
                <Pressable className="mt-5 rounded-2xl bg-accent px-6 py-3" onPress={handleOpenNewTask}>
                  <Text className="text-sm font-sans-extrabold text-white">Add task</Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          <View className="mb-5 mt-8 flex-row items-center justify-between">
            <Text className="text-2xl font-sans-extrabold text-primary">Subjects</Text>
            <Pressable className="rounded-full bg-card px-4 py-2" onPress={() => setIsCourseModalOpen(true)}>
              <Text className="text-sm font-sans-extrabold text-accent">Add subject</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {planner.courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={getCourseProgress(course)}
                taskCount={getCourseTaskCount(course)}
                onDelete={planner.deleteCourse}
              />
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
          if (editingTask) planner.updateTask(editingTask.id, draft);
          else planner.createTask(draft);
        }}
      />

      <CourseEditorModal
        visible={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={planner.createCourse}
      />
    </SafeAreaView>
  );
}
