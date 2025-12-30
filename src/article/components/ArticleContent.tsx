import React, { useMemo } from 'react';
import { Linking } from 'react-native';
import { YStack, getTokenValue } from 'tamagui';
import Markdown from 'react-native-markdown-display';

interface ArticleContentProps {
  content: string;
}

// Create markdown styles using Tamagui tokens
function useMarkdownStyles() {
  return useMemo(() => {
    const white = getTokenValue('$white', 'color') as string;
    const brandTeal = getTokenValue('$brandTeal', 'color') as string;
    const neutral3 = getTokenValue('$neutral3', 'color') as string; // paragraph text
    const neutral1 = getTokenValue('$neutral1', 'color') as string; // lighter text

    return {
      body: {
        color: neutral1,
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Adamina',
      },
      heading1: {
        color: white,
        fontSize: 24,
        fontWeight: '700' as const,
        fontFamily: 'Adamina',
        marginTop: 24,
        marginBottom: 12,
      },
      heading2: {
        color: white,
        fontSize: 20,
        fontWeight: '600' as const,
        fontFamily: 'Adamina',
        marginTop: 20,
        marginBottom: 10,
      },
      heading3: {
        color: white,
        fontSize: 18,
        fontWeight: '600' as const,
        fontFamily: 'Adamina',
        marginTop: 16,
        marginBottom: 8,
      },
      paragraph: {
        color: neutral3,
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Adamina',
        marginBottom: 16,
      },
      link: {
        color: brandTeal,
        textDecorationLine: 'underline' as const,
      },
      blockquote: {
        backgroundColor: `${brandTeal}1A`, // 10% opacity
        borderLeftColor: brandTeal,
        borderLeftWidth: 4,
        paddingLeft: 16,
        paddingVertical: 8,
        marginVertical: 16,
      },
      code_inline: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: brandTeal,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontFamily: 'monospace',
      },
      code_block: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: neutral1,
        padding: 16,
        borderRadius: 8,
        marginVertical: 16,
        fontFamily: 'monospace',
      },
      fence: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: neutral1,
        padding: 16,
        borderRadius: 8,
        marginVertical: 16,
        fontFamily: 'monospace',
      },
      list_item: {
        color: neutral3,
        fontFamily: 'Adamina',
        marginBottom: 8,
      },
      bullet_list: {
        marginVertical: 12,
      },
      ordered_list: {
        marginVertical: 12,
      },
      hr: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        height: 1,
        marginVertical: 24,
      },
      image: {
        borderRadius: 12,
        marginVertical: 16,
      },
      strong: {
        color: white,
        fontWeight: '600' as const,
      },
      em: {
        color: neutral3,
        fontStyle: 'italic' as const,
      },
    };
  }, []);
}

export function ArticleContent({ content }: ArticleContentProps) {
  const markdownStyles = useMarkdownStyles();

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
    return false;
  };

  return (
    <YStack>
      <Markdown
        style={markdownStyles}
        onLinkPress={handleLinkPress}
      >
        {content}
      </Markdown>
    </YStack>
  );
}
