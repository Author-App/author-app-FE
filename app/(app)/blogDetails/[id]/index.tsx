import React from "react";
import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
import UText from "@/src/components/core/text/uText";
import { exploreData } from "@/src/data/exploreData";
import { logOut } from "@/src/redux/Slice/AuthSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, useWindowDimensions, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { useDispatch } from "react-redux";
import { XStack, YStack } from "tamagui";

const BlogDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  // ✅ Find the blog post by ID
  const blogSection = exploreData.find((item) => item.id === "blog");
  const blog = blogSection?.data.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <YStack f={1} ai="center" jc="center">
        <UText variant="heading-h1">Blog Not Found</UText>
      </YStack>
    );
  }

  const handleLogout = () => {
    dispatch(logOut());
    router.replace("/(public)/login");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FAFAFA" }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack>
        {/* 🌄 Header with Background Image */}
        <UHeaderWithBackground bgImage={blog.cover} showBackButton={true} />

        <YStack
          mt={-30}
          mx={20}
          p={20}
          bg="$white"
          borderRadius={16}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.08}
          shadowRadius={6}
          elevation={3}
        >
          {/* 🏷️ Title and Meta */}
          <UText
            variant="heading-h1"
            mb={8}
            color="$black"
            style={{
              fontSize: 24,
              fontWeight: "700",
              lineHeight: 32,
            }}
          >
            {blog.title}
          </UText>

          <UText
            variant="text-sm"
            color="$neutral5"
            mb={20}
            style={{ fontSize: 14, fontStyle: "italic" }}
          >
            {`By ${blog.author} • ${blog.date} • ${blog.readTime}`}
          </UText>

          {/* 👤 Author Info */}
          <XStack ai="center" mb={20}>
            <Image
              source={blog.avatar}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
            <YStack>
              <UText color="$black" fontWeight="600">
                {blog.author}
              </UText>
              <UText color="$neutral5" fontSize={12}>
                Author
              </UText>
            </YStack>
          </XStack>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: "#EAEAEA",
              marginVertical: 14,
            }}
          />

          {/* 📰 Blog Content (HTML Renderer) */}
          <RenderHTML
            contentWidth={width - 40}
            source={{ html: blog.content }}
            baseStyle={{
              color: "#333",
              fontSize: 16,
              lineHeight: 26,
            }}
            tagsStyles={{
              h2: {
                fontSize: 22,
                fontWeight: "700",
                color: "#111",
                marginBottom: 12,
                marginTop: 18,
              },
              h3: {
                fontSize: 18,
                fontWeight: "600",
                color: "#222",
                marginBottom: 10,
                marginTop: 14,
              },
              p: { marginBottom: 14 },
              li: { marginBottom: 8 },
              ul: { paddingLeft: 20 },
            }}
          />

          {/* Divider after content */}
          <View
            style={{
              height: 1,
              backgroundColor: "#EEE",
              marginVertical: 24,
            }}
          />

          {/* ✨ Footer Note */}
          <UText variant="text-sm" color="$neutral5" ta="center" mt={10}>
            Thanks for reading! 💬 Share your thoughts below.
          </UText>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default BlogDetailScreen;
