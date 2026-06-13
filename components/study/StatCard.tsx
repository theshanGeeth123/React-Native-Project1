import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type StatCardProps = {
  stat: StudyStat;
};

export function StatCard({ stat }: StatCardProps) {
  return (
    <View className="mr-3 w-40 rounded-3xl border border-border bg-card p-4">
      <View className="size-11 items-center justify-center rounded-2xl" style={{ backgroundColor: stat.color }}>
        <Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.accent} />
      </View>
      <Text className="mt-4 text-2xl font-sans-extrabold text-primary">{stat.value}</Text>
      <Text className="mt-1 text-sm font-sans-bold text-primary">{stat.label}</Text>
      <Text className="mt-1 text-xs font-sans-medium text-muted-foreground">{stat.caption}</Text>
    </View>
  );
}
