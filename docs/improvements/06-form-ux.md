# Form UX Improvements

## Current Problems

1. **No real-time validation** - errors only show after submission
2. **No password visibility toggle** - users can't verify passwords
3. **No input formatting** - phone/credit card not auto-formatted
4. **Generic error messages** - "Invalid input" not helpful
5. **No character counter** - users don't know limits
6. **No autofocus** - users have to tap first field
7. **Submit button always enabled** - should be disabled when invalid
8. **No keyboard type optimization** - email fields use standard keyboard

## Why This Matters

- **Reduces friction** - users complete forms faster
- **Prevents errors** - catch mistakes before submission
- **Builds trust** - professional forms feel secure
- **Reduces support** - fewer "forgot password" requests

## Required Implementations

### Task 1: Create Enhanced Text Input Component

**File to create:** `src/components/core/inputs/uEnhancedInput.tsx`

```tsx
import React, { useState, useCallback, forwardRef } from 'react';
import { TextInput, Pressable, TextInputProps } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { Eye, EyeOff } from 'lucide-react-native';

interface UEnhancedInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCharCount?: boolean;
  type?: 'text' | 'email' | 'password' | 'phone' | 'number';
  required?: boolean;
}

export const UEnhancedInput = forwardRef<TextInput, UEnhancedInputProps>(({
  label,
  error,
  hint,
  maxLength,
  showCharCount = false,
  type = 'text',
  required = false,
  value = '',
  onChangeText,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderColor = useSharedValue('#E5E5E5');

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(borderColor.value, { duration: 200 }),
  }));

  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    borderColor.value = '#B4975A'; // Primary color
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    borderColor.value = error ? '#EF4444' : '#E5E5E5';
    onBlur?.(e);
  }, [onBlur, error]);

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const formatValue = (text: string) => {
    if (type === 'phone') {
      // Format as (XXX) XXX-XXXX
      const cleaned = text.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        const formatted = [
          match[1] ? `(${match[1]}` : '',
          match[2] ? `) ${match[2]}` : '',
          match[3] ? `-${match[3]}` : '',
        ].join('');
        return formatted;
      }
    }
    return text;
  };

  const handleChangeText = useCallback((text: string) => {
    const formatted = formatValue(text);
    onChangeText?.(formatted);
  }, [type, onChangeText]);

  return (
    <YStack gap="$1.5">
      {/* Label */}
      <XStack alignItems="center" gap="$1">
        <Text fontSize={14} fontWeight="500" color="$neutral11">
          {label}
        </Text>
        {required && (
          <Text fontSize={14} color="$red10">*</Text>
        )}
      </XStack>

      {/* Input Container */}
      <Animated.View style={[{ borderWidth: 1, borderRadius: 8, overflow: 'hidden' }, animatedBorderStyle]}>
        <XStack alignItems="center">
          <TextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType={getKeyboardType()}
            secureTextEntry={type === 'password' && !showPassword}
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            autoComplete={type === 'email' ? 'email' : type === 'password' ? 'password' : 'off'}
            maxLength={maxLength}
            placeholderTextColor="#9CA3AF"
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              color: '#1F2937',
            }}
            {...props}
          />
          
          {/* Password Toggle */}
          {type === 'password' && (
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{ padding: 12 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
            >
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </Pressable>
          )}
        </XStack>
      </Animated.View>

      {/* Error/Hint/Counter Row */}
      <XStack justifyContent="space-between" alignItems="flex-start">
        <YStack flex={1}>
          {error && (
            <Text fontSize={12} color="$red10">
              {error}
            </Text>
          )}
          {!error && hint && (
            <Text fontSize={12} color="$neutral9">
              {hint}
            </Text>
          )}
        </YStack>
        
        {showCharCount && maxLength && (
          <Text 
            fontSize={12} 
            color={value.length >= maxLength ? '$red10' : '$neutral9'}
          >
            {value.length}/{maxLength}
          </Text>
        )}
      </XStack>
    </YStack>
  );
});

UEnhancedInput.displayName = 'UEnhancedInput';
```

### Task 2: Create Form Validation Hook

**File to create:** `src/hooks/useFormValidation.ts`

