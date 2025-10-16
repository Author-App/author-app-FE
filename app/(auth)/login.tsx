import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, XStack } from 'tamagui'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UText from '@/src/components/core/text/uText';
import UInput from '@/src/components/core/inputs/uInput'
import UTextButton from '@/src/components/core/buttons/uTextButton'
import { loginValidationSchema } from '@/src/utils/validator';

const login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                console.log("THIS IS VALUESS", values);
                router.replace('/(tabs)' as any)
            }
            catch (error) {
                console.log("THIS IS ERROR", error);

            }

        },
    });

    return (
        <YStack flex={1} jc="center" px={24} bg="$white" gap={24}>
            <YStack ai="center" mb={12} gap={8}>
                <UText variant="heading-h1" color="$primary7">
                    Sign In to your Account
                </UText>
                <UText variant="text-sm" color="$neutral7">
                    Let's Sign in to your account
                </UText>
            </YStack>
            <YStack gap={16}>
                <UInput
                    variant="primary"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    keyboardType="email-address"
                    autoComplete="email"
                />
                <UInput
                    variant="primary"
                    placeholder="Enter your password"
                    value={formik.values.email}
                    onChangeText={formik.handleChange('password')}
                    keyboardType="visible-password"
                    autoComplete="password"
                />
            </YStack>
            <UTextButton
                onPress={() => formik.handleSubmit()}>   
                Sign In
            </UTextButton>
            <YStack gap={12}>
                <UTextButton
                    variant="tertiary-md"
                    onPress={() => console.log('Apple Sign In')}>
                    Continue with Apple
                </UTextButton>
                <UTextButton
                    variant="tertiary-md"
                    onPress={() => console.log('Google Sign In')}>
                    Continue with Google
                </UTextButton>
                <UTextButton
                    variant="tertiary-md"
                    onPress={() => console.log('Facebook Sign In')}>
                    Continue with Facebook
                </UTextButton>
            </YStack>

            <XStack jc="center" mt={16}>
                <UText variant="text-sm" color="$neutral7">Don’t have an account? </UText>
                <UText
                    variant="text-sm"
                    color="$primary7"
                    fontWeight={700}
                    onPress={() => router.push('/(auth)/signup')}>
                    Sign Up
                </UText>
            </XStack>
        </YStack>
    )
}

export default login;