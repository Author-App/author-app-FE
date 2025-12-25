import IconArrowRight from '@/assets/icons/iconArrowRight';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useVerificationCodeController from '@/src/controllers/useVerificationCodeController';
import { useFormik } from 'formik';
import React, { useCallback, useMemo, memo } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OTPTextView from 'react-native-otp-textinput';
import { XStack, YStack } from 'tamagui';

const authScreenBg = require('@/assets/images/authScreenBg.png');
const mainLogo = require('@/assets/images/mainLogo.png');

const styles = StyleSheet.create({
    background: { flex: 1 },
});

const otpTextInputStyle = {
    color: '#ffffff',
} as object;

const VerificationCode = memo(() => {
    const { top, bottom } = useSafeAreaInsets();
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
            source={authScreenBg}
            resizeMode="cover"
            style={styles.background}
        >
            <UAnimatedView animation="fadeIn" duration={400}>
                <ULocalImage source={mainLogo} width={130} height={70} mt={top + 8} />
            </UAnimatedView>
            <YStack flex={1} px={24} pb={bottom + 8} jc="space-between">
                <YStack gap={10} flex={1}>
                    <UAnimatedView animation="fadeInUp" delay={100}>
                        <UText variant="heading-h1" color="$white">
                            Verification Code
                        </UText>
                    </UAnimatedView>
                    <UAnimatedView animation="fadeInUp" delay={200}>
                        <UText variant="text-sm" color="$white">
                            Enter verification code sent to your email address.
                        </UText>
                    </UAnimatedView>

                    <UKeyboardAvoidingView gap={16} mt={25}>
                        <UAnimatedView animation="fadeInUp" delay={300}>
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
                        </UAnimatedView>

                        <UAnimatedView animation="fadeInUp" delay={400}>
                            <XStack justifyContent="flex-end">
                                <UIconButton
                                    variant="primary-md"
                                    icon={IconArrowRight}
                                    onPress={handleSubmit}
                                    loading={states.loading}
                                />
                            </XStack>
                        </UAnimatedView>
                    </UKeyboardAvoidingView>
                </YStack>

                <UAnimatedView animation="fadeInUp" delay={500}>
                    <YStack gap={16}>
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
                </UAnimatedView>
            </YStack>
        </ImageBackground>
    );
});

VerificationCode.displayName = 'VerificationCode';

export default VerificationCode;
