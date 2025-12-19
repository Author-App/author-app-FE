import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Text, XStack, YStack, useTheme } from 'tamagui';

interface TabItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
  onPress: () => void;
  isCenter?: boolean;
}

const TabItem = ({
  icon,
  label,
  focused,
  onPress,
  isCenter = false,
}: TabItemProps) => {
  const theme = useTheme();

  return (
    <YStack
      flex={1}
      ai="center"
      jc="center"
      gap={6}
      onPress={onPress}
      pressStyle={{ opacity: 0.7, scale: 0.96 }}
      animation="bouncy"
      mt={isCenter ? -70 : 0} // 🔥 lift center tab
      cursor="pointer"
    >
      {/* Icon container */}
      <YStack
        width={isCenter ? 68 : 56}
        height={isCenter ? 68 : 36}
        ai="center"
        jc="center"
        borderRadius={isCenter ? 34 : 12}
        backgroundColor={
          isCenter
            ? focused
              ? '#385d83ff'
              : '$bg2'
            : focused
              ? '$bg2'
              : 'transparent'
        }
        shadowColor={isCenter ? '#000' : undefined}
        shadowOffset={{ width: 0, height: 8 }}
        shadowOpacity={isCenter ? 0.25 : 0}
        shadowRadius={14}
        elevation={isCenter ? 14 : 0}
        scale={focused && isCenter ? 1.1 : 1}
        animation="bouncy"
      >
        <Ionicons
          name={icon}
          size={isCenter ? 32 : 26}
          color={
            isCenter
              ? focused
                ? '#fff'
                : theme.neutral7.val
              : focused
                ? '#385d83ff'
                : theme.neutral6.val
          }
        />
      </YStack>

      {/* Hide label for center tab */}
      {!isCenter && (
        <Text
          fontSize={12}
          fontWeight={focused ? '700' : '500'}
          color={focused ? '#385d83ff' : '$neutral6'}
          mt={6}
        >
          {label}
        </Text>
      )}
    </YStack>
  );
};

const BottomNavbar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const getIconName = (
    routeName: string,
    focused: boolean
  ): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
      case '(home)':
        return focused ? 'home' : 'home-outline';
      case 'library':
        return focused ? 'library' : 'library-outline';
      case 'explore':
        return focused ? 'play-circle' : 'play-circle-outline';
      case 'profile':
        return focused ? 'person' : 'person-outline';
      case 'settings':
        return focused ? 'settings' : 'settings-outline';
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
      case 'explore':
        return 'Explore';
      case 'profile':
        return 'Profile';
      case 'settings':
        return 'Settings';
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
      paddingTop={18}
      // paddingTop={26}
      paddingHorizontal={12}
      height={Platform.OS === 'ios' ? 100 : 80}
      shadowColor="$neutral8"
      shadowOffset={{ width: 0, height: -6 }}
      shadowOpacity={0.15}
      shadowRadius={14}
      elevation={18}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isCenter = route.name === 'library'; // ⭐ center tab

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
            isCenter={isCenter} // ✅ important
          />
        );
      })}
    </XStack>
  );
};

export default BottomNavbar;


// import { Ionicons } from '@expo/vector-icons';
// import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// import { Platform } from 'react-native';
// import { Text, XStack, YStack, useTheme } from 'tamagui';

// interface TabItemProps {
//   icon: keyof typeof Ionicons.glyphMap;
//   label: string;
//   focused: boolean;
//   onPress: () => void;
//   isCenter?: boolean;
// }

// const TabItem = ({ icon, label, focused, onPress, isCenter = false }: TabItemProps) => {
//   const theme = useTheme();

