import IconArrowRight2 from "@/assets/icons/iconArrowRight2";
import IconBack from "@/assets/icons/iconBack";
import IconChangePassword from "@/assets/icons/iconChangePassword";
import IconDelete from "@/assets/icons/iconDelete";
import IconEdit from "@/assets/icons/iconEdit";
import IconLogout from "@/assets/icons/iconLogout";
import IconNotifications from "@/assets/icons/iconNotifications";
import IconReport from "@/assets/icons/iconReport";
import IconSubscription from "@/assets/icons/iconSubscription";
import assets from "@/assets/images";

import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UImage from "@/src/components/core/image/uImage";
import UHeader from "@/src/components/core/layout/uHeader";
import UText from "@/src/components/core/text/uText";
import useSettingsController from "@/src/controllers/useSettingsController";
import { logOut } from "@/src/redux2/Slice/AuthSlice";
import { persistor } from "@/src/redux2/Store";
import { getInitials } from "@/src/utils/helper";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { YStack, XStack, Switch, Card, ScrollView } from "tamagui";

const SettingsScreen = () => {
  const { functions, states } = useSettingsController();

  const router = useRouter();

  const dispatch = useDispatch();

  const accountOptions = [
    {
      label: "Notifications",
      icon: <IconNotifications />,
      rightComponent: (
        <Switch
          checked={states.notificationsEnabled}
          onCheckedChange={functions.setNotificationsEnabled}
          size="$4"
          backgroundColor={states.notificationsEnabled ? "#385d83ff" : "$gray7"}
        >
          <Switch.Thumb animation="quick" backgroundColor="white" elevate borderRadius={20} />
        </Switch>
      ),
      onPress: () => console.log("Notifications"),
    },
    {
      label: "Edit Profile",
      icon: <IconEdit />,
      onPress: () => router.push("/(app)/editProfile"),
    },
    {
      label: "Change Password",
      icon: <IconChangePassword dimen={20} />,
      onPress: () => router.push("/(app)/changePassword"),
    },
    {
      label: "Manage Subscription",
      icon: <IconSubscription />,
      onPress: () =>
        router.push({
          pathname: "/(app)/subscription",
          params: { premium: true },
        }),
    },
    {
      label: "Report A Bug",
      icon: <IconReport />,
      onPress: () => console.log("BugReport"),
    },
    {
      label: "Logout",
      icon: <IconLogout />,
      onPress: () => {
        dispatch(logOut());
        persistor.purge();
        router.push("/(public)/login");
      },
    },
    {
      label: "Delete Account",
      icon: <IconDelete />,
      onPress: () => console.log("fdfffd"),
    },
  ];

  // ✅ Reusable card component (single source of styling)
  const renderCard = (item: any, index: number) => (
    <Card
      key={index}
      marginHorizontal={20}
      borderRadius={16}
      backgroundColor="#ffffff"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={6}
      elevation={4}
      px={15}
      py={20}
      width="100%"
      alignSelf="center"
      jc="space-between"
      flexDirection="row"
      ai="center"
      onPress={item.onPress}
      pressStyle={{ opacity: 0.85 }}
    >
      <XStack ai="center">
        {item.icon}
        <UText variant="text-md" ml={8}>{item.label}</UText>
      </XStack>
      {item.rightComponent || <IconArrowRight2 />}
    </Card>
  );

  return (
    <YStack flex={1} backgroundColor="$bg2">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <UHeader
          title="Settings"
          headerColor="$bg2"
          leftControl={
            <UIconButton
              icon={IconBack}
              variant="quinary-md"
              onPress={() => router.back()}
            />
          }
        />

        <YStack p={20}>
          <UImage
            imageSource={assets.images.padden}
            fallBackText={getInitials("Stanley Padden")}
            w={150}
            borderRadius={75}
            overflow="hidden"
            mt={10}
            alignSelf="center"
          />
          <YStack ai="center">
            <UText variant="heading-h1" mt={10}>Stanley Padden</UText>
            <UText variant="text-md" mt={10}>stanleypadden@gmail.com</UText>
          </YStack>
          <YStack mt={30} gap={20}>
            {accountOptions.map(renderCard)}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default SettingsScreen;
