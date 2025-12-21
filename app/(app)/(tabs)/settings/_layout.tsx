import IconBack from "@/assets/icons/iconBack";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UHeader from "@/src/components/core/layout/uHeader";
import { Stack, useRouter } from "expo-router";

export default function SettingsLayout() {

    const router = useRouter();
    return (
        <Stack 
        screenOptions={{ headerShown: false }} 
        >
            <Stack.Screen name="index" 
            options={{headerShown: false}}
            />
        </Stack>
    );
}