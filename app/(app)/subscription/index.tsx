import IconBack from "@/assets/icons/iconBack";
import IconTick from "@/assets/icons/iconTick";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import UHeader from "@/src/components/core/layout/uHeader";
import UText from "@/src/components/core/text/uText";
import useSettingsController from "@/src/controllers/useSettingsController";
import { benefits, premiumBnefits, premiumSubscriptionDetails } from "@/src/data/subscriptionData";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { Card, ScrollView, XStack, YStack } from "tamagui";


const SubscriptionScreen = () => {
    const { functions, states } = useSettingsController();

    const router = useRouter();

    const { premium: premiumParam } = useLocalSearchParams();

    const premium = premiumParam === 'true';

    console.log("THIS IS PREMIUM", premium);
    
    return (
        <YStack flex={1}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <YStack backgroundColor={'$bg2'} paddingBottom={40}>
                    <UHeader
                        title={ premium ? "Manage Subscription" : "Free Plan"}
                        headerColor='$bg2'
                        leftControl={
                            <UIconButton
                                icon={IconBack}
                                variant="quinary-md"
                                onPress={() => router.back()}
                            />
                        }
                    />

                    <UText variant="heading-h1" numberOfLines={1} width="85%" alignSelf="center" mt={20}>
                        Subscription
                    </UText>

                    {
                        premium ?
                            <Card
                                marginTop={30}
                                borderRadius={16}
                                backgroundColor="#ffffff"
                                shadowColor="#000"
                                shadowOffset={{ width: 0, height: 2 }}
                                shadowOpacity={0.08}
                                shadowRadius={6}
                                elevation={4}
                                px={30}
                                py={20}
                                width="85%"
                                alignSelf="center"
                                jc="space-between"
                                flexDirection="row"
                                ai="center"
                                onPress={() => console.log('ffdssfd')}
                                pressStyle={{ opacity: 0.85 }}
                            >
                                <YStack width={'100%'}>
                                    <UText variant="heading-h1" numberOfLines={1} alignSelf="center">
                                        Premium
                                    </UText>

                                    <UText variant="text-md" numberOfLines={1} mt={8}>
                                        Renews on
                                    </UText>
                                    <UText variant="text-md" numberOfLines={1} >
                                        {premiumSubscriptionDetails?.reniewDate}
                                    </UText>

                                    <UText variant="text-md" numberOfLines={1} mt={10}>
                                        ${premiumSubscriptionDetails?.fees}/month
                                    </UText>


                                    <UTextButton
                                        onPress={() => console.log('fsddfs')}
                                        variant='secondary-md'
                                        mt={20}
                                        textColor={'$black'}
                                    >
                                        Manage / Cancel
                                    </UTextButton>

                                </YStack>

                            </Card>
                            :
                            <Card
                                marginTop={30}
                                borderRadius={16}
                                backgroundColor="#ffffff"
                                shadowColor="#000"
                                shadowOffset={{ width: 0, height: 2 }}
                                shadowOpacity={0.08}
                                shadowRadius={6}
                                elevation={4}
                                px={30}
                                py={20}
                                width="85%"
                                alignSelf="center"
                                jc="space-between"
                                flexDirection="row"
                                ai="center"
                                onPress={() => console.log('ffdssfd')}
                                pressStyle={{ opacity: 0.85 }}
                            >
                                <YStack>
                                    <UText variant="heading-h1" numberOfLines={1}>Current Plan Free Tier</UText>
                                    <UText variant="text-md" numberOfLines={2} my={10}>Upgrade to unlock exclusive content and more</UText>

                                    {
                                        benefits?.map((benefit) =>
                                            <XStack ai={'center'} width={'100%'} key={benefit.id}>
                                                <IconTick dimen={40} />
                                                <UText variant="text-md">{benefit?.label}</UText>
                                            </XStack>
                                        )
                                    }

                                </YStack>

                            </Card>


                    }


                </YStack>

                {
                    premium == false && <YStack px={35} py={20}>
                        <UText variant="heading-h1" numberOfLines={1}>Premium Benefits</UText>

                        {
                            premiumBnefits?.map((benefitt) =>

                                <XStack ai={'center'} key={benefitt?.id}>
                                    <IconTick dimen={40} />
                                    <UText variant="text-md">{benefitt?.label}</UText>
                                </XStack>
                            )
                        }


                        <UTextButton variant="secondary-md" mt={20}>Upgrade Now</UTextButton>

                    </YStack>
                }
            </ScrollView>
        </YStack>
    );
};

export default SubscriptionScreen;
