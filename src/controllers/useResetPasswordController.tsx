import { useRouter } from "expo-router";
import { useState } from "react";
import { forgotPasswordFormValidator, loginValidationSchema, resetPasswordFormValidator } from "../utils/validator";
import { showSuccessToast } from "../utils/toast";


const initialValues = {
    password: '',
};

const useResetPasswordController = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);


    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("THIS IS VALUESS", values);

            showSuccessToast('Password updated successfully')
            router.replace('/(public)/login' as any);

            resetForm();
        } catch (error) {
            console.log("THIS IS ERROR", error);
        } finally {
            setLoading(false);
        }
    }

    return {
        validator: resetPasswordFormValidator,
        values: {
            initialValues,
        },
        functions: {
            handleSubmit,
            setLoading,
            setSubmitted
        },
        states: {
            loading,
            submitted,
        },
        router,
    }

}

export default useResetPasswordController