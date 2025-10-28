import IconDuration from "@/assets/icons/iconDuration";
import IconEdit from "@/assets/icons/iconEdit";
import assets from "@/assets/images";
import UButtonTabs from "@/src/components/core/buttons/uButtonTabs";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import UImage from "@/src/components/core/image/uImage";
import UInput from "@/src/components/core/inputs/uInput";
import UKeyboardAvoidingView from "@/src/components/core/layout/uKeyboardAvoidingView";
import UText from "@/src/components/core/text/uText";
import useSettingsController from "@/src/controllers/useSettingsController";
import { getInitials } from "@/src/utils/helper";
import { useFormik } from "formik";
import { useState } from "react";
import { YStack, Text, XStack, Switch } from "tamagui";

const SettingsScreen = () => {
  const { validator, values, functions, states, router } = useSettingsController();

  const formik = useFormik({
    initialValues: values.initialValues,
    validationSchema: validator,
    onSubmit: (values, { resetForm, setSubmitting }) => functions.handleSubmit(values, { resetForm, setSubmitting })
  });

  const renderGeneralTab = () => (
    <>
      <UKeyboardAvoidingView gap={16} mt={25} >
        <UInput
          variant="primary"
          placeholder="Enter your full name"
          value={formik.values.fullName}
          onChangeText={formik.handleChange("fullName")}
          error={states.submitted ? formik.errors.fullName : undefined}
          keyboardType="default"
          autoComplete="name"
        // onBlur={() => setIsEditingName(false)} // closes edit mode when you tap away
        />

        <UInput
          variant="primary"
          placeholder="Enter your email"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          error={states.submitted ? formik.errors.email : undefined}
          keyboardType="email-address"
          autoComplete="email"
          editable={false}
        />

      </UKeyboardAvoidingView>

      <UTextButton
        onPress={() => {
          functions.setSubmitted(true)
          formik.handleSubmit()
        }}
        loading={states.loading}
        indicatorColor={'#fff'}

      >
        Update
      </UTextButton>
    </>
  );

  const renderAccountTab = () => (
    <YStack mt={30} gap={20}>
      <XStack ai="center" jc="space-between">
        <UText variant="text-md">Notifications</UText>
        <Switch
          checked={states.notificationsEnabled}
          onCheckedChange={functions.setNotificationsEnabled}
          size="$4"
          backgroundColor={states.notificationsEnabled ? '$blue10' : '$gray7'}
        >
          <Switch.Thumb
            animation="quick"
            backgroundColor="white"
            elevate
            borderRadius={20}
          />
        </Switch>
      </XStack>

      <UTextButton
        onPress={() => console.log("ChangePassword")}
        variant="quinary-md"
      >
        Change Password
      </UTextButton>

      {states.isPremium ? (
        <YStack bg="$gray2" br={10}>
          {/* <UText variant="text-md" fontWeight="700">
            Premium Membership
          </UText>
          <UText color="$gray10" mt={5}>
            Active – renews on 15/12/2025
          </UText> */}
          <UTextButton variant="quinary-md" onPress={() => console.log("Upgrade")}>
            Manage Subscription
          </UTextButton>
        </YStack>
      ) : (
        <YStack p={15} bg="$gray2" br={10}>
          <UText variant="text-md" fontWeight="700">
            Upgrade to Premium
          </UText>
          <UText color="$gray10" mt={5}>
            Enjoy ad-free experience, exclusive offers & more.
          </UText>
          <UTextButton mt={10} onPress={() => console.log("Upgrade")}>
            Upgrade
          </UTextButton>
        </YStack>
      )}

      <UTextButton
        onPress={() => console.log("BugReport")}
        variant="quinary-md"
      >
        Report a Bug / Suggest Feature
      </UTextButton>

      <YStack gap={10}>
        <UTextButton
          onPress={() => console.log('eedwd')}
          variant="quinary-md"
        >
          Logout
        </UTextButton>
        <UTextButton
          onPress={() => console.log('eedwd')}
          // variant="danger-sm"
          variant="secondary-md"
        >
          Delete Account
        </UTextButton>
      </YStack>

      {/* 📱 Footer */}
      <YStack mt={60} ai="center">
        {/* <UText color="$gray10">{`${values.appName} v${values.appVersion}`}</UText> */}
        <UText color="$gray9">Made with ❤️ by Stanley Padden</UText>
      </YStack>
    </YStack>
  );


  return (
    <YStack
      flex={1}
      p={20}>
      <UImage
        imageSource={assets.images.padden}
        fallBackText={getInitials('Stanley Padden')}
        w={150}
        borderRadius={75}
        overflow="hidden"
        mt={40}
        alignSelf="center"
      />
      <YStack alignSelf="flex-start" mt={30}>
        <UButtonTabs
          items={['General', 'Account']}
          selectedItem={states.activeTab}
          onItemSelect={(tab) => functions.setActiveTab(tab)}
          variant="style-2"
          innerContainerProps={{
            h: 35,
            jc: 'space-between',
            ai: 'center',

          }}
          tabItemProps={{
            marginRight: 15,
            jc: 'center',
            pressStyle: { opacity: 0.7 },
          }}

        />
      </YStack>

      {states.activeTab === "General" ? renderGeneralTab() : renderAccountTab()}

    </YStack>
  );
}

export default SettingsScreen;