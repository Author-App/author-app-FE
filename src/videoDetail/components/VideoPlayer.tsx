import React, { memo, useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { YStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import haptics from '@/src/utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerProps {
  videoRef: React.RefObject<Video | null>;
  fileUrl: string;
  thumbnail?: string | null;
  initialPosition?: number;
  onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void;
  isLoading?: boolean;
}

export const VideoPlayer = memo(function VideoPlayer({
  videoRef,
  fileUrl,
  thumbnail,
  initialPosition = 0,
  onPlaybackStatusUpdate,
  isLoading,
}: VideoPlayerProps) {
  const { top: safeTop } = useSafeAreaInsets();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle orientation changes
  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        const orientation = event.orientationInfo.orientation;
        const isLandscape =
          orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
        setIsFullscreen(isLandscape);
      }
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Lock back to portrait when unmounting
  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    haptics.medium();
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      StatusBar.setHidden(false);
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
      StatusBar.setHidden(true);
    }
  }, [isFullscreen]);

  // Calculate dimensions based on fullscreen state
  const playerHeight = isFullscreen ? SCREEN_WIDTH : 280 + safeTop;
  const playerWidth = isFullscreen ? SCREEN_HEIGHT : '100%';

  return (
    <YStack
      w={playerWidth as any}
      h={playerHeight}
      bg="$color1"
      overflow="hidden"
      pt={isFullscreen ? 0 : safeTop}
    >
      {/* Gradient overlay for top edge blend */}
      {!isFullscreen && (
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent']}
          style={[styles.topGradient, { top: safeTop }]}
          pointerEvents="none"
        />
      )}

      <Video
        ref={videoRef}
        source={{ uri: fileUrl }}
        style={[
          styles.video,
          isFullscreen && { width: SCREEN_HEIGHT, height: SCREEN_WIDTH },
        ]}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        positionMillis={initialPosition}
        posterSource={thumbnail ? { uri: thumbnail } : undefined}
        posterStyle={styles.poster}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        progressUpdateIntervalMillis={500}
      />

      {/* Fullscreen toggle button */}
      <YStack
        position="absolute"
        bottom={isFullscreen ? 16 : 60}
        right={isFullscreen ? 60 : 16}
        zIndex={10}
        onPress={toggleFullscreen}
        pressStyle={{ opacity: 0.7, scale: 0.95 }}
        animation="quick"
      >
        <YStack
          bg="rgba(0,0,0,0.6)"
          br={20}
          w={40}
          h={40}
          ai="center"
          jc="center"
        >
          <Ionicons
            name={isFullscreen ? 'contract' : 'expand'}
            size={20}
            color="white"
          />
        </YStack>
      </YStack>

      {/* Loading overlay */}
      {isLoading && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          ai="center"
          jc="center"
          bg="rgba(0,0,0,0.6)"
        >
          <ActivityIndicator size="large" color="#A91D3A" />
        </YStack>
      )}

      {/* Bottom gradient for smooth transition */}
      {!isFullscreen && (
        <LinearGradient
          colors={['transparent', 'rgba(18,18,18,1)']}
          style={styles.bottomGradient}
          pointerEvents="none"
        />
      )}
    </YStack>
  );
});

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1,
  },
});