//   return (
//     <YStack
//       flex={1}
//       ai="center"
//       jc="center"
//       gap={8}
//       onPress={onPress}
//       pressStyle={{ opacity: 0.6, scale: 0.97 }}
//       animation="bouncy"
//       cursor="pointer"
//       mt={isCenter ? -24 : 0}   // 👈 raise it
//     >
//       <YStack
//         width={isCenter ? 64 : 56}
//         height={isCenter ? 64 : 36}
//         // width={56}
//         // height={36}
//         ai="center"
//         jc="center"
//         // borderRadius={12}
//         borderRadius={isCenter ? 32 : 12}
//         backgroundColor={
//           isCenter
//             ? focused
//               ? '#385d83ff'
//               : '$bg2'
//             : focused
//               ? '$bg2'
//               : 'transparent'
//         }
//         // backgroundColor={focused ? '$bg2' : 'transparent'}
//         // animation="quick"
//         // scale={focused ? 1 : 0.95}
//         shadowColor={isCenter ? '#000' : undefined}
//         shadowOffset={{ width: 0, height: 6 }}
//         shadowOpacity={isCenter ? 0.25 : 0}
//         shadowRadius={10}
//         elevation={isCenter ? 10 : 0}
//         scale={focused && isCenter ? 1.08 : focused ? 1 : 0.95}
//         animation="bouncy"
//       >
//         <Ionicons
//           name={icon}
//           // size={26}
//           size={isCenter ? 30 : 26}
//           // color={focused ? '#385d83ff' : theme.neutral6.val}
//           color={
//             isCenter
//               ? focused
//                 ? '#fff'
//                 : theme.neutral7.val
//               : focused
//                 ? '#385d83ff'
//                 : theme.neutral6.val
//           }
//         />
//       </YStack>
//       {!isCenter && (
//         <Text
//           fontSize={12}
//           fontWeight={focused ? '700' : '500'}
//           color={focused ? '#385d83ff' : '$neutral6'}
//           mt={8}
//         >
//           {label}
//         </Text>
//       )}
//       {/* <Text
//         fontSize={12}
//         fontWeight={focused ? '700' : '500'}
//         color={focused ? '#385d83ff' : '$neutral6'}
//         animation="quick"
//         opacity={focused ? 1 : 0.7}
//       >
//         {label}
//       </Text> */}
//     </YStack>
//   );
// };

// const BottomNavbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
//   const getIconName = (routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
//     switch (routeName) {
//       case '(home)':
//         return focused ? 'home' : 'home-outline';
//       case 'library':
//         return focused ? 'library' : 'library-outline';
//       case 'explore':
//         return focused ? 'play-circle' : 'play-circle-outline';
//       case 'profile':
//         return focused ? 'person' : 'person-outline';
//       case 'settings':
//         return focused ? 'settings' : 'settings-outline';
//       default:
//         return 'help-circle-outline';
//     }
//   };

//   const getLabel = (routeName: string) => {
//     switch (routeName) {
//       case '(home)':
//         return 'Home';
//       case 'library':
//         return 'Library';
//       case 'explore':
//         return 'Explore';
//       case 'profile':
//         return 'Profile';
//       case 'settings':
//         return 'Settings';
//       default:
//         return routeName;
//     }
//   };

//   return (
//     <XStack
//       backgroundColor="$neutral0"
//       borderTopWidth={0.5}
//       borderTopColor="$neutral2"
//       paddingBottom={Platform.OS === 'ios' ? 28 : 16}
//       paddingTop={16}
//       paddingHorizontal={12}
//       height={Platform.OS === 'ios' ? 95 : 75}
//       shadowColor="$neutral8"
//       shadowOffset={{ width: 0, height: -4 }}
//       shadowOpacity={0.15}
//       shadowRadius={12}
//       elevation={16}
//     >
//       {state.routes.map((route, index) => {
//         const isFocused = state.index === index;
//         const isCenter = route.name === 'library';

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         return (
//           <TabItem
//             key={route.key}
//             icon={getIconName(route.name, isFocused)}
//             label={getLabel(route.name)}
//             focused={isFocused}
//             onPress={onPress}
//           />
//         );
//       })}
//     </XStack>
//   );
// };

// export default BottomNavbar;