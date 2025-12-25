import assets from '@/assets/images';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useLoginController from '@/src/controllers/useLoginController';
import { useFormik } from 'formik';
import React, { useRef, useCallback, useMemo, memo } from 'react';
import { ImageBackground, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XStack, YStack } from 'tamagui';

const styles = StyleSheet.create({
    background: { flex: 1 },
});

const Login = memo(() => {
    const { top, bottom } = useSafeAreaInsets();

    const passwordRef = useRef<TextInput>(null);

    const { validator, values, functions, states, router } = useLoginController();

    const formikConfig = useMemo(() => ({
        initialValues: values.initialValues,
        validationSchema: validator,
        onSubmit: functions.handleSubmit,
    }), [values.initialValues, validator, functions.handleSubmit]);

    const formik = useFormik(formikConfig);

    const handleSubmit = useCallback(() => {
        functions.setSubmitted(true);
        formik.handleSubmit();
    }, [functions.setSubmitted, formik.handleSubmit]);

    const handleEmailChange = useCallback((text: string) => {
        formik.setFieldValue('email', text);
    }, [formik.setFieldValue]);

    const handlePasswordChange = useCallback((text: string) => {
        formik.setFieldValue('password', text);
    }, [formik.setFieldValue]);

    const focusPassword = useCallback(() => {
        passwordRef.current?.focus();
    }, []);

    const navigateToForgotPassword = useCallback(() => {
        router.push('/(public)/forgotpassword');
    }, [router]);

    const navigateToSignup = useCallback(() => {
        router.push('/(public)/signup');
    }, [router]);

    const emailError = useMemo(
        () => (states.submitted ? formik.errors.email : undefined),
        [states.submitted, formik.errors.email]
    );

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
                            Sign In to your Account
                        </UText>
                    </UAnimatedView>
                    <UAnimatedView animation="fadeInUp" delay={200}>
                        <UText variant="text-sm" color="$white">
                            Let's Sign in to your account
                        </UText>
                    </UAnimatedView>

                    <UKeyboardAvoidingView gap={16} mt={25}>
                        <UAnimatedView animation="fadeInUp" delay={300}>
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
                                returnKeyType="next"
                                onSubmitEditing={focusPassword}
                                blurOnSubmit={false}
                            />
                        </UAnimatedView>
                        <UAnimatedView animation="fadeInUp" delay={400}>
                            <UInput
                                ref={passwordRef}
                                variant="primary"
                                placeholder="Enter your password"
                                value={formik.values.password}
                                onChangeText={handlePasswordChange}
                                error={passwordError}
                                secureTextEntry
                                autoComplete="current-password"
                                autoCapitalize="none"
                                textContentType="password"
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                            />
                        </UAnimatedView>
                        <UAnimatedView animation="fadeIn" delay={500}>
                            <XStack jc="flex-end">
                                <UText
                                    variant="text-sm"
                                    color="$white"
                                    fontWeight={600}
                                    onPress={navigateToForgotPassword}
                                >
                                    Forgot Password?
                                </UText>
                            </XStack>
                        </UAnimatedView>
                    </UKeyboardAvoidingView>
                </YStack>

                <UAnimatedView animation="fadeInUp" delay={600}>
                    <YStack gap={16}>
                        <NeonButton
                            onPress={handleSubmit}
                            loading={states.loading}
                        >
                            Sign In
                        </NeonButton>

                        <XStack jc="center" mt={16}>
                            <UText variant="text-sm" color="$white">
                                Don't have an account?{' '}
                            </UText>
                            <UText
                                variant="text-sm"
                                color="$white"
                                onPress={navigateToSignup}
                            >
                                Sign Up
                            </UText>
                        </XStack>
                    </YStack>
                </UAnimatedView>
            </YStack>
        </ImageBackground>
    );
});

Login.displayName = 'Login';

export default Login;
