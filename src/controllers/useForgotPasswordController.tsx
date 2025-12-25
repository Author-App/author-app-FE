import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { forgotPasswordFormValidator } from "@/src/utils/validator";
import { useForgotPasswordMutation } from "../redux2/Apis/Auth";
import { showErrorToast } from "../utils/toast";

const initialValues = {
    email: "",
};

const useForgotPasswordController = () => {
    const [submitted, setSubmitted] = useState(false);
    const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
    const router = useRouter();

    const handleSubmit = useCallback(
        async (
            values: { email: string },
            { resetForm }: { resetForm: () => void }
        ) => {
            try {
                const payload = {
                    email: values.email,
                };

                const res = await forgotPassword(payload).unwrap();

                if (res) {
                    router.push({
                        pathname: "/(public)/verificationcode",
                        params: {
                            token: res?.data?.token,
                        },
                    });
                    resetForm();
                }
            } catch (err: unknown) {
                const error = err as { data?: { message?: string } };
                const message = error?.data?.message || "Something went wrong";
                showErrorToast(message);
            }
        },
        [forgotPassword, router]
    );

    const handleSetSubmitted = useCallback((value: boolean) => {
        setSubmitted(value);
    }, []);

    return {
        validator: forgotPasswordFormValidator,
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

export default useForgotPasswordController;
