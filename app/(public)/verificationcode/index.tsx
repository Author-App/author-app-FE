import IconArrowRight from '@/assets/icons/iconArrowRight';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UText from '@/src/components/core/text/uText';
import useVerificationCodeController from '@/src/controllers/useVerificationCodeController';
import { useFormik } from 'formik';
import React from 'react';
import { XStack, YStack } from 'tamagui';
import OTPTextView from "react-native-otp-textinput";
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import { Image, ImageBackground } from 'react-native';
import assets from '@/assets/images';


const VerificationCode = () => {

    const { validator, values, functions, states, router } = useVerificationCodeController();

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
                        Verification Code
                    </UText>
                    <UText variant="text-sm" color="$white">
                        Enter verification code sent to your email address.
                    </UText>
                    <UKeyboardAvoidingView gap={16} mt={25}>
                        <OTPTextView
                            inputCount={6}
                            keyboardType="number-pad"
                            handleTextChange={(text) =>
                                functions.handleOTPChange(text, formik.setFieldValue, formik.handleSubmit)
                            }
                            // tintColor={'#465A54'}
                            tintColor={'$white'}
                            textInputStyle={{
                                color:'#ffffff'
                                // textShadowColor: '$white',
                                // textShadowOffset: { width: 0, height: 0 },
                                // textShadowRadius: 0,
                                // includeFontPadding: false,
                            } as object}


                        />
                        {states.submitted && formik.errors.code && (
                            <UText variant="text-xs" color="$red10" ml={16} mt={5}>
                                {formik.errors.code}
                            </UText>
                        )}

                        <XStack justifyContent="flex-end">
                            <UIconButton
                                variant="primary-md"
                                icon={IconArrowRight}
                                onPress={() => {
                                    functions.setSubmitted(true)
                                    formik.handleSubmit()
                                }}
                                // iconProps={{ color: '$neutral0' }}
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

export default VerificationCode;