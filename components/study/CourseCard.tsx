import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { ProgressBar } from '@/components/study/ProgressBar';
import { colors } from '@/constants/theme';

type CourseCardProps = {
  course: Course;
  progress: number;
  taskCount: number;
  onDelete?: (id: string) => void;
};

export function CourseCard({ course, progress, taskCount, onDelete }: CourseCardProps) {
  const confirmDelete = () => {
    if (!onDelete) return;
    Alert.alert(
      'Delete subject?',
      'The subject will be removed. Existing tasks will move to General Study.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(course.id) },
      ],
    );
  };

  return (
    <View className="rounded-3xl border border-border bg-card p-4">
      <View className="flex-row gap-4">
        <View className="size-14 items-center justify-center rounded-2xl" style={{ backgroundColor: course.color }}>
          <Text className="text-2xl">{course.icon}</Text>
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <View className="min-w-0 flex-1">
              <Text className="text-xs font-sans-extrabold uppercase text-accent">{course.code}</Text>
              <Text className="mt-1 text-lg font-sans-extrabold leading-6 text-primary" numberOfLines={2}>
                {course.title}
              </Text>
              <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground" numberOfLines={1}>
                {course.lecturer}
              </Text>
            </View>

            {onDelete ? (
              <Pressable className="rounded-full bg-muted p-2" onPress={confirmDelete}>
                <Ionicons name="trash-outline" size={17} color={colors.destructive} />
              </Pressable>
            ) : null}
          </View>

          <View className="mt-4 flex-row items-center justify-between gap-3">
            <Text className="text-xs font-sans-bold text-muted-foreground" numberOfLines={1}>
              Next: {course.nextClass}
            </Text>
            <Text className="text-xs font-sans-bold text-muted-foreground">
              {taskCount} tasks
            </Text>
          </View>

          <ProgressBar value={progress} color={colors.accent} />

          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-xs font-sans-bold text-muted-foreground">Subject progress</Text>
            <Text className="text-sm font-sans-extrabold text-primary">{progress}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
