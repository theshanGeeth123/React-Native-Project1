import { AuthBrand } from '@/components/auth/AuthBrand';
import { AuthNotice } from '@/components/auth/AuthNotice';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';
import { AuthTextInput, authInputStyles } from '@/components/auth/AuthTextInput';
import {
  AUTH_ROUTES,
  getClerkErrorMessage,
  getFieldErrorMessage,
  getPasswordHelpText,
  isStrongEnoughPassword,
  isValidEmail,
  normalizeEmail,
} from '@/lib/auth';
import { useAuth, useSignUp } from '@clerk/expo';
import clsx from 'clsx';
import { type Href, Redirect, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [verificationStarted, setVerificationStarted] = useState(false);

  const isFetching = fetchStatus === 'fetching';
  const normalizedEmail = normalizeEmail(emailAddress);
  const passwordHelpText = getPasswordHelpText(password);
  const isPasswordReady = isStrongEnoughPassword(password);

  const isVerificationStep =
    verificationStarted ||
    (signUp.status === 'missing_requirements' &&
      signUp.unverifiedFields.includes('email_address') &&
      signUp.missingFields.length === 0);

  const localErrors = useMemo(() => {
    const result: Partial<
      Record<'email' | 'password' | 'confirmPassword' | 'code', string>
    > = {};

    if (submitted && !isVerificationStep && !isValidEmail(normalizedEmail)) {
      result.email = 'Enter a valid email address.';
    }

    if (submitted && !isVerificationStep && !isStrongEnoughPassword(password)) {
      result.password = getPasswordHelpText(password);
    }

    if (submitted && !isVerificationStep && confirmPassword !== password) {
      result.confirmPassword = 'Passwords do not match.';
    }

    if (submitted && isVerificationStep && code.trim().length < 6) {
      result.code = 'Enter the 6-digit verification code sent to your email.';
    }

    return result;
  }, [code, confirmPassword, isVerificationStep, normalizedEmail, password, submitted]);

  const emailError =
    localErrors.email ||
    getFieldErrorMessage(errors, 'emailAddress') ||
    getFieldErrorMessage(errors, 'email_address');
  const passwordError =
    localErrors.password || getFieldErrorMessage(errors, 'password');
  const confirmPasswordError = localErrors.confirmPassword;
  const codeError = localErrors.code || getFieldErrorMessage(errors, 'code');

  const resetMessages = () => {
    setGeneralError(null);
    setNotice(null);
  };

  const completeSignUp = async () => {
    await signUp.finalize({
      navigate: ({ session }: { session?: { currentTask?: unknown } }) => {
        if (session?.currentTask) {
          setNotice('Your account needs one more security step before opening the app.');
          return;
        }

        router.replace(AUTH_ROUTES.appHome as Href);
      },
    });
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setSubmitted(true);
    resetMessages();

    if (!isValidEmail(normalizedEmail)) {
      setGeneralError('Please enter a valid email address.');
      return;
    }

    if (!isStrongEnoughPassword(password)) {
      setGeneralError('Please create a stronger password before continuing.');
      return;
    }

    if (confirmPassword !== password) {
      setGeneralError('Please make sure both passwords match.');
      return;
    }

    try {
      const { error } = await signUp.password({
        emailAddress: normalizedEmail,
        password,
      });

      if (error) {
        setGeneralError(
          getClerkErrorMessage(error, 'Could not create your account. Please try again.'),
        );
        return;
      }

      await signUp.verifications.sendEmailCode();
      setCode('');
      setSubmitted(false);
      setVerificationStarted(true);
      setNotice(`We sent a verification code to ${normalizedEmail}.`);
    } catch (error) {
      setGeneralError(
        getClerkErrorMessage(error, 'Could not create your account. Please try again.'),
      );
    }
  };

  const handleVerify = async () => {
    Keyboard.dismiss();
    setSubmitted(true);
    resetMessages();

    const verificationCode = code.trim();

    if (verificationCode.length < 6) {
      setGeneralError('Enter the 6-digit code from your email.');
      return;
    }

    try {
      await signUp.verifications.verifyEmailCode({ code: verificationCode });

      if (signUp.status === 'complete') {
        await completeSignUp();
        return;
      }

      setGeneralError('Verification is not complete yet. Please check the code and try again.');
    } catch (error) {
      setGeneralError(
        getClerkErrorMessage(error, 'The verification code is invalid or expired.'),
      );
    }
  };

  const handleResendCode = async () => {
    resetMessages();

    try {
      await signUp.verifications.sendEmailCode();
      setNotice('A fresh verification code has been sent to your email.');
    } catch (error) {
      setGeneralError(
        getClerkErrorMessage(error, 'Could not resend the code. Please try again.'),
      );
    }
  };

  if (signUp.status === 'complete' || isSignedIn) {
    return <Redirect href={AUTH_ROUTES.appHome} />;
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content justify-center">
            <AuthBrand
              title={isVerificationStep ? 'Verify your email' : 'Create your study account'}
              subtitle={
                isVerificationStep
                  ? 'Enter the secure code we sent to complete your BlueStudy account.'
                  : 'Plan tasks, protect deadlines, and build a smarter study routine with a secure account.'
              }
            />

            <View className="auth-card">
              <View className="auth-form">
                <AuthNotice message={generalError} />
                <AuthNotice message={notice} tone="info" />

                {isVerificationStep ? (
                  <>
                    <View className="auth-field">
                      <Text className="auth-label">Verification code</Text>
                      <AuthTextInput
                        centered
                        error={Boolean(codeError)}
                        value={code}
                        onChangeText={(value) =>
                          setCode(value.replace(/[^0-9]/g, '').slice(0, 8))
                        }
                        placeholder="000000"
                        keyboardType="number-pad"
                        autoComplete="one-time-code"
                        returnKeyType="done"
                        onSubmitEditing={handleVerify}
                        editable={!isFetching}
                      />
                      {codeError ? <Text className="auth-error">{codeError}</Text> : null}
                    </View>

                    <AuthSubmitButton
                      label="Verify account"
                      loadingLabel="Verifying..."
                      loading={isFetching}
                      disabled={code.trim().length < 6}
                      onPress={handleVerify}
                    />

                    <Pressable
                      accessibilityRole="button"
                      className="auth-secondary-button"
                      disabled={isFetching}
                      onPress={handleResendCode}
                    >
                      <Text className="auth-secondary-button-text">Send a new code</Text>
                    </Pressable>

                    <View className="auth-link-row">
                      <Text className="auth-link-copy">Already verified?</Text>
                      <Pressable
                        accessibilityRole="link"
                        disabled={isFetching}
                        onPress={() => router.replace(AUTH_ROUTES.signIn as Href)}
                      >
                        <Text className="auth-link">Sign in</Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="auth-field">
                      <Text className="auth-label">Email</Text>
                      <AuthTextInput
                        error={Boolean(emailError)}
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        placeholder="Enter your email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        keyboardType="email-address"
                        returnKeyType="next"
                        editable={!isFetching}
                      />
                      {emailError ? <Text className="auth-error">{emailError}</Text> : null}
                    </View>

                    <View className="auth-field">
                      <Text className="auth-label">Password</Text>
                      <View
                        style={[
                          authInputStyles.passwordWrap,
                          passwordError && authInputStyles.passwordWrapError,
                        ]}
                      >
                        <TextInput
                          style={authInputStyles.passwordInput}
                          value={password}
                          onChangeText={setPassword}
                          placeholder="Create a password"
                          placeholderTextColor="rgba(15, 23, 42, 0.38)"
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                          autoComplete="new-password"
                          returnKeyType="next"
                          editable={!isFetching}
                        />

                        <Pressable
                          accessibilityRole="button"
                          className="rounded-full px-2 py-1"
                          onPress={() => setShowPassword((value) => !value)}
                        >
                          <Text className="text-sm font-sans-bold text-accent">
                            {showPassword ? 'Hide' : 'Show'}
                          </Text>
                        </Pressable>
                      </View>

                      <Text className={clsx('auth-helper', isPasswordReady && 'text-success')}>
                        {passwordHelpText}
                      </Text>
                      {passwordError ? <Text className="auth-error">{passwordError}</Text> : null}
                    </View>

                    <View className="auth-field">
                      <Text className="auth-label">Confirm password</Text>
                      <AuthTextInput
                        error={Boolean(confirmPasswordError)}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repeat your password"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                        returnKeyType="go"
                        onSubmitEditing={handleSubmit}
                        editable={!isFetching}
                      />
                      {confirmPasswordError ? (
                        <Text className="auth-error">{confirmPasswordError}</Text>
                      ) : null}
                    </View>

                    <AuthSubmitButton
                      label="Create account"
                      loadingLabel="Creating account..."
                      loading={isFetching}
                      disabled={!emailAddress || !password || !confirmPassword}
                      onPress={handleSubmit}
                    />

                    <View className="rounded-2xl bg-muted/70 px-4 py-3">
                      <Text className="text-center text-xs font-sans-semibold leading-5 text-muted-foreground">
                        Email verification keeps your study plans and account secure.
                      </Text>
                    </View>

                    <View className="auth-link-row">
                      <Text className="auth-link-copy">Already have an account?</Text>
                      <Pressable
                        accessibilityRole="link"
                        disabled={isFetching}
                        onPress={() => router.replace(AUTH_ROUTES.signIn as Href)}
                      >
                        <Text className="auth-link">Sign in</Text>
                      </Pressable>
                    </View>

                    <View nativeID="clerk-captcha" />
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
