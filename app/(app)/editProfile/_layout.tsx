import IconBack from "@/assets/icons/iconBack";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UHeader from "@/src/components/core/layout/uHeader";
import UHeaderWithImage from "@/src/components/core/layout/uHeaderWithImage";
import { Stack, useRouter } from "expo-router";

export default function EditProfileLayout() {

  const router = useRouter();
  return (
    <Stack 
    // screenOptions={{ headerShown: false }} 
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="settings" options={{
        header: () => (
          <UHeader
            title="Settings"
            leftControl={
              <UIconButton
                icon={IconBack}
                variant="tertiary-md"  // or "primary-sm" depending on your design
                onPress={() => router.back()}
              />
            }
          />

        )
      }} /> */}
    </Stack>
  );
} 