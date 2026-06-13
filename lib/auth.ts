export const AUTH_ROUTES = {
  signIn: '/(auth)/signIn',
  signUp: '/(auth)/signUp',
  appHome: '/',
} as const;

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const isValidEmail = (value: string) => {
  const email = normalizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (value: string) => ({
  hasMinLength: value.length >= 8,
  hasLetter: /[A-Za-z]/.test(value),
  hasNumber: /\d/.test(value),
});

export const isStrongEnoughPassword = (value: string) => {
  const result = validatePassword(value);
  return result.hasMinLength && result.hasLetter && result.hasNumber;
};

export const getPasswordHelpText = (value: string) => {
  const result = validatePassword(value);

  if (!value) return 'Use at least 8 characters with letters and numbers.';
  if (!result.hasMinLength) return 'Password must be at least 8 characters.';
  if (!result.hasLetter || !result.hasNumber) return 'Use both letters and numbers.';

  return 'Strong password ready.';
};

export const getClerkErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) => {
  if (!error) return fallback;

  if (typeof error === 'string') return error;

  if (Array.isArray(error)) {
    return (
      error
        .map((item) => getClerkErrorMessage(item, ''))
        .filter(Boolean)
        .join('\n') || fallback
    );
  }

  if (typeof error === 'object') {
    const record = error as Record<string, unknown>;

    if (typeof record.longMessage === 'string') return record.longMessage;
    if (typeof record.message === 'string') return record.message;

    if (Array.isArray(record.errors)) {
      return getClerkErrorMessage(record.errors, fallback);
    }

    if (record.error) {
      return getClerkErrorMessage(record.error, fallback);
    }
  }

  return fallback;
};

export const getFieldErrorMessage = (errors: unknown, fieldName: string) => {
  if (!errors || typeof errors !== 'object') return undefined;

  const fields = (
    errors as {
      fields?: Record<string, { message?: string; longMessage?: string }>;
    }
  ).fields;

  const fieldError = fields?.[fieldName];

  return fieldError?.longMessage || fieldError?.message;
};
