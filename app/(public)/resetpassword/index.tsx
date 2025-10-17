import UTextButton from '@/src/components/core/buttons/uTextButton';
import UInput from '@/src/components/core/inputs/uInput';
import UText from '@/src/components/core/text/uText';
import ScreenWrapper from '@/src/components/layout/screenWrapper';
import useResetPasswordController from '@/src/controllers/useResetPasswordController';
import { useFormik } from 'formik';
import React from 'react';
import { XStack, YStack } from 'tamagui';

const resetpassword = () => {

    const { validator, values, functions, states, router } = useResetPasswordController();

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
                        Reset Password
                    </UText>
                    <UText variant="text-sm" color="$neutral7">
                        Set a new password for your account
                    </UText>

                    <YStack gap={16} mt={25}>

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
                        Submit
                    </UTextButton>


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

export default resetpassword;