import IconBack from "@/assets/icons/iconBack";
import assets from "@/assets/images";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import UImage from "@/src/components/core/image/uImage";
import UInput from "@/src/components/core/inputs/uInput";
import UHeader from "@/src/components/core/layout/uHeader";
import UKeyboardAvoidingView from "@/src/components/core/layout/uKeyboardAvoidingView";
import useSettingsController from "@/src/controllers/useSettingsController";
import { getInitials } from "@/src/utils/helper";
import { useFormik } from "formik";
import { Image, View } from "react-native";
import { ScrollView, YStack } from "tamagui";

const EditProfile = () => {
    const { values, functions, states, router } = useSettingsController();

    const formik = useFormik({
        initialValues: values.initialValues,
        onSubmit: (values, { resetForm, setSubmitting }) => functions.handleSubmit(values, { resetForm, setSubmitting })
    });



    return (
        <YStack flex={1}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <UHeader
                    title="Edit Profile"
                    leftControl={
                        <UIconButton
                            icon={IconBack}
                            variant="quinary-md"
                            onPress={() => router.back()}
                        />
                    }
                />
                <YStack p={20}>

                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <View style={{ position: 'relative' }}>
                            <UImage
                                imageSource={assets.images.padden}
                                fallBackText={getInitials('Stanley Padden')}
                                w={150}
                                h={150}
                                borderRadius={75}
                                overflow="hidden"
                            />

                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: -10,
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    backgroundColor: '#fff',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                    borderColor: '#ddd',
                                    borderWidth: 1,
                                }}
                            >
                                <Image
                                    source={assets.icons.gallery}
                                    style={{ width: 20, height: 20, tintColor: '#000' }}
                                />
                            </View>
                        </View>
                    </View>

                    <UKeyboardAvoidingView gap={16} mt={25} >
                        <UInput
                            variant="secondary"
                            placeholder="Enter your full name"
                            value={formik.values.fullName}
                            onChangeText={formik.handleChange("fullName")}
                            error={states.submitted ? formik.errors.fullName : undefined}
                            keyboardType="default"
                            autoComplete="name"
                        // onBlur={() => setIsEditingName(false)} // closes edit mode when you tap away
                        />

                        <UInput
                            variant="secondary"
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
                </YStack>

            </ScrollView>
        </YStack>
    );
};

export default EditProfile;
