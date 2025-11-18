import UDropdown from '@/src/components/core/dropdowns/uDropdown';
import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground';
import UText from '@/src/components/core/text/uText';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, useWindowDimensions } from 'react-native';
import { XStack, YStack } from 'tamagui';
import RenderHtml from 'react-native-render-html';

const dummyHtml = `
  <!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: -apple-system, Roboto, "Helvetica Neue", Arial; color: #2b2b2b; line-height: 1.5; padding: 0 12px; }
      h1 { font-size: 22px; margin: 8px 0 12px; color: #2b2b2b; }
      h2 { font-size: 18px; margin: 12px 0 8px; color: #3a3a3a; }
      p { margin: 8px 0; font-size: 15px; }
      ul { margin: 8px 0 12px 18px; }
      li { margin-bottom: 6px; }
      mark { background: #FFF59D; padding: 0 4px; border-radius: 3px; }
      .lead { color: #6b5a3c; font-size: 16px; margin-bottom: 10px; }
      blockquote { border-left: 3px solid #D9C3A3; padding-left: 12px; color: #6b6b6b; margin: 10px 0; background: rgba(217,195,163,0.06); border-radius: 6px; }
      pre { background: #1e1e1e; color: #f5f5f5; padding: 12px; border-radius: 6px; overflow: auto; }
      code { font-family: monospace; font-size: 13px; color: #e6e6e6; }
      img { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; }
      a { color: #8F714F; text-decoration: none; font-weight: 600; }
      .highlighted-points { background: rgba(235,224,210,0.5); padding: 10px; border-radius: 8px; margin: 10px 0; }
    </style>
  </head>
  <body>
    <h1>The Future of Creative Writing</h1>
    <p class="lead">How technology and culture are shaping storytelling in the next decade.</p>

    <div class="highlighted-points">
      <h2>Key Takeaways</h2>
      <ul>
        <li><mark>AI-assisted drafting</mark> will become a standard part of the author workflow.</li>
        <li>Focus on <mark>human voice</mark> and editorial craft to stand out.</li>
        <li>New formats — short interactive serials & multimedia articles — will rise.</li>
      </ul>
    </div>

    <h2>Overview</h2>
    <p>Authors are using tools that speed up idea generation. The role of an editor becomes more important in maintaining distinct tone and quality. Examples below:</p>

    <blockquote>
      "The best writing in the future will be a collaboration between clear human intent and fast machine assistance."
    </blockquote>

    <h2>Further reading</h2>
    <p>Read more on how creative workflows are changing on <a href="https://example.com">our blog</a>.</p>

    <p style="font-size:13px; color:#8f8f8f;">Published on: January 5, 2025</p>
  </body>
  </html>
`;

// const dummyHtml = `
//   <!doctype html>
//   <html>
//   <head>
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <style>
//       body { font-family: -apple-system, Roboto, "Helvetica Neue", Arial; color: #2b2b2b; line-height: 1.5; padding: 0 12px; }
//       h1 { font-size: 22px; margin: 8px 0 12px; color: #2b2b2b; }
//       h2 { font-size: 18px; margin: 12px 0 8px; color: #3a3a3a; }
//       p { margin: 8px 0; font-size: 15px; }
//       ul { margin: 8px 0 12px 18px; }
//       li { margin-bottom: 6px; }
//       mark { background: #FFF59D; padding: 0 4px; border-radius: 3px; }
//       .lead { color: #6b5a3c; font-size: 16px; margin-bottom: 10px; }
//       blockquote { border-left: 3px solid #D9C3A3; padding-left: 12px; color: #6b6b6b; margin: 10px 0; background: rgba(217,195,163,0.06); border-radius: 6px; }
//       pre { background: #1e1e1e; color: #f5f5f5; padding: 12px; border-radius: 6px; overflow: auto; }
//       code { font-family: monospace; font-size: 13px; color: #e6e6e6; }
//       img { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; }
//       a { color: #8F714F; text-decoration: none; font-weight: 600; }
//       .highlighted-points { background: rgba(235,224,210,0.5); padding: 10px; border-radius: 8px; margin: 10px 0; }
//     </style>
//   </head>
//   <body>
//     <h1>The Future of Creative Writing</h1>
//     <p class="lead">How technology and culture are shaping storytelling in the next decade.</p>

