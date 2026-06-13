import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { ProgressBar } from '@/components/study/ProgressBar';
import { colors } from '@/constants/theme';
import { formatDuration, formatPriorityLabel, formatStatusLabel, formatTaskDateTime } from '@/lib/utils';

type StudyTaskCardProps = {
  task: StudyTask;
  compact?: boolean;
  onToggleComplete?: (id: string) => void;
  onStart?: (id: string) => void;
  onProgress?: (id: string) => void;
  onEdit?: (task: StudyTask) => void;
  onDelete?: (id: string) => void;
};

const priorityClass: Record<StudyTaskPriority, string> = {
  high: 'bg-destructive/10',
  medium: 'bg-warning/10',
  low: 'bg-success/10',
};

const statusIcon: Record<StudyTaskStatus, keyof typeof Ionicons.glyphMap> = {
  todo: 'ellipse-outline',
  'in-progress': 'time-outline',
  completed: 'checkmark-circle',
};

export function StudyTaskCard({
  task,
  compact = false,
  onToggleComplete,
  onStart,
  onProgress,
  onEdit,
  onDelete,
}: StudyTaskCardProps) {
  const isCompleted = task.status === 'completed';

  const confirmDelete = () => {
    if (!onDelete) return;
    Alert.alert('Delete task?', 'This task will be removed from your local planner.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
    ]);
  };

  return (
    <View className={clsx('rounded-3xl border border-border bg-card p-4', compact && 'p-3')}>
      <View className="flex-row gap-4">
        <Pressable
          accessibilityRole="button"
          className="size-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: task.color }}
          onPress={() => onToggleComplete?.(task.id)}
        >
          <Ionicons
            name={statusIcon[task.status]}
            size={26}
            color={isCompleted ? colors.success : colors.primary}
          />
        </Pressable>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text
                className={clsx(
                  'text-base font-sans-extrabold leading-5 text-primary',
                  isCompleted && 'text-muted-foreground line-through',
                )}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground" numberOfLines={1}>
                {task.course}
              </Text>
            </View>

            <View className={clsx('rounded-full px-3 py-1', priorityClass[task.priority])}>
              <Text className="text-xs font-sans-extrabold uppercase text-primary">
                {task.priority}
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between gap-3">
            <Text className="text-xs font-sans-bold text-muted-foreground" numberOfLines={1}>
              {formatTaskDateTime(task.dueDate, task.dueTime)}
            </Text>
            <Text className="text-xs font-sans-bold text-muted-foreground">
              {formatDuration(task.durationMinutes)}
            </Text>
          </View>

          {!compact ? (
            <>
              <ProgressBar value={task.progress} color={task.status === 'completed' ? colors.success : colors.accent} />
              <View className="mt-3 flex-row items-center justify-between gap-2">
                <Text className="text-xs font-sans-semibold text-muted-foreground">
                  {formatStatusLabel(task.status)} • {task.progress}%
                </Text>
                <Text className="text-xs font-sans-semibold text-muted-foreground">
                  {formatPriorityLabel(task.priority)}
                </Text>
              </View>

              {task.notes ? (
                <Text className="mt-3 text-sm font-sans-medium leading-5 text-muted-foreground" numberOfLines={2}>
                  {task.notes}
                </Text>
              ) : null}
            </>
          ) : null}
        </View>
      </View>

      {!compact ? (
        <View className="mt-4 flex-row flex-wrap gap-2">
          <Pressable
            className={clsx(
              'flex-row items-center gap-1 rounded-full px-3 py-2',
              isCompleted ? 'bg-success/10' : 'bg-accent/10',
            )}
            onPress={() => onToggleComplete?.(task.id)}
          >
            <Ionicons
              name={isCompleted ? 'return-up-back-outline' : 'checkmark-outline'}
              size={15}
              color={isCompleted ? colors.success : colors.accent}
            />
            <Text className="text-xs font-sans-extrabold text-primary">
              {isCompleted ? 'Reopen' : 'Done'}
            </Text>
          </Pressable>

          {!isCompleted ? (
            <>
              <Pressable
                className="flex-row items-center gap-1 rounded-full bg-muted px-3 py-2"
                onPress={() => onStart?.(task.id)}
              >
                <Ionicons name="play-outline" size={15} color={colors.accent} />
                <Text className="text-xs font-sans-extrabold text-primary">Start</Text>
              </Pressable>
              <Pressable
                className="flex-row items-center gap-1 rounded-full bg-muted px-3 py-2"
                onPress={() => onProgress?.(task.id)}
              >
                <Ionicons name="add-outline" size={15} color={colors.accent} />
                <Text className="text-xs font-sans-extrabold text-primary">+25%</Text>
              </Pressable>
            </>
          ) : null}

          <Pressable
            className="flex-row items-center gap-1 rounded-full bg-muted px-3 py-2"
            onPress={() => onEdit?.(task)}
          >
            <Ionicons name="create-outline" size={15} color={colors.primary} />
            <Text className="text-xs font-sans-extrabold text-primary">Edit</Text>
          </Pressable>

          <Pressable
            className="flex-row items-center gap-1 rounded-full bg-destructive/10 px-3 py-2"
            onPress={confirmDelete}
          >
            <Ionicons name="trash-outline" size={15} color={colors.destructive} />
            <Text className="text-xs font-sans-extrabold text-destructive">Delete</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
