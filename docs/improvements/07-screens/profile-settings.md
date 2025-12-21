# Profile & Settings Improvements

## Current Locations
- Profile: `app/(app)/(tabs)/profile.tsx` or Settings tab
- Settings: `app/(app)/settings/index.tsx`
- Edit Profile: `app/(app)/editProfile/index.tsx`

## Current Problems

1. Profile may lack visual hierarchy
2. Settings not grouped properly
3. No profile completion indicator
4. Missing quick stats/achievements
5. No dark mode toggle
6. Logout confirmation not user-friendly

## Improvements Required

### 1. Enhanced Profile Header

```tsx
// src/components/profile/profileHeader.tsx
import React from 'react';
import { YStack, XStack, Text, Avatar } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { Camera, Edit2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    memberSince: string;
  };
  onAvatarPress: () => void;
  onEditPress: () => void;
}

export const ProfileHeader = React.memo(({
  user,
  onAvatarPress,
  onEditPress,
}: ProfileHeaderProps) => {
  return (
    <YStack 
      paddingHorizontal="$4" 
      paddingVertical="$6" 
      alignItems="center"
      backgroundColor="$primary2"
    >
      {/* Avatar with Edit Button */}
      <UPressableButton onPress={onAvatarPress} hapticType="light">
        <YStack position="relative">
          <Avatar circular size="$10">
            {user.avatarUrl ? (
              <Avatar.Image 
                src={user.avatarUrl} 
                accessibilityLabel={`${user.name}'s profile picture`}
              />
            ) : (
              <Avatar.Fallback backgroundColor="$primary7">
                <Text color="white" fontSize={32} fontWeight="600">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </Avatar.Fallback>
            )}
          </Avatar>
          
          <YStack
            position="absolute"
            bottom={0}
            right={0}
            width={32}
            height={32}
            borderRadius={16}
            backgroundColor="$primary7"
            alignItems="center"
            justifyContent="center"
            borderWidth={3}
            borderColor="$primary2"
          >
            <Camera size={16} color="white" />
          </YStack>
        </YStack>
      </UPressableButton>

      {/* Name & Email */}
      <YStack alignItems="center" marginTop="$4" gap="$1">
        <Text fontSize={22} fontWeight="700" color="$neutral12">
          {user.name}
        </Text>
        <Text fontSize={14} color="$neutral9">
          {user.email}
        </Text>
        <Text fontSize={12} color="$neutral8" marginTop="$1">
          Member since {user.memberSince}
        </Text>
      </YStack>

      {/* Edit Button */}
      <UPressableButton onPress={onEditPress} hapticType="light">
        <XStack
          marginTop="$4"
          paddingHorizontal="$4"
          paddingVertical="$2"
          backgroundColor="white"
          borderRadius={20}
          alignItems="center"
          gap="$2"
        >
          <Edit2 size={14} color="#B4975A" />
          <Text fontSize={14} color="$primary7" fontWeight="500">
            Edit Profile
          </Text>
        </XStack>
      </UPressableButton>
    </YStack>
  );
});
```

### 2. Reading Stats Section

```tsx
// src/components/profile/readingStats.tsx
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Book, Clock, Award, Calendar } from 'lucide-react-native';

interface ReadingStatsProps {
  stats: {
    booksRead: number;
    hoursListened: number;
    streak: number;
    joinDate: string;
  };
}

const StatItem = React.memo(({ 
  icon: Icon, 
  value, 
  label 
}: { 
  icon: any; 
  value: string | number; 
  label: string;
}) => (
  <YStack flex={1} alignItems="center" gap="$2">
    <YStack
      width={44}
      height={44}
      borderRadius={22}
      backgroundColor="$primary2"
      alignItems="center"
      justifyContent="center"
    >
      <Icon size={20} color="#B4975A" />
    </YStack>
    <Text fontSize={18} fontWeight="700" color="$neutral12">
      {value}
    </Text>
    <Text fontSize={12} color="$neutral9" textAlign="center">
      {label}
    </Text>
  </YStack>
));

export const ReadingStats = React.memo(({ stats }: ReadingStatsProps) => {
  return (
    <YStack 
      marginHorizontal="$4" 
      marginTop="-$4"
      padding="$4"
      backgroundColor="white"
      borderRadius={16}
      shadowColor="rgba(0,0,0,0.1)"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={1}
      shadowRadius={8}
    >
      <XStack justifyContent="space-around">
        <StatItem 
          icon={Book} 
          value={stats.booksRead} 
          label="Books Read" 
        />
        <StatItem 
          icon={Clock} 
          value={`${stats.hoursListened}h`} 
          label="Hours" 
        />
        <StatItem 
          icon={Award} 
          value={stats.streak} 
          label="Day Streak" 
        />
      </XStack>
    </YStack>
  );
});
```

### 3. Settings Menu Groups

```tsx
// src/components/settings/settingsGroup.tsx
import React from 'react';
import { YStack, XStack, Text, Switch } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { ChevronRight } from 'lucide-react-native';

