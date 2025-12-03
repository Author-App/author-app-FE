import { router, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { forgotPasswordFormValidator } from "@/src/utils/validator";
import SkeletonHero from "../components/home/skeletons/skeletonHero";
import SkeletonCarousel from "../components/home/skeletons/skeletonCarousel";
import { Button, Text, YStack } from "tamagui";
import HeroBanner from "../components/home/banner/heroBanner";
import CarouselSection from "../components/home/carousel/carouselSection";
import { ListRenderItem } from "@shopify/flash-list";
import { HomeItem } from "../types/home/homeTypes";
import { bannerConfig } from "../config/bannerConfig";
import CarouselArticles from "../components/home/carousel/carouselArticles";
import CarouselBooks from "../components/home/carousel/carouselBooks";
import UHeaderWithBackground from "../components/core/layout/uHeaderWithBackground";
import { useGetHomeQuery } from "../redux2/Apis/Home";


const useHomeController = () => {

    const { data, isLoading, error, refetch } = useGetHomeQuery(null);

    console.log("THIS IS DATA", data);


    // const [loading, setLoading] = useState(false)
    // const [error, setError] = useState(false)


    // const handleRetry = useCallback(() => setError(false), []);

    const handleRetry = useCallback(() => refetch(), [refetch]);

    const homeSections = useMemo(() => {
        if (!data?.data) return [];

        const api = data.data;

        return [
            // {
            //     id: "hero-banner",
            //     type: "hero",
            //     subtype: "banner",
            //     title: api.banner.title,
            //     // data: api.banner,
            // },
            {
                id: "trending-books-section",
                type: "carousel",
                subtype: "books",
                title: "Trending Books",
                data: api.trendingBooks,
            },
            {
                id: "articles-section",
                type: "carousel",
                subtype: "articles",
                title: "Featured Articles",
                data: api.articles,
            },
            {
                id: "audio-books-section",
                type: "carousel",
                subtype: "audiobooks",
                title: "New Audiobooks",
                data: api.audioBooks,
            },
        ];
    }, [data]);

    console.log("THIS IS HOME SECTIONSS", JSON.stringify(homeSections, null, 2));



    const errorView = useMemo(
        () => (
            <YStack ai="center" p="$4">
                <Text color="$red10" mb="$2">
                    Something went wrong.
                </Text>
                <Button onPress={handleRetry}>Retry</Button>
            </YStack>
        ),
        [handleRetry]
    );

    const loadingSkeleton = useCallback((type: string) => {
        if (type === "hero") return <SkeletonHero />;
        if (type === "carousel") return <SkeletonCarousel />;
        return null;
    }, []);

    const renderItem: ListRenderItem<HomeItem> = useCallback(
        ({ item }) => {
            if (isLoading) return loadingSkeleton(item.type);
            if (error) return errorView;

            // console.log("THIS IS ITEM", item);


            // if (item.type === "hero") {

            //     // console.log("THIS IS ITEM OF HERO", item);


            //     // const config = bannerConfig[item.subtype || "audiobook"];
            //     return (
            //         <HeroBanner
            //             // {...config}
            //             title={item.title}
            //             type={item.subtype}
            //             onPressCTA={() => console.log("Navigating to details")}
            //         />
            //     );
            // }

            if (item.type === "carousel") {
                const carouselContent = (() => {
                    switch (item.subtype) {
                        case "articles":
                            return (
                                <CarouselArticles
                                    data={item.data}
                                    onPressItem={(id) =>
                                        router.push(`/(app)/article/${id}`)
                                    }
                                />
                            );
                        case "books":
                        case "audiobooks":
                            return (
                                <CarouselBooks
                                    data={item.data}
                                    onPressItem={(item) =>
                                        router.push({
                                            pathname: "/(app)/bookDetail/[id]",
                                            params: {
                                                id: item.id,
                                                // title: item.title,
                                                // cover: item.cover,
                                            },
                                        })
                                    }
                                // onPressItem={() =>
                                //     router.push({
                                //         pathname: '/(app)/bookDetail/[id]',
                                //         params: { id: item.id },
                                //     })
                                // }
                                // onPressItem={(id) =>
                                //     router.push(`/(app)/bookDetail/${id}`)
                                // }
                                />
                            );
                        default:
                            return null;
                    }
                })();

                return (
                    <YStack px={16} pt={30}>
                        <CarouselSection title={item.title}>{carouselContent}</CarouselSection>
                    </YStack>
                );
            }

            return null;
        },
        [isLoading, error]
        // [loading, error, errorView, loadingSkeleton]
    );

    const listHeaderComponent = useMemo(() => (
        <YStack mb={20} position="relative">
            <UHeaderWithBackground />
            {data?.data?.banner && (
                <HeroBanner
                    image={data.data.banner.image || ""}
                    title={data.data.banner.title}
                    subtitle={data.data.banner.subtitle}
                    eyebrow={data.data.banner.eyebrow}
                    badge={data.data.banner.badge}
                    onPressCTA={() => console.log("Navigating to banner details")}
                />
            )}
        </YStack>
    ), [data]);


    // const listHeaderComponent = useMemo(() => (
    //     <YStack mb={20} position="relative">
    //         <UHeaderWithBackground />
    //         <HeroBanner image="" title="" />
    //     </YStack>
    // ), []);

    const keyExtractor = useMemo(() => (item: any) => item.id, []);

    const contentContainerStyle = useMemo(
        () => ({
            paddingBottom: 32,
        }),
        []
    );

    return {

        functions: {
            renderItem,
            keyExtractor,
            handleRetry,
            // setLoading,
        },
        components: {
            listHeaderComponent,
        },
        styles: {
            contentContainerStyle,
        },
        states: {
            loading: isLoading,
            error,
            // homeSections: data?.homeSections || [],
            homeSections

        },
    }

}

export default useHomeController