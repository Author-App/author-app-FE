import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { signupValidationSchema } from "@/src/utils/validator";
import { showErrorToast, showSuccessToast } from "@/src/utils/toast";
import { useSignupMutation } from "../redux2/Apis/Auth";

const initialValues = {
    fullName: "",
    email: "",
    password: "",
};

const useSignupController = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [signup, { isLoading, error }] = useSignupMutation();
    const router = useRouter();

    const handleSubmit = useCallback(
        async (
            values: { fullName: string; email: string; password: string },
            { resetForm }: { resetForm: () => void }
        ) => {
            try {
                const parts = values.fullName.trim().split(" ");
                const firstName = parts[0];
                const lastName = parts.slice(1).join(" ");

                const payload = {
                    firstName,
                    lastName: lastName || "",
                    email: values.email,
                    password: values.password,
                    deviceId: "abcd1234-ab",
                    timeZone: "GMT",
                };

                const res = await signup(payload).unwrap();

                if (res) {
                    showSuccessToast("You've signed up successfully");
                    router.replace("/(public)/login");
                    resetForm();
                }
            } catch (err: unknown) {
                const error = err as { data?: { message?: string } };
                const message = error?.data?.message || "Something went wrong";
                showErrorToast(message);
            }
        },
        [signup, router]
    );

    const handleSetSubmitted = useCallback((value: boolean) => {
        setSubmitted(value);
    }, []);

    return {
        validator: signupValidationSchema,
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

export default useSignupController;
