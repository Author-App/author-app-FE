import IconBack from "@/assets/icons/iconBack";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import UInput from "@/src/components/core/inputs/uInput";
import UHeader from "@/src/components/core/layout/uHeader";
import UKeyboardAvoidingView from "@/src/components/core/layout/uKeyboardAvoidingView";
import useChangePasswordController from "@/src/controllers/useChangePasswordController";
import { useFormik } from "formik";
import { ScrollView, YStack } from "tamagui";

const ChangePassword = () => {
    const { validator, values, functions, states, router } = useChangePasswordController();

    const formik = useFormik({
        initialValues: values.initialValues,
        validationSchema: validator,
        onSubmit: (values, { resetForm, setSubmitting }) => functions.handleSubmit(values, { resetForm, setSubmitting })
    });



    return (
        <YStack flex={1}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <UHeader
                    title="Change Password"
                    leftControl={
                        <UIconButton
                            icon={IconBack}
                            variant="quinary-md"
                            onPress={() => router.back()}
                        />
                    }
                />
                <YStack p={20}>

                    <UKeyboardAvoidingView gap={16} mt={25} >

                        <UInput
                            variant="secondary"
                            placeholder="Enter current password"
                            value={formik.values.currentPassword}
                            onChangeText={formik.handleChange('currentPassword')}
                            error={states.submitted ? formik.errors.currentPassword : undefined}
                            keyboardType="visible-password"
                            autoComplete="password"
                        />

                        <UInput
                            variant="secondary"
                            placeholder="Enter new password"
                            value={formik.values.newPassword}
                            onChangeText={formik.handleChange('newPassword')}
                            error={states.submitted ? formik.errors.newPassword : undefined}
                            keyboardType="visible-password"
                            autoComplete="password"
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

export default ChangePassword;
