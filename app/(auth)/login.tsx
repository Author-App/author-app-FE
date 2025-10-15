import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, XStack, Text, Input, Separator, Button, Image } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import CustomButton from '@/src/components/core/customButton'
import CustomInput from '@/src/components/core/customInput'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
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
            <YStack ai="center" mb={12}>
                <Text fontSize={28} fontWeight="700" color="$primary7">
                    Sign In to your Account
                </Text>
                <Text fontSize={14} color="$neutral7">
                    Let's Sign in to your account
                </Text>
            </YStack>

            <YStack gap={16}>

                <CustomInput
                    label="Email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    error={formik.errors.email}
                    keyboardType="email-address"
                />


                <CustomInput
                    label="Password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChangeText={formik.handleChange('password')}
                    error={formik.errors.password}
                    secureTextEntry
                />

            </YStack>
            <CustomButton
                buttonText="Sign In"
                onPress={formik.handleSubmit}
                loading={loading}
            />

            <XStack ai="center" jc="center" my={8}>
                <Separator flex={1} bg="$neutral4" />
                <Text mx={8} color="$neutral7" fontSize={14}>
                    OR 
                </Text>
                <Separator flex={1} bg="$neutral4" />
            </XStack>

            <YStack gap={12}>
                <CustomButton
                    buttonText="Continue with Apple"
                    onPress={() => console.log('Apple Sign In')}
                />
                <CustomButton
                    buttonText="Continue with Google"
                    onPress={() => console.log('Google Sign In')}
                />
                <CustomButton
                    buttonText="Continue with Facebook"
                    onPress={() => console.log('Facebook Sign In')}
                />
            </YStack>

            <XStack jc="center" mt={16}>
                <Text color="$neutral7">Don’t have an account? </Text>
                <Text
                    color="$primary7"
                    fontWeight="700"
                    onPress={() => router.push('/(auth)/signup')}
                >
                    Sign Up
                </Text>
            </XStack>
        </YStack>
    )
}

export default login;