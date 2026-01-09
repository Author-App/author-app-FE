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
import UIconTextButton from "@/src/components/core/buttons/uIconTextButton";
import UImage from "@/src/components/core/image/uImage";
import UHeader from "@/src/components/core/layout/uHeader";
import UText from "@/src/components/core/text/uText";
import useSettingsController from "@/src/controllers/useSettingsController";
import { useDeleteAccountMutation, useGetMeQuery } from "@/src/redux2/Apis/User";
import { logOut } from "@/src/redux2/Slice/AuthSlice";
import { persistor } from "@/src/redux2/Store";
import { getInitials } from "@/src/utils/helper";
import { registerForPushNotificationsAsync } from "@/src/utils/registerForPushNotifications";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { YStack, XStack, Switch, Card, ScrollView } from "tamagui";

const SettingsScreen = () => {
  const { functions, states } = useSettingsController();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    })();
  }, []);
  console.log("THIS IS EXPO PUSH NOTIFICATIONS", expoPushToken);
  


  const { data, isLoading, isError, refetch } = useGetMeQuery(undefined);

  console.log("THIS IS DATA", data?.data?.user)
  const user = data?.data?.user ?? {};

  const [deleteAccount, { isLoading: isDeleting }] =
    useDeleteAccountMutation();


  const router = useRouter();

  const dispatch = useDispatch();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount().unwrap();

              Toast.show({
                type: 'success',
                text2: 'Account deleted successfully',
              });

              dispatch(logOut());
              await persistor.purge();
              router.replace('/(public)/login');

            } catch (error: any) {
              Toast.show({
                type: 'error',
                text2:
                  error?.data?.message ||
                  'Failed to delete account',
              });
            }
          },
        },
      ],
    );
  };


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
      onPress: () => router.push("/(app)/editProfile" as Href),
    },
    {
      label: "Change Password",
      icon: <IconChangePassword dimen={20} />,
      onPress: () => router.push("/(app)/changePassword" as Href),
    },
    {
      label: "Manage Subscription",
      icon: <IconSubscription />,
      onPress: () =>
        router.push({
          pathname: "/(app)/subscription",
          // params: { premium: "true" },
        } as unknown as Href),
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
      onPress: handleDeleteAccount,
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

  if (isLoading) {
    return (
      <YStack flex={1} jc="center" ai="center" backgroundColor={'$white'}>
        <ActivityIndicator size="large" color="#007AFF" />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack flex={1} jc="center" ai="center" backgroundColor={'$white'}>
        <UText variant="text-md" color="$red10">Something went wrong.</UText>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$bg2">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <UHeader
          title="Settings"
          headerColor="$bg2"
        />

        <YStack p={20}>
          <UImage
            imageSource={user?.profileImageUrl}
            fallBackText={`${user?.firstName} ${user?.lastName}`}
            w={150}
            h={150}
            borderRadius={75}
            overflow="hidden"
            mt={10}
            alignSelf="center"
          />
          {/* <UImage
            imageSource={{ uri: user?.profileImageUrl }}
            fallBackText={getInitials(`${user?.firstName} ${user?.lastName}`)}
            w={150}
            height={150}
            borderRadius={75}
            overflow="hidden"
            mt={10}
            alignSelf="center"
          /> */}
          <YStack ai="center">
            <UText textAlign="center" width={'50%'} variant="heading-h1" mt={10}>{`${user?.firstName} ${user?.lastName}`}</UText>
            <UText textAlign="center" width={'50%'} variant="text-md" mt={10}>{user?.email}</UText>
          </YStack>

          {expoPushToken && (
            <Card
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
              mt={20}
            >
              <UText variant="text-sm" color="$gray10" mb={6}>
                Expo Push Token (for testing)
              </UText>

              <UText
                variant="text-xs"
                selectable
                numberOfLines={3}
              >
                {expoPushToken}
              </UText>

              <UIconTextButton
                mt={10}
                onPress={async () => {
                  await Clipboard.setStringAsync(expoPushToken);
                  Toast.show({
                    type: "success",
                    text2: "Push token copied to clipboard",
                  });
                }}
              >
                Copy Token
              </UIconTextButton>
            </Card>
          )}

          <YStack mt={30} gap={20}>
            {accountOptions.map(renderCard)}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default SettingsScreen;
