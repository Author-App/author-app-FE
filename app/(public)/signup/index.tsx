import IconApple from '@/assets/icons/iconApple';
import IconFacebook from '@/assets/icons/iconFacebook';
import IconGoogle from '@/assets/icons/iconGoogle';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import UInput from '@/src/components/core/inputs/uInput';
import UText from '@/src/components/core/text/uText';
import ScreenWrapper from '@/src/components/layout/screenWrapper';
import useLoginController from '@/src/controllers/useLoginController';
import useSignupController from '@/src/controllers/useSignupController';
import { useFormik } from 'formik';
import React from 'react';
import { XStack, YStack } from 'tamagui';

const signup = () => {

    const { validator, values, functions, states, router } = useSignupController();

    const formik = useFormik({
        initialValues: values.initialValues,
        validationSchema: validator,
        onSubmit: (values, { resetForm, setSubmitting }) => functions.handleSubmit(values, { resetForm, setSubmitting })
    });


    return (
        <ScreenWrapper scrollable>

            <YStack flex={1} bg="$white" px={24} pb={24} jc="space-between">
                <YStack mt={80} gap={16}>

                    <UText variant="heading-h1" color="$primary7">
                        Create Account
                    </UText>
                    <UText variant="text-sm" color="$neutral7">
                        Sign up to get started
                    </UText>

                    <YStack gap={16} mt={25}>
                        <UInput
                            variant="primary"
                            placeholder="Enter your full name"
                            value={formik.values.fullName}
                            onChangeText={formik.handleChange('fullName')}
                            error={states.submitted ? formik.errors.fullName : undefined}
                            keyboardType="default"
                            autoComplete="name"
                        />
                        <UInput
                            variant="primary"
                            placeholder="Enter your email"
                            value={formik.values.email}
                            onChangeText={formik.handleChange('email')}
                            error={states.submitted ? formik.errors.email : undefined}
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                        <UInput
                            variant="primary"
                            placeholder="Enter your password"
                            value={formik.values.password}
                            onChangeText={formik.handleChange('password')}
                            error={states.submitted ? formik.errors.password : undefined}
                            keyboardType="visible-password"
                            autoComplete="password"
                        />

                    </YStack>
                </YStack>

                <YStack gap={16} mb={25}>
                    <UTextButton
                        onPress={() => {
                            functions.setSubmitted(true)
                            formik.handleSubmit()
                        }}
                        loading={states.loading}
                        indicatorColor={'#fff'}

                    >
                        Sign Up
                    </UTextButton>

                    <XStack ai="center" jc="center" gap={8} mt={10} mb={10}>
                        <YStack flex={1} h={1} bg="$neutral4" />
                        <UText variant="text-sm" color="$neutral7">
                            or Sign Up with
                        </UText>
                        <YStack flex={1} h={1} bg="$neutral4" />
                    </XStack>

                    <XStack jc="center" ai="center" gap={24}>
                        <UIconButton
                            variant="tertiary-md"
                            icon={IconFacebook}
                            onPress={() => console.log('Facebook login')}

                        />

                        <UIconButton
                            variant="tertiary-md"
                            icon={IconGoogle}
                            onPress={() => console.log('Google login')}
                        />

                        <UIconButton
                            variant="tertiary-md"
                            icon={IconApple}
                            onPress={() => console.log('Apple login')}
                        />
                    </XStack>

                    <XStack jc="center" mt={16}>
                        <UText variant="text-sm" color="$neutral7">Already have an account? </UText>
                        <UText
                            variant="text-sm"
                            color="$primary7"
                            fontWeight={700}
                            onPress={() => router.push('/(public)/login' as any)}>
                            Sign In
                        </UText>
                    </XStack>
                </YStack>

            </YStack>
        </ScreenWrapper>

    )
}

export default signup;