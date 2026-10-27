import { useCallback, useState } from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Rating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/src/utils/haptics';

import UText from '@/src/components/core/text/uText';
import UInput from '@/src/components/core/inputs/uInput';
import UModal from '@/src/components/core/modals/uModal';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating?: number, review?: string) => void;
  initialRating?: number;
  initialReview?: string;
  bookTitle?: string;
}

const RATING_WORDS = ['Tap to rate', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

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

  const handleSubmit = useCallback(() => {
    haptics.medium();
    onSubmit(rating, review);
    onClose();
  }, [onSubmit, rating, review, onClose]);

  const handleRatingChange = useCallback((value: number) => {
    haptics.selection();
    setRating(Math.round(value * 2) / 2);
  }, []);

  return (
    <UModal visible={visible} onClose={onClose} tone="glow">
      <YStack
        pos="absolute"
        top={8}
        right={8}
        w={44}
        h={44}
        ai="center"
        jc="center"
        onPress={() => {
          haptics.light();
          onClose();
        }}
        pressStyle={{ opacity: 0.7 }}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <Ionicons name="close" size={20} color={getTokenValue('$textMuted', 'color')} />
      </YStack>

      <UText variant="display-l" fontSize={18} lineHeight={24} letterSpacing={0} color="$textPrimary" textAlign="center" mt={12} accessibilityRole="header">
        How was your experience?
      </UText>
      {bookTitle && (
        <UText variant="body" color="$textSecondary" textAlign="center">
          {bookTitle}
        </UText>
      )}

      <YStack ai="center" gap={10} my={8}>
        <Rating
          type="custom"
          imageSize={40}
          startingValue={rating}
          onFinishRating={handleRatingChange}
          ratingColor={getTokenValue('$gold', 'color')}
          ratingBackgroundColor="rgba(255,255,255,0.15)"
          // The library paints this behind each star, so it must match the card fill
          tintColor="#120E2A"
          style={{ alignSelf: 'center' }}
        />
        <XStack ai="center" gap={6}>
          <UText variant="display-m" color="$gold">
            {rating.toFixed(1)}
          </UText>
          <UText variant="body-s" color="$textMuted">
            · {RATING_WORDS[Math.ceil(rating)]}
          </UText>
        </XStack>
      </YStack>

      <YStack w="100%">
        <UInput
          variant="glass"
          label="Write a Review"
          placeholder="Share your thoughts..."
          value={review}
          onChangeText={setReview}
          multiline
        />
      </YStack>

      <NeonButton w="100%" mt={6} accessibilityLabel="Submit Review" onPress={handleSubmit} disabled={rating === 0} opacity={rating === 0 ? 0.5 : 1}>
        <XStack ai="center" gap={8}>
          <Ionicons name="star" size={16} color={getTokenValue('$textPrimary', 'color')} />
          <UText variant="label-button" color="$textPrimary">
            Submit Review
          </UText>
        </XStack>
      </NeonButton>
    </UModal>
  );
};

export default RatingModal;
