import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import Purchases from "react-native-purchases";

import IconBack from "@/assets/icons/iconBack";
import IconTick from "@/assets/icons/iconTick";

import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import UHeader from "@/src/components/core/layout/uHeader";
import UText from "@/src/components/core/text/uText";

import { benefits, premiumBnefits } from "@/src/data/subscriptionData";

import { useRouter } from "expo-router";
import { Card, ScrollView, XStack, YStack } from "tamagui";

const SubscriptionScreen = () => {
  const router = useRouter();

  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Check subscription status
  const checkSubscription = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const active =
        customerInfo.entitlements.active["premium"] !== undefined;
      setIsPremium(active);
    } catch (e) {
      console.log("RevenueCat error:", e);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Purchase subscription
  const upgradeNow = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages[0];

      if (!pkg) {
        console.log("No packages found");
        return;
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);

      if (customerInfo.entitlements.active["premium"]) {
        setIsPremium(true);
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        console.log("Purchase error:", e);
      }
    }
  };

  // 🔹 Manage / Cancel subscription
  const manageSubscription = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("https://apps.apple.com/account/subscriptions");
    } else {
      Linking.openURL(
        "https://play.google.com/store/account/subscriptions"
      );
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  if (loading) {
    return null; // or loader
  }

  return (
    <YStack flex={1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <YStack backgroundColor="$bg2" paddingBottom={40}>
          <UHeader
            title={isPremium ? "Manage Subscription" : "Free Plan"}
            headerColor="$bg2"
            leftControl={
              <UIconButton
                icon={IconBack}
                variant="quinary-md"
                onPress={() => router.back()}
              />
            }
          />

          <UText
            variant="heading-h1"
            numberOfLines={1}
            width="85%"
            alignSelf="center"
            mt={20}
          >
            Subscription
          </UText>

          {/* 🔹 PREMIUM CARD */}
          {isPremium ? (
            <Card
              marginTop={30}
              borderRadius={16}
              backgroundColor="#ffffff"
              px={30}
              py={20}
              width="85%"
              alignSelf="center"
            >
              <YStack width="100%">
                <UText variant="heading-h1" alignSelf="center">
                  Premium
                </UText>

                <UText variant="text-md" mt={10}>
                  You have an active subscription
                </UText>

                <UTextButton
                  onPress={manageSubscription}
                  variant="secondary-md"
                  mt={20}
                >
                  Manage / Cancel
                </UTextButton>
              </YStack>
            </Card>
          ) : (
            /* 🔹 FREE CARD */
            <Card
              marginTop={30}
              borderRadius={16}
              backgroundColor="#ffffff"
              px={30}
              py={20}
              width="85%"
              alignSelf="center"
            >
              <YStack>
                <UText variant="heading-h1">
                  Current Plan: Free
                </UText>

                <UText variant="text-md" my={10}>
                  Upgrade to unlock exclusive content
                </UText>

                {benefits.map((benefit) => (
                  <XStack key={benefit.id} ai="center">
                    <IconTick dimen={40} />
                    <UText variant="text-md">
                      {benefit.label}
                    </UText>
                  </XStack>
                ))}
              </YStack>
            </Card>
          )}
        </YStack>

        {/* 🔹 PREMIUM BENEFITS + UPGRADE */}
        {!isPremium && (
          <YStack px={35} py={20}>
            <UText variant="heading-h1">Premium Benefits</UText>

            {premiumBnefits.map((item) => (
              <XStack key={item.id} ai="center">
                <IconTick dimen={40} />
                <UText variant="text-md">{item.label}</UText>
              </XStack>
            ))}

            <UTextButton
              variant="secondary-md"
              mt={20}
              onPress={upgradeNow}
            >
              Upgrade Now
            </UTextButton>
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
};

export default SubscriptionScreen;
