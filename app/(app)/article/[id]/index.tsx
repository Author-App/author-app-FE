import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground';
import UText from '@/src/components/core/text/uText';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, ScrollView, useWindowDimensions } from 'react-native';
import { YStack } from 'tamagui';
import Markdown from 'react-native-markdown-display';
import { useGetArticleDetailQuery } from '@/src/redux2/Apis/Articles';

const ArticleScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetArticleDetailQuery(id!, {
    skip: !id,
  });

  console.log("ARTICLE", data);

  const article = data?.data;

  if (isLoading) {
    return (
      <YStack flex={1} jc="center" ai="center">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (isError || !article) {
    return (
      <YStack flex={1} backgroundColor="$bg2">
        <UHeaderWithBackground title="Article" showBackButton />
        <YStack flex={1} jc="center" ai="center" px={20}>
          <UText textAlign="center" color="$red10">
            Failed to load article.
          </UText>
          <UText onPress={refetch} color="$primary" mt={10}>
            Tap to retry
          </UText>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$bg2">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <UHeaderWithBackground title="Article" showBackButton />

        <YStack
          width="90%"
          alignSelf="center"
          backgroundColor="$bg2"
          borderRadius={16}
          top={-15}
          px={16}
          py={16}
        >

          <Markdown
            onLinkPress={(url) => {
              Linking.openURL(url);
              return false;
            }}
          >
            {article.content}
          </Markdown>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default ArticleScreen;