//     <div class="highlighted-points">
//       <h2>Key Takeaways</h2>
//       <ul>
//         <li><mark>AI-assisted drafting</mark> will become a standard part of the author workflow.</li>
//         <li>Focus on <mark>human voice</mark> and editorial craft to stand out.</li>
//         <li>New formats — short interactive serials & multimedia articles — will rise.</li>
//       </ul>
//     </div>

//     <h2>Overview</h2>
//     <p>Authors are using tools that speed up idea generation. The role of an editor becomes more important in maintaining distinct tone and quality. Examples below:</p>

//     <img src="https://picsum.photos/800/400" alt="Article illustrative" />

//     <blockquote>
//       "The best writing in the future will be a collaboration between clear human intent and fast machine assistance."
//     </blockquote>

//     <h2>Short example snippet</h2>
//     <pre><code>
//     // sample pseudo-code for an author assistant
//     const idea = await ai.suggest('plot for a short story about time travel');
//     const outline = ai.expand(idea);
//     editor.review(outline);
//     </code></pre>

//     <h2>Further reading</h2>
//     <p>Read more on how creative workflows are changing on <a href="https://example.com">our blog</a>.</p>

//     <p style="font-size:13px; color:#8f8f8f;">Published on: January 5, 2025</p>
//   </body>
//   </html>
// `;


