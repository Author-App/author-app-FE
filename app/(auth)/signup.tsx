import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack, XStack, Text, Input, Separator, Button, Image } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import CustomButton from '@/src/components/core/customButton'
import CustomInput from '@/src/components/core/customInput'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signupValidationSchema } from '@/src/utils/validator'

const signup = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: signupValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                console.log("THIS IS VALUESS", values);
                 router.push('/(auth)/login');
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
                    Create Account
                </Text>
                <Text fontSize={14} color="$neutral7">
                    Sign up to get started
                </Text>
            </YStack>

            <YStack gap={16}>

                <CustomInput
                    label="First Name"
                    placeholder="Enter your first name"
                    value={formik.values.firstName}
                    onChangeText={formik.handleChange('firstName')}
                    error={formik.errors.firstName}
                />

                <CustomInput
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={formik.values.lastName}
                    onChangeText={formik.handleChange('lastName')}
                    error={formik.errors.lastName}
                />

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

                <CustomInput
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={formik.values.confirmPassword}
                    onChangeText={formik.handleChange('confirmPassword')}
                    error={formik.errors.confirmPassword}
                    secureTextEntry
                />

            </YStack>
            <CustomButton
                buttonText="Sign Up"
                onPress={formik.handleSubmit}
                loading={loading}
            />

            <XStack jc="center" mt={16}>
                <Text color="$neutral7">Already have an account? </Text>
                <Text
                    color="$primary7"
                    fontWeight="700"
                    onPress={() => router.push('/(auth)/login')}
                >
                    Sign In
                </Text>
            </XStack>
        </YStack>
    )
}

export default signup

