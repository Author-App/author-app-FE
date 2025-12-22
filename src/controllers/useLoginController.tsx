import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { loginValidationSchema } from "../utils/validator";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { useLoginMutation } from "../redux2/Apis/Auth";
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const getDeviceInfo = async () => ({
    deviceId: Platform.OS === 'android' ? Application.getAndroidId() : Application.applicationId ?? 'unknown',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

const initialValues = {
    email: "",
    password: "",
};

const useLoginController = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [login, { isLoading, error }] = useLoginMutation();
    const router = useRouter();

    const handleSubmit = useCallback(
        async (
            values: { email: string; password: string },
            { resetForm }: { resetForm: () => void }
        ) => {
            try {
                const { deviceId, timeZone } = await getDeviceInfo();
                const payload = {
                    email: values.email,
                    password: values.password,
                    deviceId: deviceId,    
                    timeZone: timeZone,
                };

                const res = await login(payload);

                if (res?.data) {
                    showSuccessToast("You've logged in successfully");
                    router.replace("/(app)/(tabs)/(home)");
                    resetForm();
                }

                if (res?.error) {
                    const errorData = res?.error as { data?: { message?: string } };
                    const message = errorData?.data?.message || "Something went wrong";
                    showErrorToast(message);
                }
            } catch (err: unknown) {
                const error = err as { data?: { message?: string } };
                const message = error?.data?.message || "Something went wrong";
                showErrorToast(message);
            }
        },
        [login, router]
    );

    const handleSetSubmitted = useCallback((value: boolean) => {
        setSubmitted(value);
    }, []);

    return {
        validator: loginValidationSchema,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            setSubmitted: handleSetSubmitted,
        },
        states: {
            loading: isLoading,
            error,
            submitted,
        },
        router,
    };
};

export default useLoginController;
