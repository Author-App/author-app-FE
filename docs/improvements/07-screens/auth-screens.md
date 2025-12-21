# Authentication Screens Improvements

## Current Locations
- Login: `app/(public)/login/index.tsx`
- Signup: `app/(public)/signup/index.tsx`
- Forgot Password: `app/(public)/forgotpassword/index.tsx`
- Reset Password: `app/(public)/resetpassword/index.tsx`
- Verification Code: `app/(public)/verificationcode/index.tsx`
- Onboarding: `app/(public)/onboarding/index.tsx`

## Current Problems

1. Social login buttons may not be functional
2. No password visibility toggle
3. No password strength indicator
4. No real-time validation
5. Generic error messages
6. No loading states during auth
7. Onboarding may be skippable or minimal
8. No "Remember Me" option
9. Terms/Privacy not linked during signup

## Improvements Required

### 1. Unified Auth Layout

```tsx
// src/components/auth/authLayout.tsx
import React from 'react';
import { 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform, 
  StatusBar 
} from 'react-native';
import { YStack, Text, Image } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
}

export const AuthLayout = React.memo(({
  children,
  title,
  subtitle,
  showBackButton = true,
  showLogo = true,
}: AuthLayoutProps) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack flex={1} padding="$5">
            {/* Header */}
            <YStack marginBottom="$6">
              {showBackButton && (
                <UPressableButton
                  onPress={() => router.back()}
                  hapticType="light"
                  style={{ alignSelf: 'flex-start', marginBottom: 24 }}
                >
                  <YStack
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor="$neutral2"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ArrowLeft size={20} color="#1F2937" />
                  </YStack>
                </UPressableButton>
              )}

              {showLogo && (
                <Image
                  source={require('@/assets/images/logo.png')}
                  width={60}
                  height={60}
                  marginBottom="$4"
                  accessibilityLabel="App logo"
                />
              )}

              <Text fontSize={28} fontWeight="700" color="$neutral12">
                {title}
              </Text>
              {subtitle && (
                <Text fontSize={15} color="$neutral9" marginTop="$2">
                  {subtitle}
                </Text>
              )}
            </YStack>

            {/* Content */}
            <YStack flex={1}>{children}</YStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});
```

### 2. Social Login Buttons

```tsx
// src/components/auth/socialLoginButtons.tsx
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { IconGoogle } from '@/assets/icons/iconGoogle';
import { IconApple } from '@/assets/icons/iconApple';
import { IconFacebook } from '@/assets/icons/iconFacebook';
import { Platform } from 'react-native';

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  onFacebookPress: () => void;
  isLoading?: 'google' | 'apple' | 'facebook' | null;
}

export const SocialLoginButtons = React.memo(({
  onGooglePress,
  onApplePress,
  onFacebookPress,
  isLoading,
}: SocialLoginButtonsProps) => {
  const SocialButton = React.memo(({ 
    icon: Icon, 
    label, 
    onPress, 
    loading 
  }: { 
    icon: React.ElementType;
    label: string;
    onPress: () => void;
    loading: boolean;
  }) => (
    <UPressableButton 
      onPress={onPress} 
      hapticType="light"
      disabled={isLoading !== null}
    >
      <XStack
        flex={1}
        paddingVertical="$3"
        paddingHorizontal="$4"
        borderRadius={12}
        borderWidth={1}
        borderColor="$neutral4"
        alignItems="center"
        justifyContent="center"
        gap="$2"
        opacity={isLoading && !loading ? 0.5 : 1}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#6B7280" />
        ) : (
          <>
            <Icon width={20} height={20} />
            <Text fontSize={14} fontWeight="500" color="$neutral11">
              {label}
            </Text>
          </>
        )}
      </XStack>
    </UPressableButton>
  ));

  return (
    <YStack gap="$3">
      {/* Divider */}
      <XStack alignItems="center" gap="$3" marginVertical="$2">
        <YStack flex={1} height={1} backgroundColor="$neutral4" />
        <Text fontSize={13} color="$neutral8">
          or continue with
        </Text>
        <YStack flex={1} height={1} backgroundColor="$neutral4" />
      </XStack>

      {/* Social Buttons */}
      <XStack gap="$3">
        <SocialButton
          icon={IconGoogle}
          label="Google"
          onPress={onGooglePress}
          loading={isLoading === 'google'}
        />
        
        {Platform.OS === 'ios' && (
          <SocialButton
            icon={IconApple}
            label="Apple"
            onPress={onApplePress}
            loading={isLoading === 'apple'}
          />
        )}
      </XStack>
    </YStack>
  );
});
```

### 3. Improved Login Screen

