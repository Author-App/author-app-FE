import { Stack, useRouter } from "expo-router";

export default function SubscriptionLayout() {

    const router = useRouter();
    return (
        <Stack>
            <Stack.Screen name="index" 
            options={{
                headerShown: false
            }}
            />
        </Stack>
    );
}