import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { codeValidationSchema } from "@/src/utils/validator";
import { showErrorToast } from "../utils/toast";
import { useVerifycodeMutation } from "../redux2/Apis/Auth";

const initialValues = {
    code: "",
};

const useVerificationCodeController = () => {
    const { token } = useLocalSearchParams<{ token: string }>();
    const [verifycode, { isLoading, error }] = useVerifycodeMutation();
    const [submitted, setSubmitted] = useState<boolean>(false);
    const router = useRouter();

    const handleOTPChange = useCallback(
        (
            text: string,
            setFieldValue: (field: string, value: string) => void,
            handleSubmit: () => void
        ) => {
            setFieldValue("code", text);

            if (text.length === 6) {
                handleSubmit();
            }
        },
        []
    );

    const handleSubmit = useCallback(
        async (
            values: { code: string },
            { resetForm }: { resetForm: () => void }
        ) => {
            try {
                const res = await verifycode({
                    token,
                    code: values.code,
                }).unwrap();

                if (res) {
                    router.push({
                        pathname: "/(public)/resetpassword",
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
        [verifycode, token, router]
    );

    const handleSetSubmitted = useCallback((value: boolean) => {
        setSubmitted(value);
    }, []);

    return {
        validator: codeValidationSchema,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            setSubmitted: handleSetSubmitted,
            handleOTPChange,
        },
        states: {
            loading: isLoading,
            error,
            submitted,
        },
        router,
    };
};

export default useVerificationCodeController;
