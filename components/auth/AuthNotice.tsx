import clsx from 'clsx';
import React from 'react';
import { Text, View } from 'react-native';

type AuthNoticeProps = {
  message?: string | null;
  tone?: 'error' | 'info' | 'success';
};

export function AuthNotice({ message, tone = 'error' }: AuthNoticeProps) {
  if (!message) return null;

  return (
    <View
      className={clsx(
        'rounded-2xl border px-4 py-3',
        tone === 'error' && 'border-destructive/30 bg-destructive/10',
        tone === 'info' && 'border-accent/20 bg-accent/10',
        tone === 'success' && 'border-success/25 bg-success/10',
      )}
    >
      <Text
        className={clsx(
          'text-sm font-sans-semibold leading-5',
          tone === 'error' && 'text-destructive',
          tone === 'info' && 'text-primary',
          tone === 'success' && 'text-success',
        )}
      >
        {message}
      </Text>
    </View>
  );
}
