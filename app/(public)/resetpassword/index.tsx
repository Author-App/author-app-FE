import assets from '@/assets/images';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useResetPasswordController from '@/src/controllers/useResetPasswordController';
import { useFormik } from 'formik';
import React from 'react';
import { Image, ImageBackground } from 'react-native';
import { XStack, YStack } from 'tamagui';

const ResetPassword = () => {

    const { validator, values, functions, states, router } = useResetPasswordController();

    const formik = useFormik({
        initialValues: values.initialValues,
        validationSchema: validator,
        onSubmit: (values, { resetForm, setSubmitting }) => functions.handleSubmit(values, { resetForm, setSubmitting })
    });


    return (
        <ImageBackground
            source={assets.images.authBackgroundImage2}
            resizeMode="cover"
            style={{ flex: 1 }}
        >
            <Image source={assets.images.mainLogo} style={{ width: 130, height: 70, marginTop: 38 }} />
            <YStack flex={1} px={24} pb={24} jc="space-between">
                <YStack gap={10} flex={1}>
                    <UText variant="heading-h1" color="$white">
                        Reset Password
                    </UText>
                    <UText variant="text-sm" color="$white">
                        Set a new password for your account
                    </UText>
                    <UKeyboardAvoidingView gap={16} mt={25}>
                        <UInput
                            variant="primary"
                            placeholder="Enter your password"
                            value={formik.values.password}
                            onChangeText={formik.handleChange('password')}
                            error={states.submitted ? formik.errors.password : undefined}
                            keyboardType="visible-password"
                            autoComplete="password"
                        />
                    </UKeyboardAvoidingView>
                </YStack>
                <YStack gap={16} mb={25}>
                    <NeonButton style={{ width: '100%' }}
                        onPress={() => {
                            functions.setSubmitted(true)
                            formik.handleSubmit()
                        }}
                        loading={states.loading}
                    >
                        Submit
                    </NeonButton>
                    {/* <UTextButton
                        onPress={() => {
                            functions.setSubmitted(true)
                            formik.handleSubmit()
                        }}
                        loading={states.loading}
                        indicatorColor={'#fff'}

                    >
                        Submit
                    </UTextButton> */}
                    <XStack jc="center" mt={16}>
                        <UText
                            variant="text-md"
                            color="$white"
                            // fontWeight={700}
                            textDecorationLine='underline'
                            onPress={() => router.push('/(public)/login')}>
                            Back to Login
                        </UText>
                    </XStack>
                </YStack>
            </YStack>
        </ImageBackground>

    )
}

export default ResetPassword;