interface SettingsItem {
  id: string;
  icon: React.ElementType;
  label: string;
  subtitle?: string;
  type: 'navigation' | 'toggle' | 'info';
  value?: boolean;
  destructive?: boolean;
}

interface SettingsGroupProps {
  title: string;
  items: SettingsItem[];
  onItemPress: (id: string) => void;
  onToggle?: (id: string, value: boolean) => void;
}

export const SettingsGroup = React.memo(({
  title,
  items,
  onItemPress,
  onToggle,
}: SettingsGroupProps) => {
  return (
    <YStack gap="$2">
      <Text 
        fontSize={12} 
        fontWeight="600" 
        color="$neutral9" 
        textTransform="uppercase"
        paddingHorizontal="$4"
      >
        {title}
      </Text>

      <YStack 
        backgroundColor="white" 
        borderRadius={12} 
        marginHorizontal="$4"
        overflow="hidden"
      >
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {item.type === 'toggle' ? (
              <XStack 
                paddingHorizontal="$4" 
                paddingVertical="$3.5" 
                alignItems="center"
              >
                <XStack flex={1} alignItems="center" gap="$3">
                  <item.icon size={20} color="#B4975A" />
                  <YStack flex={1}>
                    <Text fontSize={15} color="$neutral12">
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text fontSize={12} color="$neutral9">
                        {item.subtitle}
                      </Text>
                    )}
                  </YStack>
                </XStack>
                <Switch
                  checked={item.value}
                  onCheckedChange={(val) => onToggle?.(item.id, val)}
                  accessibilityLabel={item.label}
                />
              </XStack>
            ) : (
              <UPressableButton 
                onPress={() => onItemPress(item.id)}
                hapticType="light"
              >
                <XStack 
                  paddingHorizontal="$4" 
                  paddingVertical="$3.5" 
                  alignItems="center"
                >
                  <XStack flex={1} alignItems="center" gap="$3">
                    <item.icon 
                      size={20} 
                      color={item.destructive ? '#EF4444' : '#B4975A'} 
                    />
                    <YStack flex={1}>
                      <Text 
                        fontSize={15} 
                        color={item.destructive ? '$red10' : '$neutral12'}
                      >
                        {item.label}
                      </Text>
                      {item.subtitle && (
                        <Text fontSize={12} color="$neutral9">
                          {item.subtitle}
                        </Text>
                      )}
                    </YStack>
                  </XStack>
                  
                  {item.type === 'navigation' && (
                    <ChevronRight size={20} color="#9CA3AF" />
                  )}
                </XStack>
              </UPressableButton>
            )}
            
            {/* Divider */}
            {index < items.length - 1 && (
              <YStack 
                height={1} 
                backgroundColor="$neutral3" 
                marginLeft={52}
              />
            )}
          </React.Fragment>
        ))}
      </YStack>
    </YStack>
  );
});
```

### 4. Logout Confirmation Dialog

```tsx
// src/components/settings/logoutDialog.tsx
import React from 'react';
import { Modal, Pressable } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { LogOut } from 'lucide-react-native';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { useHaptics } from '@/src/hooks/useHaptics';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutDialog = React.memo(({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutDialogProps) => {
  const haptics = useHaptics();

  const handleConfirm = () => {
    haptics.warning();
    onConfirm();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
        onPress={onClose}
      >
        <YStack
          backgroundColor="white"
          borderRadius={20}
          padding="$5"
          width="100%"
          maxWidth={320}
          alignItems="center"
          gap="$4"
        >
          {/* Icon */}
          <YStack
            width={64}
            height={64}
            borderRadius={32}
            backgroundColor="$red2"
            alignItems="center"
            justifyContent="center"
          >
            <LogOut size={28} color="#EF4444" />
          </YStack>

          {/* Title */}
          <Text fontSize={18} fontWeight="700" textAlign="center">
            Log Out?
          </Text>

          {/* Message */}
          <Text 
            fontSize={14} 
            color="$neutral9" 
            textAlign="center"
            paddingHorizontal="$2"
          >
            Are you sure you want to log out? You'll need to sign in again to access your library.
          </Text>

          {/* Buttons */}
          <XStack gap="$3" width="100%">
            <UPressableButton
              onPress={onClose}
              style={{ flex: 1 }}
              hapticType="light"
            >
              <XStack
                paddingVertical="$3"
                borderRadius={12}
                backgroundColor="$neutral2"
                justifyContent="center"
              >
                <Text fontSize={15} fontWeight="600" color="$neutral11">
                  Cancel
                </Text>
              </XStack>
            </UPressableButton>

            <UPressableButton
              onPress={handleConfirm}
              style={{ flex: 1 }}
              hapticType="medium"
              disabled={isLoading}
            >
              <XStack
                paddingVertical="$3"
                borderRadius={12}
                backgroundColor="$red10"
                justifyContent="center"
              >
                <Text fontSize={15} fontWeight="600" color="white">
                  {isLoading ? 'Logging out...' : 'Log Out'}
                </Text>
              </XStack>
            </UPressableButton>
          </XStack>
        </YStack>
      </Pressable>
    </Modal>
  );
});
```

### 5. Profile Completion Indicator

```tsx
// src/components/profile/profileCompletion.tsx
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { ChevronRight } from 'lucide-react-native';

interface ProfileCompletionProps {
  percentage: number;
  missingItems: string[];
  onPress: () => void;
}

export const ProfileCompletion = React.memo(({
  percentage,
  missingItems,
  onPress,
}: ProfileCompletionProps) => {
  if (percentage >= 100) return null;

  return (
    <UPressableButton onPress={onPress} hapticType="light">
      <XStack
        marginHorizontal="$4"
        marginTop="$4"
        padding="$4"
        backgroundColor="$primary2"
        borderRadius={12}
        alignItems="center"
        gap="$3"
      >
        {/* Progress Ring */}
        <YStack
          width={48}
          height={48}
          borderRadius={24}
          borderWidth={4}
          borderColor="$neutral4"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Text fontSize={14} fontWeight="700" color="$primary7">
            {percentage}%
          </Text>
        </YStack>

        <YStack flex={1}>
          <Text fontSize={14} fontWeight="600" color="$neutral12">
            Complete Your Profile
          </Text>
          <Text fontSize={12} color="$neutral9">
            Add {missingItems[0]} to unlock all features
          </Text>
        </YStack>

        <ChevronRight size={20} color="#B4975A" />
      </XStack>
    </UPressableButton>
  );
});
```

## Settings Screen Structure

```tsx
// app/(app)/settings/index.tsx
import { User, Bell, Lock, Moon, CreditCard, HelpCircle, FileText, LogOut, Info } from 'lucide-react-native';

const settingsData = [
  {
    title: 'Account',
    items: [
      { id: 'profile', icon: User, label: 'Edit Profile', type: 'navigation' },
      { id: 'password', icon: Lock, label: 'Change Password', type: 'navigation' },
      { id: 'subscription', icon: CreditCard, label: 'Subscription', subtitle: 'Premium', type: 'navigation' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', icon: Bell, label: 'Notifications', type: 'navigation' },
      { id: 'darkMode', icon: Moon, label: 'Dark Mode', type: 'toggle', value: false },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', icon: HelpCircle, label: 'Help & FAQ', type: 'navigation' },
      { id: 'terms', icon: FileText, label: 'Terms of Service', type: 'navigation' },
      { id: 'privacy', icon: FileText, label: 'Privacy Policy', type: 'navigation' },
      { id: 'about', icon: Info, label: 'About', subtitle: 'v1.0.0', type: 'navigation' },
    ],
  },
  {
    title: '',
    items: [
      { id: 'logout', icon: LogOut, label: 'Log Out', type: 'navigation', destructive: true },
    ],
  },
];

<ScrollView>
  {settingsData.map((group) => (
    <SettingsGroup
      key={group.title}
      title={group.title}
      items={group.items}
      onItemPress={handleItemPress}
      onToggle={handleToggle}
    />
  ))}
</ScrollView>

<LogoutDialog
  isOpen={showLogoutDialog}
  onClose={() => setShowLogoutDialog(false)}
  onConfirm={handleLogout}
/>
```

## Testing Checklist

- [ ] Avatar shows camera icon overlay
- [ ] Avatar tap opens image picker
- [ ] Edit profile navigates correctly
- [ ] Stats display accurate numbers
- [ ] Settings grouped logically
- [ ] Toggle switches work
- [ ] Logout shows confirmation dialog
- [ ] Logout dialog has cancel option
- [ ] Destructive actions in red
- [ ] Haptic feedback on all interactions
- [ ] Profile completion shows when incomplete
- [ ] Dark mode toggle persists
