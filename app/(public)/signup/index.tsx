import assets from '@/assets/images';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useSignupController from '@/src/controllers/useSignupController';
import { useFormik } from 'formik';
import React, { useRef, useCallback, useMemo, memo } from 'react';
import { ImageBackground, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XStack, YStack } from 'tamagui';

const styles = StyleSheet.create({
    background: { flex: 1 },
});

const Signup = memo(() => {
    const { top, bottom } = useSafeAreaInsets();
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const { validator, values, functions, states, router } = useSignupController();

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

    const handleFullNameChange = useCallback(
        (text: string) => {
            formik.setFieldValue('fullName', text);
        },
        [formik.setFieldValue]
    );

    const handleEmailChange = useCallback(
        (text: string) => {
            formik.setFieldValue('email', text);
        },
        [formik.setFieldValue]
    );

    const handlePasswordChange = useCallback(
        (text: string) => {
            formik.setFieldValue('password', text);
        },
        [formik.setFieldValue]
    );

    const focusEmail = useCallback(() => {
        emailRef.current?.focus();
    }, []);

    const focusPassword = useCallback(() => {
        passwordRef.current?.focus();
    }, []);

    const navigateToLogin = useCallback(() => {
        router.push('/(public)/login');
    }, [router]);

    const fullNameError = useMemo(
        () => (states.submitted ? formik.errors.fullName : undefined),
        [states.submitted, formik.errors.fullName]
    );

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
                            Create Account
                        </UText>
                    </UAnimatedView>
                    <UAnimatedView animation="fadeInUp" delay={200}>
                        <UText variant="text-sm" color="$white">
                            Sign up to get started
                        </UText>
                    </UAnimatedView>

                    <UKeyboardAvoidingView gap={16} mt={25}>
                        <UAnimatedView animation="fadeInUp" delay={300}>
                            <UInput
                                variant="primary"
                                placeholder="Enter your full name"
                                value={formik.values.fullName}
                                onChangeText={handleFullNameChange}
                                error={fullNameError}
                                autoComplete="name"
                                autoCapitalize="words"
                                textContentType="name"
                                returnKeyType="next"
                                onSubmitEditing={focusEmail}
                                blurOnSubmit={false}
                            />
                        </UAnimatedView>
                        <UAnimatedView animation="fadeInUp" delay={400}>
                            <UInput
                                ref={emailRef}
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
                        <UAnimatedView animation="fadeInUp" delay={500}>
                            <UInput
                                ref={passwordRef}
                                variant="primary"
                                placeholder="Enter your password"
                                value={formik.values.password}
                                onChangeText={handlePasswordChange}
                                error={passwordError}
                                secureTextEntry
                                autoComplete="password"
                                autoCapitalize="none"
                                textContentType="password"
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                            />
                        </UAnimatedView>
                    </UKeyboardAvoidingView>
                </YStack>

                <UAnimatedView animation="fadeInUp" delay={600}>
                    <YStack gap={16}>
                        <NeonButton onPress={handleSubmit} loading={states.loading}>
                            Sign Up
                        </NeonButton>

                        <XStack jc="center" mt={16}>
                            <UText variant="text-sm" color="$white">
                                Already have an account?{' '}
                            </UText>
                            <UText
                                variant="text-sm"
                                color="$white"
                                onPress={navigateToLogin}
                            >
                                Sign In
                            </UText>
                        </XStack>
                    </YStack>
                </UAnimatedView>
            </YStack>
        </ImageBackground>
    );
});

Signup.displayName = 'Signup';

export default Signup;
