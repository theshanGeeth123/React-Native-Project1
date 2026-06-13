import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { colors } from '@/constants/theme';

type AuthTextInputProps = TextInputProps & {
  error?: boolean;
  centered?: boolean;
};

export function AuthTextInput({ error, centered, style, ...props }: AuthTextInputProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor="rgba(15, 23, 42, 0.38)"
      style={[
        styles.input,
        centered && styles.centered,
        error && styles.inputError,
        style,
      ]}
    />
  );
}

export const authInputStyles = StyleSheet.create({
  passwordWrap: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordWrapError: {
    borderColor: colors.destructive,
  },
  passwordInput: {
    flex: 1,
    minHeight: 56,
    paddingVertical: 14,
    paddingRight: 10,
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'sans-medium',
  },
});

const styles = StyleSheet.create({
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'sans-medium',
  },
  centered: {
    textAlign: 'center',
    letterSpacing: 4,
    fontFamily: 'sans-bold',
  },
  inputError: {
    borderColor: colors.destructive,
  },
});
