import assets from '@/assets/images';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useResetPasswordController from '@/src/controllers/useResetPasswordController';
import { useFormik } from 'formik';
import React, { useCallback, useMemo, memo } from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import { XStack, YStack } from 'tamagui';

const styles = StyleSheet.create({
    background: { flex: 1 },
    logo: { width: 130, height: 70, marginTop: 38 },
});

const ResetPassword = memo(() => {
    const { validator, values, functions, states, router } = useResetPasswordController();

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

    const handlePasswordChange = useCallback(
        (text: string) => {
            formik.setFieldValue('password', text);
        },
        [formik.setFieldValue]
    );

    const navigateToLogin = useCallback(() => {
        router.push('/(public)/login');
    }, [router]);

    const passwordError = useMemo(
        () => (states.submitted ? formik.errors.password : undefined),
        [states.submitted, formik.errors.password]
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
                        Reset Password
                    </UText>
                    <UText variant="text-sm" color="$white">
                        Set a new password for your account
                    </UText>

                    <UKeyboardAvoidingView gap={16} mt={25}>
                        <UInput
                            variant="primary"
                            placeholder="Enter your new password"
                            value={formik.values.password}
                            onChangeText={handlePasswordChange}
                            error={passwordError}
                            secureTextEntry
                            autoComplete="new-password"
                            autoCapitalize="none"
                            textContentType="newPassword"
                            returnKeyType="done"
                            onSubmitEditing={handleSubmit}
                        />
                    </UKeyboardAvoidingView>
                </YStack>

                <YStack gap={16} mb={25}>
                    <NeonButton onPress={handleSubmit} loading={states.loading}>
                        Submit
                    </NeonButton>

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

ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;
