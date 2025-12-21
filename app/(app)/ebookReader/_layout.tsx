import IconBack from "@/assets/icons/iconBack";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UHeader from "@/src/components/core/layout/uHeader";
import { Stack, useRouter } from "expo-router";

export default function EBookReaderLayout() {

    const router = useRouter();
    return (
        <Stack>
            <Stack.Screen name="index"
                options={{
                    header: () => (
                        <UHeader
                            title="Book Reader"
                            leftControl={
                                <UIconButton
                                    icon={IconBack}
                                    variant="tertiary-md"  // or "primary-sm" depending on your design
                                    onPress={() => router.back()}
                                />
                            }
                        />

                    )
                }}
            />
        </Stack>
    );
}