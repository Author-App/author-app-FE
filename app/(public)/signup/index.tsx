import assets from '@/assets/images';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useSignupController from '@/src/controllers/useSignupController';
import { useFormik } from 'formik';
import React, { useRef, useCallback, useMemo, memo } from 'react';
import { Image, ImageBackground, TextInput, StyleSheet } from 'react-native';
import { XStack, YStack } from 'tamagui';

const styles = StyleSheet.create({
    background: { flex: 1 },
    logo: { width: 130, height: 70, marginTop: 38 },
});

const Signup = memo(() => {
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
            <Image source={assets.images.mainLogo} style={styles.logo} />
            <YStack flex={1} px={24} pb={24} jc="space-between">
                <YStack gap={10} flex={1}>
                    <UText variant="heading-h1" color="$white">
                        Create Account
                    </UText>
                    <UText variant="text-sm" color="$white">
                        Sign up to get started
                    </UText>

                    <UKeyboardAvoidingView gap={16} mt={25}>
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
                    </UKeyboardAvoidingView>
                </YStack>

                <YStack gap={16} mb={25}>
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
            </YStack>
        </ImageBackground>
    );
});

Signup.displayName = 'Signup';

export default Signup;