```tsx
import { useState, useCallback, useMemo } from 'react';

type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
};

type ValidationRules<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule;
};

type Errors<T extends Record<string, any>> = {
  [K in keyof T]?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Set<keyof T>>(new Set());

  const validateField = useCallback((key: keyof T, value: string): string | null => {
    const rule = rules[key];
    if (!rule) return null;

    if (rule.required && !value.trim()) {
      return 'This field is required';
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `Must be no more than ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      if (rule.pattern === EMAIL_REGEX) {
        return 'Please enter a valid email address';
      }
      if (rule.pattern === PASSWORD_REGEX) {
        return 'Password must have 8+ chars, uppercase, lowercase, and number';
      }
      return 'Invalid format';
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const setValue = useCallback((key: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    
    // Only show errors after field has been touched
    if (touched.has(key)) {
      const error = validateField(key, value);
      setErrors(prev => ({ ...prev, [key]: error || undefined }));
    }
  }, [touched, validateField]);

  const setFieldTouched = useCallback((key: keyof T) => {
    setTouched(prev => new Set(prev).add(key));
    const error = validateField(key, values[key] as string);
    setErrors(prev => ({ ...prev, [key]: error || undefined }));
  }, [values, validateField]);

  const validateAll = useCallback((): boolean => {
    const newErrors: Errors<T> = {};
    let isValid = true;

    for (const key of Object.keys(rules) as (keyof T)[]) {
      const error = validateField(key, values[key] as string);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched(new Set(Object.keys(rules) as (keyof T)[]));
    return isValid;
  }, [rules, values, validateField]);

  const isValid = useMemo(() => {
    for (const key of Object.keys(rules) as (keyof T)[]) {
      if (validateField(key, values[key] as string)) {
        return false;
      }
    }
    return true;
  }, [rules, values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(new Set());
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    isValid,
    reset,
  };
};

// Preset patterns for common validation
export const ValidationPatterns = {
  EMAIL: EMAIL_REGEX,
  PASSWORD: PASSWORD_REGEX,
  PHONE: /^\(\d{3}\) \d{3}-\d{4}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
};
```

### Task 3: Create Smart Submit Button

**File to create:** `src/components/core/buttons/uSubmitButton.tsx`

```tsx
import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { Text, XStack } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { useHaptics } from '@/src/hooks/useHaptics';

interface USubmitButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  loadingText?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const USubmitButton = React.memo(({
  title,
  onPress,
  isLoading = false,
  isDisabled = false,
  loadingText = 'Please wait...',
}: USubmitButtonProps) => {
  const scale = useSharedValue(1);
  const haptics = useHaptics();
  
  const isButtonDisabled = isDisabled || isLoading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isButtonDisabled) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (!isButtonDisabled) {
      haptics.mediumTap();
      onPress();
    }
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={isButtonDisabled}
      style={animatedStyle}
      accessibilityRole="button"
      accessibilityLabel={isLoading ? loadingText : title}
      accessibilityState={{ disabled: isButtonDisabled }}
    >
      <XStack
        backgroundColor={isButtonDisabled ? '$neutral5' : '$primary7'}
        paddingVertical={16}
        paddingHorizontal={24}
        borderRadius={12}
        justifyContent="center"
        alignItems="center"
        gap="$2"
        opacity={isButtonDisabled ? 0.6 : 1}
      >
        {isLoading && (
          <ActivityIndicator color="white" size="small" />
        )}
        <Text
          color="white"
          fontSize={16}
          fontWeight="600"
        >
          {isLoading ? loadingText : title}
        </Text>
      </XStack>
    </AnimatedPressable>
  );
});

USubmitButton.displayName = 'USubmitButton';
```

### Task 4: Update Login Screen with Enhanced Forms

**File to modify:** `app/(public)/login/index.tsx`

```tsx
import React, { useRef, useCallback } from 'react';
import { TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { YStack, Text } from 'tamagui';
import { UEnhancedInput } from '@/src/components/core/inputs/uEnhancedInput';
import { USubmitButton } from '@/src/components/core/buttons/uSubmitButton';
import { useFormValidation, ValidationPatterns } from '@/src/hooks/useFormValidation';
import { useHaptics } from '@/src/hooks/useHaptics';

export default function LoginScreen() {
  const passwordRef = useRef<TextInput>(null);
  const haptics = useHaptics();

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
      password: { required: true, minLength: 8 },
    }
  );

  const handleLogin = useCallback(async () => {
    if (!validateAll()) {
      haptics.error();
      return;
    }

    try {
      // Login logic here
      haptics.success();
    } catch (error) {
      haptics.error();
    }
  }, [validateAll]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <YStack flex={1} padding="$4" gap="$4">
          <Text fontSize={28} fontWeight="700" marginBottom="$4">
            Welcome Back
          </Text>

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
            hint="Must be at least 8 characters"
            required
          />

          <USubmitButton
            title="Sign In"
            onPress={handleLogin}
            isDisabled={!isValid}
          />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

### Task 5: Create Password Strength Indicator

**File to create:** `src/components/core/inputs/uPasswordStrength.tsx`

```tsx
import React, { useMemo } from 'react';
import { XStack, YStack, Text } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface UPasswordStrengthProps {
  password: string;
}

export const UPasswordStrength = React.memo(({ password }: UPasswordStrengthProps) => {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  }, [password]);

  const getLabel = () => {
    if (password.length === 0) return '';
    switch (strength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return '#EF4444';
      case 2:
        return '#F59E0B';
      case 3:
        return '#3B82F6';
      case 4:
        return '#10B981';
      default:
        return '#E5E5E5';
    }
  };

  if (password.length === 0) return null;

  return (
    <YStack gap="$1" marginTop="$1">
      <XStack gap="$1">
        {[0, 1, 2, 3].map((index) => (
          <YStack
            key={index}
            flex={1}
            height={4}
            borderRadius={2}
            backgroundColor={index < strength ? getColor() : '#E5E5E5'}
          />
        ))}
      </XStack>
      <Text fontSize={12} color={getColor()}>
        {getLabel()}
      </Text>
    </YStack>
  );
});

UPasswordStrength.displayName = 'UPasswordStrength';
```

## Forms to Update

After creating components, update these screens:

1. **Login** - `app/(public)/login/index.tsx`
2. **Signup** - `app/(public)/signup/index.tsx`
3. **Forgot Password** - `app/(public)/forgotpassword/index.tsx`
4. **Reset Password** - `app/(public)/resetpassword/index.tsx`
5. **Verification Code** - `app/(public)/verificationcode/index.tsx`
6. **Edit Profile** - `app/(app)/editProfile/index.tsx`
7. **Change Password** - `app/(app)/changePassword/index.tsx`

## Testing Checklist

- [ ] Email field shows email keyboard
- [ ] Phone field auto-formats as (XXX) XXX-XXXX
- [ ] Password toggle shows/hides password
- [ ] Real-time validation shows errors as user types
- [ ] Submit button disabled when form invalid
- [ ] Enter key moves to next field
- [ ] Final field submits form on Enter
- [ ] Clear error messages for each validation type
- [ ] Character counter for limited fields
- [ ] Loading state on submit button
- [ ] Keyboard dismisses properly
- [ ] ScrollView scrolls when keyboard open
- [ ] Haptic feedback on submit
- [ ] Password strength indicator works
- [ ] Required fields marked with asterisk
