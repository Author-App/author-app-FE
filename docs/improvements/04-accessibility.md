# Accessibility Improvements

## Current Problems

1. **No accessibility labels** on interactive elements
2. **Missing accessibilityRole** props on buttons, links, images
3. **No screen reader announcements** for dynamic content
4. **Touch targets too small** on some buttons (< 44x44)
5. **Low contrast text** in some areas
6. **No accessibilityHint** for complex interactions

## Why This Matters

- **15-20% of users** have some form of disability
- **App Store/Play Store** may reject apps with poor accessibility
- **Legal requirements** in some markets
- Shows **professionalism** and attention to detail

## Required Changes

### Task 1: Update Core Button Components

**File to modify:** `src/components/core/buttons/uTextButton.tsx`

```tsx
import { AccessibilityRole } from 'react-native';

interface UTextButtonProps {
  // ... existing props
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const UTextButton = React.memo(({
  children,
  onPress,
  disabled,
  loading,
  accessibilityLabel,
  accessibilityHint,
  ...props
}: UTextButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      // Ensure minimum touch target
      style={{ minHeight: 44, minWidth: 44 }}
      {...props}
    >
      {/* ... content */}
    </TouchableOpacity>
  );
});
```

**File to modify:** `src/components/core/buttons/uIconButton.tsx`

```tsx
interface UIconButtonProps {
  // ... existing props
  accessibilityLabel: string; // Required for icon-only buttons
}

export const UIconButton = React.memo(({
  icon: Icon,
  onPress,
  accessibilityLabel,
  ...props
}: UIconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' }}
      {...props}
    >
      <Icon />
    </TouchableOpacity>
  );
});
```

### Task 2: Update Input Components

**File to modify:** `src/components/core/inputs/uInput.tsx`

```tsx
interface UInputProps {
  // ... existing props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  error?: string;
}

export const UInput = React.memo(({
  label,
  placeholder,
  error,
  accessibilityLabel,
  accessibilityHint,
  ...props
}: UInputProps) => {
  const inputId = useId();
  
  return (
    <YStack gap="$1">
      {label && (
        <UText 
          variant="labelMd"
          nativeID={`${inputId}-label`}
        >
          {label}
        </UText>
      )}
      <TextInput
        accessible={true}
        accessibilityLabel={accessibilityLabel || label || placeholder}
        accessibilityHint={accessibilityHint}
        accessibilityLabelledBy={label ? `${inputId}-label` : undefined}
        accessibilityState={{
          disabled: props.editable === false,
        }}
        accessibilityInvalid={!!error}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <UText 
          variant="bodySm" 
          color="$red7"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </UText>
      )}
    </YStack>
  );
});
```

### Task 3: Update Image Components

**File to modify:** `src/components/core/image/uImage.tsx`

```tsx
interface UImageProps {
  // ... existing props
  accessibilityLabel?: string;
  isDecorative?: boolean; // If true, hides from screen readers
}

export const UImage = React.memo(({
  source,
  accessibilityLabel,
  isDecorative = false,
  ...props
}: UImageProps) => {
  return (
    <Image
      source={source}
      accessible={!isDecorative}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityIgnoresInvertColors={true}
      {...props}
    />
  );
});
```

### Task 4: Add Screen Reader Announcements Hook

**File to create:** `src/hooks/useAnnounce.ts`

```tsx
import { AccessibilityInfo } from 'react-native';
import { useCallback } from 'react';

export const useAnnounce = () => {
  const announce = useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  const announcePolite = useCallback((message: string) => {
    // Slight delay to not interrupt current speech
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(message);
    }, 100);
  }, []);

  return { announce, announcePolite };
};

// Usage in components:
// const { announce } = useAnnounce();
// announce('Item added to cart');
```

### Task 5: Update Header Component

**File to modify:** `src/components/core/layout/uHeader.tsx`

