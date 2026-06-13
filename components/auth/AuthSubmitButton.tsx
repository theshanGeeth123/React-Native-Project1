import clsx from 'clsx';
import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type AuthSubmitButtonProps = {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function AuthSubmitButton({
  label,
  loadingLabel,
  loading = false,
  disabled = false,
  onPress,
}: AuthSubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={clsx(
        'auth-button flex-row justify-center gap-2',
        isDisabled && 'auth-button-disabled',
      )}
      disabled={isDisabled}
      onPress={onPress}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : null}
      <Text className="auth-button-text">
        {loading ? loadingLabel || label : label}
      </Text>
    </Pressable>
  );
}
