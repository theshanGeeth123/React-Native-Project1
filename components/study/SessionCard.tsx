import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { formatDuration } from '@/lib/utils';

type SessionCardProps = {
  session: FocusLog;
};

export function SessionCard({ session }: SessionCardProps) {
  return (
    <View className="mr-4 w-56 rounded-3xl border border-border bg-card p-4">
      <View className="size-14 items-center justify-center rounded-2xl bg-muted">
        <Ionicons name="timer-outline" size={26} color={colors.accent} />
      </View>
      <Text className="mt-4 text-lg font-sans-extrabold leading-6 text-primary">
        {session.note || 'Focus session'}
      </Text>
      <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
        {dayjs(session.date).format('MMM D')} • {formatDuration(session.minutes)}
      </Text>
    </View>
  );
}
