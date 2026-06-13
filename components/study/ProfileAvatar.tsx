import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type ProfileAvatarProps = {
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = {
  sm: 'size-11 rounded-2xl',
  md: 'size-14 rounded-3xl',
  lg: 'size-20 rounded-3xl',
};

const textClass = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

export function ProfileAvatar({ initials, size = 'md' }: ProfileAvatarProps) {
  return (
    <View className={`${sizeClass[size]} items-center justify-center bg-accent shadow-sm`}>
      {initials ? (
        <Text className={`${textClass[size]} font-sans-extrabold text-white`}>{initials}</Text>
      ) : (
        <Ionicons name="person-outline" size={size === 'lg' ? 34 : 24} color={colors.card} />
      )}
    </View>
  );
}
