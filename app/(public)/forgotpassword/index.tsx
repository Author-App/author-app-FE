import IconArrowRight from '@/assets/icons/iconArrowRight';
import assets from '@/assets/images';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useForgotPasswordController from '@/src/controllers/useForgotPasswordController';
import { useFormik } from 'formik';
import React, { useCallback, useMemo, memo } from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import { XStack, YStack } from 'tamagui';

const styles = StyleSheet.create({
    background: { flex: 1 },
    logo: { width: 130, height: 70, marginTop: 38 },
});

const ForgotPassword = memo(() => {
    const { validator, values, functions, states, router } = useForgotPasswordController();

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

    const handleEmailChange = useCallback(
        (text: string) => {
            formik.setFieldValue('email', text);
        },
        [formik.setFieldValue]
    );

    const navigateToLogin = useCallback(() => {
        router.push('/(public)/login');
    }, [router]);

    const emailError = useMemo(
        () => (states.submitted ? formik.errors.email : undefined),
        [states.submitted, formik.errors.email]
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
                            onChangeText={handleEmailChange}
                            error={emailError}
                            keyboardType="email-address"
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                            returnKeyType="done"
                            onSubmitEditing={handleSubmit}
                        />
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

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;
