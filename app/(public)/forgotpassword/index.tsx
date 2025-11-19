import IconArrowRight from '@/assets/icons/iconArrowRight';
import assets from '@/assets/images';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useForgotPasswordController from '@/src/controllers/useForgotPasswordController';
import { useFormik } from 'formik';
import React from 'react';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';
import { XStack, YStack } from 'tamagui';

const ForgotPassword = () => {

    const { validator, values, functions, states, router } = useForgotPasswordController();

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
                        Forgot Password
                    </UText>
                    <UText variant="text-sm" color="$white">
                        Enter an email address to receive a verification code
                    </UText>
                    <UKeyboardAvoidingView gap={16} mt={25}>
                        <UInput
                            variant="primary"
                            placeholder="Enter your email"
                            value={formik.values.email}
                            onChangeText={formik.handleChange('email')}
                            error={states.submitted ? formik.errors.email : undefined}
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                        <XStack justifyContent="flex-end">
                            <UIconButton
                                variant="primary-md"
                                icon={IconArrowRight}
                                onPress={() => {
                                    functions.setSubmitted(true)
                                    formik.handleSubmit()
                                }}
                                // iconProps={{ color: '$primary' }}
                                loading={states.loading}
                            />
                        </XStack>
                    </UKeyboardAvoidingView>
                </YStack>
                <YStack gap={16} mb={25}>
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

export default ForgotPassword;