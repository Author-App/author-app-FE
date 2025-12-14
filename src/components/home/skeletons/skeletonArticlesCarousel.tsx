import { FlashList } from "@shopify/flash-list";
import { YStack } from "tamagui";
import USkeleton from "../../core/display/uSkeleton";

const SkeletonArticlesCarousel = ({ items = 5 }) => {
  return (
    <FlashList
      horizontal
      data={Array.from({ length: items })}
      keyExtractor={(_, i) => `article-skeleton-${i}`}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 4 }}
      renderItem={() => (
        <YStack width={110} alignItems="center" mx={8}>
          <USkeleton width={100} height={100} radius={50} />

          <USkeleton
            width={80}
            height={14}
            radius={4}
            mt={10}
          />
          <USkeleton
            width={70}
            height={14}
            radius={4}
            mt={6}
          />
        </YStack>
      )}
    />
  );
};

export default SkeletonArticlesCarousel;
