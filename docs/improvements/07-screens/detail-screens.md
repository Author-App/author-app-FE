# Detail Screens Improvements

## Current Locations
- Book Detail: `app/(app)/bookDetail/index.tsx`
- Podcast Detail: `app/(app)/podcastDetail/index.tsx`
- Video Detail: `app/(app)/videoDetails/index.tsx`
- Event Detail: `app/(app)/eventDetails/index.tsx`
- Blog/Article Detail: `app/(app)/blogDetails/index.tsx`

## Common Problems Across Detail Screens

1. No skeleton loading
2. Error messages use `alert()`
3. No offline handling
4. Share functionality missing
5. Bookmark/favorite not intuitive
6. No related content
7. Reviews/ratings not prominent
8. Purchase flow may feel clunky
9. Missing breadcrumbs/back navigation context

## Book Detail Improvements

### 1. Book Detail Header

```tsx
// src/components/bookDetail/bookHeader.tsx
import React, { useState } from 'react';
import { Dimensions, Share } from 'react-native';
import { YStack, XStack, Text, Image } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Bookmark, 
  Star 
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useHaptics } from '@/src/hooks/useHaptics';

const { width } = Dimensions.get('window');

interface BookHeaderProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    rating: number;
    reviewCount: number;
  };
  isBookmarked: boolean;
  onBookmarkPress: () => void;
}

export const BookHeader = React.memo(({
  book,
  isBookmarked,
  onBookmarkPress,
}: BookHeaderProps) => {
  const haptics = useHaptics();
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = async () => {
    haptics.lightTap();
    try {
      await Share.share({
        message: `Check out "${book.title}" by ${book.author}`,
        url: `https://app.example.com/book/${book.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLike = () => {
    haptics.mediumTap();
    setIsLiked(!isLiked);
  };

  return (
    <YStack>
      {/* Background Cover (Blurred) */}
      <YStack height={280} position="relative">
        <Image
          source={{ uri: book.coverUrl }}
          width={width}
          height={280}
          resizeMode="cover"
          style={{ position: 'absolute' }}
          blurRadius={20}
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(255,255,255,1)']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Top Actions */}
        <XStack
          paddingHorizontal="$4"
          paddingTop="$12"
          justifyContent="space-between"
        >
          <UPressableButton
            onPress={() => router.back()}
            hapticType="light"
          >
            <YStack
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor="rgba(255,255,255,0.9)"
              alignItems="center"
              justifyContent="center"
            >
              <ArrowLeft size={20} color="#1F2937" />
            </YStack>
          </UPressableButton>

          <XStack gap="$2">
            <UPressableButton onPress={handleLike} hapticType="medium">
              <YStack
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="rgba(255,255,255,0.9)"
                alignItems="center"
                justifyContent="center"
              >
                <Heart
                  size={20}
                  color={isLiked ? '#EF4444' : '#1F2937'}
                  fill={isLiked ? '#EF4444' : 'none'}
                />
              </YStack>
            </UPressableButton>

            <UPressableButton onPress={handleShare} hapticType="light">
              <YStack
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="rgba(255,255,255,0.9)"
                alignItems="center"
                justifyContent="center"
              >
                <Share2 size={20} color="#1F2937" />
              </YStack>
            </UPressableButton>
          </XStack>
        </XStack>
      </YStack>

      {/* Book Cover */}
      <YStack alignItems="center" marginTop={-100}>
        <Image
          source={{ uri: book.coverUrl }}
          width={160}
          height={240}
          borderRadius={8}
          shadowColor="rgba(0,0,0,0.25)"
          shadowOffset={{ width: 0, height: 8 }}
          shadowOpacity={1}
          shadowRadius={16}
          accessibilityLabel={`Cover of ${book.title}`}
        />

        {/* Bookmark Badge */}
        <UPressableButton
          onPress={onBookmarkPress}
          hapticType="medium"
          style={{
            position: 'absolute',
            top: 8,
            right: -8,
          }}
        >
          <YStack
            width={36}
            height={36}
            borderRadius={18}
            backgroundColor={isBookmarked ? '$primary7' : 'white'}
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor={isBookmarked ? '$primary7' : '$neutral4'}
          >
            <Bookmark
              size={18}
              color={isBookmarked ? 'white' : '#6B7280'}
              fill={isBookmarked ? 'white' : 'none'}
            />
          </YStack>
        </UPressableButton>
      </YStack>

      {/* Title & Author */}
      <YStack alignItems="center" paddingHorizontal="$6" marginTop="$4" gap="$1">
        <Text
          fontSize={22}
          fontWeight="700"
          textAlign="center"
          color="$neutral12"
          numberOfLines={2}
        >
          {book.title}
        </Text>
        <Text fontSize={15} color="$neutral9">
          by {book.author}
        </Text>

        {/* Rating */}
        <XStack alignItems="center" gap="$2" marginTop="$2">
          <XStack alignItems="center" gap="$1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                color="#F59E0B"
                fill={star <= Math.round(book.rating) ? '#F59E0B' : 'none'}
              />
            ))}
          </XStack>
          <Text fontSize={14} color="$neutral9">
            {book.rating.toFixed(1)} ({book.reviewCount} reviews)
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
});
```

### 2. Book Info Pills

```tsx
// src/components/bookDetail/bookInfoPills.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack, Text } from 'tamagui';
import { Book, Clock, Calendar, Languages } from 'lucide-react-native';

