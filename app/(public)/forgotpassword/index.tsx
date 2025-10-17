import IconArrowRight from '@/assets/icons/iconArrowRight';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import UInput from '@/src/components/core/inputs/uInput';
import UText from '@/src/components/core/text/uText';
import ScreenWrapper from '@/src/components/layout/screenWrapper';
import useForgotPasswordController from '@/src/controllers/useForgotPasswordController';
import { useFormik } from 'formik';
import React from 'react';
import { XStack, YStack } from 'tamagui';

const forgotpassword = () => {

    const { validator, values, functions, states, router } = useForgotPasswordController();

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
                        Forgot Password
                    </UText>
                    <UText variant="text-sm" color="$neutral7">
                        Enter an email address to receive a verification code
                    </UText>

                    <YStack gap={16} mt={25}>
                        <UInput
                            variant="primary"
                            placeholder="Enter your email"
                            value={formik.values.email}
                            onChangeText={formik.handleChange('email')}
                            error={states.submitted ? formik.errors.email : undefined}
                            keyboardType="email-address"
                            autoComplete="email"
                        />

                        <XStack justifyContent="flex-end">
                            <UIconButton
                                variant="secondary-md"
                                icon={IconArrowRight}
                                onPress={() => {
                                    functions.setSubmitted(true)
                                    formik.handleSubmit()
                                }}
                                iconProps={{ color: '$neutral0' }}
                                loading={states.loading}
                            />
                        </XStack>

                    </YStack>
                </YStack>

                <YStack gap={16} mb={25}>

                    <XStack jc="center" mt={16}>
                        <UText
                            variant="text-md"
                            color="$primary7"
                            fontWeight={700}
                            textDecorationLine='underline'
                            onPress={() => router.push('/(public)/login' as any)}>
                            Back to Login
                        </UText>
                    </XStack>
                </YStack>

            </YStack>
        </ScreenWrapper>

    )
}

export default forgotpassword;