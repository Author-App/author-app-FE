import { useCallback, useState } from 'react';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { Rating } from 'react-native-ratings';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/src/utils/haptics';

import UText from '@/src/components/core/text/uText';
import UInput from '@/src/components/core/inputs/uInput';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UKeyboardAvoidingView from '../../layout/uKeyboardAvoidingView';
import { UButton } from '../../buttons/uButton';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating?: number, review?: string) => void;
  initialRating?: number;
  initialReview?: string;
  bookTitle?: string;
}

const RatingModal = ({
  visible,
  onClose,
  onSubmit,
  initialRating = 0,
  initialReview = '',
  bookTitle,
}: RatingModalProps) => {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  
  const white = getTokenValue('$white', 'color');
  const gold = getTokenValue('$gold', 'color') as string;
  const brandNavy = getTokenValue('$brandNavy', 'color') as string;

  const handleSubmit = useCallback(() => {
    haptics.medium();
    onSubmit(rating, review);
    onClose();
  }, [onSubmit, rating, review, onClose]);

  const handleRatingChange = useCallback((value: number) => {
    const roundedValue = Math.round(value * 2) / 2;
    haptics.selection();
    setRating(roundedValue);
  }, []);

  const getRatingText = useCallback(() => {
    if (rating === 0) return 'Tap to rate';
    if (rating <= 1) return 'Poor';
    if (rating <= 2) return 'Fair';
    if (rating <= 3) return 'Good';
    if (rating <= 4) return 'Very Good';
    return 'Excellent';
  }, [rating]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
        <UKeyboardAvoidingView>
          <YStack
            flex={1}
            bg="rgba(0,0,0,0.7)"
            jc="center"
            ai="center"
            onPress={onClose}
          >
              <YStack
                bg="$brandNavy"
                br={12}
                p={12}
                width="95%"
                maxWidth={400}
                bw={1}
                borderColor="rgba(255,255,255,0.1)"
              >
                <YStack
                  onPress={() => {
                    haptics.light();
                    onClose();
                  }}
                  bg="rgba(255,255,255,0.1)"
                  w={32}
                  h={32}
                  br={16}
                  ai="center"
                  jc="center"
                  position="absolute" 
                  top={10} 
                  right={10} 
                  zIndex={1}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Ionicons name="close" size={18} color={white} />
                </YStack>

                {/* Title */}
                <YStack ai="center" gap={6} mt={54} mb={24}>
                  <UText variant="playfair-lg" color="$white" textAlign="center">
                    How was your experience?
                  </UText>
                  {bookTitle && (
                    <UText variant="text-md" color="$neutral1" textAlign="center">
                      {bookTitle}
                    </UText>
                  )}
                </YStack>

                <UAnimatedView animation="fadeInUp" delay={100} duration={200}>
                  <YStack ai="center" gap={12} mb={24}>
                    <Rating
                      type="custom"
                      imageSize={40}
                      startingValue={rating}
                      onFinishRating={handleRatingChange}
                      // fractions={2}
                      ratingColor={gold}
                      ratingBackgroundColor="rgba(255,255,255,0.15)"
                      tintColor={brandNavy}
                      style={{ alignSelf: 'center' }}
                    />
                    <XStack ai="center" gap={6}>
                      <UText variant="heading-h2" color="$gold">
                        {rating.toFixed(1)}
                      </UText>
                      <UText variant="text-sm" color="$neutral5">
                        • {getRatingText()}
                      </UText>
                    </XStack>
                  </YStack>
                </UAnimatedView>

                {/* Review Input */}
                <UAnimatedView animation="fadeInUp" delay={200} duration={200}>
                  <YStack gap={10} mb={20}>
                    <XStack ai="center" gap={6}>
                      <Ionicons name="pencil" size={14} color={white} />
                      <UText variant="text-sm" color="$white" fontWeight="500">
                        Write a Review
                      </UText>
                    </XStack>
                    <UInput
                      placeholder="Share your thoughts..."
                      value={review}
                      onChangeText={setReview}
                      multiline
                      height={90}
                      backgroundColor="rgba(255,255,255,0.06)"
                      borderColor="rgba(255,255,255,0.12)"
                      borderWidth={1}
                      borderRadius={12}
                      px={14}
                      py={10}
                      textAlignVertical="top"
                      color="$white"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                    />
                  </YStack>
                </UAnimatedView>

                {/* Submit Button */}
                <UAnimatedView animation="fadeInUp" delay={300} duration={200}>
                  <UButton
                    onPress={handleSubmit}
                    disabled={rating === 0}
                    opacity={rating === 0 ? 0.5 : 1}
                    width="100%"
                    borderRadius={99}
                    bg="$brandTeal"
                  >
                    <XStack ai="center" gap={8}>
                      <Ionicons name="star" size={16} color={white} />
                      <UText variant="text-md" color="$white" fontWeight="600">
                        Submit Review
                      </UText>
                    </XStack>
                  </UButton>
                </UAnimatedView>
              </YStack>
          </YStack>
        </UKeyboardAvoidingView>
    </Modal>
  );
};

export default RatingModal;
