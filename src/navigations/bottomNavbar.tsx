import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Text, XStack, YStack, useTheme } from 'tamagui';

interface TabItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
  onPress: () => void;
}

const TabItem = ({ icon, label, focused, onPress }: TabItemProps) => {
  const theme = useTheme();
  
  return (
    <YStack
      flex={1}
      ai="center"
      jc="center"
      gap={8}
      onPress={onPress}
      pressStyle={{ opacity: 0.6, scale: 0.97 }}
      animation="bouncy"
      cursor="pointer"
    >
      <YStack
        width={56}
        height={36}
        ai="center"
        jc="center"
        borderRadius={12}
        backgroundColor={focused ? '$primaryAlpha2' : 'transparent'}
        animation="quick"
        scale={focused ? 1 : 0.95}
      >
        <Ionicons
          name={icon}
          size={26}
          color={focused ? theme.primary7.val : theme.neutral6.val}
        />
      </YStack>
      <Text
        fontSize={12}
        fontWeight={focused ? '700' : '500'}
        color={focused ? '$primary7' : '$neutral6'}
        animation="quick"
        opacity={focused ? 1 : 0.7}
      >
        {label}
      </Text>
    </YStack>
  );
};

const BottomNavbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const getIconName = (routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
      case '(home)':
        return focused ? 'home' : 'home-outline';
      case 'library':
        return focused ? 'library' : 'library-outline';
      case 'media':
        return focused ? 'play-circle' : 'play-circle-outline';
      case 'store':
        return focused ? 'storefront' : 'storefront-outline';
      case 'profile':
        return focused ? 'person' : 'person-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case '(home)':
        return 'Home';
      case 'library':
        return 'Library';
      case 'media':
        return 'Media';
      case 'store':
        return 'Store';
      case 'profile':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <XStack
      backgroundColor="$neutral0"
      borderTopWidth={0.5}
      borderTopColor="$neutral2"
      paddingBottom={Platform.OS === 'ios' ? 28 : 16}
      paddingTop={16}
      paddingHorizontal={12}
      height={Platform.OS === 'ios' ? 95 : 75}
      shadowColor="$neutral8"
      shadowOffset={{ width: 0, height: -4 }}
      shadowOpacity={0.15}
      shadowRadius={12}
      elevation={16}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            icon={getIconName(route.name, isFocused)}
            label={getLabel(route.name)}
            focused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </XStack>
  );
};

export default BottomNavbar;

