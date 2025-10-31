import { router, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { forgotPasswordFormValidator } from "@/src/utils/validator";
import SkeletonHero from "../components/home/skeletons/skeletonHero";
import SkeletonCarousel from "../components/home/skeletons/skeletonCarousel";
import { Button, Text, YStack } from "tamagui";
import HeroBanner from "../components/home/banner/heroBanner";
import CarouselSection from "../components/home/carousel/carouselSection";
import { ListRenderItem } from "@shopify/flash-list";
import { HomeItem } from "../types/home/homeTypes";
import { bannerConfig } from "../config/bannerConfig";


const useHomeController = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)


    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 2000); // 2 seconds

    //     return () => clearTimeout(timer);
    // }, []);


    const handleRetry = () => setError(false)


    const renderItem: ListRenderItem<HomeItem> = useCallback(
        ({ item }) => {
            if (loading) {
                if (item.type === 'hero') return <SkeletonHero />
                if (item.type === 'carousel') return <SkeletonCarousel />
            }

            if (error) {
                return (
                    <YStack ai="center" p="$4">
                        <Text color="$red10" mb="$2">Something went wrong.</Text>
                        <Button onPress={handleRetry}>Retry</Button>
                    </YStack>
                )
            }

            switch (item.type) {
                case 'hero':

                    const config = bannerConfig[item.subtype || 'audiobook'];
                    return (
                        <HeroBanner
                            {...config}
                            type={item.subtype}
                            onPressCTA={() => console.log('Navigating to details')}

                        />
                    );
                case 'carousel':
                    return (
                        <YStack 
                        // mt="$5" 
                        px={16} pt={30}>
                            <CarouselSection
                                title={item?.title}
                                subtype={item?.subtype}
                                data={item?.data}
                                onPressItem={(id) =>
                                    console.log(`Navigate to detail route of ${item?.subtype}: ${id}`)
                                }
                            />
                        </YStack>
                    )
                default:
                    return null
            }
        },
        [loading, error]
    )

    return {
        functions: {
            renderItem,
            setLoading,
            handleRetry
        },
        states: {
            loading,
        },
    }

}

export default useHomeController