interface BookInfoPillsProps {
  pages: number;
  duration: string;
  publishedDate: string;
  language: string;
}

export const BookInfoPills = React.memo(({
  pages,
  duration,
  publishedDate,
  language,
}: BookInfoPillsProps) => {
  const pills = [
    { icon: Book, label: `${pages} pages` },
    { icon: Clock, label: duration },
    { icon: Calendar, label: publishedDate },
    { icon: Languages, label: language },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 12,
      }}
    >
      {pills.map((pill, index) => (
        <XStack
          key={index}
          paddingHorizontal="$3"
          paddingVertical="$2"
          backgroundColor="$neutral2"
          borderRadius={20}
          alignItems="center"
          gap="$2"
        >
          <pill.icon size={14} color="#6B7280" />
          <Text fontSize={13} color="$neutral11">
            {pill.label}
          </Text>
        </XStack>
      ))}
    </ScrollView>
  );
});
```

### 3. Purchase/Download CTA

```tsx
// src/components/bookDetail/purchaseCTA.tsx
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { Download, Play, Lock, Check } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

interface PurchaseCTAProps {
  status: 'not-owned' | 'owned' | 'downloading' | 'downloaded';
  price: number;
  currency?: string;
  onPurchase: () => void;
  onDownload: () => void;
  onPlay: () => void;
  downloadProgress?: number;
  isPurchasing?: boolean;
}

