import IconApple from '@/assets/icons/iconApple';
import IconFacebook from '@/assets/icons/iconFacebook';
import IconGoogle from '@/assets/icons/iconGoogle';
import assets from '@/assets/images';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import UInput from '@/src/components/core/inputs/uInput';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UText from '@/src/components/core/text/uText';
import useLoginController from '@/src/controllers/useLoginController';
import { useFormik } from 'formik';
import React from 'react';
import { Image, ImageBackground } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

const Login = () => {

    const { validator, values, functions, states, router } = useLoginController();

    const formik = useFormik({
        initialValues: values.initialValues,
        validationSchema: validator,
        onSubmit: (values, { resetForm, setSubmitting }) => functions.handleSubmit(values, { resetForm, setSubmitting })
    });


    return (
        <ImageBackground
            source={assets.images.authBackgroundImage2}
            resizeMode="cover"
            style={{ flex: 1 }}
        >
            <Image source={assets.images.mainLogo} style={{ width: 130, height: 70, marginTop: 38 }} />
            <YStack flex={1} px={24} pb={24} jc="space-between">
                <YStack gap={10} flex={1}>

                    <UText variant="heading-h1" color="$white">
                        Sign In to your Account
                    </UText>
                    <UText variant="text-sm" color="$white">
                        Let's Sign in to your account
                    </UText>

                    <UKeyboardAvoidingView
                        gap={16}
                        mt={25}>
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
                        <XStack jc="flex-end">
                            <UText
                                variant="text-sm"
                                color="$white"
                                fontWeight={600}
                                onPress={() => router.push('/(public)/forgotpassword')}>
                                Forgot Password?
                            </UText>
                        </XStack>
                    </UKeyboardAvoidingView>
                    {/* </UKeyboardAvoidingView> */}
                </YStack>
                <YStack gap={16} mb={25}>
                    {/* <UTextButton
                        onPress={() => {
                            functions.setSubmitted(true)
                            formik.handleSubmit()
                        }}
                        variant='secondary-md'
                        loading={states.loading}
                        indicatorColor={'#fff'}>
                        Sign In
                    </UTextButton> */}
                    <NeonButton style={{ width: '100%' }}
                        onPress={() => {
                            functions.setSubmitted(true)
                            formik.handleSubmit()
                        }}
                        loading={states.loading}
                    >
                        Sign In
                    </NeonButton>
                    <XStack ai="center" jc="center" gap={8} mt={10} mb={10}>
                        <YStack flex={1} h={1} bg="$white" />
                        <UText variant="text-sm" color="$white">
                            or Sign In with
                        </UText>
                        <YStack flex={1} h={1} bg="$white" />
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
                        <UText variant="text-sm" color="$white">Don’t have an account? </UText>
                        <UText
                            variant="text-sm"
                            color="$white"
                            onPress={() => router.push('/(public)/signup' as any)}>
                            Sign Up
                        </UText>
                    </XStack>
                </YStack>
            </YStack>
        </ImageBackground>

    )
}

export default Login;