import { clampProgress } from '@/lib/utils';
import React from 'react';
import { View } from 'react-native';

import { colors } from '@/constants/theme';

type ProgressBarProps = {
  value: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ value, color = colors.accent, height = 8 }: ProgressBarProps) {
  return (
    <View
      className="mt-3 overflow-hidden rounded-full bg-muted"
      style={{ height }}
    >
      <View
        className="h-full rounded-full"
        style={{ width: `${clampProgress(value)}%`, backgroundColor: color }}
      />
    </View>
  );
}
