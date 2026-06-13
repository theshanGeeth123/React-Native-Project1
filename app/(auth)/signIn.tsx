import { AuthBrand } from '@/components/auth/AuthBrand';
import { AuthNotice } from '@/components/auth/AuthNotice';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';
import { AuthTextInput, authInputStyles } from '@/components/auth/AuthTextInput';
import {
  AUTH_ROUTES,
  getClerkErrorMessage,
  getFieldErrorMessage,
  isValidEmail,
  normalizeEmail,
} from '@/lib/auth';
import { useAuth, useSignIn } from '@clerk/expo';
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

export default function SignInScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [needsEmailCode, setNeedsEmailCode] = useState(false);

  const isFetching = fetchStatus === 'fetching';
  const normalizedEmail = normalizeEmail(emailAddress);

  const localErrors = useMemo(() => {
    const result: Partial<Record<'email' | 'password' | 'code', string>> = {};

    if (submitted && !needsEmailCode && !isValidEmail(normalizedEmail)) {
      result.email = 'Enter a valid email address.';
    }

    if (submitted && !needsEmailCode && password.length === 0) {
      result.password = 'Enter your password.';
    }

    if (submitted && needsEmailCode && code.trim().length < 6) {
      result.code = 'Enter the verification code from your email.';
    }

    return result;
  }, [code, needsEmailCode, normalizedEmail, password.length, submitted]);

  const emailError =
    localErrors.email ||
    getFieldErrorMessage(errors, 'identifier') ||
    getFieldErrorMessage(errors, 'emailAddress') ||
    getFieldErrorMessage(errors, 'email_address');
  const passwordError =
    localErrors.password || getFieldErrorMessage(errors, 'password');
  const codeError = localErrors.code || getFieldErrorMessage(errors, 'code');

  const resetMessages = () => {
    setGeneralError(null);
    setNotice(null);
  };

  const completeSignIn = async () => {
    await signIn.finalize({
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
      setGeneralError('Please check your email address before continuing.');
      return;
    }

    if (!password) {
      setGeneralError('Please enter your password.');
      return;
    }

    try {
      const { error } = await signIn.password({
        emailAddress: normalizedEmail,
        password,
      });

      if (error) {
        setGeneralError(
          getClerkErrorMessage(error, 'Could not sign in. Check your email and password.'),
        );
        return;
      }

      if (signIn.status === 'complete') {
        await completeSignIn();
        return;
      }

      if (signIn.status === 'needs_client_trust') {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === 'email_code',
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setCode('');
          setSubmitted(false);
          setNeedsEmailCode(true);
          setNotice('We sent a verification code to your email. Enter it below to continue.');
          return;
        }
      }

      if (signIn.status === 'needs_second_factor') {
        setGeneralError('This account requires a second factor that is not enabled in this app yet.');
        return;
      }

      setGeneralError('Sign in is not complete yet. Please try again.');
    } catch (error) {
      setGeneralError(
        getClerkErrorMessage(error, 'Could not sign in. Check your details and try again.'),
      );
    }
  };

  const handleVerify = async () => {
    Keyboard.dismiss();
    setSubmitted(true);
    resetMessages();

    const verificationCode = code.trim();

    if (verificationCode.length < 6) {
      setGeneralError('Enter the 6-digit verification code from your email.');
      return;
    }

    try {
      await signIn.mfa.verifyEmailCode({ code: verificationCode });

      if (signIn.status === 'complete') {
        await completeSignIn();
        return;
      }

      setGeneralError('Verification was not completed. Please check the code and try again.');
    } catch (error) {
      setGeneralError(
        getClerkErrorMessage(error, 'The verification code is invalid or expired.'),
      );
    }
  };

  const handleResendCode = async () => {
    resetMessages();

    try {
      await signIn.mfa.sendEmailCode();
      setNotice('A fresh verification code has been sent to your email.');
    } catch (error) {
      setGeneralError(
        getClerkErrorMessage(error, 'Could not resend the code. Please try again.'),
      );
    }
  };

  const handleStartOver = () => {
    signIn.reset();
    setCode('');
    setSubmitted(false);
    setNeedsEmailCode(false);
    resetMessages();
  };

  if (isSignedIn) {
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
              title={needsEmailCode ? 'Verify your sign in' : 'Welcome back'}
              subtitle={
                needsEmailCode
                  ? 'Enter the secure code sent to your email to protect your study plan.'
                  : 'Sign in to manage your timetable, focus sessions, deadlines, and weekly progress.'
              }
            />

            <View className="auth-card">
              <View className="auth-form">
                <AuthNotice message={generalError} />
                <AuthNotice message={notice} tone="info" />

                {needsEmailCode ? (
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
                      label="Verify and continue"
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

                    <Pressable
                      accessibilityRole="button"
                      className="items-center py-2"
                      disabled={isFetching}
                      onPress={handleStartOver}
                    >
                      <Text className="auth-link">Use another email</Text>
                    </Pressable>
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
                          placeholder="Enter your password"
                          placeholderTextColor="rgba(15, 23, 42, 0.38)"
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                          autoComplete="password"
                          returnKeyType="go"
                          onSubmitEditing={handleSubmit}
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
                      {passwordError ? <Text className="auth-error">{passwordError}</Text> : null}
                    </View>

                    <AuthSubmitButton
                      label="Sign in"
                      loadingLabel="Signing in..."
                      loading={isFetching}
                      disabled={!emailAddress || !password}
                      onPress={handleSubmit}
                    />

                    <View className="auth-divider-row">
                      <View className="auth-divider-line" />
                      <Text className="auth-divider-text">Secure study access</Text>
                      <View className="auth-divider-line" />
                    </View>

                    <View className="flex-row flex-wrap justify-center gap-2">
                      <View className="rounded-full bg-muted px-3 py-2">
                        <Text className="text-xs font-sans-semibold text-primary">Encrypted session</Text>
                      </View>
                      <View className="rounded-full bg-muted px-3 py-2">
                        <Text className="text-xs font-sans-semibold text-primary">Deadline safe</Text>
                      </View>
                      <View className="rounded-full bg-muted px-3 py-2">
                        <Text className="text-xs font-sans-semibold text-primary">Fast setup</Text>
                      </View>
                    </View>

                    <View className="auth-link-row">
                      <Text className="auth-link-copy">New to BlueStudy?</Text>
                      <Pressable
                        accessibilityRole="link"
                        disabled={isFetching}
                        onPress={() => router.replace(AUTH_ROUTES.signUp as Href)}
                      >
                        <Text className="auth-link">Create an account</Text>
                      </Pressable>
                    </View>
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
