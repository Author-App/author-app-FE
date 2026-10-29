import React, { useMemo } from 'react';
import { Linking } from 'react-native';
import { YStack, getTokenValue } from 'tamagui';
import Markdown from 'react-native-markdown-display';

interface ArticleContentProps {
  content: string;
}

// The reading surface spec: Inter 17/28 on #05030C, Inter headings (never Orbitron in long-form),
// cyan underlined links, a 2pt purple rule on blockquotes, 18pt between paragraphs
function useMarkdownStyles() {
  return useMemo(() => {
    const text = getTokenValue('$textReading', 'color') as string;
    const white = getTokenValue('$textPrimary', 'color') as string;
    const muted = getTokenValue('$textMuted', 'color') as string;
    const cyan = getTokenValue('$accentCyan', 'color') as string;
    const purple = getTokenValue('$glowPurple', 'color') as string;
    const body = { color: text, fontSize: 17, lineHeight: 28, fontFamily: 'Inter' };
    const heading = { color: white, fontFamily: 'Inter-Bold', marginTop: 8, marginBottom: 18 };

    return {
      body,
      paragraph: { ...body, marginTop: 0, marginBottom: 18 },
      heading1: { ...heading, fontSize: 24, lineHeight: 30 },
      heading2: { ...heading, fontSize: 21, lineHeight: 28 },
      heading3: { ...heading, fontSize: 18, lineHeight: 26 },
      link: { color: cyan, textDecorationLine: 'underline' as const },
      blockquote: {
        backgroundColor: 'transparent',
        borderLeftColor: purple,
        borderLeftWidth: 2,
        paddingLeft: 18,
        paddingVertical: 4,
        marginLeft: 0,
        marginVertical: 4,
      },
      // ponytail: Inter italic is not bundled, so iOS shows the upright face. Add Inter-Italic.ttf if quotes need it.
      em: { fontStyle: 'italic' as const },
      strong: { fontFamily: 'Inter-Bold', color: white },
      bullet_list: { marginBottom: 18 },
      ordered_list: { marginBottom: 18 },
      list_item: { ...body, marginBottom: 6 },
      bullet_list_icon: { color: cyan, fontSize: 17, lineHeight: 28 },
      ordered_list_icon: { color: cyan, fontSize: 17, lineHeight: 28 },
      image: { borderRadius: 16, marginVertical: 8 },
      hr: { backgroundColor: 'rgba(255,255,255,0.1)', height: 1, marginVertical: 24 },
      code_inline: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: cyan,
        paddingHorizontal: 6,
        borderRadius: 4,
        fontFamily: 'Menlo',
      },
      code_block: { backgroundColor: 'rgba(255,255,255,0.05)', color: muted, padding: 16, borderRadius: 12, fontFamily: 'Menlo' },
      fence: { backgroundColor: 'rgba(255,255,255,0.05)', color: muted, padding: 16, borderRadius: 12, fontFamily: 'Menlo' },
    };
  }, []);
}

// The CMS underline button inserts raw <u>…</u>. Markdown has no underline and this
// renderer shows HTML as text, so keep the words and drop the tags. Underline also reads
// as a link on a phone, and links are the only underlined text in the design.
const stripUnderlineTags = (markdown: string) => markdown.replace(/<\/?u>/gi, '');

export function ArticleContent({ content }: ArticleContentProps) {
  const markdownStyles = useMarkdownStyles();
  const markdown = useMemo(() => stripUnderlineTags(content), [content]);

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
        {markdown}
      </Markdown>
    </YStack>
  );
}
