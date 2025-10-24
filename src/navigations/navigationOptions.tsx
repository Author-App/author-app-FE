import IconBack from "@/assets/icons/iconBack";
import UIconButton from "../components/core/buttons/uIconButtonVariants";
import { useRouter, useSegments } from "expo-router";
import UHeaderWithImage from "../components/core/layout/uHeaderWithImage";
import UText from "../components/core/text/uText";
import assets from "@/assets/images";


export const NavigationOptions = (props: any) => {

    const router = useRouter();
    const segments = useSegments();

    const currentRoute = segments[segments.length - 1];

    const screens = [
        {
            id: 1,
            title: 'Home',
            left: 'image',
            right: 'notifications',
            route: '(home)',
        },
    ];

    const route = screens.find(item => item.route === currentRoute);

    const renderLeft = () => {

        if (route?.left === 'back') {
            return (
                <UIconButton
                    variant="tertiary-md"
                    icon={IconBack}
                    onPress={() => props?.navigation?.goBack()}

                />
            )

        } else if (route?.left === 'image') {
            return (
                <UHeaderWithImage
                    // heroImage={null}
                    title="UI"
                    headerSubtitle={
                        <UText variant="text-xs" color="$neutral7">
                            Welcome back 👋
                        </UText>
                    }
                />
            );
        } else {
            return null;
        }
    };
    const renderRight = () => {
        if (route?.right === 'notifications') {
            return (
                <UIconButton
                    variant="tertiary-md"
                    icon={IconBack}
                    onPress={() => router.push('/notifications')}
                />
            )

        }
    };

    const renderTitle = () => {
        const route = screens.find(item => item.route === props.route.name);

        if (route?.title) {
            return (
                <UText variant="heading-h1" color="$primary7">
                    {route?.title}

                </UText>
            );
        }
        return null;
    };


    return {
        headerShadowVisible: false,
        headerTitleAlign: 'flex-start',
        headerStyle: {
            backgroundColor: '$white',
        },
        headerBackTitleVisible: false,
        headerLeft: () => renderLeft(),
        headerRight: () => renderRight(),
        headerTitle: () => renderTitle(),
        // header
    };
};
