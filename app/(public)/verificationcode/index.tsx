import IconArrowRight from '@/assets/icons/iconArrowRight';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UInput from '@/src/components/core/inputs/uInput';
import UText from '@/src/components/core/text/uText';
import ScreenWrapper from '@/src/components/layout/screenWrapper';
import useVerificationCodeController from '@/src/controllers/useVerificationCodeController';
import { useFormik } from 'formik';
import React from 'react';
import { XStack, YStack } from 'tamagui';
import OTPTextView from "react-native-otp-textinput";
import { getVariableValue } from 'tamagui';


const verificationcode = () => {

    const { validator, values, functions, states, router } = useVerificationCodeController();

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
                        Verification Code
                    </UText>
                    <UText variant="text-sm" color="$neutral7">
                        Enter verification code sent to your email address.
                    </UText>

                    <YStack gap={16} mt={25}>

                        <OTPTextView

                            inputCount={4}
                            keyboardType="number-pad"
                            handleTextChange={(text) =>
                                functions.handleOTPChange(text, formik.setFieldValue, formik.handleSubmit)
                            }
                            tintColor={'#465A54'}
                        />
                        {states.submitted && formik.errors.code && (
                            <UText variant="text-xs" color="$red10" ml={16} mt={5}>
                                {formik.errors.code}
                            </UText>
                        )}

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

export default verificationcode;