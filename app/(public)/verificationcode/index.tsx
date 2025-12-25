import IconArrowRight from '@/assets/icons/iconArrowRight';
import assets from '@/assets/images';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useVerificationCodeController from '@/src/controllers/useVerificationCodeController';
import { useFormik } from 'formik';
import React, { useCallback, useMemo, memo } from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import { XStack, YStack } from 'tamagui';

const styles = StyleSheet.create({
    background: { flex: 1 },
    logo: { width: 130, height: 70, marginTop: 38 },
});

const otpTextInputStyle = {
    color: '#ffffff',
} as object;

const VerificationCode = memo(() => {
    const { validator, values, functions, states, router } = useVerificationCodeController();

    const formikConfig = useMemo(
        () => ({
            initialValues: values.initialValues,
            validationSchema: validator,
            onSubmit: functions.handleSubmit,
        }),
        [values.initialValues, validator, functions.handleSubmit]
    );

    const formik = useFormik(formikConfig);

    const handleSubmit = useCallback(() => {
        functions.setSubmitted(true);
        formik.handleSubmit();
    }, [functions.setSubmitted, formik.handleSubmit]);

    const handleOTPChange = useCallback(
        (text: string) => {
            functions.handleOTPChange(text, formik.setFieldValue, formik.handleSubmit);
        },
        [functions.handleOTPChange, formik.setFieldValue, formik.handleSubmit]
    );

    const navigateToLogin = useCallback(() => {
        router.push('/(public)/login');
    }, [router]);

    const codeError = useMemo(
        () => (states.submitted && formik.errors.code ? formik.errors.code : null),
        [states.submitted, formik.errors.code]
    );

    return (
        <ImageBackground
            source={assets.images.authBackgroundImage2}
            resizeMode="cover"
            style={styles.background}
        >
            <Image source={assets.images.mainLogo} style={styles.logo} />
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
                            handleTextChange={handleOTPChange}
                            tintColor="$white"
                            textInputStyle={otpTextInputStyle}
                        />

                        {codeError && (
                            <UText variant="text-xs" color="$red10" ml={16} mt={5}>
                                {codeError}
                            </UText>
                        )}

                        <XStack justifyContent="flex-end">
                            <UIconButton
                                variant="primary-md"
                                icon={IconArrowRight}
                                onPress={handleSubmit}
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
                            textDecorationLine="underline"
                            onPress={navigateToLogin}
                        >
                            Back to Login
                        </UText>
                    </XStack>
                </YStack>
            </YStack>
        </ImageBackground>
    );
});

VerificationCode.displayName = 'VerificationCode';

export default VerificationCode;
