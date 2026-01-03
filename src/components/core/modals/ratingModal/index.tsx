import { memo, useState } from 'react';
import { XStack, YStack, Button, Input } from 'tamagui';
import { Rating } from 'react-native-ratings';
import UText from '@/src/components/core/text/uText';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import UInput from '../../inputs/uInput';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating?: number, review?: string) => void;
  initialRating?: number;
  initialReview?: string;
  allowRating?: boolean;
  allowReview?: boolean;
}

const RatingModal = ({
  visible,
  onClose,
  onSubmit,
  initialRating = 0,
  initialReview = '',
  allowRating = true,
  allowReview = true,
}: RatingModalProps) => {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);

  const handleSubmit = () => {
    onSubmit(allowRating ? rating : undefined, allowReview ? review : undefined);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <YStack
          flex={1}
          backgroundColor="rgba(0,0,0,0.5)"
          jc="center"
          ai="center"
          px={20}
        >
          <YStack
            backgroundColor="$white"
            borderRadius={15}
            p={20}
            width="100%"
            maxWidth={400}
          >
            <UText variant="heading-h1" mb={5} alignSelf='center'>
              {/* {allowRating && allowReview
              ? 'Rate & Review'
              : allowRating
                ? 'Rate'
                : 'Review'} */}
              Rate Book
            </UText>

            {allowRating && (
              <YStack mb={15}>
                <Rating
                  type="custom"
                  imageSize={30}
                  startingValue={rating}
                  onFinishRating={setRating}
                  ratingColor="#d4af37"
                  // ratingBackgroundColor="#e5e5e5"
                  style={{ alignSelf: 'center', marginVertical: 10 }}
                />
                {/* <UText variant="text-sm" color="$color10" textAlign="center">
                {rating} Stars
              </UText> */}
              </YStack>
            )}

            {allowReview && (
              <UInput
                placeholder="Write your review..."
                placeholderTextColor={'$black'}
                value={review}
                onChangeText={setReview}
                multiline
                height={100}
                borderColor="$neutral5"
                borderWidth={1}
                borderRadius={10}
                px={10}
                py={5}
                mb={15}
                textAlignVertical='top'
                color={'black'}


              />
              // <Input
              //   placeholder="Write your review..."
              //   value={review}
              //   onChangeText={setReview}
              //   multiline
              //   height={100}
              //   borderColor="$neutral5"
              //   borderWidth={1}
              //   borderRadius={10}
              //   px={10}
              //   py={5}
              //   mb={15}
              // />
            )}

            <UTextButton
              variant="primary-md"
              onPress={() => {
                if (rating === 0) return;
                handleSubmit();
              }}
              width={'30%'}
              // disabled={rating===0}
              alignSelf='center'
            >
              Submit
            </UTextButton>

            {/* <XStack justifyContent="flex-end" space={10}>
            <UTextButton
              variant="secondary-md"
              onPress={onClose}
            >
              Cancel
            </UTextButton>
            <UTextButton
              variant="primary-md"
              onPress={handleSubmit}
            >
              Submit
            </UTextButton>
          </XStack> */}
          </YStack>
        </YStack>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default memo(RatingModal);
