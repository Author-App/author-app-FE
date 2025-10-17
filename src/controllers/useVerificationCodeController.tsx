import { useRouter } from "expo-router";
import { useState } from "react";
import { codeValidationSchema } from "@/src/utils/validator";


const initialValues = {
    code: '',
};

const useVerificationCodeController = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);


    const router = useRouter();

    const handleOTPChange = (
        text: string,
        setFieldValue: (field: string, value: any) => void,
        handleSubmit: () => void
    ) => {
        setFieldValue("code", text);

        if (text.length === 4) {
            handleSubmit();
        }
    };


    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("THIS IS VALUESS", values);

            router.push('/(public)/resetPassword');

            resetForm();
        } catch (error) {
            console.log("THIS IS ERROR", error);
        } finally {
            setLoading(false);
        }
    }

    return {
        validator: codeValidationSchema,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            setLoading,
            setSubmitted,
            handleOTPChange,
        },
        states: {
            loading,
            submitted,
        },
        router,
    }

}

export default useVerificationCodeController