export const PurchaseCTA = React.memo(({
  status,
  price,
  currency = '$',
  onPurchase,
  onDownload,
  onPlay,
  downloadProgress = 0,
  isPurchasing = false,
}: PurchaseCTAProps) => {
  const getButtonConfig = () => {
    switch (status) {
      case 'not-owned':
        return {
          text: isPurchasing ? 'Processing...' : `Buy for ${currency}${price.toFixed(2)}`,
          icon: Lock,
          onPress: onPurchase,
          disabled: isPurchasing,
          variant: 'primary' as const,
        };
      case 'owned':
        return {
          text: 'Download',
          icon: Download,
          onPress: onDownload,
          disabled: false,
          variant: 'secondary' as const,
        };
      case 'downloading':
        return {
          text: `Downloading ${downloadProgress}%`,
          icon: Download,
          onPress: () => {},
          disabled: true,
          variant: 'secondary' as const,
        };
      case 'downloaded':
        return {
          text: 'Read Now',
          icon: Play,
          onPress: onPlay,
          disabled: false,
          variant: 'primary' as const,
        };
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  return (
    <YStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      paddingHorizontal="$4"
      paddingVertical="$4"
      paddingBottom="$6"
      backgroundColor="white"
      borderTopWidth={1}
      borderTopColor="$neutral3"
    >
      {status === 'downloading' && (
        <YStack
          height={3}
          backgroundColor="$neutral3"
          borderRadius={2}
          marginBottom="$3"
          overflow="hidden"
        >
          <YStack
            width={`${downloadProgress}%`}
            height={3}
            backgroundColor="$primary7"
          />
        </YStack>
      )}

      <UPressableButton
        onPress={config.onPress}
        disabled={config.disabled}
        hapticType="medium"
      >
        <XStack
          paddingVertical="$4"
          paddingHorizontal="$6"
          borderRadius={12}
          backgroundColor={config.variant === 'primary' ? '$primary7' : '$neutral2'}
          justifyContent="center"
          alignItems="center"
          gap="$2"
          opacity={config.disabled ? 0.7 : 1}
        >
          <Icon
            size={20}
            color={config.variant === 'primary' ? 'white' : '#B4975A'}
          />
          <Text
            fontSize={16}
            fontWeight="600"
            color={config.variant === 'primary' ? 'white' : '$primary7'}
          >
            {config.text}
          </Text>
        </XStack>
      </UPressableButton>
    </YStack>
  );
});
```

### 4. Expandable Description

```tsx
// src/components/shared/expandableText.tsx
import React, { useState, useCallback } from 'react';
import { YStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface ExpandableTextProps {
  text: string;
  numberOfLines?: number;
  title?: string;
}

export const ExpandableText = React.memo(({
  text,
  numberOfLines = 4,
  title = 'Description',
}: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);

  const onTextLayout = useCallback((e: any) => {
    if (!needsExpansion && e.nativeEvent.lines.length > numberOfLines) {
      setNeedsExpansion(true);
    }
  }, [numberOfLines, needsExpansion]);

  return (
    <YStack paddingHorizontal="$4" gap="$2">
      <Text fontSize={16} fontWeight="600" color="$neutral12">
        {title}
      </Text>
      
      <Text
        fontSize={14}
        lineHeight={22}
        color="$neutral11"
        numberOfLines={isExpanded ? undefined : numberOfLines}
        onTextLayout={onTextLayout}
      >
        {text}
      </Text>

      {needsExpansion && (
        <UPressableButton
          onPress={() => setIsExpanded(!isExpanded)}
          hapticType="light"
        >
          <Text fontSize={14} color="$primary7" fontWeight="500">
            {isExpanded ? 'Show less' : 'Read more'}
          </Text>
        </UPressableButton>
      )}
    </YStack>
  );
});
```

### 5. Related Content Section

```tsx
// src/components/shared/relatedContent.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { YStack, XStack, Text, Image } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';

interface RelatedItem {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}

interface RelatedContentProps {
  title?: string;
  items: RelatedItem[];
  onItemPress: (item: RelatedItem) => void;
}

export const RelatedContent = React.memo(({
  title = 'You May Also Like',
  items,
  onItemPress,
}: RelatedContentProps) => {
  if (items.length === 0) return null;

  const renderItem = ({ item }: { item: RelatedItem }) => (
    <UPressableButton
      onPress={() => onItemPress(item)}
      hapticType="light"
      style={{ marginRight: 12 }}
    >
      <YStack width={100}>
        <Image
          source={{ uri: item.coverUrl }}
          width={100}
          height={150}
          borderRadius={6}
        />
        <Text
          fontSize={12}
          fontWeight="500"
          color="$neutral12"
          numberOfLines={2}
          marginTop="$1.5"
        >
          {item.title}
        </Text>
        <Text fontSize={11} color="$neutral9" numberOfLines={1}>
          {item.author}
        </Text>
      </YStack>
    </UPressableButton>
  );

  return (
    <YStack gap="$3" marginTop="$4">
      <Text
        fontSize={16}
        fontWeight="600"
        color="$neutral12"
        paddingHorizontal="$4"
      >
        {title}
      </Text>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </YStack>
  );
});
```

### 6. Reviews Section

```tsx
// src/components/shared/reviewsSection.tsx
import React from 'react';
import { YStack, XStack, Text, Avatar } from 'tamagui';
import { Star, ChevronRight } from 'lucide-react-native';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  text: string;
}

interface ReviewsSectionProps {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  onSeeAllPress: () => void;
  onWriteReviewPress: () => void;
}

const ReviewCard = React.memo(({ review }: { review: Review }) => (
  <YStack
    backgroundColor="$neutral2"
    borderRadius={12}
    padding="$3"
    gap="$2"
  >
    <XStack alignItems="center" gap="$2">
      <Avatar circular size="$3">
        {review.userAvatar ? (
          <Avatar.Image src={review.userAvatar} />
        ) : (
          <Avatar.Fallback backgroundColor="$primary7">
            <Text color="white" fontSize={12}>
              {review.userName.charAt(0)}
            </Text>
          </Avatar.Fallback>
        )}
      </Avatar>
      
      <YStack flex={1}>
        <Text fontSize={13} fontWeight="600" color="$neutral12">
          {review.userName}
        </Text>
        <Text fontSize={11} color="$neutral8">
          {review.date}
        </Text>
      </YStack>

      <XStack alignItems="center" gap="$1">
        <Star size={12} color="#F59E0B" fill="#F59E0B" />
        <Text fontSize={12} fontWeight="600" color="$neutral11">
          {review.rating}
        </Text>
      </XStack>
    </XStack>

    <Text fontSize={13} color="$neutral11" numberOfLines={3}>
      {review.text}
    </Text>
  </YStack>
));

export const ReviewsSection = React.memo(({
  averageRating,
  totalReviews,
  reviews,
  onSeeAllPress,
  onWriteReviewPress,
}: ReviewsSectionProps) => {
  return (
    <YStack paddingHorizontal="$4" gap="$4">
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center">
        <YStack>
          <Text fontSize={16} fontWeight="600" color="$neutral12">
            Reviews
          </Text>
          <XStack alignItems="center" gap="$1" marginTop="$1">
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text fontSize={14} fontWeight="600" color="$neutral11">
              {averageRating.toFixed(1)}
            </Text>
            <Text fontSize={13} color="$neutral9">
              ({totalReviews} reviews)
            </Text>
          </XStack>
        </YStack>

        <UPressableButton onPress={onWriteReviewPress} hapticType="light">
          <XStack
            paddingHorizontal="$3"
            paddingVertical="$2"
            backgroundColor="$primary2"
            borderRadius={8}
          >
            <Text fontSize={13} color="$primary7" fontWeight="500">
              Write Review
            </Text>
          </XStack>
        </UPressableButton>
      </XStack>

      {/* Reviews */}
      <YStack gap="$3">
        {reviews.slice(0, 3).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </YStack>

      {/* See All */}
      {totalReviews > 3 && (
        <UPressableButton onPress={onSeeAllPress} hapticType="light">
          <XStack
            justifyContent="center"
            alignItems="center"
            gap="$1"
            paddingVertical="$2"
          >
            <Text fontSize={14} color="$primary7" fontWeight="500">
              See All {totalReviews} Reviews
            </Text>
            <ChevronRight size={16} color="#B4975A" />
          </XStack>
        </UPressableButton>
      )}
    </YStack>
  );
});
```

## Complete Detail Screen Structure

```tsx
// app/(app)/bookDetail/index.tsx
<YStack flex={1} backgroundColor="$background">
  <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
    {isLoading ? (
      <BookDetailSkeleton />
    ) : (
      <>
        <BookHeader
          book={book}
          isBookmarked={isBookmarked}
          onBookmarkPress={handleBookmark}
        />

        <BookInfoPills
          pages={book.pages}
          duration={book.duration}
          publishedDate={book.publishedDate}
          language={book.language}
        />

        <ExpandableText text={book.description} />

        <ReviewsSection
          averageRating={book.rating}
          totalReviews={book.reviewCount}
          reviews={book.reviews}
          onSeeAllPress={() => {}}
          onWriteReviewPress={() => {}}
        />

        <RelatedContent
          items={relatedBooks}
          onItemPress={handleRelatedPress}
        />
      </>
    )}
  </ScrollView>

  <PurchaseCTA
    status={purchaseStatus}
    price={book.price}
    onPurchase={handlePurchase}
    onDownload={handleDownload}
    onPlay={handlePlay}
    downloadProgress={downloadProgress}
    isPurchasing={isPurchasing}
  />
</YStack>
```

## Testing Checklist

- [ ] Skeleton loading on initial load
- [ ] Share button opens share sheet
- [ ] Bookmark toggles with animation
- [ ] Like/Heart animates
- [ ] Star ratings display correctly
- [ ] Info pills scroll horizontally
- [ ] Description expands/collapses
- [ ] Purchase flow handles all states
- [ ] Download progress shows
- [ ] Related content scrolls
- [ ] Reviews show correctly
- [ ] Back navigation works
- [ ] All touch targets 44x44 minimum
- [ ] Haptic feedback on interactions
