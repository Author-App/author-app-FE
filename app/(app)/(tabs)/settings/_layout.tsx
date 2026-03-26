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