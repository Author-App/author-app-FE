import assets from '@/assets/images';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useResetPasswordController from '@/src/controllers/useResetPasswordController';
import { useFormik } from 'formik';
import React, { useCallback, useMemo, memo } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XStack, YStack } from 'tamagui';

const styles = StyleSheet.create({
    background: { flex: 1 },
});

const ResetPassword = memo(() => {
    const { top, bottom } = useSafeAreaInsets();
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
            <UAnimatedView animation="fadeIn" duration={400}>
                <ULocalImage source={assets.images.mainLogo} width={130} height={70} mt={top + 8} />
            </UAnimatedView>
            <YStack flex={1} px={24} pb={bottom + 8} jc="space-between">
                <YStack gap={10} flex={1}>
                    <UAnimatedView animation="fadeInUp" delay={100}>
                        <UText variant="heading-h1" color="$white">
                            Reset Password
                        </UText>
                    </UAnimatedView>
                    <UAnimatedView animation="fadeInUp" delay={200}>
                        <UText variant="text-sm" color="$white">
                            Set a new password for your account
                        </UText>
                    </UAnimatedView>

                    <UKeyboardAvoidingView gap={16} mt={25}>
                        <UAnimatedView animation="fadeInUp" delay={300}>
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
                        </UAnimatedView>
                    </UKeyboardAvoidingView>
                </YStack>

                <UAnimatedView animation="fadeInUp" delay={400}>
                    <YStack gap={16}>
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
                </UAnimatedView>
            </YStack>
        </ImageBackground>
    );
});

ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;