```tsx
export const UHeader = React.memo(({
  title,
  showBackButton,
  rightComponent,
  ...props
}: UHeaderProps) => {
  return (
    <XStack
      accessible={true}
      accessibilityRole="header"
      {...props}
    >
      {showBackButton && (
        <UIconButton
          icon={IconBack}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        />
      )}
      <UText 
        variant="headingMd"
        accessibilityRole="header"
      >
        {title}
      </UText>
      {rightComponent}
    </XStack>
  );
});
```

### Task 6: Update Tab Navigation

**File to modify:** `src/navigations/bottomNavbar.tsx`

```tsx
// For each tab item:
<TouchableOpacity
  accessible={true}
  accessibilityRole="tab"
  accessibilityLabel={`${tabName} tab`}
  accessibilityState={{
    selected: isSelected,
  }}
  accessibilityHint={`Navigate to ${tabName}`}
>
  {/* Tab content */}
</TouchableOpacity>
```

### Task 7: Create Accessibility Testing Checklist Component

**File to create:** `src/components/__dev__/AccessibilityDebug.tsx`

```tsx
// Development only component to highlight accessibility issues
import React from 'react';
import { View, AccessibilityInfo } from 'react-native';

export const AccessibilityDebug: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!__DEV__) return <>{children}</>;

  React.useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      if (enabled) {
        console.log('Screen reader is enabled');
      }
    });
  }, []);

  return <>{children}</>;
};
```

### Task 8: Screen-by-Screen Accessibility Updates

**Files to update with accessibility labels:**

#### Login Screen
```tsx
// app/(public)/login/index.tsx
<UInput
  accessibilityLabel="Email address"
  accessibilityHint="Enter your registered email"
  keyboardType="email-address"
  autoComplete="email"
  textContentType="emailAddress"
/>

<UInput
  accessibilityLabel="Password"
  accessibilityHint="Enter your password"
  secureTextEntry
  autoComplete="password"
  textContentType="password"
/>

<UTextButton
  accessibilityLabel="Sign in"
  accessibilityHint="Signs you in to your account"
>
  Sign In
</UTextButton>

<UTextButton
  accessibilityLabel="Forgot password"
  accessibilityHint="Opens password recovery screen"
>
  Forgot Password?
</UTextButton>
```

#### Home Screen Content Cards
```tsx
// For each content card:
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`${item.title}, by ${item.author}`}
  accessibilityHint={`Opens ${item.type} details`}
>
  {/* Card content */}
</Pressable>
```

#### Media Player
```tsx
// Podcast/Video player controls
<UIconButton
  icon={isPlaying ? IconPause : IconPlay}
  accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
  accessibilityHint={isPlaying ? 'Pauses playback' : 'Starts playback'}
/>

<Slider
  accessible={true}
  accessibilityRole="adjustable"
  accessibilityLabel={`Playback progress: ${formattedTime}`}
  accessibilityHint="Swipe left or right to seek"
/>
```

## Minimum Touch Target Sizes

Ensure all interactive elements are at least:
- **44x44 points** (iOS Human Interface Guidelines)
- **48x48 dp** (Material Design)

For smaller icons, use `hitSlop`:
```tsx
<TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
```

## Color Contrast Requirements

Ensure text meets WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio
- **Large text (18pt+)**: 3:1 contrast ratio

Problem areas to check:
- `$neutral6` and `$neutral7` text on white backgrounds
- Placeholder text in inputs
- Disabled button text

## Testing Checklist

- [ ] All buttons have `accessibilityLabel`
- [ ] All icon buttons have descriptive labels
- [ ] All inputs have labels linked
- [ ] Form errors are announced
- [ ] Tab navigation states are correct
- [ ] Images have alt text or are marked decorative
- [ ] Touch targets are 44x44 minimum
- [ ] Screen reader can navigate all screens
- [ ] Dynamic content changes are announced
- [ ] Color contrast meets WCAG AA