const ArticleScreen = () => {
    const { id } = useLocalSearchParams();

    console.log("THIS IS ARTCLES FROM ID", id);
    const { width } = useWindowDimensions();

    const [html, setHtml] = useState<string>('');

    // simulate fetching HTML from backend on mount
    useEffect(() => {
        // simulate network delay
        const t = setTimeout(() => {
            setHtml(dummyHtml);
        }, 250);
        return () => clearTimeout(t);
    }, [id]);

    // handle link presses
    const onLinkPress = (_evt: any, href: string) => {
        if (href) Linking.openURL(href);
    };

    return (
        <YStack flex={1} backgroundColor={'$bg2'}>
            {/* ✅ ScrollView should contain everything */}
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* ✅ Header Section */}
                <YStack>
                    <UHeaderWithBackground title="Article" showBackButton={true} />
                </YStack>

                {/* ✅ Floating card that starts at the bottom of header */}
                <YStack
                    width="90%"
                    alignSelf="center"
                    backgroundColor={'$bg2'}
                    borderRadius={16}
                    position="relative"
                    // top={-30} // 👈 Pull it upward to overlap the bottom of the header
                    top={-15} // 👈 Pull it upward to overlap the bottom of the header

                    px={16}
                    py={16}
                >
                    {html ? (
                        <RenderHtml
                            contentWidth={Math.max(320, width - 64)}
                            source={{ html }}
                            baseStyle={{
                                color: '#2b2b2b',
                                fontFamily: 'Adamina',
                            }}

                            tagsStyles={{
                                h1: {
                                    color: '#1a1a1a',
                                    fontSize: 26,
                                    fontWeight: '700',
                                    marginTop: 12,
                                    marginBottom: 8,
                                    lineHeight: 32,
                                    fontFamily: 'Adamina',
                                },
                                h2: {
                                    color: '#2b2b2b',
                                    fontSize: 20,
                                    fontWeight: '600',
                                    marginTop: 14,
                                    marginBottom: 6,
                                    lineHeight: 28,
                                    fontFamily: 'Adamina',
                                },
                                p: {
                                    fontSize: 15,
                                    color: '#333',
                                    marginVertical: 6,
                                    lineHeight: 22,
                                    fontFamily: 'Adamina',
                                },
                                blockquote: {
                                    fontFamily: 'Adamina',
                                    backgroundColor: 'rgba(217,195,163,0.06)',
                                    borderLeftWidth: 4,
                                    borderLeftColor: '#D9C3A3',
                                    paddingLeft: 12,
                                    marginVertical: 8,
                                },
                                pre: {
                                    backgroundColor: '#1e1e1e',
                                    color: '#f5f5f5',
                                    padding: 12,
                                    borderRadius: 6,
                                },
                                img: {
                                    borderRadius: 8,
                                    marginVertical: 8,
                                },
                                a: {
                                    fontFamily: 'Adamina',
                                    color: '#8F714F',
                                    textDecorationLine: 'none',
                                    fontWeight: '600',
                                },
                                mark: {
                                    backgroundColor: '#FFF59D',
                                    paddingHorizontal: 4,
                                    borderRadius: 3,
                                },
                            }}

                            // tagsStyles={{
                            //     mark: { backgroundColor: '#FFF59D', paddingHorizontal: 4, borderRadius: 3 },
                            //     h1: { color: '#2b2b2b', marginBottom: 6, fontFamily: 'Adamina' },
                            //     h2: { color: '#3a3a3a', marginTop: 10, marginBottom: 6, fontFamily: 'Adamina' },
                            //     p: { marginVertical: 6, fontSize: 15, color: '#333', fontFamily: 'Adamina' },
                            //     blockquote: {
                            //         fontFamily: 'Adamina',
                            //         backgroundColor: 'rgba(217,195,163,0.06)',
                            //         borderLeftWidth: 4,
                            //         borderLeftColor: '#D9C3A3',
                            //         paddingLeft: 12,
                            //         marginVertical: 8,
                            //     },
                            //     pre: { backgroundColor: '#1e1e1e', color: '#f5f5f5', padding: 12, borderRadius: 6 },
                            //     img: { borderRadius: 8, marginVertical: 8 },
                            //     a: {
                            //         fontFamily: 'Adamina',
                            //         color: '#8F714F',
                            //         textDecorationLine: 'none',
                            //         fontWeight: '600',
                            //     },
                            // }}
                            onLinkPress={onLinkPress}
                            renderersProps={{
                                img: { enableExperimentalPercentWidth: true },
                            }}
                        />
                    ) : (
                        <UText color="$neutral7">Loading article…</UText>
                    )}
                </YStack>
            </ScrollView>
        </YStack>
    );

    return (
        <YStack flex={1} backgroundColor={'$bg2'}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* 👇 Move the header inside the ScrollView */}
                <YStack position="relative" mb={20}>
                    <UHeaderWithBackground title="Article" showBackButton={true} />

                    <YStack
                        width="95%"
                        alignSelf="center"
                        borderRadius={13}
                        overflow="visible"
                        position="absolute"
                        bottom={-10}
                        zIndex={999}
                        backgroundColor={'$bg2'}
                        px={5}

                    // py={10}
                    >
                        {/* <XStack jc="space-between" width="100%">
                            <UText>HELLO WORLD</UText>
                            <UText>HELLO WORLD</UText>
                        </XStack> */}
                    </YStack>
                </YStack>

                <YStack px={16}>
                    {html ? (
                        <RenderHtml
                            contentWidth={Math.max(320, width - 32)}
                            source={{ html }}
                            baseStyle={{
                                color: '#2b2b2b',
                                fontFamily: 'Adamina'
                            }}
                            tagsStyles={{
                                mark: { backgroundColor: '#FFF59D', paddingHorizontal: 4, borderRadius: 3 },
                                h1: { color: '#2b2b2b', marginBottom: 6, fontFamily: 'Adamina' },
                                h2: { color: '#3a3a3a', marginTop: 10, marginBottom: 6, fontFamily: 'Adamina' },
                                p: { marginVertical: 6, fontSize: 15, color: '#333', fontFamily: 'Adamina' },
                                blockquote: { fontFamily: 'Adamina', backgroundColor: 'rgba(217,195,163,0.06)', borderLeftWidth: 4, borderLeftColor: '#D9C3A3', paddingLeft: 12, marginVertical: 8 },
                                pre: { backgroundColor: '#1e1e1e', color: '#f5f5f5', padding: 12, borderRadius: 6 },
                                img: { borderRadius: 8, marginVertical: 8 },
                                a: { fontFamily: 'Adamina', color: '#8F714F', textDecorationLine: 'none', fontWeight: '600' },
                            }}
                            onLinkPress={onLinkPress}
                            renderersProps={{
                                img: { enableExperimentalPercentWidth: true },
                            }}
                        />
                    ) : (
                        <UText color="$neutral7">Loading article…</UText>
                    )}
                </YStack>
            </ScrollView>
        </YStack>
    );

}

export default ArticleScreen;