```tsx
// app/(public)/login/index.tsx
import React, { useRef, useCallback, useState } from 'react';
import { TextInput } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { router } from 'expo-router';
import { AuthLayout } from '@/src/components/auth/authLayout';
import { UEnhancedInput } from '@/src/components/core/inputs/uEnhancedInput';
import { USubmitButton } from '@/src/components/core/buttons/uSubmitButton';
import { SocialLoginButtons } from '@/src/components/auth/socialLoginButtons';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { useFormValidation, ValidationPatterns } from '@/src/hooks/useFormValidation';
import { useHaptics } from '@/src/hooks/useHaptics';
import { useLoginController } from '@/src/controllers/useLoginController';

export default function LoginScreen() {
  const passwordRef = useRef<TextInput>(null);
  const haptics = useHaptics();
  const { login, isLoading, socialLogin, socialLoading } = useLoginController();

  const {
    values,
    errors,
    setValue,
    setFieldTouched,
    validateAll,
    isValid,
  } = useFormValidation(
    { email: '', password: '' },
    {
      email: { required: true, pattern: ValidationPatterns.EMAIL },
      password: { required: true, minLength: 1 },
    }
  );

  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!validateAll()) {
      haptics.error();
      return;
    }

    const success = await login(values.email, values.password, rememberMe);
    if (success) {
      haptics.success();
    } else {
      haptics.error();
    }
  }, [validateAll, values, rememberMe, login]);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to your library"
      showBackButton={false}
    >
      <YStack gap="$4" flex={1}>
        <UEnhancedInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          onChangeText={(text) => setValue('email', text)}
          onBlur={() => setFieldTouched('email')}
          error={errors.email}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          autoFocus
          required
        />

        <YStack>
          <UEnhancedInput
            ref={passwordRef}
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={(text) => setValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            required
          />

          <XStack justifyContent="space-between" alignItems="center" marginTop="$3">
            {/* Remember Me */}
            <UPressableButton
              onPress={() => setRememberMe(!rememberMe)}
              hapticType="selection"
            >
              <XStack alignItems="center" gap="$2">
                <YStack
                  width={20}
                  height={20}
                  borderRadius={4}
                  borderWidth={2}
                  borderColor={rememberMe ? '$primary7' : '$neutral5'}
                  backgroundColor={rememberMe ? '$primary7' : 'transparent'}
                  alignItems="center"
                  justifyContent="center"
                >
                  {rememberMe && (
                    <Check size={12} color="white" />
                  )}
                </YStack>
                <Text fontSize={13} color="$neutral9">
                  Remember me
                </Text>
              </XStack>
            </UPressableButton>

            {/* Forgot Password */}
            <UPressableButton
              onPress={() => router.push('/(public)/forgotpassword')}
              hapticType="light"
            >
              <Text fontSize={13} color="$primary7" fontWeight="500">
                Forgot Password?
              </Text>
            </UPressableButton>
          </XStack>
        </YStack>

        <YStack marginTop="$4">
          <USubmitButton
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            isDisabled={!isValid}
          />
        </YStack>

        <SocialLoginButtons
          onGooglePress={() => socialLogin('google')}
          onApplePress={() => socialLogin('apple')}
          onFacebookPress={() => socialLogin('facebook')}
          isLoading={socialLoading}
        />

        {/* Sign Up Link */}
        <XStack justifyContent="center" marginTop="$6">
          <Text fontSize={14} color="$neutral9">
            Don't have an account?{' '}
          </Text>
          <UPressableButton
            onPress={() => router.push('/(public)/signup')}
            hapticType="light"
          >
            <Text fontSize={14} color="$primary7" fontWeight="600">
              Sign Up
            </Text>
          </UPressableButton>
        </XStack>
      </YStack>
    </AuthLayout>
  );
}
```

### 4. Improved Signup Screen

