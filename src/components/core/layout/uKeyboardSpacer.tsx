import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  EmitterSubscription,
  Keyboard,
  KeyboardEvent,
  LayoutAnimation,
  LayoutAnimationConfig,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, YStackProps } from 'tamagui';

const defaultAnimation: LayoutAnimationConfig = {
  duration: 500,
  create: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 200,
  },
};

interface KeyboardSpacerProps extends YStackProps {
  topSpacing?: number;
  onToggle?: (keyboardOpen: boolean, keyboardSpace: number) => void;
  disableSafeArea?: boolean;
  offset?: number;
}

const UKeyboardSpacer = ({
  topSpacing = 0,
  onToggle,
  disableSafeArea,
  offset = 0,
  ...props
}: KeyboardSpacerProps) => {
  const { bottom } = useSafeAreaInsets();
  const [keyboardSpace, setKeyboardSpace] = useState(
    disableSafeArea ? 0 + offset : bottom + offset
  );

  const updateKeyboardSpace = useCallback(
    (e: KeyboardEvent) => {
      if (!e?.endCoordinates) {
        return;
      }

      let animationConfig = defaultAnimation;

      if (Platform.OS === 'ios') {
        const { duration = defaultAnimation.duration, easing } = e;
        const easingType =
          LayoutAnimation.Types[easing] || LayoutAnimation.Types.easeInEaseOut;

        animationConfig = LayoutAnimation.create(
          duration,
          easingType,
          LayoutAnimation.Properties.opacity
        );
      }

      LayoutAnimation.configureNext(animationConfig);

      const screenHeight = Dimensions.get('window').height;
      const newKeyboardSpace =
        screenHeight - e.endCoordinates.screenY + topSpacing;

      setKeyboardSpace(newKeyboardSpace + offset);
      onToggle?.(true, newKeyboardSpace);
    },
    [onToggle, topSpacing, offset]
  );

  const resetKeyboardSpace = useCallback(
    (e: KeyboardEvent) => {
      let animationConfig = defaultAnimation;

      if (Platform.OS === 'ios') {
        const { duration = defaultAnimation.duration, easing } = e;
        const easingType =
          LayoutAnimation.Types[easing] || LayoutAnimation.Types.easeInEaseOut;

        animationConfig = LayoutAnimation.create(
          duration,
          easingType,
          LayoutAnimation.Properties.opacity
        );
      }

      LayoutAnimation.configureNext(animationConfig);

      setKeyboardSpace(disableSafeArea ? 0 + offset : bottom + offset);
      onToggle?.(false, 0);
    },
    [onToggle, bottom, disableSafeArea, offset]
  );

  /**
   * Setup and teardown keyboard listeners
   */
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const updateEvent =
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const resetEvent =
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    const subUpdate: EmitterSubscription = Keyboard.addListener(
      updateEvent,
      updateKeyboardSpace
    );
    const subReset: EmitterSubscription = Keyboard.addListener(
      resetEvent,
      resetKeyboardSpace
    );

    return () => {
      subUpdate.remove();
      subReset.remove();
    };
  }, [updateKeyboardSpace, resetKeyboardSpace]);

  return <YStack height={keyboardSpace} {...props} />;
};

export default UKeyboardSpacer;
