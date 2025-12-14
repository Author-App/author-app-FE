import { FlashList } from "@shopify/flash-list";
import { YStack } from "tamagui";
import USkeleton from "../../core/display/uSkeleton";

const SkeletonBooksCarousel = ({ items = 5 }) => (
  <FlashList
    horizontal
    data={Array.from({ length: items })}
    keyExtractor={(_, i) => `book-skeleton-${i}`}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 4 }}
    renderItem={() => (
      <YStack
        width={115}
        height={167}
        marginRight={10}
        borderRadius={15}
        padding={4}
      >
        <USkeleton width={100} height={90} radius={15} />

        <USkeleton width={100} height={16} radius={4} mt={10} />
        <USkeleton width={80} height={14} radius={4} mt={6} />
      </YStack>
    )}
  />
);

export default SkeletonBooksCarousel;