```tsx
// app/(public)/signup/index.tsx
import React, { useRef, useCallback } from 'react';
import { TextInput, Linking } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { router } from 'expo-router';
import { AuthLayout } from '@/src/components/auth/authLayout';
import { UEnhancedInput } from '@/src/components/core/inputs/uEnhancedInput';
import { UPasswordStrength } from '@/src/components/core/inputs/uPasswordStrength';
import { USubmitButton } from '@/src/components/core/buttons/uSubmitButton';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { useFormValidation, ValidationPatterns } from '@/src/hooks/useFormValidation';

export default function SignupScreen() {
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const {
    values,
    errors,
    setValue,
    setFieldTouched,
    validateAll,
    isValid,
  } = useFormValidation(
    { name: '', email: '', password: '', confirmPassword: '' },
    {
      name: { required: true, minLength: 2 },
      email: { required: true, pattern: ValidationPatterns.EMAIL },
      password: { required: true, pattern: ValidationPatterns.PASSWORD },
      confirmPassword: {
        required: true,
        custom: (value) =>
          value !== values.password ? 'Passwords do not match' : null,
      },
    }
  );

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our community of readers"
    >
      <YStack gap="$4" flex={1}>
        <UEnhancedInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={values.name}
          onChangeText={(text) => setValue('name', text)}
          onBlur={() => setFieldTouched('name')}
          error={errors.name}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          autoFocus
          required
        />

        <UEnhancedInput
          ref={emailRef}
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          onChangeText={(text) => setValue('email', text)}
          onBlur={() => setFieldTouched('email')}
          error={errors.email}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          required
        />

        <YStack>
          <UEnhancedInput
            ref={passwordRef}
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={values.password}
            onChangeText={(text) => setValue('password', text)}
            onBlur={() => setFieldTouched('password')}
            error={errors.password}
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            required
          />
          <UPasswordStrength password={values.password} />
        </YStack>

        <UEnhancedInput
          ref={confirmRef}
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChangeText={(text) => setValue('confirmPassword', text)}
          onBlur={() => setFieldTouched('confirmPassword')}
          error={errors.confirmPassword}
          returnKeyType="done"
          required
        />

        {/* Terms & Privacy */}
        <UPressableButton
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          hapticType="selection"
        >
          <XStack alignItems="flex-start" gap="$2">
            <YStack
              width={20}
              height={20}
              borderRadius={4}
              borderWidth={2}
              borderColor={acceptedTerms ? '$primary7' : '$neutral5'}
              backgroundColor={acceptedTerms ? '$primary7' : 'transparent'}
              alignItems="center"
              justifyContent="center"
              marginTop={2}
            >
              {acceptedTerms && <Check size={12} color="white" />}
            </YStack>
            <Text fontSize={13} color="$neutral9" flex={1}>
              I agree to the{' '}
              <Text
                color="$primary7"
                onPress={() => Linking.openURL('https://example.com/terms')}
              >
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text
                color="$primary7"
                onPress={() => Linking.openURL('https://example.com/privacy')}
              >
                Privacy Policy
              </Text>
            </Text>
          </XStack>
        </UPressableButton>

        <YStack marginTop="$4">
          <USubmitButton
            title="Create Account"
            onPress={handleSignup}
            isLoading={isLoading}
            isDisabled={!isValid || !acceptedTerms}
          />
        </YStack>

        {/* Login Link */}
        <XStack justifyContent="center" marginTop="$6">
          <Text fontSize={14} color="$neutral9">
            Already have an account?{' '}
          </Text>
          <UPressableButton
            onPress={() => router.push('/(public)/login')}
            hapticType="light"
          >
            <Text fontSize={14} color="$primary7" fontWeight="600">
              Sign In
            </Text>
          </UPressableButton>
        </XStack>
      </YStack>
    </AuthLayout>
  );
}
```

### 5. OTP Verification Screen

```tsx
// src/components/auth/otpInput.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { TextInput, Keyboard } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { useHaptics } from '@/src/hooks/useHaptics';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
}

export const OTPInput = React.memo(({
  length = 6,
  value,
  onChange,
  onComplete,
}: OTPInputProps) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const haptics = useHaptics();

  const handleChange = useCallback((text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text.slice(-1);
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    if (text && index < length - 1) {
      haptics.lightTap();
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedValue.length === length) {
      Keyboard.dismiss();
      haptics.success();
      onComplete?.(updatedValue);
    }
  }, [value, length, onChange, onComplete]);

  const handleKeyPress = useCallback((e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [value]);

  return (
    <XStack gap="$2" justifyContent="center">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          style={{
            width: 48,
            height: 56,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: value[index] ? '#B4975A' : '#E5E5E5',
            backgroundColor: 'white',
            textAlign: 'center',
            fontSize: 24,
            fontWeight: '600',
            color: '#1F2937',
          }}
          accessibilityLabel={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </XStack>
  );
});
```

### 6. Resend Timer Component

```tsx
// src/components/auth/resendTimer.tsx
import React, { useState, useEffect } from 'react';
import { Text, XStack } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';

interface ResendTimerProps {
  initialSeconds?: number;
  onResend: () => void;
}

export const ResendTimer = React.memo(({
  initialSeconds = 60,
  onResend,
}: ResendTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = () => {
    setSeconds(initialSeconds);
    setCanResend(false);
    onResend();
  };

  return (
    <XStack justifyContent="center" alignItems="center" gap="$1">
      <Text fontSize={14} color="$neutral9">
        Didn't receive the code?
      </Text>
      {canResend ? (
        <UPressableButton onPress={handleResend} hapticType="light">
          <Text fontSize={14} color="$primary7" fontWeight="600">
            Resend
          </Text>
        </UPressableButton>
      ) : (
        <Text fontSize={14} color="$neutral8">
          Resend in {seconds}s
        </Text>
      )}
    </XStack>
  );
});
```

## Testing Checklist

### Login
- [ ] Email field validates format
- [ ] Password toggle shows/hides password
- [ ] Remember me checkbox works
- [ ] Forgot password navigates
- [ ] Social login buttons work
- [ ] Error messages are specific
- [ ] Loading state on submit
- [ ] Haptic feedback on actions

### Signup
- [ ] All fields validate in real-time
- [ ] Password strength indicator works
- [ ] Confirm password matches
- [ ] Terms checkbox required for submit
- [ ] Terms/Privacy links open
- [ ] Loading state on submit

### Verification
- [ ] OTP input auto-focuses next
- [ ] Backspace moves to previous
- [ ] Auto-submits when complete
- [ ] Resend timer works
- [ ] Resend button enables after timer
- [ ] Haptic feedback on input

### General
- [ ] All screens have back button
- [ ] Keyboard avoidance works
- [ ] Links between screens work
- [ ] Error states show properly
- [ ] Success transitions smoothly
