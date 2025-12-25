import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { resetPasswordFormValidator } from "../utils/validator";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { useResetPasswordMutation } from "../redux2/Apis/Auth";

const initialValues = {
    password: "",
};

const useResetPasswordController = () => {
    const { token } = useLocalSearchParams<{ token: string }>();
    const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
    const [submitted, setSubmitted] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = useCallback(
        async (
            values: { password: string },
            { resetForm }: { resetForm: () => void }
        ) => {
            try {
                const res = await resetPassword({
                    token,
                    password: values.password,
                }).unwrap();

                if (res) {
                    showSuccessToast("Password updated successfully");
                    router.replace("/(public)/login");
                    resetForm();
                }
            } catch (err: unknown) {
                const error = err as { data?: { message?: string } };
                const message = error?.data?.message || "Something went wrong";
                showErrorToast(message);
            }
        },
        [resetPassword, token, router]
    );

    const handleSetSubmitted = useCallback((value: boolean) => {
        setSubmitted(value);
    }, []);

    return {
        validator: resetPasswordFormValidator,
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

export default useResetPasswordController;
