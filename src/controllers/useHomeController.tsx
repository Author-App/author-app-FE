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


const useHomeController = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)


    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 2000); // 2 seconds

    //     return () => clearTimeout(timer);
    // }, []);

    const handleRetry = useCallback(() => setError(false), []);

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
            if (loading) return loadingSkeleton(item.type);
            if (error) return errorView;

            if (item.type === "hero") {
                const config = bannerConfig[item.subtype || "audiobook"];
                return (
                    <HeroBanner
                        {...config}
                        type={item.subtype}
                        onPressCTA={() => console.log("Navigating to details")}
                    />
                );
            }

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
                                    onPressItem={(id) =>
                                        router.push(`/(app)/bookDetail/${id}`)
                                    }
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
        [loading, error, errorView, loadingSkeleton]
    );


    const listHeaderComponent = useMemo(() => (
        <YStack mb={20} position="relative">
            <UHeaderWithBackground />
            <HeroBanner image="" title="" />
        </YStack>
    ), []);

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
            setLoading,
        },
        components: {
            listHeaderComponent,
        },
        styles: {
            contentContainerStyle,
        },
        states: {
            loading,
            error,
        },
    }

}

export default useHomeController