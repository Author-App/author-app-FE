import React, { memo, useCallback, useRef, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';

import { haptics } from '@/src/utils/haptics';

// Intrinsic size of the banner asset (phone portrait).
const BANNER_W = 852;
const BANNER_H = 1846;
const BANNER_RATIO = BANNER_W / BANNER_H;

const TABLET_BREAKPOINT = 768;
const CARD_MAX_WIDTH = 440;

interface WelcomeModalProps {
  visible: boolean;
  firstName?: string;
  onDismiss: () => void;
  isDismissing?: boolean;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ visible, onDismiss }) => {
  const lottieRef = useRef<LottieView>(null);
  const { width } = useWindowDimensions();

  const isTablet = width >= TABLET_BREAKPOINT;

  // On phone: fill the width. On tablet: constrain to a centered card.
  const cardWidth = isTablet ? Math.min(CARD_MAX_WIDTH, width) : width;
  const cardHeight = cardWidth / BANNER_RATIO;

  useEffect(() => {
    if (visible) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    haptics.light();
    onDismiss();
  }, [onDismiss]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent transparent>
      {/* Backdrop: tapping outside the card dismisses (mainly relevant on tablet). */}
      <Pressable style={styles.backdrop} onPress={handleDismiss}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Stop propagation so scroll drags / inner taps don't hit the backdrop.
              The explicit dismiss is the button Pressable below the image. */}
          <View
            style={[styles.card, { width: cardWidth, height: cardHeight }]}
            onStartShouldSetResponder={() => false}
          >
            <Pressable onPress={handleDismiss} style={StyleSheet.absoluteFill}>
              <Image
                source={require('@/assets/images/welcomeBanner.jpeg')}
                style={styles.image}
                resizeMode="cover"
              />
            </Pressable>

            <LottieView
              ref={lottieRef}
              source={require('@/assets/animations/confetti.json')}
              style={StyleSheet.absoluteFill}
              loop={false}
              autoPlay={false}
            />
          </View>
        </ScrollView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000B33',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default memo(WelcomeModal);